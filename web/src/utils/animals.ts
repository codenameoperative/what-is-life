// Universal animals data file
// This file contains all animal data separated from items

export interface Animal {
  id: string
  name: string
  tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'wdyft'
  description: string
  wtcReward: {
    min: number
    max: number
  }
}

export const huntAnimals: Record<string, Animal> = {
  // Common Animals
  rabbit: {
    id: 'rabbit',
    name: 'Rabbit',
    tier: 'common',
    description: 'A small, quick rabbit',
    wtcReward: { min: 50, max: 150 }
  },
  squirrel: {
    id: 'squirrel',
    name: 'Squirrel',
    tier: 'common',
    description: 'A nimble forest squirrel',
    wtcReward: { min: 50, max: 150 }
  },

  // Uncommon Animals
  deer: {
    id: 'deer',
    name: 'Deer',
    tier: 'uncommon',
    description: 'A graceful forest deer',
    wtcReward: { min: 200, max: 500 }
  },
  fox: {
    id: 'fox',
    name: 'Fox',
    tier: 'uncommon',
    description: 'A cunning red fox',
    wtcReward: { min: 200, max: 500 }
  },

  // Rare Animals
  wolf: {
    id: 'wolf',
    name: 'Wolf',
    tier: 'rare',
    description: 'A majestic gray wolf',
    wtcReward: { min: 750, max: 1500 }
  },
  bear: {
    id: 'bear',
    name: 'Bear',
    tier: 'rare',
    description: 'A powerful brown bear',
    wtcReward: { min: 750, max: 1500 }
  },

  // Epic Animals
  cougar: {
    id: 'cougar',
    name: 'Cougar',
    tier: 'epic',
    description: 'A stealthy mountain lion',
    wtcReward: { min: 2000, max: 4000 }
  },
  elk: {
    id: 'elk',
    name: 'Elk',
    tier: 'epic',
    description: 'A magnificent elk with impressive antlers',
    wtcReward: { min: 2000, max: 4000 }
  },

  // Legendary Animals
  bison: {
    id: 'bison',
    name: 'Bison',
    tier: 'legendary',
    description: 'A massive, ancient bison',
    wtcReward: { min: 5000, max: 10000 }
  },
  eagle: {
    id: 'eagle',
    name: 'Golden Eagle',
    tier: 'legendary',
    description: 'A majestic bird of prey',
    wtcReward: { min: 5000, max: 10000 }
  },

  // Mythical Animals
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    tier: 'mythical',
    description: 'A mythical creature of pure magic',
    wtcReward: { min: 15000, max: 25000 }
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    tier: 'mythical',
    description: 'A legendary bird that rises from ashes',
    wtcReward: { min: 15000, max: 25000 }
  },

  // WDYFT Animals
  dragon: {
    id: 'dragon',
    name: 'Ancient Dragon',
    tier: 'wdyft',
    description: 'A legendary dragon of immense power',
    wtcReward: { min: 50000, max: 100000 }
  },
  kraken: {
    id: 'kraken',
    name: 'Kraken',
    tier: 'wdyft',
    description: 'A mythical sea monster of epic proportions',
    wtcReward: { min: 50000, max: 100000 }
  }
}

// Helper function to get random animal by tier
export function getRandomAnimalByTier(tier: keyof typeof huntAnimals): Animal | null {
  const animalsOfTier = Object.values(huntAnimals).filter(animal => animal.tier === tier)
  if (animalsOfTier.length === 0) return null

  const randomIndex = Math.floor(Math.random() * animalsOfTier.length)
  return animalsOfTier[randomIndex]
}

// Helper function to get random tier based on chances
export function getRandomTier(chances: Record<string, number>): string | null {
  const total = Object.values(chances).reduce((sum, chance) => sum + chance, 0)
  let random = Math.random() * total

  for (const [tier, chance] of Object.entries(chances)) {
    random -= chance
    if (random <= 0) return tier
  }

  return null
}
