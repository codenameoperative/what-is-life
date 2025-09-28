export interface CrimeLocation {
  id: string
  name: string
  description: string
  // Base WTC reward range
  wtcReward: {
    min: number
    max: number
  }
  // Chance of getting caught (0.0 to 1.0) - if caught, lose coins
  caughtChance: number
  // Chance to get items (0.0 to 1.0)
  itemChance: number
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
  // Risk level
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
}

// All available crime locations
export const crimeLocations: Record<string, CrimeLocation> = {
  pickpocketing_tourist: {
    id: 'pickpocketing_tourist',
    name: 'Pickpocketing Tourist',
    description: 'A distracted tourist with a bulging wallet - easy target but low reward.',
    wtcReward: { min: 10, max: 50 },
    caughtChance: 0.15,
    itemChance: 0.2,
    itemDropChances: {
      useless: 0.4,
      common: 0.3,
      uncommon: 0.15,
      rare: 0.08,
      epic: 0.04,
      ultra_rare: 0.02,
      ultra_epic: 0.005,
      legendary: 0.002,
      mythical: 0.001,
      wdyft: 0.0005
    },
    riskLevel: 'low'
  },

  shoplifting_convenience_store: {
    id: 'shoplifting_convenience_store',
    name: 'Shoplifting Convenience Store',
    description: 'Quick grab and dash from a local convenience store.',
    wtcReward: { min: 20, max: 80 },
    caughtChance: 0.25,
    itemChance: 0.3,
    itemDropChances: {
      useless: 0.35,
      common: 0.25,
      uncommon: 0.18,
      rare: 0.1,
      epic: 0.05,
      ultra_rare: 0.025,
      ultra_epic: 0.008,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0007
    },
    riskLevel: 'low'
  },

  burglary_vacation_home: {
    id: 'burglary_vacation_home',
    name: 'Burglary Vacation Home',
    description: 'An empty vacation home with potential valuables inside.',
    wtcReward: { min: 100, max: 300 },
    caughtChance: 0.35,
    itemChance: 0.4,
    itemDropChances: {
      useless: 0.2,
      common: 0.2,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.01,
      legendary: 0.005,
      mythical: 0.002,
      wdyft: 0.001
    },
    riskLevel: 'medium'
  },

  hacking_atm: {
    id: 'hacking_atm',
    name: 'Hacking ATM',
    description: 'Digital intrusion into an ATM for quick cash extraction.',
    wtcReward: { min: 150, max: 400 },
    caughtChance: 0.4,
    itemChance: 0.15,
    itemDropChances: {
      useless: 0.3,
      common: 0.2,
      uncommon: 0.15,
      rare: 0.12,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.006,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0008
    },
    riskLevel: 'medium'
  },

  bank_robbery: {
    id: 'bank_robbery',
    name: 'Bank Robbery',
    description: 'High-stakes robbery of a local bank branch.',
    wtcReward: { min: 500, max: 1500 },
    caughtChance: 0.6,
    itemChance: 0.3,
    itemDropChances: {
      useless: 0.1,
      common: 0.15,
      uncommon: 0.18,
      rare: 0.2,
      epic: 0.12,
      ultra_rare: 0.06,
      ultra_epic: 0.015,
      legendary: 0.008,
      mythical: 0.003,
      wdyft: 0.0015
    },
    riskLevel: 'high'
  },

  corporate_espionage: {
    id: 'corporate_espionage',
    name: 'Corporate Espionage',
    description: 'Infiltrating corporate offices for valuable data and assets.',
    wtcReward: { min: 300, max: 1000 },
    caughtChance: 0.5,
    itemChance: 0.5,
    itemDropChances: {
      useless: 0.15,
      common: 0.15,
      uncommon: 0.2,
      rare: 0.18,
      epic: 0.1,
      ultra_rare: 0.05,
      ultra_epic: 0.012,
      legendary: 0.006,
      mythical: 0.0025,
      wdyft: 0.0012
    },
    riskLevel: 'high'
  },

  art_theft_museum: {
    id: 'art_theft_museum',
    name: 'Art Theft Museum',
    description: 'Stealing priceless artwork from a high-security museum.',
    wtcReward: { min: 800, max: 2000 },
    caughtChance: 0.7,
    itemChance: 0.4,
    itemDropChances: {
      useless: 0.05,
      common: 0.1,
      uncommon: 0.15,
      rare: 0.2,
      epic: 0.15,
      ultra_rare: 0.08,
      ultra_epic: 0.02,
      legendary: 0.01,
      mythical: 0.004,
      wdyft: 0.002
    },
    riskLevel: 'extreme'
  },

  casino_heist: {
    id: 'casino_heist',
    name: 'Casino Heist',
    description: 'Elaborate heist targeting a high-roller casino vault.',
    wtcReward: { min: 1000, max: 3000 },
    caughtChance: 0.75,
    itemChance: 0.35,
    itemDropChances: {
      useless: 0.08,
      common: 0.12,
      uncommon: 0.15,
      rare: 0.18,
      epic: 0.15,
      ultra_rare: 0.08,
      ultra_epic: 0.018,
      legendary: 0.009,
      mythical: 0.0035,
      wdyft: 0.0018
    },
    riskLevel: 'extreme'
  },

  jewelry_store_smash_and_grab: {
    id: 'jewelry_store_smash_and_grab',
    name: 'Jewelry Store Smash and Grab',
    description: 'Fast and furious smash-and-grab at an upscale jewelry store.',
    wtcReward: { min: 400, max: 1200 },
    caughtChance: 0.55,
    itemChance: 0.45,
    itemDropChances: {
      useless: 0.12,
      common: 0.18,
      uncommon: 0.2,
      rare: 0.16,
      epic: 0.1,
      ultra_rare: 0.05,
      ultra_epic: 0.012,
      legendary: 0.006,
      mythical: 0.0025,
      wdyft: 0.0013
    },
    riskLevel: 'high'
  },

  drug_trafficking_operation: {
    id: 'drug_trafficking_operation',
    name: 'Drug Trafficking Operation',
    description: 'High-risk involvement in an underground drug operation.',
    wtcReward: { min: 200, max: 800 },
    caughtChance: 0.8,
    itemChance: 0.25,
    itemDropChances: {
      useless: 0.25,
      common: 0.2,
      uncommon: 0.15,
      rare: 0.12,
      epic: 0.08,
      ultra_rare: 0.04,
      ultra_epic: 0.006,
      legendary: 0.003,
      mythical: 0.0015,
      wdyft: 0.0008
    },
    riskLevel: 'extreme'
  }
}

// =====================================================
// TEMPLATE FOR ADDING NEW CRIMES
// =====================================================
// Copy and paste this template to add new crimes:

/*
new_crime_id: {
  id: 'new_crime_id',
  name: 'New Crime Name',
  description: 'Description of what this crime involves.',
  wtcReward: { min: 50, max: 200 },
  caughtChance: 0.25, // 25% chance of getting caught
  itemChance: 0.3, // 30% chance of finding items
  itemDropChances: {
    useless: 0.4,
    common: 0.25,
    uncommon: 0.15,
    rare: 0.1,
    epic: 0.05,
    ultra_rare: 0.025,
    ultra_epic: 0.008,
    legendary: 0.003,
    mythical: 0.0015,
    wdyft: 0.0008
  },
  riskLevel: 'medium' // 'low' | 'medium' | 'high' | 'extreme'
},
*/

// =====================================================

// Helper function to get random crimes
export function getRandomCrimes(count: number = 3): CrimeLocation[] {
  const crimes = Object.values(crimeLocations)
  const shuffled = [...crimes].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
