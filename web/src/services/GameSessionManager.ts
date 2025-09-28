// Game Session Management for LAN multiplayer
import { friendManager, type Friend } from './FriendManager'
import { lanDiscovery, type DiscoveredDevice } from './LANDiscoveryService'

export interface GameSession {
  id: string
  hostId: string
  hostName: string
  gameType: 'hunt' | 'crime' | 'fish' | 'custom'
  maxPlayers: number
  currentPlayers: number
  players: GamePlayer[]
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: number
  settings: GameSettings
  isPrivate: boolean
  password?: string
}

export interface GamePlayer {
  id: string
  name: string
  deviceId: string
  isReady: boolean
  joinedAt: number
  score?: number
  status: 'connected' | 'disconnected' | 'playing'
}

export interface GameSettings {
  timeLimit?: number
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme'
  allowSpectators: boolean
  autoStart: boolean
  customRules?: Record<string, any>
}

export interface GameInvitation {
  id: string
  fromPlayerId: string
  fromPlayerName: string
  toPlayerId: string
  toPlayerName: string
  sessionId: string
  gameType: string
  timestamp: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: number
}

class GameSessionManager {
  private static instance: GameSessionManager
  private sessions: Map<string, GameSession> = new Map()
  private invitations: Map<string, GameInvitation> = new Map()
  private currentSession: GameSession | null = null
  private isHost = false
  private listeners: Set<(sessions: GameSession[]) => void> = new Set()
  private invitationListeners: Set<(invitations: GameInvitation[]) => void> = new Set()

  private constructor() {}

  static getInstance(): GameSessionManager {
    if (!GameSessionManager.instance) {
      GameSessionManager.instance = new GameSessionManager()
    }
    return GameSessionManager.instance
  }

  // Create a new game session
  async createSession(
    gameType: GameSession['gameType'],
    settings: Partial<GameSettings> = {},
    isPrivate = false,
    password?: string
  ): Promise<GameSession | null> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const session: GameSession = {
        id: sessionId,
        hostId: friendManager['currentPlayerId'] || 'unknown',
        hostName: 'You', // Would get actual player name
        gameType,
        maxPlayers: 4,
        currentPlayers: 1,
        players: [{
          id: friendManager['currentPlayerId'] || 'unknown',
          name: 'You',
          deviceId: await this.getCurrentDeviceId(),
          isReady: true,
          joinedAt: Date.now(),
          status: 'connected'
        }],
        status: 'waiting',
        createdAt: Date.now(),
        settings: {
          difficulty: 'normal',
          allowSpectators: false,
          autoStart: false,
          ...settings
        },
        isPrivate,
        password
      }

      this.sessions.set(sessionId, session)
      this.currentSession = session
      this.isHost = true

      // Start session broadcasting
      this.startSessionBroadcast(session)

      this.saveToStorage()
      this.notifyListeners()

      return session
    } catch (error) {
      console.error('Failed to create game session:', error)
      return null
    }
  }

  // Join an existing game session
  async joinSession(sessionId: string, asSpectator = false): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== 'waiting') return false

    if (session.currentPlayers >= session.maxPlayers && !asSpectator) return false

    try {
      const player: GamePlayer = {
        id: friendManager['currentPlayerId'] || 'unknown',
        name: 'You',
        deviceId: await this.getCurrentDeviceId(),
        isReady: false,
        joinedAt: Date.now(),
        status: 'connected'
      }

      if (asSpectator) {
        session.settings.allowSpectators = true
        player.status = 'connected' // Spectators don't need to be ready
      } else {
        session.currentPlayers++
        session.players.push(player)
      }

      this.currentSession = session
      this.isHost = false

      this.saveToStorage()
      this.notifyListeners()

      return true
    } catch (error) {
      console.error('Failed to join game session:', error)
      return false
    }
  }

  // Leave current session
  leaveSession(): void {
    if (this.currentSession) {
      if (this.isHost) {
        // Host leaving - cancel the session
        this.currentSession.status = 'cancelled'
        this.stopSessionBroadcast()
      } else {
        // Player leaving - remove from players
        this.currentSession.players = this.currentSession.players.filter(
          p => p.id !== (friendManager['currentPlayerId'] || 'unknown')
        )
        this.currentSession.currentPlayers = Math.max(0, this.currentSession.currentPlayers - 1)
      }

      this.currentSession = null
      this.isHost = false

      this.saveToStorage()
      this.notifyListeners()
    }
  }

  // Send game invitation to a friend
  async sendGameInvitation(friendId: string, gameType: GameSession['gameType']): Promise<boolean> {
    try {
      const friend = friendManager.getFriends().find(f => f.id === friendId)
      if (!friend) return false

      const invitation: GameInvitation = {
        id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromPlayerId: friendManager['currentPlayerId'] || 'unknown',
        fromPlayerName: 'You',
        toPlayerId: friendId,
        toPlayerName: friend.name,
        sessionId: this.currentSession?.id || '',
        gameType: gameType,
        timestamp: Date.now(),
        status: 'pending',
        expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
      }

      this.invitations.set(invitation.id, invitation)

      // In a real implementation, this would send the invitation via WebRTC
      this.saveToStorage()
      this.notifyInvitationListeners()

      return true
    } catch (error) {
      console.error('Failed to send game invitation:', error)
      return false
    }
  }

  // Respond to game invitation
  respondToInvitation(invitationId: string, accept: boolean): boolean {
    const invitation = this.invitations.get(invitationId)
    if (!invitation || invitation.status !== 'pending') return false

    if (accept) {
      invitation.status = 'accepted'
      // Auto-join the session
      this.joinSession(invitation.sessionId)
    } else {
      invitation.status = 'rejected'
    }

    this.saveToStorage()
    this.notifyInvitationListeners()

    return true
  }

  // Start the game session
  startSession(): boolean {
    if (!this.currentSession || !this.isHost || this.currentSession.status !== 'waiting') {
      return false
    }

    const readyPlayers = this.currentSession.players.filter(p => p.isReady).length
    const minPlayers = this.currentSession.settings.autoStart ? 2 : 1

    if (readyPlayers >= minPlayers) {
      this.currentSession.status = 'in_progress'
      this.saveToStorage()
      this.notifyListeners()
      return true
    }

    return false
  }

  // End the game session
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'completed'
      this.stopSessionBroadcast()

      this.saveToStorage()
      this.notifyListeners()

      // Reset after a delay
      setTimeout(() => {
        this.currentSession = null
        this.isHost = false
      }, 5000)
    }
  }

  // Update player ready status
  setPlayerReady(isReady: boolean): void {
    if (this.currentSession) {
      const player = this.currentSession.players.find(
        p => p.id === (friendManager['currentPlayerId'] || 'unknown')
      )
      if (player) {
        player.isReady = isReady
        this.saveToStorage()
        this.notifyListeners()
      }
    }
  }

  // Broadcast session information to the network
  private async startSessionBroadcast(session: GameSession): Promise<void> {
    // In a real implementation, this would use UDP broadcast or WebRTC
    // to announce the session to other devices on the network

    const broadcastInterval = setInterval(() => {
      if (session.status === 'waiting') {
        // Broadcast session info
        this.broadcastSessionInfo(session)
      } else {
        clearInterval(broadcastInterval)
      }
    }, 2000) // Broadcast every 2 seconds
  }

  // Stop session broadcasting
  private stopSessionBroadcast(): void {
    // Stop broadcasting (would clear intervals in real implementation)
  }

  // Broadcast session information
  private async broadcastSessionInfo(session: GameSession): Promise<void> {
    // In a real implementation, this would send UDP packets or use WebRTC
    // to announce the session to other devices

    // For now, simulate receiving sessions from other devices
    this.simulateSessionDiscovery()
  }

  // Simulate discovering sessions from other devices
  private simulateSessionDiscovery(): void {
    // This would be replaced with actual network discovery
    // For now, just update existing sessions
  }

  // Get all available sessions
  getAvailableSessions(): GameSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'waiting')
      .filter(session => !session.isPrivate || session.hostId === friendManager['currentPlayerId'])
  }

  // Get current session
  getCurrentSession(): GameSession | null {
    return this.currentSession
  }

  // Get pending invitations
  getPendingInvitations(): GameInvitation[] {
    const now = Date.now()
    return Array.from(this.invitations.values())
      .filter(inv => inv.status === 'pending' && inv.expiresAt > now)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  // Get current device ID
  private async getCurrentDeviceId(): Promise<string> {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Add listeners
  addSessionListener(listener: (sessions: GameSession[]) => void): void {
    this.listeners.add(listener)
  }

  addInvitationListener(listener: (invitations: GameInvitation[]) => void): void {
    this.invitationListeners.add(listener)
  }

  // Remove listeners
  removeSessionListener(listener: (sessions: GameSession[]) => void): void {
    this.listeners.delete(listener)
  }

  removeInvitationListener(listener: (invitations: GameInvitation[]) => void): void {
    this.invitationListeners.delete(listener)
  }

  // Notify listeners
  private notifyListeners(): void {
    const sessions = this.getAvailableSessions()
    this.listeners.forEach(listener => listener(sessions))
  }

  private notifyInvitationListeners(): void {
    const invitations = this.getPendingInvitations()
    this.invitationListeners.forEach(listener => listener(invitations))
  }

  // Save to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('game_sessions', JSON.stringify({
        sessions: Array.from(this.sessions.entries()),
        invitations: Array.from(this.invitations.entries()),
        currentSession: this.currentSession
      }))
    } catch (error) {
      console.error('Failed to save sessions to storage:', error)
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('game_sessions')
      if (data) {
        const parsed = JSON.parse(data)
        this.sessions = new Map(parsed.sessions || [])
        this.invitations = new Map(parsed.invitations || [])
        this.currentSession = parsed.currentSession || null
      }
    } catch (error) {
      console.error('Failed to load sessions from storage:', error)
    }
  }

  // Clean up expired invitations
  cleanupExpiredInvitations(): void {
    const now = Date.now()
    let changed = false

    for (const [id, invitation] of this.invitations.entries()) {
      if (invitation.expiresAt < now) {
        this.invitations.delete(id)
        changed = true
      }
    }

    if (changed) {
      this.saveToStorage()
      this.notifyInvitationListeners()
    }
  }
}

export const gameSessionManager = GameSessionManager.getInstance()
