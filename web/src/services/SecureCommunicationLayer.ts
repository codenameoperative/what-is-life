// Secure Communication Layer with E2E Encryption
import { friendManager, type Friend } from './FriendManager'

export interface EncryptedMessage {
  id: string
  from: string
  to: string
  type: 'text' | 'game_data' | 'control' | 'heartbeat'
  payload: string // Encrypted data
  timestamp: number
  signature: string
}

export interface SecureConnection {
  peerId: string
  peerName: string
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed'
  encryptionKey: CryptoKey | null
  lastActivity: number
}

class SecureCommunicationLayer {
  private static instance: SecureCommunicationLayer
  private connections: Map<string, SecureConnection> = new Map()
  private messageListeners: Map<string, Set<(message: any) => void>> = new Map()
  private connectionListeners: Set<(connections: SecureConnection[]) => void> = new Set()
  private isInitialized = false

  private constructor() {}

  static getInstance(): SecureCommunicationLayer {
    if (!SecureCommunicationLayer.instance) {
      SecureCommunicationLayer.instance = new SecureCommunicationLayer()
    }
    return SecureCommunicationLayer.instance
  }

  // Initialize the secure communication layer
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      // Initialize WebRTC for peer-to-peer connections
      await this.initializeWebRTC()

      this.isInitialized = true
      console.log('Secure communication layer initialized')

      return true
    } catch (error) {
      console.error('Failed to initialize secure communication:', error)
      return false
    }
  }

  // Initialize WebRTC for peer-to-peer communication
  private async initializeWebRTC(): Promise<void> {
    // In a real implementation, this would set up WebRTC peer connections
    // For now, we'll simulate the connection establishment
  }

  // Establish secure connection with a friend
  async establishConnection(friendId: string): Promise<boolean> {
    const friend = friendManager.getFriends().find(f => f.id === friendId)
    if (!friend) return false

    try {
      const connection: SecureConnection = {
        peerId: friendId,
        peerName: friend.name,
        connectionState: 'connecting',
        encryptionKey: null,
        lastActivity: Date.now()
      }

      this.connections.set(friendId, connection)

      // Generate encryption keys for this connection
      const keys = await this.generateEncryptionKeys()
      connection.encryptionKey = keys.encryptionKey

      // Simulate connection establishment
      await this.simulateConnectionEstablishment(friendId)

      connection.connectionState = 'connected'
      this.notifyConnectionListeners()

      return true
    } catch (error) {
      console.error('Failed to establish connection:', error)
      this.connections.delete(friendId)
      return false
    }
  }

  // Generate encryption keys for secure communication
  private async generateEncryptionKeys(): Promise<{ encryptionKey: CryptoKey; decryptionKey: CryptoKey }> {
    try {
      // Generate AES-GCM key for symmetric encryption
      const key = await crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )

      return { encryptionKey: key, decryptionKey: key }
    } catch (error) {
      console.error('Failed to generate encryption keys:', error)
      throw error
    }
  }

  // Simulate connection establishment (placeholder)
  private async simulateConnectionEstablishment(friendId: string): Promise<void> {
    // In a real implementation, this would:
    // 1. Use WebRTC to establish peer connection
    // 2. Exchange public keys for key agreement
    // 3. Establish encrypted tunnel

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Connection established with ${friendId}`)
        resolve()
      }, 1000)
    })
  }

  // Send encrypted message to a peer
  async sendMessage(peerId: string, message: any, type: EncryptedMessage['type'] = 'text'): Promise<boolean> {
    const connection = this.connections.get(peerId)
    if (!connection || connection.connectionState !== 'connected' || !connection.encryptionKey) {
      return false
    }

    try {
      // Serialize and encrypt the message
      const serializedMessage = JSON.stringify(message)
      const encryptedPayload = await this.encryptMessage(serializedMessage, connection.encryptionKey)

      const encryptedMessage: EncryptedMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from: friendManager['currentPlayerId'] || 'unknown',
        to: peerId,
        type,
        payload: encryptedPayload,
        timestamp: Date.now(),
        signature: await this.generateMessageSignature(serializedMessage)
      }

      // In a real implementation, this would send via WebRTC DataChannel
      await this.simulateMessageSending(encryptedMessage)

      // Update last activity
      connection.lastActivity = Date.now()

      return true
    } catch (error) {
      console.error('Failed to send message:', error)
      return false
    }
  }

  // Encrypt message using AES-GCM
  private async encryptMessage(message: string, key: CryptoKey): Promise<string> {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(message)

      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12))

      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      )

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)

      // Return base64 encoded result
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('Failed to encrypt message:', error)
      throw error
    }
  }

  // Decrypt message using AES-GCM
  private async decryptMessage(encryptedData: string, key: CryptoKey): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      )

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error('Failed to decrypt message:', error)
      throw error
    }
  }

  // Generate message signature for integrity verification
  private async generateMessageSignature(message: string): Promise<string> {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(message)

      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))

      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Failed to generate message signature:', error)
      return ''
    }
  }

  // Verify message signature
  private async verifyMessageSignature(message: string, signature: string): Promise<boolean> {
    const expectedSignature = await this.generateMessageSignature(message)
    return expectedSignature === signature
  }

  // Simulate message sending (placeholder)
  private async simulateMessageSending(message: EncryptedMessage): Promise<void> {
    // In a real implementation, this would send the message via WebRTC DataChannel
    console.log('Message sent:', message.id)
  }

  // Add message listener for a specific peer
  addMessageListener(peerId: string, listener: (message: any) => void): void {
    if (!this.messageListeners.has(peerId)) {
      this.messageListeners.set(peerId, new Set())
    }
    this.messageListeners.get(peerId)!.add(listener)
  }

  // Remove message listener
  removeMessageListener(peerId: string, listener: (message: any) => void): void {
    const listeners = this.messageListeners.get(peerId)
    if (listeners) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.messageListeners.delete(peerId)
      }
    }
  }

  // Add connection status listener
  addConnectionListener(listener: (connections: SecureConnection[]) => void): void {
    this.connectionListeners.add(listener)
  }

  // Remove connection listener
  removeConnectionListener(listener: (connections: SecureConnection[]) => void): void {
    this.connectionListeners.delete(listener)
  }

  // Get all active connections
  getActiveConnections(): SecureConnection[] {
    return Array.from(this.connections.values())
      .filter(conn => conn.connectionState === 'connected')
  }

  // Get connection status for a peer
  getConnectionStatus(peerId: string): SecureConnection | null {
    return this.connections.get(peerId) || null
  }

  // Disconnect from a peer
  disconnectPeer(peerId: string): void {
    const connection = this.connections.get(peerId)
    if (connection) {
      connection.connectionState = 'disconnected'
      this.notifyConnectionListeners()
    }
  }

  // Clean up inactive connections
  cleanupInactiveConnections(): void {
    const cutoffTime = Date.now() - (5 * 60 * 1000) // 5 minutes ago
    let changed = false

    for (const [peerId, connection] of this.connections.entries()) {
      if (connection.lastActivity < cutoffTime && connection.connectionState === 'connected') {
        connection.connectionState = 'disconnected'
        changed = true
      }
    }

    if (changed) {
      this.notifyConnectionListeners()
    }
  }

  // Notify connection listeners
  private notifyConnectionListeners(): void {
    const connections = this.getActiveConnections()
    this.connectionListeners.forEach(listener => listener(connections))
  }

  // Process incoming encrypted message
  async processIncomingMessage(encryptedMessage: EncryptedMessage): Promise<void> {
    try {
      const connection = this.connections.get(encryptedMessage.from)
      if (!connection || !connection.encryptionKey) {
        console.warn('Received message from unknown or disconnected peer')
        return
      }

      // Verify message signature
      const decryptedPayload = await this.decryptMessage(encryptedMessage.payload, connection.encryptionKey)
      const isValidSignature = await this.verifyMessageSignature(decryptedPayload, encryptedMessage.signature)

      if (!isValidSignature) {
        console.warn('Invalid message signature - possible tampering')
        return
      }

      // Parse and handle the decrypted message
      const message = JSON.parse(decryptedPayload)

      // Notify message listeners
      const listeners = this.messageListeners.get(encryptedMessage.from)
      if (listeners) {
        listeners.forEach(listener => listener(message))
      }

      // Update connection activity
      connection.lastActivity = Date.now()

    } catch (error) {
      console.error('Failed to process incoming message:', error)
    }
  }

  // Send heartbeat to maintain connection
  async sendHeartbeat(peerId: string): Promise<void> {
    await this.sendMessage(peerId, { type: 'heartbeat', timestamp: Date.now() }, 'heartbeat')
  }

  // Start heartbeat for all connections
  startHeartbeat(): void {
    setInterval(() => {
      this.getActiveConnections().forEach(connection => {
        this.sendHeartbeat(connection.peerId)
      })

      // Clean up inactive connections
      this.cleanupInactiveConnections()
    }, 30000) // Every 30 seconds
  }
}

export const secureCommunication = SecureCommunicationLayer.getInstance()
