// Real-time Game State Synchronization Engine using WebRTC
import { friendManager } from './FriendManager'

export interface GameStateUpdate {
  id: string
  timestamp: number
  playerId: string
  action: string
  data: any
  sequenceNumber: number
  checksum: string
}

export interface SyncSession {
  sessionId: string
  participants: string[]
  gameState: any
  lastUpdate: number
  sequenceNumber: number
  conflictResolution: 'last_write_wins' | 'operational_transform' | 'custom'
}

interface PeerConnection {
  peerId: string
  connection: RTCPeerConnection
  dataChannel: RTCDataChannel | null
  lastActivity: number
  isConnected: boolean
}

class GameSyncEngine {
  private static instance: GameSyncEngine
  private syncSessions: Map<string, SyncSession> = new Map()
  private pendingUpdates: Map<string, GameStateUpdate[]> = new Map()
  private listeners: Map<string, Set<(update: GameStateUpdate) => void>> = new Map()
  private peerConnections: Map<string, PeerConnection> = new Map()
  private isInitialized = false
  private sequenceCounter = 0

  private constructor() {}

  static getInstance(): GameSyncEngine {
    if (!GameSyncEngine.instance) {
      GameSyncEngine.instance = new GameSyncEngine()
    }
    return GameSyncEngine.instance
  }

  // Initialize the sync engine
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      this.setupDiscoveryListener()
      this.startSyncLoop()

      this.isInitialized = true
      console.log('Game sync engine initialized')

      return true
    } catch (error) {
      console.error('Failed to initialize game sync engine:', error)
      return false
    }
  }

  // Set up discovery listener
  private setupDiscoveryListener(): void {
    // Listen for new friends joining
    friendManager.addFriendListener((friends) => {
      friends.forEach(friend => {
        if (friend.isOnline && !this.peerConnections.has(friend.id)) {
          this.establishPeerConnection(friend.id)
        }
      })
    })
  }

  // Handle incoming sync messages
  private async handleIncomingMessage(message: any): Promise<void> {
    if (message.type === 'game_sync') {
      const update = message.data as GameStateUpdate
      await this.processIncomingUpdate(update)
    }
  }

  // Establish WebRTC peer connection
  private async establishPeerConnection(peerId: string): Promise<boolean> {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })

      const dataChannel = peerConnection.createDataChannel('game-sync', {
        ordered: true,
        maxPacketLifeTime: 3000
      })

      dataChannel.onopen = () => {
        console.log('Data channel opened with', peerId)
        const connection = this.peerConnections.get(peerId)
        if (connection) {
          connection.isConnected = true
          connection.dataChannel = dataChannel
        }
      }

      dataChannel.onmessage = (event) => {
        this.handleIncomingMessage(JSON.parse(event.data))
      }

      dataChannel.onclose = () => {
        console.log('Data channel closed with', peerId)
        const connection = this.peerConnections.get(peerId)
        if (connection) {
          connection.isConnected = false
        }
      }

      const peerConnectionObj: PeerConnection = {
        peerId,
        connection: peerConnection,
        dataChannel,
        lastActivity: Date.now(),
        isConnected: false
      }

      this.peerConnections.set(peerId, peerConnectionObj)

      return true
    } catch (error) {
      console.error('Failed to establish peer connection:', error)
      return false
    }
  }

  // Send message to peer via WebRTC data channel
  private async sendMessageToPeer(peerId: string, message: any): Promise<boolean> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection || !peerConnection.isConnected || !peerConnection.dataChannel) {
      return false
    }

    try {
      peerConnection.dataChannel.send(JSON.stringify(message))
      peerConnection.lastActivity = Date.now()
      return true
    } catch (error) {
      console.error('Failed to send message to peer:', error)
      return false
    }
  }

  // Create or join a sync session
  async createSyncSession(sessionId: string, participants: string[]): Promise<SyncSession> {
    const session: SyncSession = {
      sessionId,
      participants,
      gameState: {},
      lastUpdate: Date.now(),
      sequenceNumber: 0,
      conflictResolution: 'last_write_wins'
    }

    this.syncSessions.set(sessionId, session)

    // Send session creation message to all participants
    for (const participantId of participants) {
      if (participantId !== friendManager.getCurrentPlayerId()) {
        await this.sendMessageToPeer(participantId, {
          type: 'session_created',
          sessionId,
          participants
        })
      }
    }

    return session
  }

  // Join an existing sync session
  async joinSyncSession(sessionId: string, participantId: string): Promise<boolean> {
    const session = this.syncSessions.get(sessionId)
    if (!session) return false

    if (!session.participants.includes(participantId)) {
      session.participants.push(participantId)
    }

    // Notify other participants
    for (const pid of session.participants) {
      if (pid !== participantId && pid !== friendManager.getCurrentPlayerId()) {
        await this.sendMessageToPeer(pid, {
          type: 'participant_joined',
          sessionId: sessionId,
          participantId
        })
      }
    }

    return true
  }

  // Apply a game state update
  async applyUpdate(sessionId: string, action: string, data: any): Promise<boolean> {
    const session = this.syncSessions.get(sessionId)
    if (!session) return false

    const update: GameStateUpdate = {
      id: `update_${Date.now()}_${++this.sequenceCounter}`,
      timestamp: Date.now(),
      playerId: friendManager.getCurrentPlayerId(),
      action,
      data,
      sequenceNumber: ++session.sequenceNumber,
      checksum: await this.generateChecksum(JSON.stringify({ action, data }))
    }

    // Apply update locally first
    const success = await this.applyUpdateLocally(sessionId, session, update)

    if (success) {
      // Broadcast update to other participants
      await this.broadcastUpdate(sessionId, update)

      // Store in pending updates for reliability
      if (!this.pendingUpdates.has(sessionId)) {
        this.pendingUpdates.set(sessionId, [])
      }
      this.pendingUpdates.get(sessionId)!.push(update)

      // Clean up old pending updates
      this.cleanupPendingUpdates(sessionId)
    }

    return success
  }

  // Apply update locally
  private async applyUpdateLocally(sessionId: string, syncSession: SyncSession, update: GameStateUpdate): Promise<boolean> {
    try {
      // Apply the update based on action type
      switch (update.action) {
        case 'player_move':
          syncSession.gameState.players = syncSession.gameState.players || {}
          syncSession.gameState.players[update.playerId] = {
            ...syncSession.gameState.players[update.playerId],
            ...update.data
          }
          break

        case 'game_event':
          syncSession.gameState.events = syncSession.gameState.events || []
          syncSession.gameState.events.push(update.data)
          break

        case 'score_update':
          syncSession.gameState.scores = syncSession.gameState.scores || {}
          syncSession.gameState.scores[update.playerId] = update.data.score
          break

        case 'game_state':
          // Full state synchronization
          syncSession.gameState = { ...syncSession.gameState, ...update.data }
          break

        default:
          console.warn('Unknown action type:', update.action)
          return false
      }

      syncSession.lastUpdate = update.timestamp

      // Notify local listeners
      this.notifyListeners(sessionId, update)

      return true
    } catch (error) {
      console.error('Failed to apply update locally:', error)
      return false
    }
  }

  // Broadcast update to session participants
  private async broadcastUpdate(sessionId: string, update: GameStateUpdate): Promise<void> {
    const session = this.syncSessions.get(sessionId)
    if (!session) return

    for (const participantId of session.participants) {
      if (participantId !== update.playerId) {
        await this.sendMessageToPeer(participantId, {
          type: 'game_sync',
          sessionId,
          data: update
        })
      }
    }
  }

  // Process incoming update from another player
  private async processIncomingUpdate(update: GameStateUpdate): Promise<void> {
    const sessionId = update.id.split('_')[1] // Extract session ID from update ID
    const session = this.syncSessions.get(sessionId)
    if (!session) return

    // Check for conflicts and resolve
    const conflict = await this.detectConflict(sessionId, session, update)
    if (conflict) {
      await this.resolveConflict(sessionId, session, update, conflict)
    } else {
      await this.applyUpdateLocally(sessionId, session, update)
    }
  }

  // Detect conflicts between updates
  private async detectConflict(sessionId: string, session: SyncSession, update: GameStateUpdate): Promise<GameStateUpdate | null> {
    // Simple conflict detection based on sequence numbers
    // In a more sophisticated implementation, this would use operational transforms

    const pendingUpdates = this.pendingUpdates.get(session.sessionId) || []
    const conflictingUpdate = pendingUpdates.find(
      pending => pending.sequenceNumber === update.sequenceNumber &&
                 pending.playerId !== update.playerId
    )

    return conflictingUpdate || null
  }

  // Resolve conflicts using configured strategy
  private async resolveConflict(sessionId: string, session: SyncSession, update: GameStateUpdate, conflict: GameStateUpdate): Promise<void> {
    switch (session.conflictResolution) {
      case 'last_write_wins':
        // Use the most recent update
        if (update.timestamp > conflict.timestamp) {
          await this.applyUpdateLocally(sessionId, session, update)
        } else {
          await this.applyUpdateLocally(sessionId, session, conflict)
        }
        break

      case 'operational_transform':
        // Apply operational transformation (simplified)
        await this.applyOperationalTransform(sessionId, session, update, conflict)
        break

      default:
        // Default to last write wins
        await this.applyUpdateLocally(sessionId, session, update)
    }
  }

  // Apply operational transformation (simplified)
  private async applyOperationalTransform(sessionId: string, session: SyncSession, update: GameStateUpdate, conflict: GameStateUpdate): Promise<void> {
    if (update.action === conflict.action && update.playerId !== conflict.playerId) {
      // Transform conflicting operations
      const transformedUpdate = this.transformOperations(update, conflict)
      await this.applyUpdateLocally(sessionId, session, transformedUpdate)
    } else {
      // No transformation needed
      await this.applyUpdateLocally(sessionId, session, update)
    }
  }

  // Transform conflicting operations (simplified)
  private transformOperations(update: GameStateUpdate, conflict: GameStateUpdate): GameStateUpdate {
    // This is a placeholder for operational transformation logic
    // Real implementation would depend on the specific operation types

    return update
  }

  // Generate checksum for data integrity
  private async generateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
  }

  // Add listener for game state updates
  addUpdateListener(sessionId: string, listener: (update: GameStateUpdate) => void): void {
    if (!this.listeners.has(sessionId)) {
      this.listeners.set(sessionId, new Set())
    }
    this.listeners.get(sessionId)!.add(listener)
  }

  // Remove update listener
  removeUpdateListener(sessionId: string, listener: (update: GameStateUpdate) => void): void {
    const listeners = this.listeners.get(sessionId)
    if (listeners) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listeners.delete(sessionId)
      }
    }
  }

  // Notify listeners of updates
  private notifyListeners(sessionId: string, update: GameStateUpdate): void {
    const listeners = this.listeners.get(sessionId)
    if (listeners) {
      listeners.forEach(listener => listener(update))
    }
  }

  // Start synchronization loop
  private startSyncLoop(): void {
    setInterval(() => {
      // Send periodic sync messages to maintain connection
      this.sendPeriodicSync()

      // Clean up old pending updates
      this.cleanupOldUpdates()
    }, 1000) // Every second
  }

  // Send periodic sync messages
  private async sendPeriodicSync(): Promise<void> {
    this.syncSessions.forEach(async (session) => {
      for (const participantId of session.participants) {
        if (participantId !== friendManager.getCurrentPlayerId()) {
          await this.sendMessageToPeer(participantId, {
            type: 'sync_heartbeat',
            sessionId: session.sessionId,
            timestamp: Date.now()
          })
        }
      }
    })
  }

  // Clean up old pending updates
  private cleanupOldUpdates(): void {
    const cutoffTime = Date.now() - (5 * 60 * 1000) // 5 minutes ago

    this.pendingUpdates.forEach((updates, sessionId) => {
      const recentUpdates = updates.filter(update => update.timestamp > cutoffTime)
      this.pendingUpdates.set(sessionId, recentUpdates)
    })
  }

  // Clean up pending updates for a specific session
  private cleanupPendingUpdates(sessionId: string): void {
    const updates = this.pendingUpdates.get(sessionId) || []
    const recentUpdates = updates.filter(update => Date.now() - update.timestamp < 60000) // Keep last minute
    this.pendingUpdates.set(sessionId, recentUpdates)
  }

  // Get current game state for a session
  getGameState(sessionId: string): any {
    const session = this.syncSessions.get(sessionId)
    return session?.gameState || {}
  }

  // Get all active sync sessions
  getActiveSessions(): SyncSession[] {
    return Array.from(this.syncSessions.values())
      .filter(session => Date.now() - session.lastUpdate < 300000) // Active in last 5 minutes
  }

  // End sync session
  endSession(sessionId: string): void {
    const session = this.syncSessions.get(sessionId)
    if (session) {
      // Notify all participants that session is ending
      session.participants.forEach(participantId => {
        if (participantId !== friendManager.getCurrentPlayerId()) {
          this.sendMessageToPeer(participantId, {
            type: 'session_ended',
            sessionId
          })
        }
      })

      this.syncSessions.delete(sessionId)
      this.pendingUpdates.delete(sessionId)
      this.listeners.delete(sessionId)
    }
  }

  // Handle player disconnection
  handlePlayerDisconnection(sessionId: string, playerId: string): void {
    const session = this.syncSessions.get(sessionId)
    if (session) {
      session.participants = session.participants.filter(id => id !== playerId)

      // If no participants left, end the session
      if (session.participants.length === 0) {
        this.endSession(sessionId)
      } else {
        // Notify remaining participants
        session.participants.forEach(participantId => {
          if (participantId !== friendManager.getCurrentPlayerId()) {
            this.sendMessageToPeer(participantId, {
              type: 'player_disconnected',
              sessionId,
              playerId
            })
          }
        })
      }
    }
  }

  // Synchronize full game state (for new players joining)
  async synchronizeFullState(sessionId: string, targetPlayerId: string): Promise<boolean> {
    const session = this.syncSessions.get(sessionId)
    if (!session) return false

    try {
      await this.sendMessageToPeer(targetPlayerId, {
        type: 'full_state_sync',
        sessionId,
        gameState: session.gameState,
        sequenceNumber: session.sequenceNumber
      })

      return true
    } catch (error) {
      console.error('Failed to synchronize full state:', error)
      return false
    }
  }
}

export const gameSyncEngine = GameSyncEngine.getInstance()
