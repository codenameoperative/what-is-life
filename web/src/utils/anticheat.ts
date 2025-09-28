// Anti-cheat system - bans by player ID only
export interface BanEntry {
  playerId: string
  reason: string
  timestamp: number
  bannedBy: string
  expiresAt?: number // Optional expiration date
}

export interface AntiCheatConfig {
  maxWarnings: number
  banDuration: number // in milliseconds
  autoBanThresholds: {
    suspiciousActivity: number
    cheatingDetected: number
  }
}

class AntiCheatSystem {
  private bannedPlayers: Map<string, BanEntry> = new Map()
  private warnings: Map<string, number> = new Map()
  private config: AntiCheatConfig

  constructor(config?: Partial<AntiCheatConfig>) {
    this.config = {
      maxWarnings: 3,
      banDuration: 24 * 60 * 60 * 1000, // 24 hours
      autoBanThresholds: {
        suspiciousActivity: 5,
        cheatingDetected: 1
      },
      ...config
    }

    // Load banned players from localStorage
    this.loadBannedPlayers()
  }

  // Load banned players from storage
  private loadBannedPlayers() {
    try {
      const stored = localStorage.getItem('what-is-life-banned-players')
      if (stored) {
        const bans: BanEntry[] = JSON.parse(stored)
        bans.forEach(ban => {
          // Check if ban has expired
          if (!ban.expiresAt || ban.expiresAt > Date.now()) {
            this.bannedPlayers.set(ban.playerId, ban)
          }
        })
      }
    } catch (error) {
      console.error('Failed to load banned players:', error)
    }
  }

  // Save banned players to storage
  private saveBannedPlayers() {
    try {
      const bans = Array.from(this.bannedPlayers.values())
      localStorage.setItem('what-is-life-banned-players', JSON.stringify(bans))
    } catch (error) {
      console.error('Failed to save banned players:', error)
    }
  }

  // Check if a player is banned
  isPlayerBanned(playerId: string): boolean {
    const ban = this.bannedPlayers.get(playerId)
    if (!ban) return false

    // Check if ban has expired
    if (ban.expiresAt && ban.expiresAt < Date.now()) {
      this.bannedPlayers.delete(playerId)
      this.saveBannedPlayers()
      return false
    }

    return true
  }

  // Get ban information for a player
  getBanInfo(playerId: string): BanEntry | null {
    return this.bannedPlayers.get(playerId) || null
  }

  // Ban a player
  banPlayer(playerId: string, reason: string, bannedBy: string, duration?: number): void {
    const expiresAt = duration ? Date.now() + duration : this.config.banDuration
    const ban: BanEntry = {
      playerId,
      reason,
      timestamp: Date.now(),
      bannedBy,
      expiresAt
    }

    this.bannedPlayers.set(playerId, ban)
    this.warnings.delete(playerId) // Clear warnings when banned
    this.saveBannedPlayers()
  }

  // Unban a player
  unbanPlayer(playerId: string): boolean {
    const removed = this.bannedPlayers.delete(playerId)
    if (removed) {
      this.saveBannedPlayers()
    }
    return removed
  }

  // Add warning to a player
  addWarning(playerId: string, reason: string): number {
    const currentWarnings = this.warnings.get(playerId) || 0
    const newWarnings = currentWarnings + 1
    this.warnings.set(playerId, newWarnings)

    // Auto-ban if threshold reached
    if (newWarnings >= this.config.maxWarnings) {
      this.banPlayer(playerId, `Exceeded maximum warnings (${this.config.maxWarnings})`, 'SYSTEM')
      this.warnings.delete(playerId)
    }

    return newWarnings
  }

  // Report suspicious activity
  reportSuspiciousActivity(playerId: string, activity: string): void {
    const currentWarnings = this.warnings.get(playerId) || 0
    if (currentWarnings >= this.config.autoBanThresholds.suspiciousActivity) {
      this.banPlayer(playerId, `Suspicious activity: ${activity}`, 'SYSTEM')
    } else {
      this.addWarning(playerId, `Suspicious activity: ${activity}`)
    }
  }

  // Report cheating
  reportCheating(playerId: string, cheatType: string): void {
    this.banPlayer(playerId, `Cheating detected: ${cheatType}`, 'SYSTEM', this.config.banDuration * 7) // 7 day ban for cheating
  }

  // Validate player action (check for common cheats)
  validateAction(playerId: string, action: string, data: any): boolean {
    if (this.isPlayerBanned(playerId)) {
      return false
    }

    // Check for impossible values
    if (data.value && typeof data.value === 'number') {
      if (data.value < 0 || data.value > 1000000) { // Suspiciously high values
        this.reportSuspiciousActivity(playerId, `Impossible value: ${data.value}`)
        return false
      }
    }

    // Check for rapid-fire actions
    const lastAction = localStorage.getItem(`last-action-${playerId}`)
    const now = Date.now()
    if (lastAction && now - parseInt(lastAction) < 100) { // Less than 100ms between actions
      this.reportSuspiciousActivity(playerId, 'Rapid-fire actions')
      return false
    }
    localStorage.setItem(`last-action-${playerId}`, now.toString())

    return true
  }

  // Get list of all banned players
  getBannedPlayers(): BanEntry[] {
    return Array.from(this.bannedPlayers.values())
  }

  // Get warning count for a player
  getWarningCount(playerId: string): number {
    return this.warnings.get(playerId) || 0
  }

  // Clear expired bans
  clearExpiredBans(): number {
    let cleared = 0
    for (const [playerId, ban] of this.bannedPlayers.entries()) {
      if (ban.expiresAt && ban.expiresAt < Date.now()) {
        this.bannedPlayers.delete(playerId)
        cleared++
      }
    }

    if (cleared > 0) {
      this.saveBannedPlayers()
    }

    return cleared
  }
}

// Export singleton instance
export const antiCheat = new AntiCheatSystem()

// Export for testing
export { AntiCheatSystem }
