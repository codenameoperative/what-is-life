// Collectables Category Items
import { type Item } from './index'

export const collectablesItems: Record<string, Item> = {
  // Useless Collectables
  broken_glass: {
    id: 'broken_glass',
    name: 'Broken Glass',
    tier: 'useless',
    category: 'collectables',
    description: 'Shards.',
    value: 1,
    usable: false,
    source: 'Found',
    breakChance: 0
  },
  empty_bottle: {
    id: 'empty_bottle',
    name: 'Empty Bottle',
    tier: 'useless',
    category: 'collectables',
    description: 'Empty.',
    value: 10,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Rare Collectables
  golden_watch: {
    id: 'golden_watch',
    name: 'Golden Watch',
    tier: 'rare',
    category: 'collectables',
    description: 'Shiny watch.',
    value: 600,
    usable: false,
    source: 'Found',
    breakChance: 0
  },
  hunters_license: {
    id: 'hunters_license',
    name: 'Hunter\'s License',
    tier: 'rare',
    category: 'collectables',
    description: 'Official permit to hunt in protected areas.',
    value: 500,
    usable: false,
    source: 'Found',
    breakChance: 0
  },
  sapphire_ring: {
    id: 'sapphire_ring',
    name: 'Sapphire Ring',
    tier: 'rare',
    category: 'collectables',
    description: 'Blue gem ring.',
    value: 1400,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Epic Collectables
  explorer_map: {
    id: 'explorer_map',
    name: 'Explorer Map',
    tier: 'epic',
    category: 'collectables',
    description: 'Map with hidden hints.',
    value: 900,
    usable: true,
    source: 'Found',
    breakChance: 0.05
  },
  phoenix_feather: {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    tier: 'epic',
    category: 'collectables',
    description: 'Rare warm plume.',
    value: 2200,
    usable: false,
    source: 'Found',
    breakChance: 0
  },
  revival_bill: {
    id: 'revival_bill',
    name: 'Revival Bill',
    tier: 'epic',
    category: 'collectables',
    description: 'Prevents loss of items and WTC upon death. Consumed when used.',
    value: 1500,
    usable: true,
    source: 'Shop',
    breakChance: 0
  },

  // Legendary Collectables
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    tier: 'legendary',
    category: 'collectables',
    description: 'Said to be impervious.',
    value: 3600,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Mythical Collectables
  philosopher_stone: {
    id: 'philosopher_stone',
    name: 'Philosopher Stone',
    tier: 'mythical',
    category: 'collectables',
    description: 'Whispers of transmutation.',
    value: 5000,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // WDYFT Collectables
  ancient_relic: {
    id: 'ancient_relic',
    name: 'Ancient Relic',
    tier: 'wdyft',
    category: 'collectables',
    description: 'Proof of your WDYFT journey.',
    value: 0,
    usable: false,
    source: 'WDYFT',
    breakChance: 0
  },
  mysterious_map_wdyft: {
    id: 'mysterious_map_wdyft',
    name: 'Mysterious Map (WDYFT)',
    tier: 'wdyft',
    category: 'collectables',
    description: 'A recalled map from WDYFT.',
    value: 0,
    usable: false,
    source: 'WDYFT',
    breakChance: 0
  }
}
