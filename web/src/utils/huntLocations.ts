// Hunting locations data structure
interface HuntLocation {
  id: string
  name: string
  description: string
  requiredItemId?: string // Optional requirement (e.g., Hunter's license)
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  itemDropChances: {
    useless: number
    common: number
    uncommon: number
    rare: number
    epic: number
    ultra_rare: number
    ultra_epic: number
    legendary: number
    mythical: number
    wdyft: number
  }
  animalChances: {
    common: number
    uncommon: number
    rare: number
    epic: number
    legendary: number
    mythical: number
    wdyft: number
  }
  chestChance: number // Chance to find a rare treasure chest
  itemChance: number // Overall chance to find items (calculated from itemDropChances)
  wtcReward: { min: number; max: number }
}

export const huntLocations: Record<string, HuntLocation> = {
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'A dense woodland area teeming with wildlife.',
    riskLevel: 'medium',
    itemDropChances: {
      useless: 0.1,
      common: 0.3,
      uncommon: 0.25,
      rare: 0.15,
      epic: 0.1,
      ultra_rare: 0.05,
      ultra_epic: 0.03,
      legendary: 0.015,
      mythical: 0.005,
      wdyft: 0.001
    },
    animalChances: {
      common: 0.6,
      uncommon: 0.25,
      rare: 0.1,
      epic: 0.03,
      legendary: 0.015,
      mythical: 0.005,
      wdyft: 0.001
    },
    chestChance: 0.02, // 2% chance
    itemChance: 0.8, // 80% chance to find items
    wtcReward: { min: 10, max: 50 }
  },
  game_park: {
    id: 'game_park',
    name: 'Game Park',
    description: 'A protected wildlife reserve with exotic animals. Requires Hunter\'s License.',
    requiredItemId: 'hunters_license',
    riskLevel: 'high',
    itemDropChances: {
      useless: 0.05,
      common: 0.2,
      uncommon: 0.25,
      rare: 0.2,
      epic: 0.15,
      ultra_rare: 0.08,
      ultra_epic: 0.05,
      legendary: 0.02,
      mythical: 0.005,
      wdyft: 0.001
    },
    animalChances: {
      common: 0.4,
      uncommon: 0.3,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.05,
      mythical: 0.015,
      wdyft: 0.005
    },
    chestChance: 0.05, // 5% chance (higher due to license requirement)
    itemChance: 0.85, // 85% chance to find items
    wtcReward: { min: 25, max: 100 }
  },
  open_field: {
    id: 'open_field',
    name: 'Open Field',
    description: 'Vast grasslands where animals roam freely.',
    riskLevel: 'low',
    itemDropChances: {
      useless: 0.15,
      common: 0.35,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.02,
      legendary: 0.01,
      mythical: 0.003,
      wdyft: 0.0005
    },
    animalChances: {
      common: 0.7,
      uncommon: 0.2,
      rare: 0.06,
      epic: 0.02,
      legendary: 0.015,
      mythical: 0.003,
      wdyft: 0.001
    },
    chestChance: 0.015, // 1.5% chance
    itemChance: 0.75, // 75% chance to find items
    wtcReward: { min: 5, max: 30 }
  }
}

// Helper function to get available hunt locations based on inventory
export function getAvailableHuntLocations(inventory: { id: string }[]): string[] {
  return Object.keys(huntLocations).filter(locationId => {
    const location = huntLocations[locationId]
    if (!location.requiredItemId) return true
    return inventory.some(item => item.id === location.requiredItemId)
  })
}
