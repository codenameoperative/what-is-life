// Friend Management System
import { lanDiscovery, type DiscoveredDevice } from './LANDiscoveryService'

export interface Friend {
  id: string
  name: string
  deviceId: string
  isOnline: boolean
  lastSeen: number
  status: 'online' | 'offline' | 'in_game'
  currentGame?: string
  playerId: string
  avatar?: string
}

export interface FriendRequest {
  id: string
  fromPlayerId: string
  fromPlayerName: string
  fromDeviceId: string
  timestamp: number
  status: 'pending' | 'accepted' | 'rejected'
}

class FriendManager {
  private static instance: FriendManager
  private friends: Map<string, Friend> = new Map()
  private friendRequests: Map<string, FriendRequest> = new Map()
  private currentPlayerId: string = ''
  private listeners: Set<(friends: Friend[]) => void> = new Set()
  private requestListeners: Set<(requests: FriendRequest[]) => void> = new Set()

  private constructor() {
    this.loadFromStorage()
  }

  static getInstance(): FriendManager {
    if (!FriendManager.instance) {
      FriendManager.instance = new FriendManager()
    }
    return FriendManager.instance
  }

  // Initialize with player ID
  initialize(playerId: string): void {
    this.currentPlayerId = playerId
    this.loadFromStorage()
  }

  getCurrentPlayerId(): string {
    return this.currentPlayerId
  }

  // Send friend request to a discovered device
  async sendFriendRequest(deviceId: string, targetPlayerName: string): Promise<boolean> {
    try {
      // In a real implementation, this would send a request via WebRTC or WebSocket
      // For now, simulate the request
      const request: FriendRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromPlayerId: this.currentPlayerId,
        fromPlayerName: 'You', // Would get actual player name
        fromDeviceId: await this.getCurrentDeviceId(),
        timestamp: Date.now(),
        status: 'pending'
      }

      // Simulate sending request (in real implementation, this would be sent to the target device)
      this.friendRequests.set(request.id, request)

      this.saveToStorage()
      this.notifyRequestListeners()

      return true
    } catch (error) {
      console.error('Failed to send friend request:', error)
      return false
    }
  }

  // Accept friend request
  acceptFriendRequest(requestId: string): boolean {
    const request = this.friendRequests.get(requestId)
    if (!request || request.status !== 'pending') return false

    // Add as friend
    const friend: Friend = {
      id: request.fromPlayerId,
      name: request.fromPlayerName,
      deviceId: request.fromDeviceId,
      isOnline: true,
      lastSeen: Date.now(),
      status: 'online',
      playerId: request.fromPlayerId
    }

    this.friends.set(friend.id, friend)
    request.status = 'accepted'

    this.saveToStorage()
    this.notifyListeners()
    this.notifyRequestListeners()

    return true
  }

  // Reject friend request
  rejectFriendRequest(requestId: string): boolean {
    const request = this.friendRequests.get(requestId)
    if (!request || request.status !== 'pending') return false

    request.status = 'rejected'

    this.saveToStorage()
    this.notifyRequestListeners()

    return true
  }

  // Remove friend
  removeFriend(friendId: string): boolean {
    const removed = this.friends.delete(friendId)
    if (removed) {
      this.saveToStorage()
      this.notifyListeners()
    }
    return removed
  }

  // Update friend status based on network discovery
  updateFriendStatus(device: DiscoveredDevice): void {
    this.friends.forEach((friend, id) => {
      if (friend.deviceId === device.id || friend.name === device.playerName) {
        friend.isOnline = device.isOnline
        friend.lastSeen = device.lastSeen
        friend.deviceId = device.id
      }
    })

    this.notifyListeners()
  }

  // Get all friends
  getFriends(): Friend[] {
    return Array.from(this.friends.values())
  }

  // Get pending friend requests
  getFriendRequests(): FriendRequest[] {
    return Array.from(this.friendRequests.values())
      .filter(req => req.status === 'pending')
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  // Check if device is a friend
  isFriend(deviceId: string): boolean {
    return Array.from(this.friends.values()).some(friend => friend.deviceId === deviceId)
  }

  // Get current device ID
  private async getCurrentDeviceId(): Promise<string> {
    // In a real implementation, this would generate a unique device ID
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Add listener for friend updates
  addFriendListener(listener: (friends: Friend[]) => void): void {
    this.listeners.add(listener)
  }

  // Add listener for friend request updates
  addRequestListener(listener: (requests: FriendRequest[]) => void): void {
    this.requestListeners.add(listener)
  }

  // Remove listeners
  removeFriendListener(listener: (friends: Friend[]) => void): void {
    this.listeners.delete(listener)
  }

  removeRequestListener(listener: (requests: FriendRequest[]) => void): void {
    this.requestListeners.delete(listener)
  }

  // Notify listeners
  private notifyListeners(): void {
    const friends = this.getFriends()
    this.listeners.forEach(listener => listener(friends))
  }

  private notifyRequestListeners(): void {
    const requests = this.getFriendRequests()
    this.requestListeners.forEach(listener => listener(requests))
  }

  // Save to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('friends', JSON.stringify({
        friends: Array.from(this.friends.entries()),
        requests: Array.from(this.friendRequests.entries())
      }))
    } catch (error) {
      console.error('Failed to save friends to storage:', error)
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('friends')
      if (data) {
        const parsed = JSON.parse(data)
        this.friends = new Map(parsed.friends || [])
        this.friendRequests = new Map(parsed.requests || [])
      }
    } catch (error) {
      console.error('Failed to load friends from storage:', error)
    }
  }

  // Clean up offline friends (remove friends not seen for more than 24 hours)
  cleanupOfflineFriends(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
    let changed = false

    this.friends.forEach((friend, id) => {
      if (friend.lastSeen < cutoffTime) {
        this.friends.delete(id)
        changed = true
      }
    })

    if (changed) {
      this.saveToStorage()
      this.notifyListeners()
    }
  }
}

export const friendManager = FriendManager.getInstance()
