// Collectables Category Items
import { type Item } from './index'

export const collectablesItems: Record<string, Item> = {
  // Common Collectables
  rusty_coin: {
    id: 'rusty_coin',
    name: 'Rusty Coin',
    tier: 'common',
    category: 'collectables',
    description: 'An old, weathered coin covered in rust',
    value: 25,
    usable: false,
    source: 'Found',
    breakChance: 0,
    icon: '🪙'
  },
  seashell: {
    id: 'seashell',
    name: 'Seashell',
    tier: 'common',
    category: 'collectables',
    description: 'A beautiful shell washed up from the sea',
    value: 15,
    usable: false,
    source: 'Beach',
    breakChance: 0,
    icon: '🐚'
  },
  pine_cone: {
    id: 'pine_cone',
    name: 'Pine Cone',
    tier: 'common',
    category: 'collectables',
    description: 'A prickly pine cone from an evergreen tree',
    value: 10,
    usable: false,
    source: 'Forest',
    breakChance: 0,
    icon: '🌲'
  },

  // Uncommon Collectables
  silver_coin: {
    id: 'silver_coin',
    name: 'Silver Coin',
    tier: 'uncommon',
    category: 'collectables',
    description: 'A shiny silver coin with intricate engravings',
    value: 100,
    usable: false,
    source: 'Treasure',
    breakChance: 0,
    icon: '🪙'
  },
  ancient_pottery: {
    id: 'ancient_pottery',
    name: 'Ancient Pottery',
    tier: 'uncommon',
    category: 'collectables',
    description: 'A fragment of ancient pottery with faded patterns',
    value: 150,
    usable: false,
    source: 'Ruins',
    breakChance: 0,
    icon: '🏺'
  },
  fossil: {
    id: 'fossil',
    name: 'Fossil',
    tier: 'uncommon',
    category: 'collectables',
    description: 'A small fossilized bone or shell',
    value: 200,
    usable: false,
    source: 'Excavation',
    breakChance: 0,
    icon: '🦕'
  },

  // Rare Collectables
  gold_coin: {
    id: 'gold_coin',
    name: 'Gold Coin',
    tier: 'rare',
    category: 'collectables',
    description: 'A gleaming gold coin from a forgotten era',
    value: 500,
    usable: false,
    source: 'Treasure',
    breakChance: 0,
    icon: '🪙'
  },
  emerald_gem: {
    id: 'emerald_gem',
    name: 'Emerald Gem',
    tier: 'rare',
    category: 'collectables',
    description: 'A brilliant green emerald of exceptional quality',
    value: 750,
    usable: false,
    source: 'Mining',
    breakChance: 0,
    icon: '💎'
  },
  antique_watch: {
    id: 'antique_watch',
    name: 'Antique Watch',
    tier: 'rare',
    category: 'collectables',
    description: 'A finely crafted pocket watch from the Victorian era',
    value: 600,
    usable: false,
    source: 'Estate',
    breakChance: 0,
    icon: '⌚'
  },

  // Epic Collectables
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    tier: 'epic',
    category: 'collectables',
    description: 'A flawless diamond that sparkles with incredible brilliance',
    value: 2000,
    usable: false,
    source: 'Mining',
    breakChance: 0,
    icon: '💎'
  },
  ancient_artifact: {
    id: 'ancient_artifact',
    name: 'Ancient Artifact',
    tier: 'epic',
    category: 'collectables',
    description: 'A mysterious artifact from a long-lost civilization',
    value: 1500,
    usable: false,
    source: 'Archaeology',
    breakChance: 0,
    icon: '🏛️'
  },
  ruby_gem: {
    id: 'ruby_gem',
    name: 'Ruby Gem',
    tier: 'epic',
    category: 'collectables',
    description: 'A deep red ruby that seems to glow from within',
    value: 1800,
    usable: false,
    source: 'Mining',
    breakChance: 0,
    icon: '💎'
  },

  // Legendary Collectables
  crown_jewel: {
    id: 'crown_jewel',
    name: 'Crown Jewel',
    tier: 'legendary',
    category: 'collectables',
    description: 'The legendary jewel that once adorned a royal crown',
    value: 5000,
    usable: false,
    source: 'Royal Treasury',
    breakChance: 0,
    icon: '👑'
  },
  philosopher_stone: {
    id: 'philosopher_stone',
    name: 'Philosopher\'s Stone',
    tier: 'legendary',
    category: 'collectables',
    description: 'The mythical stone said to transmute base metals into gold',
    value: 10000,
    usable: false,
    source: 'Alchemy',
    breakChance: 0,
    icon: '🪄'
  },

  // Mythical Collectables
  dragon_scale: {
    id: 'dragon_scale',
    name: 'Dragon Scale',
    tier: 'mythical',
    category: 'collectables',
    description: 'An iridescent scale from an ancient dragon',
    value: 25000,
    usable: false,
    source: 'Dragon Hoard',
    breakChance: 0,
    icon: '🐲'
  },
  unicorn_horn: {
    id: 'unicorn_horn',
    name: 'Unicorn Horn',
    tier: 'mythical',
    category: 'collectables',
    description: 'A spiraled horn from a pure white unicorn',
    value: 50000,
    usable: false,
    source: 'Enchanted Forest',
    breakChance: 0,
    icon: '🦄'
  },

  // WDYFT Collectables
  meaning_of_life: {
    id: 'meaning_of_life',
    name: 'Meaning of Life',
    tier: 'wdyft',
    category: 'collectables',
    description: 'The answer to the ultimate question of life, the universe, and everything',
    value: 42,
    usable: false,
    source: 'WDYFT',
    breakChance: 0,
    icon: '🌌'
  }
}
