// Tools Category Items
import { type Item } from './index'

export const toolsItems: Record<string, Item> = {
  // Common Tools
  fishing_rod: {
    id: 'fishing_rod',
    name: 'Fishing Rod',
    tier: 'common',
    category: 'tools',
    description: 'Simple rod.',
    value: 30,
    usable: true,
    source: 'Shop',
    breakChance: 0.01,
    craftable: true,
    recipe: {
      requiredItems: {
        'sharpened_stick': 1,
        'usb_cable': 1
      }
    }
  },
  hunting_rifle: {
    id: 'hunting_rifle',
    name: 'Hunting Rifle',
    tier: 'common',
    category: 'tools',
    description: 'Basic rifle for hunting.',
    value: 50,
    usable: true,
    source: 'Shop',
    breakChance: 0.01,
    craftable: true,
    recipe: {
      requiredItems: {
        'rusty_dagger': 1,
        'usb_cable': 1,
        'broken_glass': 2
      }
    }
  },
  shovel: {
    id: 'shovel',
    name: 'Shovel',
    tier: 'common',
    category: 'tools',
    description: 'For digging.',
    value: 40,
    usable: true,
    source: 'Shop',
    breakChance: 0.01,
    craftable: true,
    recipe: {
      requiredItems: {
        'sharpened_stick': 2,
        'empty_bottle': 1
      }
    }
  },
  phone: {
    id: 'phone',
    name: 'Phone',
    tier: 'common',
    category: 'tools',
    description: 'Smartphone for posting memes.',
    value: 100,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },
  usb_cable: {
    id: 'usb_cable',
    name: 'USB Cable',
    tier: 'common',
    category: 'tools',
    description: 'Cable.',
    value: 15,
    usable: true,
    source: 'Shop',
    breakChance: 0.006
  },

  // Uncommon Tools
  steel_pickaxe: {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    tier: 'uncommon',
    category: 'tools',
    description: 'Tough pickaxe.',
    value: 120,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },

  // Rare Tools
  toolkit_pro: {
    id: 'toolkit_pro',
    name: 'Pro Toolkit',
    tier: 'rare',
    category: 'tools',
    description: 'Pro tools.',
    value: 260,
    usable: true,
    source: 'Shop',
    breakChance: 0.007
  },
  titan_hammer: {
    id: 'titan_hammer',
    name: 'Titan Hammer',
    tier: 'rare',
    category: 'tools',
    description: 'Heavy hammer with immense force.',
    value: 1100,
    usable: true,
    source: 'Shop',
    breakChance: 0.006
  },

  // Epic Tools
  precision_drill: {
    id: 'precision_drill',
    name: 'Precision Drill',
    tier: 'epic',
    category: 'tools',
    description: 'High-end drill.',
    value: 750,
    usable: true,
    source: 'Shop',
    breakChance: 0.004
  },
  quantum_driver: {
    id: 'quantum_driver',
    name: 'Quantum Driver',
    tier: 'epic',
    category: 'tools',
    description: 'Quantum-tuned driver.',
    value: 2000,
    usable: true,
    source: 'Shop',
    breakChance: 0.003
  },

  // Legendary Tools
  master_toolkit: {
    id: 'master_toolkit',
    name: 'Master Toolkit',
    tier: 'legendary',
    category: 'tools',
    description: 'Pinnacle of craftsmanship.',
    value: 3200,
    usable: true,
    source: 'Shop',
    breakChance: 0.002
  },

  // Mythical Tools
  time_warp_device: {
    id: 'time_warp_device',
    name: 'Time Warp Device',
    tier: 'mythical',
    category: 'tools',
    description: 'Skips the grind (figuratively).',
    value: 4800,
    usable: true,
    source: 'Shop',
    breakChance: 0.002
  },

  scarecrow: {
    id: 'scarecrow',
    name: 'Scarecrow',
    tier: 'rare',
    category: 'tools',
    description: 'Protects garden from pests and wild animals. Reduces crop loss chance by 80%.',
    value: 800,
    usable: false,
    source: 'Shop',
    breakChance: 0.05,
    boost: {
      type: 'work' as const,
      multiplier: 1.0,
      uses: 50
    }
  }
}
