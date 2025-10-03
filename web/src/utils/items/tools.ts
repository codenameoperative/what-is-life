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
  },

  // Additional Common Tools
  duct_tape: {
    id: 'duct_tape',
    name: 'Duct Tape',
    tier: 'common',
    category: 'tools',
    description: 'The ultimate fix-all tool. "If it moves and shouldn\'t, use duct tape. If it doesn\'t move and should, use WD-40."',
    value: 8,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
  },
  zip_ties: {
    id: 'zip_ties',
    name: 'Zip Ties',
    tier: 'common',
    category: 'tools',
    description: 'Plastic ties for binding. "I\'ll zip tie you up!" Perfect for organizing cables or restraining opponents.',
    value: 5,
    usable: true,
    source: 'Found',
    breakChance: 0.05
  },
  safety_pin: {
    id: 'safety_pin',
    name: 'Safety Pin',
    tier: 'common',
    category: 'tools',
    description: 'A simple safety pin. "I\'ll pin you down!" Surprisingly versatile for repairs and minor injuries.',
    value: 3,
    usable: true,
    source: 'Found',
    breakChance: 0.1
  },
  rubber_gloves: {
    id: 'rubber_gloves',
    name: 'Rubber Gloves',
    tier: 'common',
    category: 'tools',
    description: 'Protective rubber gloves. "I\'ll glove you!" Essential for messy jobs or avoiding fingerprints.',
    value: 12,
    usable: true,
    source: 'Shop',
    breakChance: 0.03
  },

  // Additional Uncommon Tools
  multimeter: {
    id: 'multimeter',
    name: 'Multimeter',
    tier: 'uncommon',
    category: 'tools',
    description: 'Electronic testing device. "I\'ll meter out the truth!" For diagnosing electrical problems or cheating at electronics.',
    value: 180,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
  },
  soldering_iron: {
    id: 'soldering_iron',
    name: 'Soldering Iron',
    tier: 'uncommon',
    category: 'tools',
    description: 'For joining metals. "I\'ll solder your fate!" Hot enough to burn, cool enough to create.',
    value: 150,
    usable: true,
    source: 'Shop',
    breakChance: 0.03
  },
  wire_cutters: {
    id: 'wire_cutters',
    name: 'Wire Cutters',
    tier: 'uncommon',
    category: 'tools',
    description: 'For cutting wires. "I\'ll cut you off!" Perfect for sabotage or electrical work.',
    value: 120,
    usable: true,
    source: 'Shop',
    breakChance: 0.04
  },

  // Additional Rare Tools
  welding_torch: {
    id: 'welding_torch',
    name: 'Welding Torch',
    tier: 'rare',
    category: 'tools',
    description: 'High-temperature welding tool. "I\'ll weld you together!" For fusing metal or burning bridges (literally).',
    value: 800,
    usable: true,
    source: 'Shop',
    breakChance: 0.02,
    boost: {
      type: 'work',
      multiplier: 2.5,
      uses: 20
    }
  },
  angle_grinder: {
    id: 'angle_grinder',
    name: 'Angle Grinder',
    tier: 'rare',
    category: 'tools',
    description: 'High-speed cutting tool. "I\'ll grind you down!" The loudest way to say "I need to cut this."',
    value: 900,
    usable: true,
    source: 'Shop',
    breakChance: 0.03
  },

  // Additional Epic Tools
  plasma_cutter: {
    id: 'plasma_cutter',
    name: 'Plasma Cutter',
    tier: 'epic',
    category: 'tools',
    description: 'Cuts through metal like butter. "I\'ll plasma cut your plans!" The future of metalworking.',
    value: 2500,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.01
  },
  laser_level: {
    id: 'laser_level',
    name: 'Laser Level',
    tier: 'epic',
    category: 'tools',
    description: 'Precision laser measuring tool. "I\'ll level with you!" Perfect for straight lines and sci-fi vibes.',
    value: 2200,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.008
  },

  // Additional Legendary Tools
  thor_hammer: {
    id: 'thor_hammer',
    name: 'Mjolnir (Tool Version)',
    tier: 'legendary',
    category: 'tools',
    description: 'Thor\'s hammer as a construction tool. "I\'ll hammer you into shape!" Only works if you\'re worthy.',
    value: 5000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.001
  },
  excalibur_tool: {
    id: 'excalibur_tool',
    name: 'Excalibur (Tool Version)',
    tier: 'legendary',
    category: 'tools',
    description: 'The legendary sword repurposed as a cutting tool. "I\'ll ex-cali-bur through anything!"',
    value: 4800,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.001
  },

  // Additional Mythical Tools
  infinity_gauntlet_tool: {
    id: 'infinity_gauntlet_tool',
    name: 'Infinity Gauntlet (Tool Version)',
    tier: 'mythical',
    category: 'tools',
    description: 'The Infinity Gauntlet for universal construction. "I\'ll snap this project into existence!"',
    value: 10000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0001
  },

  // Additional WDYFT Tools
  codename_operative_toolkit: {
    id: 'codename_operative_toolkit',
    name: 'Codename Operative\'s Toolkit',
    tier: 'wdyft',
    category: 'tools',
    description: 'The ultimate toolkit from the codename operative. "I\'ll operative this fix!" Contains everything and nothing.',
    value: 50000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.00001
  }
}
