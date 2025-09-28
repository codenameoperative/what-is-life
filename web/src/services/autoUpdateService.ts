import { AppUpdate } from '@capawesome/capacitor-app-update'
import { Network } from '@capacitor/network'
import { Capacitor } from '@capacitor/core'

export interface AutoUpdateSettings {
  enabled: boolean
  wifiOnly: boolean
  checkInterval: number // hours
  lastCheck: number // timestamp
  currentVersion: string
}

export class AutoUpdateService {
  private static instance: AutoUpdateService

  static getInstance(): AutoUpdateService {
    if (!AutoUpdateService.instance) {
      AutoUpdateService.instance = new AutoUpdateService()
    }
    return AutoUpdateService.instance
  }

  async checkForUpdates(settings: AutoUpdateSettings): Promise<{available: boolean, version?: string}> {
    if (!settings.enabled) {
      return { available: false }
    }

    // Check WiFi requirement
    if (settings.wifiOnly) {
      try {
        const networkStatus = await Network.getStatus()
        if (networkStatus.connectionType !== 'wifi') {
          console.log('Auto-update skipped: WiFi required, current connection:', networkStatus.connectionType)
          return { available: false }
        }
      } catch (error) {
        console.warn('Could not check network status:', error)
        // Continue with update check if network check fails
      }
    }

    // Check time interval
    const now = Date.now()
    const hoursSinceLastCheck = (now - settings.lastCheck) / (1000 * 60 * 60)
    if (hoursSinceLastCheck < settings.checkInterval) {
      console.log(`Auto-update skipped: Only ${hoursSinceLastCheck.toFixed(1)} hours since last check`)
      return { available: false }
    }

    try {
      // Get update info from Google Play
      const updateInfo = await AppUpdate.getAppUpdateInfo()

      if (updateInfo.updateAvailability === 2) {
        const availableVersion = Capacitor.getPlatform() === 'android'
          ? updateInfo.availableVersionCode?.toString()
          : updateInfo.availableVersionName

        console.log('Update available:', availableVersion)
        return {
          available: true,
          version: availableVersion
        }
      }

      console.log('No updates available')
      return { available: false }
    } catch (error) {
      console.error('Update check failed:', error)
      return { available: false }
    }
  }

  async performUpdate(): Promise<boolean> {
    try {
      const updateInfo = await AppUpdate.getAppUpdateInfo()

      if (updateInfo.updateAvailability === 2) {
        if (updateInfo.immediateUpdateAllowed) {
          // Force immediate update (blocks app usage)
          console.log('Performing immediate update...')
          await AppUpdate.performImmediateUpdate()
          return true
        } else if (updateInfo.flexibleUpdateAllowed) {
          // Background update (user can continue using app)
          console.log('Starting flexible update...')
          await AppUpdate.startFlexibleUpdate()
          return true
        } else {
          console.log('No update method available, opening store...')
          await this.openStore()
          return false
        }
      }

      return false
    } catch (error) {
      console.error('Update failed:', error)
      return false
    }
  }

  async openStore(): Promise<void> {
    try {
      await AppUpdate.openAppStore()
    } catch (error) {
      console.error('Could not open app store:', error)
    }
  }

  async completeFlexibleUpdate(): Promise<void> {
    try {
      await AppUpdate.completeFlexibleUpdate()
      console.log('Flexible update completed')
    } catch (error) {
      console.error('Could not complete flexible update:', error)
    }
  }

  // Get current network status
  async getNetworkStatus() {
    try {
      return await Network.getStatus()
    } catch (error) {
      console.warn('Could not get network status:', error)
      return { connection: 'unknown' as const }
    }
  }
}
