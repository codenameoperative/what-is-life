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
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    tier: 'common',
    category: 'clothing',
    description: 'A basic cotton t-shirt.',
    value: 15,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
  },
  jeans: {
    id: 'jeans',
    name: 'Jeans',
    tier: 'common',
    category: 'clothing',
    description: 'Durable denim pants.',
    value: 45,
    usable: true,
    source: 'Shop',
    breakChance: 0.015
  },
  socks: {
    id: 'socks',
    name: 'Socks',
    tier: 'common',
    category: 'clothing',
    description: 'A pair of cotton socks.',
    value: 8,
    usable: true,
    source: 'Shop',
    breakChance: 0.03
  },
  underwear: {
    id: 'underwear',
    name: 'Underwear',
    tier: 'common',
    category: 'clothing',
    description: 'Comfortable cotton underwear.',
    value: 12,
    usable: true,
    source: 'Shop',
    breakChance: 0.025
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    tier: 'common',
    category: 'clothing',
    description: 'A comfortable hooded sweatshirt.',
    value: 35,
    usable: true,
    source: 'Shop',
    breakChance: 0.012
  },
  sneakers: {
    id: 'sneakers',
    name: 'Sneakers',
    tier: 'common',
    category: 'clothing',
    description: 'Comfortable athletic shoes.',
    value: 50,
    usable: true,
    source: 'Shop',
    breakChance: 0.018
  },
  baseball_cap: {
    id: 'baseball_cap',
    name: 'Baseball Cap',
    tier: 'common',
    category: 'clothing',
    description: 'A simple cotton baseball cap.',
    value: 20,
    usable: true,
    source: 'Shop',
    breakChance: 0.025
  },
  scarf: {
    id: 'scarf',
    name: 'Scarf',
    tier: 'common',
    category: 'clothing',
    description: 'A warm wool scarf.',
    value: 25,
    usable: true,
    source: 'Shop',
    breakChance: 0.015
  },
  gloves: {
    id: 'gloves',
    name: 'Gloves',
    tier: 'common',
    category: 'clothing',
    description: 'A pair of wool gloves.',
    value: 18,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
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
  },
  leather_jacket: {
    id: 'leather_jacket',
    name: 'Leather Jacket',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A stylish leather jacket.',
    value: 120,
    usable: true,
    source: 'Shop',
    breakChance: 0.006
  },
  boots: {
    id: 'boots',
    name: 'Boots',
    tier: 'uncommon',
    category: 'clothing',
    description: 'Durable leather boots.',
    value: 80,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },
  dress_shirt: {
    id: 'dress_shirt',
    name: 'Dress Shirt',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A formal button-up shirt.',
    value: 65,
    usable: true,
    source: 'Shop',
    breakChance: 0.012
  },
  dress_pants: {
    id: 'dress_pants',
    name: 'Dress Pants',
    tier: 'uncommon',
    category: 'clothing',
    description: 'Formal trousers.',
    value: 75,
    usable: true,
    source: 'Shop',
    breakChance: 0.008
  },
  sweater: {
    id: 'sweater',
    name: 'Sweater',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A warm knitted sweater.',
    value: 55,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },
  winter_coat: {
    id: 'winter_coat',
    name: 'Winter Coat',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A heavy winter coat.',
    value: 100,
    usable: true,
    source: 'Shop',
    breakChance: 0.005
  },
  rain_jacket: {
    id: 'rain_jacket',
    name: 'Rain Jacket',
    tier: 'uncommon',
    category: 'clothing',
    description: 'Waterproof outerwear.',
    value: 85,
    usable: true,
    source: 'Shop',
    breakChance: 0.007
  },
  beanie: {
    id: 'beanie',
    name: 'Beanie',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A warm knit hat.',
    value: 25,
    usable: true,
    source: 'Shop',
    breakChance: 0.015
  },
  belt: {
    id: 'belt',
    name: 'Belt',
    tier: 'uncommon',
    category: 'clothing',
    description: 'A leather belt.',
    value: 35,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
  },

  // Rare Clothing
  suit: {
    id: 'suit',
    name: 'Business Suit',
    tier: 'rare',
    category: 'clothing',
    description: 'A tailored business suit.',
    value: 200,
    usable: true,
    source: 'Shop',
    breakChance: 0.004
  },
  evening_gown: {
    id: 'evening_gown',
    name: 'Evening Gown',
    tier: 'rare',
    category: 'clothing',
    description: 'An elegant formal dress.',
    value: 180,
    usable: true,
    source: 'Shop',
    breakChance: 0.005
  },
  tuxedo: {
    id: 'tuxedo',
    name: 'Tuxedo',
    tier: 'rare',
    category: 'clothing',
    description: 'A formal tuxedo.',
    value: 220,
    usable: true,
    source: 'Shop',
    breakChance: 0.003
  },
  cashmere_sweater: {
    id: 'cashmere_sweater',
    name: 'Cashmere Sweater',
    tier: 'rare',
    category: 'clothing',
    description: 'Luxuriously soft cashmere.',
    value: 150,
    usable: true,
    source: 'Shop',
    breakChance: 0.006
  },
  designer_jeans: {
    id: 'designer_jeans',
    name: 'Designer Jeans',
    tier: 'rare',
    category: 'clothing',
    description: 'Premium denim jeans.',
    value: 130,
    usable: true,
    source: 'Shop',
    breakChance: 0.008
  },
  leather_boots: {
    id: 'leather_boots',
    name: 'Leather Boots',
    tier: 'rare',
    category: 'clothing',
    description: 'Handcrafted leather boots.',
    value: 160,
    usable: true,
    source: 'Shop',
    breakChance: 0.004
  },
  silk_blouse: {
    id: 'silk_blouse',
    name: 'Silk Blouse',
    tier: 'rare',
    category: 'clothing',
    description: 'A luxurious silk blouse.',
    value: 140,
    usable: true,
    source: 'Shop',
    breakChance: 0.007
  },
  wool_overcoat: {
    id: 'wool_overcoat',
    name: 'Wool Overcoat',
    tier: 'rare',
    category: 'clothing',
    description: 'A warm wool overcoat.',
    value: 190,
    usable: true,
    source: 'Shop',
    breakChance: 0.003
  },
  fedora: {
    id: 'fedora',
    name: 'Fedora',
    tier: 'rare',
    category: 'clothing',
    description: 'A stylish felt fedora.',
    value: 80,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },
  diamond_watch: {
    id: 'diamond_watch',
    name: 'Diamond Watch',
    tier: 'rare',
    category: 'clothing',
    description: 'A luxury watch with diamonds.',
    value: 500,
    usable: true,
    source: 'Shop',
    breakChance: 0.001
  },

  // Epic Clothing
  golden_suit: {
    id: 'golden_suit',
    name: 'Golden Suit',
    tier: 'epic',
    category: 'clothing',
    description: 'A suit made of pure gold thread.',
    value: 800,
    usable: true,
    source: 'Shop',
    breakChance: 0.002
  },
  diamond_dress: {
    id: 'diamond_dress',
    name: 'Diamond Dress',
    tier: 'epic',
    category: 'clothing',
    description: 'A dress encrusted with diamonds.',
    value: 750,
    usable: true,
    source: 'Shop',
    breakChance: 0.003
  },
  platinum_tuxedo: {
    id: 'platinum_tuxedo',
    name: 'Platinum Tuxedo',
    tier: 'epic',
    category: 'clothing',
    description: 'A tuxedo with platinum accents.',
    value: 900,
    usable: true,
    source: 'Shop',
    breakChance: 0.001
  },
  mink_coat: {
    id: 'mink_coat',
    name: 'Mink Coat',
    tier: 'epic',
    category: 'clothing',
    description: 'A luxurious mink fur coat.',
    value: 1200,
    usable: true,
    source: 'Shop',
    breakChance: 0.002
  },
  ruby_necklace: {
    id: 'ruby_necklace',
    name: 'Ruby Necklace',
    tier: 'epic',
    category: 'clothing',
    description: 'A necklace with genuine rubies.',
    value: 600,
    usable: true,
    source: 'Shop',
    breakChance: 0.001
  },

  // Legendary Clothing
  emperors_robes: {
    id: 'emperors_robes',
    name: 'Emperor\'s Robes',
    tier: 'legendary',
    category: 'clothing',
    description: 'Robes worn by ancient emperors.',
    value: 2500,
    usable: true,
    source: 'Shop',
    breakChance: 0.0005
  },
  crown_jewels: {
    id: 'crown_jewels',
    name: 'Crown Jewels',
    tier: 'legendary',
    category: 'clothing',
    description: 'The legendary British Crown Jewels.',
    value: 5000,
    usable: true,
    source: 'Shop',
    breakChance: 0.0001
  },

  // Mythical Clothing
  gods_armor: {
    id: 'gods_armor',
    name: 'God\'s Armor',
    tier: 'mythical',
    category: 'clothing',
    description: 'Armor blessed by the gods themselves.',
    value: 10000,
    usable: true,
    source: 'Shop',
    breakChance: 0.00005
  },
  phoenix_feather_cloak: {
    id: 'phoenix_feather_cloak',
    name: 'Phoenix Feather Cloak',
    tier: 'mythical',
    category: 'clothing',
    description: 'A cloak made from phoenix feathers.',
    value: 15000,
    usable: true,
    source: 'Shop',
    breakChance: 0.00002
  },

  // WDYFT Clothing
  codename_operative_suit: {
    id: 'codename_operative_suit',
    name: 'Codename Operative\'s Suit',
    tier: 'wdyft',
    category: 'clothing',
    description: 'The signature suit of the codename operative.',
    value: 50000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.00001
  }
}
