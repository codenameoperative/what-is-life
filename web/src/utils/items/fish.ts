// Fish Category Items
import { type Item } from './index'

export const fishItems: Record<string, Item> = {
  // Common Fish
  salmon: {
    id: 'salmon',
    name: 'Salmon',
    tier: 'common',
    category: 'fish',
    description: 'A common freshwater fish.',
    value: 75,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  trout: {
    id: 'trout',
    name: 'Trout',
    tier: 'common',
    category: 'fish',
    description: 'A colorful freshwater fish.',
    value: 80,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Uncommon Fish
  bass: {
    id: 'bass',
    name: 'Bass',
    tier: 'uncommon',
    category: 'fish',
    description: 'A feisty fighting fish.',
    value: 150,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  perch: {
    id: 'perch',
    name: 'Perch',
    tier: 'uncommon',
    category: 'fish',
    description: 'A popular sport fish.',
    value: 140,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Rare Fish
  tuna: {
    id: 'tuna',
    name: 'Tuna',
    tier: 'rare',
    category: 'fish',
    description: 'A powerful ocean fish.',
    value: 500,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  marlin: {
    id: 'marlin',
    name: 'Marlin',
    tier: 'rare',
    category: 'fish',
    description: 'A prized game fish.',
    value: 550,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Epic Fish
  swordfish: {
    id: 'swordfish',
    name: 'Swordfish',
    tier: 'epic',
    category: 'fish',
    description: 'A magnificent billfish.',
    value: 1200,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  shark: {
    id: 'shark',
    name: 'Shark',
    tier: 'epic',
    category: 'fish',
    description: 'A fearsome predator.',
    value: 1300,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Legendary Fish
  giant_squid: {
    id: 'giant_squid',
    name: 'Giant Squid',
    tier: 'legendary',
    category: 'fish',
    description: 'A mysterious deep-sea creature.',
    value: 2500,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  anglerfish: {
    id: 'anglerfish',
    name: 'Anglerfish',
    tier: 'legendary',
    category: 'fish',
    description: 'A deep-sea angler with a lure.',
    value: 2600,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Mythical Fish
  mermaid_scales: {
    id: 'mermaid_scales',
    name: 'Mermaid Scales',
    tier: 'mythical',
    category: 'fish',
    description: 'Shimmering scales from a mythical creature.',
    value: 5000,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  kraken_tentacle: {
    id: 'kraken_tentacle',
    name: 'Kraken Tentacle',
    tier: 'mythical',
    category: 'fish',
    description: 'A tentacle from a legendary sea monster.',
    value: 5500,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // WDYFT Fish
  golden_fish: {
    id: 'golden_fish',
    name: 'Golden Fish',
    tier: 'wdyft',
    category: 'fish',
    description: 'A legendary golden fish that grants wishes.',
    value: 15000,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },
  crystal_eel: {
    id: 'crystal_eel',
    name: 'Crystal Eel',
    tier: 'wdyft',
    category: 'fish',
    description: 'A translucent eel made of pure crystal.',
    value: 16000,
    usable: false,
    source: 'Fished',
    breakChance: 0
  }
}
