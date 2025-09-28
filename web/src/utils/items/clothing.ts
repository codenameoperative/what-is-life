// Clothing Category Items
import { type Item } from './index'

export const clothingItems: Record<string, Item> = {
  // Common Clothing
  blanket_common: {
    id: 'blanket_common',
    name: 'Blanket',
    tier: 'common',
    category: 'clothing',
    description: 'Warm.',
    value: 30,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },

  // Uncommon Clothing
  padded_jacket: {
    id: 'padded_jacket',
    name: 'Padded Jacket',
    tier: 'uncommon',
    category: 'clothing',
    description: 'Sturdy jacket.',
    value: 90,
    usable: true,
    source: 'Shop',
    breakChance: 0.008
  }
}
