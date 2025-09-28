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
