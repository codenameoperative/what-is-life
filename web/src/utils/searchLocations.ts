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
  volcanic_caves: {
    id: 'volcanic_caves',
    name: 'Volcanic Caves',
    description: 'Deep underground caves heated by geothermal activity, filled with rare minerals and dangerous lava flows.',
    wtcReward: { min: 50, max: 200 },
    itemDropChances: {
      useless: 0.1,
      common: 0.15,
      uncommon: 0.2,
      rare: 0.25,
      epic: 0.15,
      ultra_rare: 0.1,
      ultra_epic: 0.03,
      legendary: 0.015,
      mythical: 0.005,
      wdyft: 0.001
    },
    specialEffect: 'High chance for ores and fire-related items. Risk of lava damage.',
    rarity: 'epic'
  },
  underwater_ruins: {
    id: 'underwater_ruins',
    name: 'Underwater Ruins',
    description: 'Ancient submerged structures holding lost treasures and mysterious artifacts from a forgotten civilization.',
    wtcReward: { min: 75, max: 300 },
    itemDropChances: {
      useless: 0.05,
      common: 0.1,
      uncommon: 0.15,
      rare: 0.25,
      epic: 0.2,
      ultra_rare: 0.15,
      ultra_epic: 0.06,
      legendary: 0.03,
      mythical: 0.01,
      wdyft: 0.002
    },
    specialEffect: 'Excellent for finding ancient artifacts and water-themed items.',
    rarity: 'epic'
  },
  alien_crash_site: {
    id: 'alien_crash_site',
    name: 'Alien Crash Site',
    description: 'The wreckage of an extraterrestrial spacecraft, containing advanced technology and mysterious materials.',
    wtcReward: { min: 100, max: 500 },
    itemDropChances: {
      useless: 0.02,
      common: 0.05,
      uncommon: 0.1,
      rare: 0.15,
      epic: 0.25,
      ultra_rare: 0.2,
      ultra_epic: 0.12,
      legendary: 0.08,
      mythical: 0.025,
      wdyft: 0.01
    },
    specialEffect: 'Contains advanced technology and unknown materials from other worlds.',
    rarity: 'epic'
  },
  time_lost_temple: {
    id: 'time_lost_temple',
    name: 'Time-Lost Temple',
    description: 'An ancient temple that exists outside of normal time, containing artifacts from various eras.',
    wtcReward: { min: 200, max: 1000 },
    itemDropChances: {
      useless: 0.01,
      common: 0.02,
      uncommon: 0.05,
      rare: 0.1,
      epic: 0.2,
      ultra_rare: 0.25,
      ultra_epic: 0.15,
      legendary: 0.12,
      mythical: 0.08,
      wdyft: 0.02
    },
    specialEffect: 'Contains items from different time periods. High risk of temporal anomalies.',
    rarity: 'epic'
  },
  dream_realm: {
    id: 'dream_realm',
    name: 'Dream Realm',
    description: 'A surreal dimension accessible only through dreams, filled with subconscious manifestations and ethereal treasures.',
    wtcReward: { min: 150, max: 800 },
    itemDropChances: {
      useless: 0.03,
      common: 0.08,
      uncommon: 0.12,
      rare: 0.18,
      epic: 0.22,
      ultra_rare: 0.18,
      ultra_epic: 0.1,
      legendary: 0.06,
      mythical: 0.025,
      wdyft: 0.005
    },
    specialEffect: 'Contains dream-like items and psychic artifacts. Reality may blur during exploration.',
    rarity: 'epic'
  },
  quantum_labyrinth: {
    id: 'quantum_labyrinth',
    name: 'Quantum Labyrinth',
    description: 'A maze of quantum uncertainty where paths shift and probabilities become reality.',
    wtcReward: { min: 300, max: 1500 },
    itemDropChances: {
      useless: 0.005,
      common: 0.01,
      uncommon: 0.03,
      rare: 0.08,
      epic: 0.15,
      ultra_rare: 0.25,
      ultra_epic: 0.2,
      legendary: 0.15,
      mythical: 0.12,
      wdyft: 0.05
    },
    specialEffect: 'Quantum effects may cause items to exist in multiple states. High chance for scientific discoveries.',
    rarity: 'epic'
  },
  void_nexus: {
    id: 'void_nexus',
    name: 'Void Nexus',
    description: 'A point where reality meets nothingness, containing fragments of existence and anti-existence.',
    wtcReward: { min: 500, max: 2500 },
    itemDropChances: {
      useless: 0.001,
      common: 0.005,
      uncommon: 0.02,
      rare: 0.05,
      epic: 0.1,
      ultra_rare: 0.2,
      ultra_epic: 0.25,
      legendary: 0.2,
      mythical: 0.15,
      wdyft: 0.1
    },
    specialEffect: 'Contains items that defy physics and reality. Risk of existential crisis.',
    rarity: 'epic'
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
  },

  // === ADDITIONAL 20 NEW LOCATIONS (41-60) ===

  cyberpunk_megacity: {
    id: 'cyberpunk_megacity',
    name: 'Cyberpunk Megacity',
    description: 'A sprawling neon-lit metropolis filled with hackers, corporations, and high-tech black market deals.',
    wtcReward: { min: 22, max: 72 },
    itemDropChances: {
      useless: 0.24,
      common: 0.19,
      uncommon: 0.21,
      rare: 0.15,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.009,
      legendary: 0.004,
      mythical: 0.002,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for cybernetic implants and hacking tools',
    rarity: 'rare'
  },

  wizard_tower: {
    id: 'wizard_tower',
    name: 'Wizard\'s Tower',
    description: 'A towering spire filled with arcane knowledge, potion labs, and mystical experiments gone wrong.',
    wtcReward: { min: 18, max: 58 },
    itemDropChances: {
      useless: 0.28,
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
    specialEffect: 'Higher chance for magical artifacts and potion ingredients',
    rarity: 'uncommon'
  },

  dinosaur_excavation_site: {
    id: 'dinosaur_excavation_site',
    name: 'Dinosaur Excavation Site',
    description: 'A paleontological dig site where ancient bones and prehistoric artifacts are being unearthed.',
    wtcReward: { min: 16, max: 52 },
    itemDropChances: {
      useless: 0.29,
      common: 0.21,
      uncommon: 0.17,
      rare: 0.11,
      epic: 0.06,
      ultra_rare: 0.03,
      ultra_epic: 0.007,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    specialEffect: 'Higher chance for fossil artifacts and ancient bones',
    rarity: 'uncommon'
  },

  underwater_volcano: {
    id: 'underwater_volcano',
    name: 'Underwater Volcano',
    description: 'An active submarine volcano venting hot water and minerals, creating bizarre deep-sea formations.',
    wtcReward: { min: 24, max: 78 },
    itemDropChances: {
      useless: 0.22,
      common: 0.16,
      uncommon: 0.19,
      rare: 0.17,
      epic: 0.09,
      ultra_rare: 0.045,
      ultra_epic: 0.011,
      legendary: 0.0045,
      mythical: 0.0022,
      wdyft: 0.0011
    },
    specialEffect: 'Higher chance for volcanic minerals and heat-resistant items',
    rarity: 'rare'
  },

  steampunk_workshop: {
    id: 'steampunk_workshop',
    name: 'Steampunk Workshop',
    description: 'A Victorian-era laboratory filled with brass gears, steam engines, and mechanical marvels.',
    wtcReward: { min: 20, max: 65 },
    itemDropChances: {
      useless: 0.26,
      common: 0.18,
      uncommon: 0.2,
      rare: 0.14,
      epic: 0.075,
      ultra_rare: 0.038,
      ultra_epic: 0.0085,
      legendary: 0.0038,
      mythical: 0.0019,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for mechanical parts and steam-powered devices',
    rarity: 'rare'
  },

  alien_biology_lab: {
    id: 'alien_biology_lab',
    name: 'Alien Biology Laboratory',
    description: 'An extraterrestrial research facility studying bizarre life forms and genetic experiments.',
    wtcReward: { min: 26, max: 85 },
    itemDropChances: {
      useless: 0.21,
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
    specialEffect: 'Highest chance for xenobiology specimens and genetic material',
    rarity: 'epic'
  },

  time_travelers_hideout: {
    id: 'time_travelers_hideout',
    name: 'Time Traveler\'s Hideout',
    description: 'A secret base where time travelers store their equipment and plan temporal excursions.',
    wtcReward: { min: 28, max: 92 },
    itemDropChances: {
      useless: 0.19,
      common: 0.13,
      uncommon: 0.16,
      rare: 0.19,
      epic: 0.12,
      ultra_rare: 0.06,
      ultra_epic: 0.015,
      legendary: 0.006,
      mythical: 0.003,
      wdyft: 0.0015
    },
    specialEffect: 'Higher chance for temporal devices and anachronistic items',
    rarity: 'epic'
  },

  digital_consciousness_realm: {
    id: 'digital_consciousness_realm',
    name: 'Digital Consciousness Realm',
    description: 'A virtual reality where digital beings live and AI consciousness manifests as physical objects.',
    wtcReward: { min: 30, max: 100 },
    itemDropChances: {
      useless: 0.18,
      common: 0.12,
      uncommon: 0.15,
      rare: 0.2,
      epic: 0.13,
      ultra_rare: 0.065,
      ultra_epic: 0.016,
      legendary: 0.0065,
      mythical: 0.0032,
      wdyft: 0.0016
    },
    specialEffect: 'Higher chance for digital artifacts and AI consciousness fragments',
    rarity: 'epic'
  },

  quantum_foam_void: {
    id: 'quantum_foam_void',
    name: 'Quantum Foam Void',
    description: 'The fundamental layer of reality where quantum fluctuations create and destroy particles.',
    wtcReward: { min: 35, max: 120 },
    itemDropChances: {
      useless: 0.15,
      common: 0.1,
      uncommon: 0.12,
      rare: 0.18,
      epic: 0.16,
      ultra_rare: 0.08,
      ultra_epic: 0.02,
      legendary: 0.008,
      mythical: 0.004,
      wdyft: 0.002
    },
    specialEffect: 'Highest chance for quantum particles and reality-warping items',
    rarity: 'epic'
  },

  dream_weaver_citadel: {
    id: 'dream_weaver_citadel',
    name: 'Dream Weaver Citadel',
    description: 'A fortress built in the collective unconscious, where dream architects shape reality.',
    wtcReward: { min: 32, max: 105 },
    itemDropChances: {
      useless: 0.17,
      common: 0.11,
      uncommon: 0.14,
      rare: 0.19,
      epic: 0.14,
      ultra_rare: 0.07,
      ultra_epic: 0.017,
      legendary: 0.007,
      mythical: 0.0035,
      wdyft: 0.0018
    },
    specialEffect: 'Higher chance for dream artifacts and subconscious manifestations',
    rarity: 'epic'
  },

  parallel_universe_crossroads: {
    id: 'parallel_universe_crossroads',
    name: 'Parallel Universe Crossroads',
    description: 'An intersection point where multiple realities converge, leaking items from alternate timelines.',
    wtcReward: { min: 38, max: 125 },
    itemDropChances: {
      useless: 0.14,
      common: 0.09,
      uncommon: 0.11,
      rare: 0.17,
      epic: 0.17,
      ultra_rare: 0.085,
      ultra_epic: 0.021,
      legendary: 0.0085,
      mythical: 0.0042,
      wdyft: 0.0021
    },
    specialEffect: 'Highest chance for alternate reality items and dimensional artifacts',
    rarity: 'epic'
  },

  singularity_core: {
    id: 'singularity_core',
    name: 'Singularity Core',
    description: 'The heart of a collapsed star, containing infinite density and impossible physics.',
    wtcReward: { min: 40, max: 140 },
    itemDropChances: {
      useless: 0.12,
      common: 0.08,
      uncommon: 0.1,
      rare: 0.16,
      epic: 0.18,
      ultra_rare: 0.09,
      ultra_epic: 0.022,
      legendary: 0.009,
      mythical: 0.0045,
      wdyft: 0.0022
    },
    specialEffect: 'Contains items that bend the laws of physics themselves',
    rarity: 'epic'
  },

  neural_network_nexus: {
    id: 'neural_network_nexus',
    name: 'Neural Network Nexus',
    description: 'A massive AI data center where machine learning algorithms manifest as physical objects.',
    wtcReward: { min: 27, max: 88 },
    itemDropChances: {
      useless: 0.2,
      common: 0.14,
      uncommon: 0.17,
      rare: 0.18,
      epic: 0.11,
      ultra_rare: 0.055,
      ultra_epic: 0.013,
      legendary: 0.0055,
      mythical: 0.0027,
      wdyft: 0.0014
    },
    specialEffect: 'Higher chance for AI-generated items and computational artifacts',
    rarity: 'rare'
  },

  bio_luminescent_caverns: {
    id: 'bio_luminescent_caverns',
    name: 'Bio-luminescent Caverns',
    description: 'Underground caves filled with glowing organisms and phosphorescent crystals.',
    wtcReward: { min: 21, max: 68 },
    itemDropChances: {
      useless: 0.25,
      common: 0.18,
      uncommon: 0.2,
      rare: 0.14,
      epic: 0.075,
      ultra_rare: 0.038,
      ultra_epic: 0.0085,
      legendary: 0.0038,
      mythical: 0.0019,
      wdyft: 0.001
    },
    specialEffect: 'Higher chance for glowing crystals and bio-luminescent organisms',
    rarity: 'uncommon'
  },

  ancient_astronaut_ruins: {
    id: 'ancient_astronaut_ruins',
    name: 'Ancient Astronaut Ruins',
    description: 'The remains of an alien civilization that visited Earth in prehistoric times.',
    wtcReward: { min: 29, max: 95 },
    itemDropChances: {
      useless: 0.19,
      common: 0.13,
      uncommon: 0.16,
      rare: 0.19,
      epic: 0.12,
      ultra_rare: 0.06,
      ultra_epic: 0.015,
      legendary: 0.006,
      mythical: 0.003,
      wdyft: 0.0015
    },
    specialEffect: 'Highest chance for ancient alien technology and extraterrestrial artifacts',
    rarity: 'epic'
  },

  shadow_market: {
    id: 'shadow_market',
    name: 'Shadow Market',
    description: 'An underground bazaar where forbidden items and dark magic are traded openly.',
    wtcReward: { min: 23, max: 75 },
    itemDropChances: {
      useless: 0.23,
      common: 0.17,
      uncommon: 0.19,
      rare: 0.16,
      epic: 0.085,
      ultra_rare: 0.043,
      ultra_epic: 0.01,
      legendary: 0.0043,
      mythical: 0.0021,
      wdyft: 0.0011
    },
    specialEffect: 'Higher chance for cursed items and black market goods',
    rarity: 'rare'
  },

  coral_reef_kingdom: {
    id: 'coral_reef_kingdom',
    name: 'Coral Reef Kingdom',
    description: 'A vibrant underwater kingdom built by intelligent sea creatures and protected by coral guardians.',
    wtcReward: { min: 19, max: 62 },
    itemDropChances: {
      useless: 0.27,
      common: 0.2,
      uncommon: 0.18,
      rare: 0.13,
      epic: 0.065,
      ultra_rare: 0.033,
      ultra_epic: 0.0075,
      legendary: 0.0033,
      mythical: 0.0017,
      wdyft: 0.0008
    },
    specialEffect: 'Higher chance for aquatic and coral-based items',
    rarity: 'uncommon'
  },

  mad_scientists_laboratory: {
    id: 'mad_scientists_laboratory',
    name: 'Mad Scientist\'s Laboratory',
    description: 'The chaotic workspace of a brilliant but unstable researcher, filled with experimental equipment.',
    wtcReward: { min: 25, max: 80 },
    itemDropChances: {
      useless: 0.22,
      common: 0.16,
      uncommon: 0.18,
      rare: 0.17,
      epic: 0.09,
      ultra_rare: 0.045,
      ultra_epic: 0.011,
      legendary: 0.0045,
      mythical: 0.0022,
      wdyft: 0.0011
    },
    specialEffect: 'Higher chance for experimental technology and unstable inventions',
    rarity: 'rare'
  },

  elemental_nexus_chamber: {
    id: 'elemental_nexus_chamber',
    name: 'Elemental Nexus Chamber',
    description: 'A chamber where the four classical elements converge, creating powerful elemental artifacts.',
    wtcReward: { min: 31, max: 102 },
    itemDropChances: {
      useless: 0.16,
      common: 0.1,
      uncommon: 0.13,
      rare: 0.18,
      epic: 0.15,
      ultra_rare: 0.075,
      ultra_epic: 0.019,
      legendary: 0.0075,
      mythical: 0.0037,
      wdyft: 0.0019
    },
    specialEffect: 'Guaranteed elemental artifacts with fire, water, earth, and air themes',
    rarity: 'epic'
  },

  virtual_reality_construct: {
    id: 'virtual_reality_construct',
    name: 'Virtual Reality Construct',
    description: 'A digital realm that has become partially real, containing VR artifacts and digital consciousness.',
    wtcReward: { min: 26, max: 85 },
    itemDropChances: {
      useless: 0.21,
      common: 0.15,
      uncommon: 0.17,
      rare: 0.18,
      epic: 0.1,
      ultra_rare: 0.05,
      ultra_epic: 0.012,
      legendary: 0.005,
      mythical: 0.0025,
      wdyft: 0.0012
    },
    specialEffect: 'Higher chance for digital artifacts and virtual reality equipment',
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
