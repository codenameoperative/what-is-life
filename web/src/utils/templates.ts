// Comprehensive Templates for Game Development
// This file contains templates for all game entities and systems

import { ItemTier, ItemCategory } from './items'

// ===== FISH TEMPLATES =====
export const fishTemplates = {
  // Common Fish Template
  common_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'common' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 75,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Uncommon Fish Template
  uncommon_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'uncommon' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 150,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Rare Fish Template
  rare_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'rare' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 500,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Epic Fish Template
  epic_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'epic' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 1200,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Legendary Fish Template
  legendary_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'legendary' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 2500,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // Mythical Fish Template
  mythical_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'mythical' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 5000,
    usable: false,
    source: 'Fished',
    breakChance: 0
  },

  // WDYFT Fish Template
  wdyft_fish: {
    id: 'fish_name',
    name: 'Fish Name',
    tier: 'wdyft' as ItemTier,
    category: 'fish' as ItemCategory,
    description: 'Description of the fish.',
    value: 15000,
    usable: false,
    source: 'Fished',
    breakChance: 0
  }
}

// ===== FISHING LOCATION TEMPLATES =====
export const fishingLocationTemplates = {
  template: {
    id: 'location_id',
    name: 'Location Name',
    description: 'Description of the fishing location.',
    // Fish drop chances by tier (0.0 to 1.0)
    fishDropChances: {
      common: 0.4,
      uncommon: 0.3,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    // Item drop chances by tier (0.0 to 1.0)
    itemDropChances: {
      useless: 0.1,
      common: 0.2,
      uncommon: 0.15,
      rare: 0.1,
      epic: 0.05,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    // Special effects
    specialEffect: 'Special effect description',
    rarity: 'common' as const
  }
}

// ===== HUNTING LOCATION TEMPLATES =====
export const huntingLocationTemplates = {
  template: {
    id: 'location_id',
    name: 'Location Name',
    description: 'Description of the hunting location.',
    itemDropChances: {
      useless: 0.1,
      common: 0.25,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    animalDropChances: {
      common: 0.3,
      uncommon: 0.25,
      rare: 0.2,
      epic: 0.12,
      legendary: 0.06,
      mythical: 0.03,
      wdyft: 0.015
    },
    chestChance: 0.1,
    requiredItemId: undefined, // Optional requirement
    rarity: 'common' as const
  }
}

// ===== SEARCH LOCATION TEMPLATES =====
export const searchLocationTemplates = {
  template: {
    id: 'location_id',
    name: 'Location Name',
    description: 'Description of the search location.',
    itemDropChances: {
      useless: 0.15,
      common: 0.3,
      uncommon: 0.25,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    searchTime: 30, // seconds
    energyCost: 10,
    rarity: 'common' as const
  }
}

// ===== CRIME LOCATION TEMPLATES =====
export const crimeLocationTemplates = {
  template: {
    id: 'crime_id',
    name: 'Crime Name',
    description: 'Description of the crime.',
    riskLevel: 'low' as const, // 'low' | 'medium' | 'high' | 'extreme'
    rewardRange: { min: 50, max: 200 },
    jailTimeRange: { min: 10, max: 60 }, // seconds
    successRate: 0.8,
    energyCost: 15
  }
}

// ===== ANIMAL TEMPLATES =====
export const animalTemplates = {
  // Common Animal Template
  common_animal: {
    id: 'animal_name',
    name: 'Animal Name',
    tier: 'common' as ItemTier,
    category: 'animals' as ItemCategory,
    description: 'Description of the animal.',
    value: 40,
    usable: false,
    source: 'Hunted',
    breakChance: 0
  },

  // Template continues for all tiers...
  // (uncommon, rare, epic, legendary, mythical, wdyft)
}

// ===== COLLECTABLE TEMPLATES =====
export const collectableTemplates = {
  // Common Collectable Template
  common_collectable: {
    id: 'collectable_name',
    name: 'Collectable Name',
    tier: 'common' as ItemTier,
    category: 'collectables' as ItemCategory,
    description: 'Description of the collectable.',
    value: 25,
    usable: false,
    source: 'Found',
    breakChance: 0
  }

  // Template continues for all tiers...
}

// ===== JOB TEMPLATES =====
export const jobTemplates = {
  template: {
    id: 'job_id',
    name: 'Job Name',
    tier: 'entry' as const, // 'entry' | 'intermediate' | 'advanced' | 'expert'
    description: 'Description of the job.',
    payPerWork: { min: 10, max: 50 },
    requirements: {
      minWTC: 0, // Optional minimum wallet requirement
      requiredItemId: undefined // Optional required item
    }
  }
}

// ===== TRIVIA QUESTION TEMPLATES =====
export const triviaQuestionTemplates = {
  template: {
    id: 'question_id',
    question: 'What is the capital of France?',
    answers: ['Paris', 'London', 'Berlin', 'Madrid'],
    correctAnswer: 0, // Index of correct answer
    difficulty: 'easy' as const, // 'easy' | 'medium' | 'hard'
    category: 'geography',
    points: 10
  }
}

// ===== WEAPON TEMPLATES =====
export const weaponTemplates = {
  // Common Weapon Template
  common_weapon: {
    id: 'weapon_name',
    name: 'Weapon Name',
    tier: 'common' as ItemTier,
    category: 'weapons' as ItemCategory,
    description: 'Description of the weapon.',
    value: 45,
    usable: false,
    source: 'Shop',
    breakChance: 0.05
  }

  // Template continues for all tiers...
}

// ===== TOOL TEMPLATES =====
export const toolTemplates = {
  // Common Tool Template
  common_tool: {
    id: 'tool_name',
    name: 'Tool Name',
    tier: 'common' as ItemTier,
    category: 'tools' as ItemCategory,
    description: 'Description of the tool.',
    value: 35,
    usable: true,
    source: 'Shop',
    breakChance: 0.2
  }

  // Template continues for all tiers...
}

// ===== CLOTHING TEMPLATES =====
export const clothingTemplates = {
  // Common Clothing Template
  common_clothing: {
    id: 'clothing_name',
    name: 'Clothing Name',
    tier: 'common' as ItemTier,
    category: 'clothing' as ItemCategory,
    description: 'Description of the clothing.',
    value: 30,
    usable: false,
    source: 'Shop',
    breakChance: 0
  }

  // Template continues for all tiers...
}

// ===== ORE TEMPLATES =====
export const oreTemplates = {
  // Common Ore Template
  common_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'common' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 15,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Uncommon Ore Template
  uncommon_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'uncommon' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 30,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Rare Ore Template
  rare_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'rare' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 85,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Epic Ore Template
  epic_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'epic' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 210,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Legendary Ore Template
  legendary_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'legendary' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 525,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // Mythical Ore Template
  mythical_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'mythical' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 1250,
    usable: false,
    source: 'Found',
    breakChance: 0
  },

  // WDYFT Ore Template
  wdyft_ore: {
    id: 'ore_name',
    name: 'Ore Name',
    tier: 'wdyft' as ItemTier,
    category: 'ores' as ItemCategory,
    description: 'Description of the ore.',
    value: 3250,
    usable: false,
    source: 'Found',
    breakChance: 0
  }
}

// ===== DIGGING LOCATION TEMPLATES =====
export const diggingLocationTemplates = {
  template: {
    id: 'location_id',
    name: 'Location Name',
    description: 'Description of the digging location.',
    oreDropChances: {
      common: 0.3,
      uncommon: 0.25,
      rare: 0.2,
      epic: 0.12,
      legendary: 0.06,
      mythical: 0.03,
      wdyft: 0.015
    },
    chestChance: 0.1,
    requiredItemId: undefined, // Optional requirement (shovel or pickaxe)
    rarity: 'common' as const
  }
}

// ===== MEME TYPE TEMPLATES =====
export const memeTypeTemplates = {
  meme_template: {
    id: 'meme_type_id',
    name: 'Meme Type Name',
    description: 'Description of the meme type and its characteristics.',
    successRate: 0.5, // 0.0 - 1.0 chance of success
    failureRate: 0.2, // 0.0 - 1.0 chance of failure
    viralMultiplier: 2.0, // Multiplier for viral rewards
    template: {
      id: 'meme_template_id',
      name: 'Meme Template Name',
      description: 'Description of what this meme template represents.',
      value: 50,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  }
}

// ===== POSTING PLATFORM TEMPLATES =====
export const postingPlatformTemplates = {
  platform_template: {
    id: 'platform_id',
    name: 'Platform Name',
    description: 'Description of the platform and how memes perform there.',
    postType: 'image/text/video',
    baseReward: { min: 10, max: 100 },
    viralChance: 0.2, // 0.0 - 1.0 chance for viral success
    failurePenalty: 0.1, // 0.0 - 1.0 chance for penalty/failure
    platformMultiplier: 1.5, // Multiplier for viral rewards
    itemDropChances: {
      useless: 0.3,
      common: 0.3,
      uncommon: 0.2,
      rare: 0.1,
      epic: 0.05,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    specialEffects: 'Special mechanics or effects for this platform',
    audience: 'Description of the typical audience'
  }
}

// ===== STREAM TYPE TEMPLATES =====
export const streamTypeTemplates = {
  stream_type_template: {
    id: 'stream_type_id',
    name: 'Stream Type Name',
    description: 'Description of the stream type and its audience.',
    successRate: 0.5, // 0.0 - 1.0 chance of success
    failureRate: 0.2, // 0.0 - 1.0 chance of failure
    viralMultiplier: 2.0, // Multiplier for viral rewards
    baseReward: { min: 50, max: 200 }, // Base WTC reward range
    durationOptions: [5, 10, 15, 20, 30], // Available duration options in minutes
    category: 'gaming|vlog|blog|etc', // Category for grouping
    requirements: 'Any special requirements for this stream type'
  }
}
