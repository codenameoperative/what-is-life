// LAN Discovery Service for detecting devices on the same network
export interface DiscoveredDevice {
  id: string
  name: string
  ip: string
  port: number
  gameVersion: string
  playerName: string
  isOnline: boolean
  lastSeen: number
}

export interface NetworkInfo {
  isConnected: boolean
  networkName: string
  ipAddress: string
  subnet: string
}

class LANDiscoveryService {
  private static instance: LANDiscoveryService
  private discoveredDevices: Map<string, DiscoveredDevice> = new Map()
  private isScanning = false
  private scanInterval: number | null = null
  private networkInfo: NetworkInfo | null = null
  private listeners: Set<(devices: DiscoveredDevice[]) => void> = new Set()

  private constructor() {
    this.initializeNetworkInfo()
  }

  static getInstance(): LANDiscoveryService {
    if (!LANDiscoveryService.instance) {
      LANDiscoveryService.instance = new LANDiscoveryService()
    }
    return LANDiscoveryService.instance
  }

  // Initialize network information
  private async initializeNetworkInfo(): Promise<void> {
    try {
      // In a real implementation, this would use WebRTC or other network APIs
      // For now, we'll use a placeholder that works in browser environment
      this.networkInfo = {
        isConnected: true,
        networkName: 'Local Network',
        ipAddress: await this.getLocalIP(),
        subnet: '192.168.1.0/24'
      }
    } catch (error) {
      console.error('Failed to initialize network info:', error)
      this.networkInfo = {
        isConnected: false,
        networkName: 'Unknown',
        ipAddress: '127.0.0.1',
        subnet: '127.0.0.1/8'
      }
    }
  }

  // Get local IP address (simplified implementation)
  private async getLocalIP(): Promise<string> {
    try {
      // Create a temporary peer connection to discover local IP
      const pc = new RTCPeerConnection({ iceServers: [] })
      pc.createDataChannel('')

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      return new Promise((resolve) => {
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const ipMatch = event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/)
            if (ipMatch) {
              resolve(ipMatch[1])
            }
          }
        }

        setTimeout(() => resolve('127.0.0.1'), 1000)
      })
    } catch {
      return '127.0.0.1'
    }
  }

  // Start network scanning
  async startScanning(): Promise<void> {
    if (this.isScanning) return

    this.isScanning = true

    // Scan for devices using UDP broadcast (simplified)
    // In a real implementation, this would use WebRTC or WebSockets
    this.scanNetwork()

    // Set up periodic scanning
    this.scanInterval = setInterval(() => {
      this.scanNetwork()
    }, 5000) // Scan every 5 seconds
  }

  // Stop network scanning
  stopScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval)
      this.scanInterval = null
    }
    this.isScanning = false
  }

  // Scan the network for other game instances
  private async scanNetwork(): Promise<void> {
    if (!this.networkInfo?.isConnected) return

    try {
      // In a real implementation, this would:
      // 1. Send UDP broadcast packets to discover devices
      // 2. Listen for responses from other game instances
      // 3. Use WebRTC for peer-to-peer discovery

      // For now, simulate discovering devices
      await this.simulateNetworkScan()
    } catch (error) {
      console.error('Network scan failed:', error)
    }
  }

  // Simulate network scanning (placeholder for real implementation)
  private async simulateNetworkScan(): Promise<void> {
    // This is a placeholder - in a real implementation, you would:
    // 1. Use UDP multicast/broadcast to discover peers
    // 2. Use WebRTC ICE candidates for NAT traversal
    // 3. Implement a service discovery protocol

    // Simulate finding other devices on the network
    const mockDevices: DiscoveredDevice[] = [
      {
        id: 'device_1',
        name: 'Player\'s Phone',
        ip: '192.168.1.100',
        port: 3001,
        gameVersion: '1.0.0',
        playerName: 'Alice',
        isOnline: true,
        lastSeen: Date.now()
      },
      {
        id: 'device_2',
        name: 'Gaming Laptop',
        ip: '192.168.1.101',
        port: 3002,
        gameVersion: '1.0.0',
        playerName: 'Bob',
        isOnline: true,
        lastSeen: Date.now() - 2000
      }
    ]

    mockDevices.forEach(device => {
      this.discoveredDevices.set(device.id, device)
    })

    this.notifyListeners()
  }

  // Get all discovered devices
  getDiscoveredDevices(): DiscoveredDevice[] {
    return Array.from(this.discoveredDevices.values())
      .filter(device => Date.now() - device.lastSeen < 10000) // Only show devices seen in last 10 seconds
      .sort((a, b) => b.lastSeen - a.lastSeen)
  }

  // Get network information
  getNetworkInfo(): NetworkInfo | null {
    return this.networkInfo
  }

  // Add listener for device discovery updates
  addListener(listener: (devices: DiscoveredDevice[]) => void): void {
    this.listeners.add(listener)
  }

  // Remove listener
  removeListener(listener: (devices: DiscoveredDevice[]) => void): void {
    this.listeners.delete(listener)
  }

  // Notify all listeners of device updates
  private notifyListeners(): void {
    const devices = this.getDiscoveredDevices()
    this.listeners.forEach(listener => listener(devices))
  }

  // Check if we're on the same network as another device
  isOnSameNetwork(deviceIP: string): boolean {
    if (!this.networkInfo) return false

    // Simple subnet check (would be more sophisticated in real implementation)
    const ourSubnet = this.networkInfo.subnet.split('/')[0]
    const ourParts = ourSubnet.split('.')
    const deviceParts = deviceIP.split('.')

    return ourParts[0] === deviceParts[0] &&
           ourParts[1] === deviceParts[1] &&
           ourParts[2] === deviceParts[2]
  }
}

export const lanDiscovery = LANDiscoveryService.getInstance()
