// Digging locations with ore drop chances and requirements
export const diggingLocations = {
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'A lush forest with rich soil. Good for beginners.',
    oreDropChances: {
      common: 0.4,
      uncommon: 0.3,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    chestChance: 0.12,
    requiredItemId: undefined, // No requirement for forest
    rarity: 'common' as const
  },
  cave: {
    id: 'cave',
    name: 'Cave',
    description: 'A deep cave system with mineral-rich walls.',
    oreDropChances: {
      common: 0.25,
      uncommon: 0.25,
      rare: 0.25,
      epic: 0.15,
      legendary: 0.06,
      mythical: 0.03,
      wdyft: 0.01
    },
    chestChance: 0.18,
    requiredItemId: 'pickaxe', // Requires pickaxe for cave
    rarity: 'uncommon' as const
  },
  backyard: {
    id: 'backyard',
    name: 'Backyard',
    description: 'Your own backyard with some hidden treasures.',
    oreDropChances: {
      common: 0.5,
      uncommon: 0.25,
      rare: 0.15,
      epic: 0.07,
      legendary: 0.025,
      mythical: 0.01,
      wdyft: 0.005
    },
    chestChance: 0.08,
    requiredItemId: undefined, // No requirement for backyard
    rarity: 'common' as const
  }
}
