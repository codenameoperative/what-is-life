// Garden plants data - farming and cultivation system
export const gardenPlants = {
  // Basic vegetables
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    description: 'A crunchy orange root vegetable.',
    growthTime: 60, // seconds
    waterNeeded: 3,
    yield: { min: 2, max: 5 },
    value: 25,
    tier: 'common',
    requirements: 'Basic garden setup'
  },

  tomato: {
    id: 'tomato',
    name: 'Tomato',
    description: 'Juicy red fruit often used as a vegetable.',
    growthTime: 90,
    waterNeeded: 4,
    yield: { min: 1, max: 3 },
    value: 40,
    tier: 'uncommon',
    requirements: 'Watering can recommended'
  },

  potato: {
    id: 'potato',
    name: 'Potato',
    description: 'Starchy tuber that grows underground.',
    growthTime: 120,
    waterNeeded: 2,
    yield: { min: 3, max: 8 },
    value: 15,
    tier: 'common',
    requirements: 'Shovel for harvesting'
  },

  lettuce: {
    id: 'lettuce',
    name: 'Lettuce',
    description: 'Crisp leafy green vegetable.',
    growthTime: 45,
    waterNeeded: 5,
    yield: { min: 1, max: 2 },
    value: 35,
    tier: 'uncommon',
    requirements: 'Regular watering needed'
  },

  // Herbs
  basil: {
    id: 'basil',
    name: 'Basil',
    description: 'Aromatic herb used in cooking.',
    growthTime: 30,
    waterNeeded: 2,
    yield: { min: 1, max: 4 },
    value: 50,
    tier: 'rare',
    requirements: 'Sunny location preferred'
  },

  mint: {
    id: 'mint',
    name: 'Mint',
    description: 'Refreshing herb with medicinal properties.',
    growthTime: 40,
    waterNeeded: 3,
    yield: { min: 2, max: 6 },
    value: 30,
    tier: 'uncommon',
    requirements: 'Spreads quickly'
  },

  // Flowers
  rose: {
    id: 'rose',
    name: 'Rose',
    description: 'Beautiful flower with thorns.',
    growthTime: 180,
    waterNeeded: 6,
    yield: { min: 1, max: 1 },
    value: 200,
    tier: 'epic',
    requirements: 'Very careful tending'
  },

  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    description: 'Tall flower that follows the sun.',
    growthTime: 150,
    waterNeeded: 4,
    yield: { min: 1, max: 2 },
    value: 100,
    tier: 'rare',
    requirements: 'Lots of sunlight'
  },

  // Exotic plants
  magical_bean: {
    id: 'magical_bean',
    name: 'Magical Bean',
    description: 'A mysterious bean said to have magical properties.',
    growthTime: 300,
    waterNeeded: 8,
    yield: { min: 1, max: 1 },
    value: 1000,
    tier: 'legendary',
    requirements: 'Very rare seed, special care needed'
  },

  crystal_flower: {
    id: 'crystal_flower',
    name: 'Crystal Flower',
    description: 'A flower that grows crystal formations.',
    growthTime: 240,
    waterNeeded: 7,
    yield: { min: 1, max: 1 },
    value: 750,
    tier: 'mythical',
    requirements: 'Mineral-rich soil'
  }
}
