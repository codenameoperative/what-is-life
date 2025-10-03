export interface SearchLocation {
  id: string
  name: string
  description: string
  // Base WTC reward range
  wtcReward: {
    min: number
    max: number
  }
  // Item drop chances by tier (0.0 to 1.0)
  itemDropChances: {
    useless: number
    common: number
    uncommon: number
    rare: number
    epic: number
    ultra_rare: number
    ultra_epic: number
    legendary: number
    mythical: number
    wdyft: number
  }
  // Special effects
  specialEffect?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic'
}

// All available search locations
export const searchLocations: Record<string, SearchLocation> = {
  abandoned_warehouse: {
    id: 'abandoned_warehouse',
    name: 'Abandoned Warehouse',
    description: 'A forgotten industrial complex filled with discarded machinery and forgotten crates.',
    wtcReward: { min: 5, max: 25 },
    itemDropChances: {
      useless: 0.4,
      common: 0.25,
      uncommon: 0.15,
      rare: 0.08,
      epic: 0.04,
      ultra_rare: 0.02,
      ultra_epic: 0.005,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    specialEffect: 'Higher chance for tools and mechanical items',
    rarity: 'common'
  },

  forgotten_cemetery: {
    id: 'forgotten_cemetery',
    name: 'Forgotten Cemetery',
    description: 'An overgrown graveyard where ancient secrets may be buried alongside the dead.',
    wtcReward: { min: 8, max: 35 },
    itemDropChances: {
      useless: 0.3,
      common: 0.2,
      uncommon: 0.2,
      rare: 0.12,
      epic: 0.06,
      ultra_rare: 0.03,
      ultra_epic: 0.008,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0008
    },
    specialEffect: 'Higher chance for collectables and mysterious items',
    rarity: 'uncommon'
  },

  sunken_shipwreck: {
    id: 'sunken_shipwreck',
    name: 'Sunken Shipwreck',
    description: 'The remains of a ship lost to the depths, now a treasure trove for brave explorers.',
    wtcReward: { min: 12, max: 45 },
    itemDropChances: {
      useless: 0.25,
      common: 0.18,
      uncommon: 0.22,
      rare: 0.15,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.01,
      legendary: 0.004,
      mythical: 0.002,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for rare and epic items from the sea',
    rarity: 'rare'
  },

  ancient_ruins: {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    description: 'The crumbling remains of a long-forgotten civilization, hiding secrets of the past.',
    wtcReward: { min: 15, max: 55 },
    itemDropChances: {
      useless: 0.2,
      common: 0.15,
      uncommon: 0.18,
      rare: 0.18,
      epic: 0.1,
      ultra_rare: 0.05,
      ultra_epic: 0.012,
      legendary: 0.005,
      mythical: 0.0025,
      wdyft: 0.0012
    },
    specialEffect: 'Higher chance for legendary and mythical artifacts',
    rarity: 'epic'
  },

  dense_forest: {
    id: 'dense_forest',
    name: 'Dense Forest',
    description: 'A thick woodland where nature has reclaimed what was once civilization\'s domain.',
    wtcReward: { min: 3, max: 18 },
    itemDropChances: {
      useless: 0.45,
      common: 0.28,
      uncommon: 0.12,
      rare: 0.06,
      epic: 0.03,
      ultra_rare: 0.015,
      ultra_epic: 0.003,
      legendary: 0.001,
      mythical: 0.0005,
      wdyft: 0.0002
    },
    specialEffect: 'Higher chance for natural and wooden items',
    rarity: 'common'
  },

  abandoned_mine: {
    id: 'abandoned_mine',
    name: 'Abandoned Mine',
    description: 'Dark tunnels and forgotten shafts that once yielded precious minerals.',
    wtcReward: { min: 10, max: 40 },
    itemDropChances: {
      useless: 0.35,
      common: 0.22,
      uncommon: 0.18,
      rare: 0.1,
      epic: 0.05,
      ultra_rare: 0.025,
      ultra_epic: 0.006,
      legendary: 0.0025,
      mythical: 0.0012,
      wdyft: 0.0006
    },
    specialEffect: 'Higher chance for precious metals and mining equipment',
    rarity: 'uncommon'
  },

  ghost_town: {
    id: 'ghost_town',
    name: 'Ghost Town',
    description: 'A deserted settlement frozen in time, where echoes of the past still linger.',
    wtcReward: { min: 6, max: 28 },
    itemDropChances: {
      useless: 0.38,
      common: 0.25,
      uncommon: 0.16,
      rare: 0.08,
      epic: 0.04,
      ultra_rare: 0.02,
      ultra_epic: 0.004,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    specialEffect: 'Higher chance for clothing and household items',
    rarity: 'common'
  },

  volcanic_caverns: {
    id: 'volcanic_caverns',
    name: 'Volcanic Caverns',
    description: 'Steaming caves and lava tubes that hide rare geological formations.',
    wtcReward: { min: 14, max: 50 },
    itemDropChances: {
      useless: 0.28,
      common: 0.16,
      uncommon: 0.2,
      rare: 0.14,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.008,
      legendary: 0.004,
      mythical: 0.002,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for fire-resistant and rare mineral items',
    rarity: 'rare'
  },

  frozen_tundra: {
    id: 'frozen_tundra',
    name: 'Frozen Tundra',
    description: 'A vast frozen wasteland where ancient creatures may be perfectly preserved.',
    wtcReward: { min: 9, max: 38 },
    itemDropChances: {
      useless: 0.32,
      common: 0.2,
      uncommon: 0.18,
      rare: 0.11,
      epic: 0.06,
      ultra_rare: 0.03,
      ultra_epic: 0.007,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for cold-weather items and ancient artifacts',
    rarity: 'uncommon'
  },

  cosmic_crash_site: {
    id: 'cosmic_crash_site',
    name: 'Cosmic Crash Site',
    description: 'The impact crater of what appears to be an otherworldly object.',
    wtcReward: { min: 20, max: 70 },
    itemDropChances: {
      useless: 0.15,
      common: 0.12,
      uncommon: 0.15,
      rare: 0.16,
      epic: 0.12,
      ultra_rare: 0.06,
      ultra_epic: 0.015,
      legendary: 0.006,
      mythical: 0.003,
      wdyft: 0.0015
    },
    specialEffect: 'Highest chance for ultra-rare and otherworldly items',
    rarity: 'epic'
  },

  // Additional Search Locations
  underwater_lab: {
    id: 'underwater_lab',
    name: 'Underwater Laboratory',
    description: 'A submerged research facility with cutting-edge technology and experimental equipment.',
    wtcReward: { min: 18, max: 60 },
    itemDropChances: {
      useless: 0.22,
      common: 0.16,
      uncommon: 0.19,
      rare: 0.15,
      epic: 0.09,
      ultra_rare: 0.045,
      ultra_epic: 0.011,
      legendary: 0.0045,
      mythical: 0.0022,
      wdyft: 0.0011
    },
    specialEffect: 'Higher chance for scientific equipment and experimental items',
    rarity: 'rare'
  },

  haunted_mansion: {
    id: 'haunted_mansion',
    name: 'Haunted Mansion',
    description: 'A Victorian estate where spirits roam and cursed artifacts lie hidden.',
    wtcReward: { min: 16, max: 52 },
    itemDropChances: {
      useless: 0.24,
      common: 0.17,
      uncommon: 0.18,
      rare: 0.14,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.009,
      legendary: 0.0035,
      mythical: 0.0018,
      wdyft: 0.0009
    },
    specialEffect: 'Higher chance for cursed items and supernatural artifacts',
    rarity: 'rare'
  },

  alien_spaceship: {
    id: 'alien_spaceship',
    name: 'Alien Spaceship',
    description: 'A crashed extraterrestrial vessel containing advanced alien technology.',
    wtcReward: { min: 25, max: 85 },
    itemDropChances: {
      useless: 0.12,
      common: 0.1,
      uncommon: 0.13,
      rare: 0.18,
      epic: 0.15,
      ultra_rare: 0.08,
      ultra_epic: 0.02,
      legendary: 0.008,
      mythical: 0.004,
      wdyft: 0.002
    },
    specialEffect: 'Highest chance for alien technology and WDYFT items',
    rarity: 'epic'
  },

  magical_library: {
    id: 'magical_library',
    name: 'Magical Library',
    description: 'An enchanted library where books contain real spells and magical knowledge.',
    wtcReward: { min: 12, max: 42 },
    itemDropChances: {
      useless: 0.26,
      common: 0.18,
      uncommon: 0.17,
      rare: 0.13,
      epic: 0.07,
      ultra_rare: 0.035,
      ultra_epic: 0.008,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for magical items and ancient tomes',
    rarity: 'uncommon'
  },

  dragon_lair: {
    id: 'dragon_lair',
    name: 'Dragon Lair',
    description: 'The cavernous home of an ancient dragon, filled with treasure and danger.',
    wtcReward: { min: 22, max: 75 },
    itemDropChances: {
      useless: 0.18,
      common: 0.14,
      uncommon: 0.16,
      rare: 0.17,
      epic: 0.11,
      ultra_rare: 0.055,
      ultra_epic: 0.013,
      legendary: 0.0055,
      mythical: 0.0027,
      wdyft: 0.0014
    },
    specialEffect: 'Higher chance for dragon-related items and treasure',
    rarity: 'epic'
  },

  pirate_cove: {
    id: 'pirate_cove',
    name: 'Pirate Cove',
    description: 'A hidden cove where pirates buried their treasure and left their mark.',
    wtcReward: { min: 15, max: 48 },
    itemDropChances: {
      useless: 0.27,
      common: 0.19,
      uncommon: 0.16,
      rare: 0.12,
      epic: 0.06,
      ultra_rare: 0.03,
      ultra_epic: 0.006,
      legendary: 0.0025,
      mythical: 0.0012,
      wdyft: 0.0006
    },
    specialEffect: 'Higher chance for pirate treasure and nautical items',
    rarity: 'uncommon'
  },

  time_rift: {
    id: 'time_rift',
    name: 'Time Rift',
    description: 'A tear in the fabric of time, leaking artifacts from different eras.',
    wtcReward: { min: 8, max: 30 },
    itemDropChances: {
      useless: 0.35,
      common: 0.23,
      uncommon: 0.14,
      rare: 0.09,
      epic: 0.05,
      ultra_rare: 0.025,
      ultra_epic: 0.005,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    specialEffect: 'Random temporal effects may occur',
    rarity: 'uncommon'
  },

  crystal_caves: {
    id: 'crystal_caves',
    name: 'Crystal Caves',
    description: 'Glistening caves filled with natural crystal formations and magical energy.',
    wtcReward: { min: 11, max: 38 },
    itemDropChances: {
      useless: 0.29,
      common: 0.21,
      uncommon: 0.17,
      rare: 0.11,
      epic: 0.055,
      ultra_rare: 0.028,
      ultra_epic: 0.0065,
      legendary: 0.0027,
      mythical: 0.0013,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for crystal and magical items',
    rarity: 'uncommon'
  },

  abandoned_amusement_park: {
    id: 'abandoned_amusement_park',
    name: 'Abandoned Amusement Park',
    description: 'Rusty rides and forgotten funhouses hide unexpected treasures.',
    wtcReward: { min: 7, max: 26 },
    itemDropChances: {
      useless: 0.36,
      common: 0.26,
      uncommon: 0.13,
      rare: 0.07,
      epic: 0.035,
      ultra_rare: 0.018,
      ultra_epic: 0.004,
      legendary: 0.0017,
      mythical: 0.0008,
      wdyft: 0.0004
    },
    specialEffect: 'Higher chance for entertainment and novelty items',
    rarity: 'common'
  },

  underground_bunker: {
    id: 'underground_bunker',
    name: 'Underground Bunker',
    description: 'A Cold War-era shelter stocked with survival supplies and classified documents.',
    wtcReward: { min: 13, max: 44 },
    itemDropChances: {
      useless: 0.31,
      common: 0.2,
      uncommon: 0.19,
      rare: 0.13,
      epic: 0.06,
      ultra_rare: 0.032,
      ultra_epic: 0.007,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for survival gear and military items',
    rarity: 'rare'
  },

  floating_market: {
    id: 'floating_market',
    name: 'Floating Market',
    description: 'A bustling market on water where merchants from around the world trade exotic goods.',
    wtcReward: { min: 10, max: 35 },
    itemDropChances: {
      useless: 0.33,
      common: 0.24,
      uncommon: 0.15,
      rare: 0.09,
      epic: 0.045,
      ultra_rare: 0.023,
      ultra_epic: 0.005,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    specialEffect: 'Higher chance for exotic and foreign items',
    rarity: 'common'
  },

  dimensional_portal: {
    id: 'dimensional_portal',
    name: 'Dimensional Portal',
    description: 'A gateway to parallel dimensions, leaking strange artifacts from other realities.',
    wtcReward: { min: 30, max: 100 },
    itemDropChances: {
      useless: 0.1,
      common: 0.08,
      uncommon: 0.11,
      rare: 0.15,
      epic: 0.18,
      ultra_rare: 0.09,
      ultra_epic: 0.025,
      legendary: 0.01,
      mythical: 0.005,
      wdyft: 0.0025
    },
    specialEffect: 'Extremely high chance for dimensional and WDYFT items',
    rarity: 'epic'
  },

  // === NEW LOCATIONS (19 more to reach 40 total) ===

  // WDYFT Locations (10 locations that guarantee legendary items)
  lost_temple_of_atlantis: {
    id: 'lost_temple_of_atlantis',
    name: 'Lost Temple of Atlantis',
    description: 'The sunken temple of an ancient underwater civilization, guardian of legendary aquatic treasures.',
    wtcReward: { min: 50, max: 200 },
    itemDropChances: {
      useless: 0.05,
      common: 0.05,
      uncommon: 0.08,
      rare: 0.12,
      epic: 0.2,
      ultra_rare: 0.15,
      ultra_epic: 0.08,
      legendary: 0.15, // Guaranteed legendary items
      mythical: 0.08,
      wdyft: 0.04 // High WDYFT chance
    },
    specialEffect: 'Guaranteed legendary aquatic artifacts and WDYFT items',
    rarity: 'epic'
  },

  forbidden_tomb_of_kings: {
    id: 'forbidden_tomb_of_kings',
    name: 'Forbidden Tomb of Kings',
    description: 'The cursed resting place of ancient monarchs, sealed with powerful magic and legendary treasures.',
    wtcReward: { min: 45, max: 180 },
    itemDropChances: {
      useless: 0.05,
      common: 0.05,
      uncommon: 0.08,
      rare: 0.12,
      epic: 0.18,
      ultra_rare: 0.15,
      ultra_epic: 0.1,
      legendary: 0.12, // Guaranteed legendary items
      mythical: 0.1,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed royal artifacts and WDYFT cursed items',
    rarity: 'epic'
  },

  sky_palace_of_legends: {
    id: 'sky_palace_of_legends',
    name: 'Sky Palace of Legends',
    description: 'A floating citadel in the clouds, home to mythical heroes and their legendary weapons.',
    wtcReward: { min: 60, max: 250 },
    itemDropChances: {
      useless: 0.03,
      common: 0.03,
      uncommon: 0.06,
      rare: 0.1,
      epic: 0.2,
      ultra_rare: 0.18,
      ultra_epic: 0.12,
      legendary: 0.15, // Guaranteed legendary items
      mythical: 0.08,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed heroic weapons and WDYFT legendary artifacts',
    rarity: 'epic'
  },

  void_realm_nexus: {
    id: 'void_realm_nexus',
    name: 'Void Realm Nexus',
    description: 'The intersection point between dimensions, where reality bends and WDYFT items manifest.',
    wtcReward: { min: 70, max: 300 },
    itemDropChances: {
      useless: 0.02,
      common: 0.02,
      uncommon: 0.04,
      rare: 0.08,
      epic: 0.15,
      ultra_rare: 0.2,
      ultra_epic: 0.15,
      legendary: 0.18, // Guaranteed legendary items
      mythical: 0.12,
      wdyft: 0.04 // High WDYFT chance
    },
    specialEffect: 'Guaranteed void-touched items and WDYFT reality-warping artifacts',
    rarity: 'epic'
  },

  eternal_flame_sanctum: {
    id: 'eternal_flame_sanctum',
    name: 'Eternal Flame Sanctum',
    description: 'A temple of eternal fire where phoenixes are reborn and legendary fire-based artifacts reside.',
    wtcReward: { min: 55, max: 220 },
    itemDropChances: {
      useless: 0.04,
      common: 0.04,
      uncommon: 0.07,
      rare: 0.11,
      epic: 0.19,
      ultra_rare: 0.16,
      ultra_epic: 0.11,
      legendary: 0.14, // Guaranteed legendary items
      mythical: 0.09,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed fire-enchanted items and WDYFT phoenix artifacts',
    rarity: 'epic'
  },

  frozen_citadel_of_ice: {
    id: 'frozen_citadel_of_ice',
    name: 'Frozen Citadel of Ice',
    description: 'An ancient ice fortress where frost dragons hoard legendary cold-based treasures.',
    wtcReward: { min: 48, max: 190 },
    itemDropChances: {
      useless: 0.04,
      common: 0.04,
      uncommon: 0.07,
      rare: 0.11,
      epic: 0.19,
      ultra_rare: 0.16,
      ultra_epic: 0.11,
      legendary: 0.14, // Guaranteed legendary items
      mythical: 0.09,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed frost-enchanted items and WDYFT ice dragon artifacts',
    rarity: 'epic'
  },

  storm_lords_throne: {
    id: 'storm_lords_throne',
    name: 'Storm Lord\'s Throne',
    description: 'The seat of power for the master of thunder and lightning, crackling with legendary electric artifacts.',
    wtcReward: { min: 52, max: 210 },
    itemDropChances: {
      useless: 0.04,
      common: 0.04,
      uncommon: 0.07,
      rare: 0.11,
      epic: 0.19,
      ultra_rare: 0.16,
      ultra_epic: 0.11,
      legendary: 0.14, // Guaranteed legendary items
      mythical: 0.09,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed lightning-enchanted items and WDYFT storm artifacts',
    rarity: 'epic'
  },

  earth_core_chamber: {
    id: 'earth_core_chamber',
    name: 'Earth Core Chamber',
    description: 'Deep beneath the surface, where the planet\'s heart beats and legendary earth-based treasures await.',
    wtcReward: { min: 58, max: 240 },
    itemDropChances: {
      useless: 0.03,
      common: 0.03,
      uncommon: 0.06,
      rare: 0.1,
      epic: 0.2,
      ultra_rare: 0.18,
      ultra_epic: 0.12,
      legendary: 0.15, // Guaranteed legendary items
      mythical: 0.08,
      wdyft: 0.05 // High WDYFT chance
    },
    specialEffect: 'Guaranteed earth-enchanted items and WDYFT crystal artifacts',
    rarity: 'epic'
  },

  celestial_observatory: {
    id: 'celestial_observatory',
    name: 'Celestial Observatory',
    description: 'An ancient stargazing tower where cosmic secrets unfold and legendary astronomical artifacts are found.',
    wtcReward: { min: 65, max: 280 },
    itemDropChances: {
      useless: 0.02,
      common: 0.02,
      uncommon: 0.05,
      rare: 0.09,
      epic: 0.18,
      ultra_rare: 0.2,
      ultra_epic: 0.14,
      legendary: 0.16, // Guaranteed legendary items
      mythical: 0.1,
      wdyft: 0.04 // High WDYFT chance
    },
    specialEffect: 'Guaranteed celestial items and WDYFT cosmic artifacts',
    rarity: 'epic'
  },

  nightmare_realm_gateway: {
    id: 'nightmare_realm_gateway',
    name: 'Nightmare Realm Gateway',
    description: 'A portal to the realm of dreams and nightmares, where legendary subconscious artifacts manifest.',
    wtcReward: { min: 75, max: 320 },
    itemDropChances: {
      useless: 0.01,
      common: 0.01,
      uncommon: 0.03,
      rare: 0.07,
      epic: 0.16,
      ultra_rare: 0.22,
      ultra_epic: 0.16,
      legendary: 0.18, // Guaranteed legendary items
      mythical: 0.12,
      wdyft: 0.04 // High WDYFT chance
    },
    specialEffect: 'Guaranteed dream/nightmare items and WDYFT subconscious artifacts',
    rarity: 'epic'
  },

  // Regular Locations (9 more to reach 40 total)
  medieval_castle: {
    id: 'medieval_castle',
    name: 'Medieval Castle',
    description: 'The ruins of a medieval fortress, filled with knightly armor and ancient weaponry.',
    wtcReward: { min: 14, max: 46 },
    itemDropChances: {
      useless: 0.3,
      common: 0.22,
      uncommon: 0.18,
      rare: 0.12,
      epic: 0.06,
      ultra_rare: 0.03,
      ultra_epic: 0.007,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for medieval weapons and armor',
    rarity: 'uncommon'
  },

  futuristic_city_ruins: {
    id: 'futuristic_city_ruins',
    name: 'Futuristic City Ruins',
    description: 'The remains of a technologically advanced city from a possible future timeline.',
    wtcReward: { min: 20, max: 65 },
    itemDropChances: {
      useless: 0.25,
      common: 0.18,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.01,
      legendary: 0.004,
      mythical: 0.002,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for advanced technology and gadgets',
    rarity: 'rare'
  },

  enchanted_grove: {
    id: 'enchanted_grove',
    name: 'Enchanted Grove',
    description: 'A mystical forest where ancient trees whisper secrets and magical creatures roam.',
    wtcReward: { min: 16, max: 52 },
    itemDropChances: {
      useless: 0.28,
      common: 0.2,
      uncommon: 0.19,
      rare: 0.13,
      epic: 0.07,
      ultra_rare: 0.035,
      ultra_epic: 0.008,
      legendary: 0.0035,
      mythical: 0.0018,
      wdyft: 0.0009
    },
    specialEffect: 'Higher chance for magical and nature-based items',
    rarity: 'uncommon'
  },

  deep_sea_trench: {
    id: 'deep_sea_trench',
    name: 'Deep Sea Trench',
    description: 'The darkest depths of the ocean, home to bizarre creatures and sunken treasures.',
    wtcReward: { min: 18, max: 58 },
    itemDropChances: {
      useless: 0.26,
      common: 0.19,
      uncommon: 0.21,
      rare: 0.14,
      epic: 0.075,
      ultra_rare: 0.038,
      ultra_epic: 0.0085,
      legendary: 0.0038,
      mythical: 0.0019,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for deep-sea creatures and underwater treasures',
    rarity: 'rare'
  },

  mountain_peak_monastery: {
    id: 'mountain_peak_monastery',
    name: 'Mountain Peak Monastery',
    description: 'An ancient monastery built on the highest peak, containing monk artifacts and wisdom.',
    wtcReward: { min: 12, max: 42 },
    itemDropChances: {
      useless: 0.32,
      common: 0.23,
      uncommon: 0.17,
      rare: 0.1,
      epic: 0.055,
      ultra_rare: 0.028,
      ultra_epic: 0.006,
      legendary: 0.0025,
      mythical: 0.0012,
      wdyft: 0.0006
    },
    specialEffect: 'Higher chance for religious artifacts and meditation items',
    rarity: 'uncommon'
  },

  ancient_battlefield: {
    id: 'ancient_battlefield',
    name: 'Ancient Battlefield',
    description: 'The site of an epic historical battle, scattered with weapons and armor from fallen warriors.',
    wtcReward: { min: 11, max: 38 },
    itemDropChances: {
      useless: 0.31,
      common: 0.24,
      uncommon: 0.16,
      rare: 0.09,
      epic: 0.05,
      ultra_rare: 0.025,
      ultra_epic: 0.005,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    specialEffect: 'Higher chance for ancient weapons and battle-worn items',
    rarity: 'common'
  },

  robotic_factory: {
    id: 'robotic_factory',
    name: 'Robotic Factory',
    description: 'An abandoned factory that once produced advanced robots and artificial intelligence systems.',
    wtcReward: { min: 19, max: 62 },
    itemDropChances: {
      useless: 0.27,
      common: 0.2,
      uncommon: 0.18,
      rare: 0.13,
      epic: 0.07,
      ultra_rare: 0.035,
      ultra_epic: 0.008,
      legendary: 0.0035,
      mythical: 0.0018,
      wdyft: 0.0009
    },
    specialEffect: 'Higher chance for robotic parts and AI components',
    rarity: 'rare'
  },

  vampire_castle: {
    id: 'vampire_castle',
    name: 'Vampire Castle',
    description: 'A gothic castle shrouded in eternal night, home to immortal beings and their cursed treasures.',
    wtcReward: { min: 17, max: 55 },
    itemDropChances: {
      useless: 0.29,
      common: 0.21,
      uncommon: 0.17,
      rare: 0.11,
      epic: 0.065,
      ultra_rare: 0.033,
      ultra_epic: 0.0075,
      legendary: 0.0033,
      mythical: 0.0017,
      wdyft: 0.0008
    },
    specialEffect: 'Higher chance for gothic and supernatural items',
    rarity: 'uncommon'
  },

  space_station_derelict: {
    id: 'space_station_derelict',
    name: 'Derelict Space Station',
    description: 'An abandoned orbital station floating in the void, containing zero-gravity treasures.',
    wtcReward: { min: 25, max: 80 },
    itemDropChances: {
      useless: 0.23,
      common: 0.17,
      uncommon: 0.19,
      rare: 0.16,
      epic: 0.09,
      ultra_rare: 0.045,
      ultra_epic: 0.011,
      legendary: 0.0045,
      mythical: 0.0022,
      wdyft: 0.0011
    },
    specialEffect: 'Higher chance for space-age technology and zero-gravity items',
    rarity: 'rare'
  }
}

// Helper function to get random locations
export function getRandomLocations(count: number = 3): SearchLocation[] {
  const locations = Object.values(searchLocations)
  const shuffled = [...locations].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// ========================================
// TEMPLATE FOR ADDING NEW LOCATIONS
// ========================================
// export const searchLocations: Record<string, SearchLocation> = {
//   your_location_id: {
//     id: 'your_location_id',
//     name: 'Your Location Name',
//     description: 'Location description...',
//     wtcReward: { min: 1, max: 10 }, // Base WTC range
//     itemDropChances: {
//       useless: 0.3,    // 30% chance
//       common: 0.2,     // 20% chance
//       uncommon: 0.15,  // 15% chance
//       rare: 0.08,      // 8% chance
//       epic: 0.04,      // 4% chance
//       ultra_rare: 0.02, // 2% chance
//       ultra_epic: 0.005, // 0.5% chance
//       legendary: 0.002, // 0.2% chance
//       mythical: 0.001, // 0.1% chance
//       wdyft: 0.0005   // 0.05% chance
//     },
//     specialEffect: 'Special effect description',
//     rarity: 'common' | 'uncommon' | 'rare' | 'epic'
//   }
// }
