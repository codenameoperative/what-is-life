// Main Multiplayer Manager - Unified interface for all multiplayer functionality
import { lanDiscovery, type DiscoveredDevice } from './LANDiscoveryService'
import { friendManager, type Friend, type FriendRequest } from './FriendManager'
import { gameSessionManager, type GameSession, type GameInvitation } from './GameSessionManager'
import { secureCommunication, type SecureConnection } from './SecureCommunicationLayer'
import { gameSyncEngine, type GameStateUpdate } from './GameSyncEngine'

export interface MultiplayerState {
  isOnline: boolean
  networkInfo: any
  discoveredDevices: DiscoveredDevice[]
  friends: Friend[]
  friendRequests: FriendRequest[]
  activeSessions: GameSession[]
  currentSession: GameSession | null
  connections: SecureConnection[]
  pendingInvitations: GameInvitation[]
}

export interface MultiplayerActions {
  // Network Discovery
  startNetworkDiscovery: () => Promise<void>
  stopNetworkDiscovery: () => void

  // Friend Management
  sendFriendRequest: (deviceId: string, playerName: string) => Promise<boolean>
  acceptFriendRequest: (requestId: string) => boolean
  rejectFriendRequest: (requestId: string) => boolean
  removeFriend: (friendId: string) => boolean

  // Game Sessions
  createGameSession: (gameType: GameSession['gameType'], settings?: any) => Promise<GameSession | null>
  joinGameSession: (sessionId: string) => Promise<boolean>
  leaveGameSession: () => void
  startGameSession: () => boolean
  endGameSession: () => void

  // Game Invitations
  sendGameInvitation: (friendId: string, gameType: GameSession['gameType']) => Promise<boolean>
  respondToInvitation: (invitationId: string, accept: boolean) => boolean

  // Real-time Sync
  applyGameUpdate: (sessionId: string, action: string, data: any) => Promise<boolean>
  setPlayerReady: (isReady: boolean) => void

  // Communication
  sendMessage: (peerId: string, message: any, type?: string) => Promise<boolean>
  establishConnection: (friendId: string) => Promise<boolean>
}

class MultiplayerManager {
  private static instance: MultiplayerManager
  private state: MultiplayerState
  private listeners: Set<(state: MultiplayerState) => void> = new Set()
  private isInitialized = false

  private constructor() {
    this.state = {
      isOnline: false,
      networkInfo: null,
      discoveredDevices: [],
      friends: [],
      friendRequests: [],
      activeSessions: [],
      currentSession: null,
      connections: [],
      pendingInvitations: []
    }
  }

  static getInstance(): MultiplayerManager {
    if (!MultiplayerManager.instance) {
      MultiplayerManager.instance = new MultiplayerManager()
    }
    return MultiplayerManager.instance
  }

  // Initialize the multiplayer system
  async initialize(playerId: string): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      // Initialize core services
      friendManager.initialize(playerId)
      await secureCommunication.initialize()
      await gameSyncEngine.initialize()

      // Set up event listeners
      this.setupEventListeners()

      // Start network discovery
      await this.startNetworkDiscovery()

      this.isInitialized = true
      console.log('Multiplayer system initialized')

      return true
    } catch (error) {
      console.error('Failed to initialize multiplayer system:', error)
      return false
    }
  }

  // Set up event listeners for all services
  private setupEventListeners(): void {
    // Network discovery listeners
    lanDiscovery.addListener((devices) => {
      this.state.discoveredDevices = devices
      this.state.networkInfo = lanDiscovery.getNetworkInfo()
      this.notifyListeners()
    })

    // Friend management listeners
    friendManager.addFriendListener((friends) => {
      this.state.friends = friends
      this.notifyListeners()
    })

    friendManager.addRequestListener((requests) => {
      this.state.friendRequests = requests
      this.notifyListeners()
    })

    // Game session listeners
    gameSessionManager.addSessionListener((sessions) => {
      this.state.activeSessions = sessions
      this.notifyListeners()
    })

    gameSessionManager.addInvitationListener((invitations) => {
      this.state.pendingInvitations = invitations
      this.notifyListeners()
    })

    // Connection listeners
    secureCommunication.addConnectionListener((connections) => {
      this.state.connections = connections
      this.notifyListeners()
    })

    // Start heartbeat for connections
    secureCommunication.startHeartbeat()
  }

  // Get current multiplayer state
  getState(): MultiplayerState {
    return { ...this.state }
  }

  // Get multiplayer actions
  getActions(): MultiplayerActions {
    return {
      // Network Discovery
      startNetworkDiscovery: this.startNetworkDiscovery.bind(this),
      stopNetworkDiscovery: this.stopNetworkDiscovery.bind(this),

      // Friend Management
      sendFriendRequest: this.sendFriendRequest.bind(this),
      acceptFriendRequest: this.acceptFriendRequest.bind(this),
      rejectFriendRequest: this.rejectFriendRequest.bind(this),
      removeFriend: this.removeFriend.bind(this),

      // Game Sessions
      createGameSession: this.createGameSession.bind(this),
      joinGameSession: this.joinGameSession.bind(this),
      leaveGameSession: this.leaveGameSession.bind(this),
      startGameSession: this.startGameSession.bind(this),
      endGameSession: this.endGameSession.bind(this),

      // Game Invitations
      sendGameInvitation: this.sendGameInvitation.bind(this),
      respondToInvitation: this.respondToInvitation.bind(this),

      // Real-time Sync
      applyGameUpdate: this.applyGameUpdate.bind(this),
      setPlayerReady: this.setPlayerReady.bind(this),

      // Communication
      sendMessage: this.sendMessage.bind(this),
      establishConnection: this.establishConnection.bind(this)
    }
  }

  // Network Discovery Actions
  private async startNetworkDiscovery(): Promise<void> {
    await lanDiscovery.startScanning()
    this.state.isOnline = true
    this.notifyListeners()
  }

  private stopNetworkDiscovery(): void {
    lanDiscovery.stopScanning()
    this.state.isOnline = false
    this.notifyListeners()
  }

  // Friend Management Actions
  private async sendFriendRequest(deviceId: string, playerName: string): Promise<boolean> {
    const success = await friendManager.sendFriendRequest(deviceId, playerName)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private acceptFriendRequest(requestId: string): boolean {
    const success = friendManager.acceptFriendRequest(requestId)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private rejectFriendRequest(requestId: string): boolean {
    const success = friendManager.rejectFriendRequest(requestId)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private removeFriend(friendId: string): boolean {
    const success = friendManager.removeFriend(friendId)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  // Game Session Actions
  private async createGameSession(gameType: GameSession['gameType'], settings?: any): Promise<GameSession | null> {
    const session = await gameSessionManager.createSession(gameType, settings)
    if (session) {
      this.state.currentSession = session
      this.notifyListeners()
    }
    return session
  }

  private async joinGameSession(sessionId: string): Promise<boolean> {
    const success = await gameSessionManager.joinSession(sessionId)
    if (success) {
      const session = gameSessionManager.getCurrentSession()
      this.state.currentSession = session
      this.notifyListeners()
    }
    return success
  }

  private leaveGameSession(): void {
    gameSessionManager.leaveSession()
    this.state.currentSession = null
    this.notifyListeners()
  }

  private startGameSession(): boolean {
    const success = gameSessionManager.startSession()
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private endGameSession(): void {
    gameSessionManager.endSession()
    this.state.currentSession = null
    this.notifyListeners()
  }

  // Game Invitation Actions
  private async sendGameInvitation(friendId: string, gameType: GameSession['gameType']): Promise<boolean> {
    const success = await gameSessionManager.sendGameInvitation(friendId, gameType)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private respondToInvitation(invitationId: string, accept: boolean): boolean {
    const success = gameSessionManager.respondToInvitation(invitationId, accept)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  // Real-time Sync Actions
  private async applyGameUpdate(sessionId: string, action: string, data: any): Promise<boolean> {
    const success = await gameSyncEngine.applyUpdate(sessionId, action, data)
    if (success) {
      this.notifyListeners()
    }
    return success
  }

  private setPlayerReady(isReady: boolean): void {
    gameSessionManager.setPlayerReady(isReady)
    this.notifyListeners()
  }

  // Communication Actions
  private async sendMessage(peerId: string, message: any, type?: string): Promise<boolean> {
    return await secureCommunication.sendMessage(peerId, message, type as any)
  }

  private async establishConnection(friendId: string): Promise<boolean> {
    return await secureCommunication.establishConnection(friendId)
  }

  // Add state change listener
  addListener(listener: (state: MultiplayerState) => void): void {
    this.listeners.add(listener)
  }

  // Remove state change listener
  removeListener(listener: (state: MultiplayerState) => void): void {
    this.listeners.delete(listener)
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()))
  }

  // Clean up resources
  cleanup(): void {
    this.stopNetworkDiscovery()
    this.listeners.clear()
  }

  // Get online friends
  getOnlineFriends(): Friend[] {
    return this.state.friends.filter(friend => friend.isOnline)
  }

  // Get friends in game
  getFriendsInGame(): Friend[] {
    return this.state.friends.filter(friend => friend.status === 'in_game')
  }

  // Check if can play with friend
  canPlayWithFriend(friendId: string): boolean {
    const friend = this.state.friends.find(f => f.id === friendId)
    return friend?.isOnline && friend?.status !== 'in_game' || false
  }

  // Get connection status for friend
  getFriendConnectionStatus(friendId: string): SecureConnection | null {
    return this.state.connections.find(conn => conn.peerId === friendId) || null
  }
}

export const multiplayerManager = MultiplayerManager.getInstance()
