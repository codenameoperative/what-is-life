// Achievement definitions for "What is Life?"
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'activity' | 'wealth' | 'survival' | 'collection' | 'level' | 'special'
  condition: {
    type: 'activity_count' | 'total_wtc' | 'level_reached' | 'item_collected' | 'death_count' | 'time_played'
    target: string | number
    count?: number
  }
  reward?: {
    wtc?: number
    items?: string[]
    title?: string
  }
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical'
  hidden?: boolean
}

export const achievements: Record<string, Achievement> = {
  // Activity Achievements
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first activity',
    icon: '👶',
    category: 'activity',
    condition: { type: 'activity_count', target: 'any', count: 1 },
    reward: { wtc: 50 },
    rarity: 'common'
  },

  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    description: 'Use the Explore activity 20 times',
    icon: '🗺️',
    category: 'activity',
    condition: { type: 'activity_count', target: 'explore', count: 20 },
    reward: { title: 'The Explorer', wtc: 500 },
    rarity: 'uncommon'
  },

  fisherman: {
    id: 'fisherman',
    name: 'Master Angler',
    description: 'Catch 50 fish',
    icon: '🎣',
    category: 'activity',
    condition: { type: 'activity_count', target: 'fish', count: 50 },
    reward: { title: 'Master Angler', wtc: 300 },
    rarity: 'uncommon'
  },

  gardener: {
    id: 'gardener',
    name: 'Green Thumb',
    description: 'Harvest 25 plants from your garden',
    icon: '🌱',
    category: 'activity',
    condition: { type: 'activity_count', target: 'garden', count: 25 },
    reward: { title: 'Green Thumb', wtc: 400 },
    rarity: 'uncommon'
  },

  streamer: {
    id: 'streamer',
    name: 'Content Creator',
    description: 'Create 30 streaming sessions',
    icon: '📺',
    category: 'activity',
    condition: { type: 'activity_count', target: 'stream', count: 30 },
    reward: { title: 'Content Creator', wtc: 350 },
    rarity: 'uncommon'
  },

  workaholic: {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Work 100 times',
    icon: '💼',
    category: 'activity',
    condition: { type: 'activity_count', target: 'work', count: 100 },
    reward: { title: 'Workaholic', wtc: 1000 },
    rarity: 'rare'
  },

  // Wealth Achievements
  first_million: {
    id: 'first_million',
    name: 'First Million',
    description: 'Earn 1,000,000 WTC total',
    icon: '💰',
    category: 'wealth',
    condition: { type: 'total_wtc', target: 1000000 },
    reward: { wtc: 5000 },
    rarity: 'epic'
  },

  bank_account: {
    id: 'bank_account',
    name: 'Bank Account',
    description: 'Deposit 10,000 WTC into your bank',
    icon: '🏦',
    category: 'wealth',
    condition: { type: 'total_wtc', target: 10000 },
    reward: { wtc: 200 },
    rarity: 'common'
  },

  // Survival Achievements
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Die and be revived by a Revival Bill',
    icon: '💀',
    category: 'survival',
    condition: { type: 'death_count', target: 1 },
    reward: { wtc: 100 },
    rarity: 'common'
  },

  ghost: {
    id: 'ghost',
    name: 'Ghost',
    description: 'Die 10 times',
    icon: '👻',
    category: 'survival',
    condition: { type: 'death_count', target: 10 },
    reward: { title: 'Ghost', wtc: 2000 },
    rarity: 'rare'
  },

  // Level Achievements
  level_10: {
    id: 'level_10',
    name: 'Apprentice',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'level',
    condition: { type: 'level_reached', target: 10 },
    reward: { title: 'Apprentice', wtc: 300 },
    rarity: 'common'
  },

  level_25: {
    id: 'level_25',
    name: 'Expert',
    description: 'Reach level 25',
    icon: '🌟',
    category: 'level',
    condition: { type: 'level_reached', target: 25 },
    reward: { title: 'Expert', wtc: 1000 },
    rarity: 'rare'
  },

  level_50: {
    id: 'level_50',
    name: 'Master',
    description: 'Reach level 50',
    icon: '👑',
    category: 'level',
    condition: { type: 'level_reached', target: 50 },
    reward: { title: 'Master', items: ['time_warp_device'], wtc: 5000 },
    rarity: 'legendary'
  },

  // Collection Achievements
  collector: {
    id: 'collector',
    name: 'Collector',
    description: 'Collect 50 different items',
    icon: '📚',
    category: 'collection',
    condition: { type: 'item_collected', target: 50 },
    reward: { title: 'Collector', wtc: 750 },
    rarity: 'uncommon'
  },

  // Special Achievements
  speedrunner: {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Complete 10 activities in under 5 minutes',
    icon: '⚡',
    category: 'special',
    condition: { type: 'time_played', target: 300 }, // 5 minutes in seconds
    reward: { wtc: 1500 },
    rarity: 'epic',
    hidden: true
  },

  // Crafting Achievements
  first_craft: {
    id: 'first_craft',
    name: 'Apprentice Crafter',
    description: 'Craft your first item',
    icon: '🔨',
    category: 'activity',
    condition: { type: 'activity_count', target: 'craft', count: 1 },
    reward: { wtc: 100 },
    rarity: 'common'
  },

  master_crafter: {
    id: 'master_crafter',
    name: 'Master Crafter',
    description: 'Craft 50 items',
    icon: '⚒️',
    category: 'activity',
    condition: { type: 'activity_count', target: 'craft', count: 50 },
    reward: { title: 'Master Crafter', wtc: 2000 },
    rarity: 'rare'
  },

  // Crime Achievements
  petty_thief: {
    id: 'petty_thief',
    name: 'Petty Thief',
    description: 'Commit your first crime',
    icon: '🕵️',
    category: 'activity',
    condition: { type: 'activity_count', target: 'crime', count: 1 },
    reward: { wtc: 50 },
    rarity: 'common'
  },

  crime_lord: {
    id: 'crime_lord',
    name: 'Crime Lord',
    description: 'Reach 100 crime reputation',
    icon: '👑',
    category: 'special',
    condition: { type: 'activity_count', target: 'crime_reputation', count: 100 },
    reward: { title: 'Crime Lord', wtc: 5000 },
    rarity: 'legendary'
  },

  // Item Collection Achievements
  weapon_collector: {
    id: 'weapon_collector',
    name: 'Armory',
    description: 'Collect 20 different weapons',
    icon: '⚔️',
    category: 'collection',
    condition: { type: 'item_collected', target: 'weapons', count: 20 },
    reward: { title: 'Weapon Master', wtc: 1500 },
    rarity: 'rare'
  },

  tool_collector: {
    id: 'tool_collector',
    name: 'Tool Shed',
    description: 'Collect 15 different tools',
    icon: '🔧',
    category: 'collection',
    condition: { type: 'item_collected', target: 'tools', count: 15 },
    reward: { wtc: 1200 },
    rarity: 'uncommon'
  },

  rare_collector: {
    id: 'rare_collector',
    name: 'Rare Collector',
    description: 'Collect 10 rare or higher tier items',
    icon: '💎',
    category: 'collection',
    condition: { type: 'item_collected', target: 'rare_items', count: 10 },
    reward: { title: 'Rare Collector', wtc: 3000 },
    rarity: 'epic'
  },

  wdyft_collector: {
    id: 'wdyft_collector',
    name: 'WDYFT Explorer',
    description: 'Collect 5 WDYFT items',
    icon: '🌌',
    category: 'collection',
    condition: { type: 'item_collected', target: 'wdyft_items', count: 5 },
    reward: { title: 'WDYFT Explorer', items: ['ancient_relic'], wtc: 10000 },
    rarity: 'mythical',
    hidden: true
  },

  // Survival Achievements
  unbreakable: {
    id: 'unbreakable',
    name: 'Unbreakable',
    description: 'Use 100 items without any breaking',
    icon: '💪',
    category: 'survival',
    condition: { type: 'activity_count', target: 'items_used', count: 100 },
    reward: { title: 'Unbreakable', wtc: 2500 },
    rarity: 'epic'
  },

  // Wealth Achievements
  millionaire: {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Earn 10,000,000 WTC total',
    icon: '💎',
    category: 'wealth',
    condition: { type: 'total_wtc', target: 10000000 },
    reward: { title: 'Millionaire', wtc: 50000 },
    rarity: 'legendary'
  },

  // Special Achievements
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete all activities at least once',
    icon: '✨',
    category: 'special',
    condition: { type: 'activity_count', target: 'all_activities', count: 10 },
    reward: { title: 'Perfectionist', items: ['philosopher_stone'], wtc: 15000 },
    rarity: 'mythical'
  },

  lucky_break: {
    id: 'lucky_break',
    name: 'Lucky Break',
    description: 'Find a treasure chest in any activity',
    icon: '🍀',
    category: 'special',
    condition: { type: 'activity_count', target: 'treasure_found', count: 1 },
    reward: { wtc: 500 },
    rarity: 'uncommon',
    hidden: true
  },

  retro_rewind: {
    id: 'retro_rewind',
    name: 'Retro Rewind',
    description: 'Unlock the codenameoperative retro interface.',
    icon: '🕹️',
    category: 'special',
    condition: { type: 'activity_count', target: 'secrets_retro', count: 1 },
    reward: { title: 'Time Traveler', wtc: 404 },
    rarity: 'legendary',
    hidden: true
  },

  glitch_hunter: {
    id: 'glitch_hunter',
    name: 'Glitch Hunter',
    description: 'Trigger the forbidden cheat protocol.',
    icon: '👾',
    category: 'special',
    condition: { type: 'activity_count', target: 'secrets_cheat', count: 1 },
    reward: { title: 'Glitch Hunter', items: ['error_404_wdyft'] },
    rarity: 'mythical',
    hidden: true
  },

  hoarder: {
    id: 'hoarder',
    name: 'Hoarder',
    description: 'Have 1000 items in your inventory',
    icon: '📦',
    category: 'collection',
    condition: { type: 'item_collected', target: 'total_items', count: 1000 },
    reward: { title: 'Hoarder', wtc: 5000 },
    rarity: 'epic'
  },

  // Time-based Achievements
  dedicated_player: {
    id: 'dedicated_player',
    name: 'Dedicated Player',
    description: 'Play for 24 hours total',
    icon: '⏰',
    category: 'special',
    condition: { type: 'time_played', target: 86400 }, // 24 hours in seconds
    reward: { title: 'Dedicated Player', wtc: 1000 },
    rarity: 'rare'
  },

  veteran: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play for 168 hours total (1 week)',
    icon: '🏅',
    category: 'special',
    condition: { type: 'time_played', target: 604800 }, // 1 week in seconds
    reward: { title: 'Veteran', items: ['phoenix_feather'], wtc: 10000 },
    rarity: 'legendary'
  }
}

// Achievement categories for UI organization
export const achievementCategories = {
  activity: 'Activity Masters',
  wealth: 'Wealth Builders',
  survival: 'Survivors',
  collection: 'Collectors',
  level: 'Level Climbers',
  special: 'Special Achievements'
}

// Achievement rarity colors
export const rarityColors = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400',
  mythical: 'text-red-400'
}
