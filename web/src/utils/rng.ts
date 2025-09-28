// Hybrid RNG Engine: cryptographically-strong when available, LCG fallback
export class HybridRNG {
  private seed: number

  constructor(seed: number = Date.now()) {
    this.seed = seed >>> 0
  }

  // Reseed deterministically
  reseed(seed: number) {
    this.seed = seed >>> 0
  }

  // Fast LCG step
  private lcgStep() {
    // Numerical Recipes LCG parameters (32-bit)
    this.seed = (1664525 * this.seed + 1013904223) >>> 0
    return this.seed
  }

  // Float in [0,1)
  nextFloat(): number {
    // Prefer crypto if available
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      return buf[0] / 0x1_0000_0000
    }
    // Fallback to LCG
    const x = this.lcgStep()
    return x / 0x1_0000_0000
  }

  // Int in [min,max]
  nextInt(min: number, max: number): number {
    if (min > max) [min, max] = [max, min]
    const r = this.nextFloat()
    return Math.floor(r * (max - min + 1)) + min
  }

  // Get current seed
  getSeed(): number {
    return this.seed >>> 0
  }

  // Drop chances based on item tier
  private getDropChance(tier: string): number {
    switch (tier) {
      case 'useless': return 0.3    // 30% chance
      case 'common': return 0.15    // 15% chance
      case 'uncommon': return 0.08  // 8% chance
      case 'rare': return 0.04      // 4% chance
      case 'epic': return 0.02      // 2% chance
      case 'ultra_rare': return 0.01 // 1% chance
      case 'ultra_epic': return 0.005 // 0.5% chance
      case 'legendary': return 0.002 // 0.2% chance
      case 'mythical': return 0.001  // 0.1% chance
      case 'wdyft': return 0.0005    // 0.05% chance
      default: return 0
    }
  }

  // Check if item should drop
  shouldDrop(tier: string): boolean {
    return this.nextFloat() < this.getDropChance(tier)
  }

  // Get random tier based on weighted drop chances
  getRandomTier(dropChances: Record<string, number>): string | null {
    const totalWeight = Object.values(dropChances).reduce((sum, chance) => sum + chance, 0)

    if (totalWeight === 0) {
      return null
    }

    const randomValue = this.nextFloat() * totalWeight
    let currentWeight = 0

    for (const [tier, chance] of Object.entries(dropChances)) {
      currentWeight += chance
      if (randomValue <= currentWeight) {
        return tier
      }
    }

    return null
  }

  // Check for death (used during activities)
  // Returns true if player dies, false otherwise
  checkDeath(deathChance: number = 0.01): boolean {
    return this.nextFloat() < deathChance
  }

  // Generate WTC drop based on tier (rarer items give more WTC)
  generateWTCDrop(tier: string): number {
    const baseAmount = this.nextInt(1, 10)
    switch (tier) {
      case 'useless': return baseAmount
      case 'common': return baseAmount * 2
      case 'uncommon': return baseAmount * 5
      case 'rare': return baseAmount * 15
      case 'epic': return baseAmount * 30
      case 'ultra_rare': return baseAmount * 60
      case 'ultra_epic': return baseAmount * 120
      case 'legendary': return baseAmount * 250
      case 'mythical': return baseAmount * 500
      case 'wdyft': return baseAmount * 1000
      default: return baseAmount
    }
  }
}

// Shared instance
export const gameRNG = new HybridRNG()
