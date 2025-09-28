// Hunting animals data structure
interface HuntAnimal {
  id: string
  name: string
  tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'wdyft'
  description: string
  wtcReward: { min: number; max: number }
  rarity: number // How rare this specific animal is within its tier
}

export const huntAnimals: Record<string, HuntAnimal> = {
  // Common tier animals
  rabbit: {
    id: 'rabbit',
    name: 'Rabbit',
    tier: 'common',
    description: 'A small, quick woodland creature.',
    wtcReward: { min: 5, max: 15 },
    rarity: 0.4
  },
  squirrel: {
    id: 'squirrel',
    name: 'Squirrel',
    tier: 'common',
    description: 'A nimble tree-dweller gathering nuts.',
    wtcReward: { min: 3, max: 12 },
    rarity: 0.6
  },

  // Uncommon tier animals
  fox: {
    id: 'fox',
    name: 'Fox',
    tier: 'uncommon',
    description: 'A clever predator with a bushy tail.',
    wtcReward: { min: 15, max: 35 },
    rarity: 0.5
  },
  deer: {
    id: 'deer',
    name: 'Deer',
    tier: 'uncommon',
    description: 'A graceful herbivore with impressive antlers.',
    wtcReward: { min: 20, max: 40 },
    rarity: 0.5
  },

  // Rare tier animals
  wolf: {
    id: 'wolf',
    name: 'Wolf',
    tier: 'rare',
    description: 'A cunning pack hunter with piercing eyes.',
    wtcReward: { min: 35, max: 75 },
    rarity: 0.5
  },
  boar: {
    id: 'boar',
    name: 'Wild Boar',
    tier: 'rare',
    description: 'A dangerous beast with sharp tusks.',
    wtcReward: { min: 40, max: 80 },
    rarity: 0.5
  },

  // Epic tier animals
  bear: {
    id: 'bear',
    name: 'Bear',
    tier: 'epic',
    description: 'A massive predator that commands respect.',
    wtcReward: { min: 75, max: 150 },
    rarity: 0.5
  },
  cougar: {
    id: 'cougar',
    name: 'Cougar',
    tier: 'epic',
    description: 'A stealthy big cat that stalks its prey.',
    wtcReward: { min: 80, max: 160 },
    rarity: 0.5
  },

  // Legendary tier animals
  moose: {
    id: 'moose',
    name: 'Moose',
    tier: 'legendary',
    description: 'A majestic giant of the northern forests.',
    wtcReward: { min: 150, max: 300 },
    rarity: 0.5
  },
  elk: {
    id: 'elk',
    name: 'Elk',
    tier: 'legendary',
    description: 'A noble creature with impressive antlers.',
    wtcReward: { min: 160, max: 320 },
    rarity: 0.5
  },

  // Mythical tier animals
  sasquatch: {
    id: 'sasquatch',
    name: 'Sasquatch',
    tier: 'mythical',
    description: 'The legendary forest giant - is it real?',
    wtcReward: { min: 500, max: 1000 },
    rarity: 0.5
  },
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    tier: 'mythical',
    description: 'A magical creature of pure wonder.',
    wtcReward: { min: 600, max: 1200 },
    rarity: 0.5
  },

  // WDYFT tier animals
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    tier: 'wdyft',
    description: 'A legendary bird that rises from its own ashes.',
    wtcReward: { min: 2000, max: 5000 },
    rarity: 0.5
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    tier: 'wdyft',
    description: 'The ultimate legendary beast of myth and legend.',
    wtcReward: { min: 5000, max: 10000 },
    rarity: 0.5
  }
}

// Helper function to get random animal based on tier and rarity
export function getRandomAnimalByTier(tier: keyof typeof huntAnimals): HuntAnimal | null {
  const tierAnimals = Object.values(huntAnimals).filter(animal => animal.tier === tier)

  if (tierAnimals.length === 0) return null

  // Weighted random selection based on rarity
  const totalRarity = tierAnimals.reduce((sum, animal) => sum + animal.rarity, 0)
  let random = Math.random() * totalRarity

  for (const animal of tierAnimals) {
    random -= animal.rarity
    if (random <= 0) return animal
  }

  return tierAnimals[0] // Fallback
}

// Helper function to get random tier based on chances
export function getRandomTier(chances: Record<string, number>): string | null {
  const tiers = Object.keys(chances)
  const total = Object.values(chances).reduce((sum, chance) => sum + chance, 0)

  let random = Math.random() * total

  for (const tier of tiers) {
    random -= chances[tier]
    if (random <= 0) return tier
  }

  return null
}

// =====================================================
// TEMPLATE FOR ADDING NEW ANIMALS
// =====================================================
// Copy and paste this template to add new animals:

/*
new_animal_id: {
  id: 'new_animal_id',
  name: 'Animal Name',
  tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'wdyft',
  description: 'Description of the animal.',
  wtcReward: { min: 10, max: 50 },
  rarity: 0.5 // 0.0 to 1.0, affects how common this animal is within its tier
},
*/

// =====================================================
