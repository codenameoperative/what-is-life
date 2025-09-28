// Item Tiers
export type ItemTier =
  | 'useless'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythical'
  | 'wdyft'

// Item categories
export type ItemCategory = 'weapons' | 'tools' | 'clothing' | 'collectables' | 'animals' | 'fish' | 'ores'

// Item interface - Base template for all items
export interface Item {
  id: string
  name: string
  tier: ItemTier
  category: ItemCategory
  description: string
  value: number
  usable: boolean
  source: string // Where did you find this? (WDYFT)
  breakChance: number // 0.0 - 1.0 chance of breaking per use
  maxDurability?: number // Maximum durability for items that can break
  icon?: string // Emoji or icon representation
  boost?: {
    type: 'work' | 'search'
    multiplier: number
    uses: number
  }
  craftable?: boolean
  recipe?: {
    requiredItems: Record<string, number>
  }
}

// Owned item type used in inventory
export type OwnedItem = {
  id: string
  quantity?: number // Stackable items have quantity, non-stackable default to 1
  durability?: number // Current durability for breakable items
}

// Item registry to store all registered items
const itemRegistry: Record<string, Item> = {}

// Function to register items from category files into the main registry
const registerItems = (items: Record<string, Item>) => {
  Object.assign(itemRegistry, items)
}

// Helper function to check if an item is stackable
export const isStackable = (item: Item): boolean => {
  return ['animals', 'clothing', 'collectables', 'ores'].includes(item.category)
}

// Helper function to get default quantity for stackable items
export const getDefaultQuantity = (item: Item): number => {
  return isStackable(item) ? 1 : 1 // Default to 1 for all items initially
}

// Export the registered items
export const items = itemRegistry

// Import and register all category items
import { weaponsItems } from './weapons'
import { toolsItems } from './tools'
import { clothingItems } from './clothing'
import { collectablesItems } from './collectables'
import { animalsItems } from './animals'
import { fishItems } from './fish'
import { oresItems } from './ores'
import { carsItems } from './cars'

// Register all items
registerItems(weaponsItems)
registerItems(toolsItems)
registerItems(clothingItems)
registerItems(collectablesItems)
registerItems(animalsItems)
registerItems(fishItems)
registerItems(oresItems)
registerItems(carsItems)
