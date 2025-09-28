// ========================================
// TEMPLATE FOR ADDING NEW ITEMS
// ========================================
// Copy and modify this template to add new items to any category

// For WEAPONS (weapons.ts):
// {
//   id: 'unique_id',
//   name: 'Display Name',
//   tier: 'common', // useless | common | uncommon | rare | epic | ultra_rare | ultra_epic | legendary | mythical | wdyft
//   category: 'weapons',
//   description: 'Item description',
//   value: 100, // WTC value
//   usable: true, // Can be used (durability will be consumed)
//   source: 'Shop', // Shop | Found | Crafted | WDYFT
//   maxDurability: 100, // 0 = infinite durability
//   breakChance: 0.02 // 0.0 - 1.0 chance per use
// }

// For TOOLS (tools.ts):
// {
//   id: 'unique_id',
//   name: 'Display Name',
//   tier: 'common',
//   category: 'tools',
//   description: 'Item description',
//   value: 100,
//   usable: true,
//   source: 'Shop',
//   maxDurability: 100,
//   breakChance: 0.02,
//   boost?: { // Optional boost for work/search
//     type: 'work', // 'work' | 'search'
//     amount: 1.2 // multiplier (1.2 = 20% boost)
//   }
// }

// For CLOTHING (clothing.ts):
// {
//   id: 'unique_id',
//   name: 'Display Name',
//   tier: 'common',
//   category: 'clothing',
//   description: 'Item description',
//   value: 100,
//   usable: true,
//   source: 'Shop',
//   maxDurability: 100,
//   breakChance: 0.02
// }

// For COLLECTABLES (collectables.ts):
// {
//   id: 'unique_id',
//   name: 'Display Name',
//   tier: 'common',
//   category: 'collectables',
//   description: 'Item description',
//   value: 100,
//   usable: false, // Most collectables are not usable
//   source: 'Found', // Found | WDYFT
//   maxDurability: 0, // Usually 0 for collectables
//   breakChance: 0
// }

// ========================================
// ADDING CRAFTABLE ITEMS
// ========================================
// For craftable items, add these properties:
// craftable: true,
// recipe: {
//   requiredItems: {
//     'item_id': 2, // item ID -> quantity needed
//     'another_item': 1
//   }
// }

// ========================================
// ADDING ITEMS WITH SPECIAL PROPERTIES
// ========================================
// Items can have various special properties:
// - boost: { type: 'work' | 'search', amount: number }
// - craftable: boolean
// - recipe: { requiredItems: Record<string, number> }
// - maxDurability: number (0 = infinite)
// - breakChance: number (0.0 - 1.0)
// - usable: boolean

// ========================================
// IMPORTANT NOTES
// ========================================
// 1. Each item needs a unique ID
// 2. Choose the appropriate tier based on rarity/value
// 3. Set usable to false for collectables that shouldn't be consumed
// 4. Use maxDurability: 0 for items that don't break
// 5. Add to the correct category file
// 6. Import and register in the category file
// 7. Test the item in-game after adding

export const itemTemplates = {
  basicWeapon: {
    id: 'unique_id',
    name: 'Display Name',
    tier: 'common',
    category: 'weapons',
    description: 'Item description',
    value: 100,
    usable: true,
    source: 'Shop',
    maxDurability: 100,
    breakChance: 0.02
  },

  basicTool: {
    id: 'unique_id',
    name: 'Display Name',
    tier: 'common',
    category: 'tools',
    description: 'Item description',
    value: 100,
    usable: true,
    source: 'Shop',
    maxDurability: 100,
    breakChance: 0.02
  },

  basicClothing: {
    id: 'unique_id',
    name: 'Display Name',
    tier: 'common',
    category: 'clothing',
    description: 'Item description',
    value: 100,
    usable: true,
    source: 'Shop',
    maxDurability: 100,
    breakChance: 0.02
  },

  basicCollectable: {
    id: 'unique_id',
    name: 'Display Name',
    tier: 'common',
    category: 'collectables',
    description: 'Item description',
    value: 100,
    usable: false,
    source: 'Found',
    maxDurability: 0,
    breakChance: 0
  }
}

// Garden Plant Template
export const gardenPlantTemplate = {
  id: 'plant_id',
  name: 'Plant Name',
  description: 'Description of the plant.',
  growthTime: 60, // seconds to grow
  waterNeeded: 3, // times it needs to be watered
  yield: { min: 1, max: 3 }, // harvest yield range
  value: 25, // value per unit
  tier: 'common|uncommon|rare|epic|legendary|mythical',
  requirements: 'Special requirements for growing this plant'
}
