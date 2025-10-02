// Animals Category Items
import { type Item } from './index'

export const animalsItems: Record<string, Item> = {
  // Common Animals
  rabbit: {
    id: 'rabbit',
    name: 'Rabbit',
    tier: 'common',
    category: 'animals',
    description: 'don\'t let bugs bunny see you holding that',
    value: 50,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  squirrel: {
    id: 'squirrel',
    name: 'Squirrel',
    tier: 'common',
    category: 'animals',
    description: 'A nimble forest squirrel',
    value: 50,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Uncommon Animals
  deer: {
    id: 'deer',
    name: 'Deer',
    tier: 'uncommon',
    category: 'animals',
    description: 'A graceful forest deer',
    value: 200,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  fox: {
    id: 'fox',
    name: 'Fox',
    tier: 'uncommon',
    category: 'animals',
    description: 'A cunning red fox',
    value: 200,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Rare Animals
  wolf: {
    id: 'wolf',
    name: 'Wolf',
    tier: 'rare',
    category: 'animals',
    description: 'A majestic gray wolf',
    value: 750,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  bear: {
    id: 'bear',
    name: 'Bear',
    tier: 'rare',
    category: 'animals',
    description: 'A powerful brown bear',
    value: 750,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  cougar: {
    id: 'cougar',
    name: 'Cougar',
    tier: 'rare',
    category: 'animals',
    description: 'A stealthy mountain lion',
    value: 2000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Epic Animals
  elk: {
    id: 'elk',
    name: 'Elk',
    tier: 'epic',
    category: 'animals',
    description: 'A magnificent elk with impressive antlers',
    value: 2000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    tier: 'epic',
    category: 'animals',
    description: 'A mythical creature of pure magic',
    value: 15000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    tier: 'epic',
    category: 'animals',
    description: 'A legendary bird that rises from ashes',
    value: 15000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Legendary Animals
  bison: {
    id: 'bison',
    name: 'Bison',
    tier: 'legendary',
    category: 'animals',
    description: 'A massive, ancient bison',
    value: 5000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  eagle: {
    id: 'eagle',
    name: 'Golden Eagle',
    tier: 'legendary',
    category: 'animals',
    description: 'A majestic bird of prey',
    value: 5000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Mythical Animals
  dragon: {
    id: 'dragon',
    name: 'Ancient Dragon',
    tier: 'mythical',
    category: 'animals',
    description: 'A legendary dragon of immense power',
    value: 50000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },
  kraken: {
    id: 'kraken',
    name: 'Kraken',
    tier: 'mythical',
    category: 'animals',
    description: 'A mythical sea monster of epic proportions',
    value: 50000,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  }
}
