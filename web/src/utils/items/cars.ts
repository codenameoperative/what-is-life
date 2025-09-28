import type { Item } from './index'

export const carsItems: Record<string, Item> = {
  // Common Tier Cars
  rusty_bicycle: {
    id: 'rusty_bicycle',
    name: 'Rusty Bicycle',
    tier: 'common',
    category: 'collectables',
    description: 'An old rusty bicycle found in a junkyard. Still rideable... mostly.',
    value: 50,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚲',
    craftable: false
  },
  used_scooter: {
    id: 'used_scooter',
    name: 'Used Scooter',
    tier: 'common',
    category: 'collectables',
    description: 'A second-hand scooter with some wear and tear. Gets you from A to B.',
    value: 75,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🛴',
    craftable: false
  },

  // Uncommon Tier Cars
  compact_car: {
    id: 'compact_car',
    name: 'Compact Car',
    tier: 'uncommon',
    category: 'collectables',
    description: 'A small, fuel-efficient car perfect for city driving.',
    value: 200,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚗',
    craftable: false
  },
  vintage_motorcycle: {
    id: 'vintage_motorcycle',
    name: 'Vintage Motorcycle',
    tier: 'uncommon',
    category: 'collectables',
    description: 'A classic motorcycle from the 80s. Needs some restoration work.',
    value: 180,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🏍️',
    craftable: false
  },

  // Rare Tier Cars
  luxury_sedan: {
    id: 'luxury_sedan',
    name: 'Luxury Sedan',
    tier: 'rare',
    category: 'collectables',
    description: 'A high-end luxury sedan with leather seats and all the bells and whistles.',
    value: 500,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚙',
    craftable: false
  },
  sports_car: {
    id: 'sports_car',
    name: 'Sports Car',
    tier: 'rare',
    category: 'collectables',
    description: 'A sleek sports car that turns heads wherever it goes.',
    value: 450,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🏎️',
    craftable: false
  },

  // Epic Tier Cars
  electric_supercar: {
    id: 'electric_supercar',
    name: 'Electric Supercar',
    tier: 'epic',
    category: 'collectables',
    description: 'A cutting-edge electric supercar with incredible acceleration and zero emissions.',
    value: 1000,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '⚡',
    craftable: false
  },
  classic_muscle_car: {
    id: 'classic_muscle_car',
    name: 'Classic Muscle Car',
    tier: 'epic',
    category: 'collectables',
    description: 'A restored 1960s muscle car with a powerful V8 engine.',
    value: 900,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚗',
    craftable: false
  },

  // Legendary Tier Cars
  hypercar: {
    id: 'hypercar',
    name: 'Hypercar',
    tier: 'legendary',
    category: 'collectables',
    description: 'An ultra-rare hypercar capable of reaching speeds over 300 mph.',
    value: 2000,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚀',
    craftable: false
  },
  luxury_yacht_car: {
    id: 'luxury_yacht_car',
    name: 'Luxury Yacht Car',
    tier: 'legendary',
    category: 'collectables',
    description: 'A one-of-a-kind car designed to look like a luxury yacht on wheels.',
    value: 1800,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🛥️',
    craftable: false
  },

  // Mythical Tier Cars
  flying_car: {
    id: 'flying_car',
    name: 'Flying Car',
    tier: 'mythical',
    category: 'collectables',
    description: 'A revolutionary flying car that can drive on roads and fly through the air.',
    value: 5000,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '🚁',
    craftable: false
  },
  time_travel_car: {
    id: 'time_travel_car',
    name: 'Time Travel Car',
    tier: 'mythical',
    category: 'collectables',
    description: 'A mysterious car that can travel through time and space.',
    value: 10000,
    usable: false,
    source: 'Search',
    breakChance: 0.0,
    icon: '⏰',
    craftable: false
  }
}
