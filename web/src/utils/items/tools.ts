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

  // Job-specific tools and equipment
  basic_toolkit: {
    id: 'basic_toolkit',
    name: 'Basic Toolkit',
    tier: 'common',
    category: 'tools',
    description: 'Essential tools for basic repairs and maintenance. Contains screwdriver, pliers, and wrenches.',
    value: 75,
    usable: true,
    source: 'Shop',
    breakChance: 0.02,
    craftable: true,
    recipe: {
      requiredItems: {
        'screwdriver': 1,
        'pliers': 1,
        'wrench': 1,
        'hammer': 1
      }
    }
  },
  knife_set: {
    id: 'knife_set',
    name: 'Professional Knife Set',
    tier: 'uncommon',
    category: 'tools',
    description: 'High-quality chef knives for food preparation. Essential for culinary professionals.',
    value: 150,
    usable: true,
    source: 'Shop',
    breakChance: 0.005,
    boost: {
      type: 'work',
      multiplier: 1.2,
      uses: 50
    }
  },
  hard_hat: {
    id: 'hard_hat',
    name: 'Construction Hard Hat',
    tier: 'common',
    category: 'tools',
    description: 'Safety helmet for construction sites. Protects against falling objects.',
    value: 45,
    usable: true,
    source: 'Shop',
    breakChance: 0.01
  },
  electrical_kit: {
    id: 'electrical_kit',
    name: 'Electrical Repair Kit',
    tier: 'uncommon',
    category: 'tools',
    description: 'Tools for electrical work including multimeter, wire cutters, and electrical tape.',
    value: 200,
    usable: true,
    source: 'Shop',
    breakChance: 0.015,
    boost: {
      type: 'work',
      multiplier: 1.25,
      uses: 30
    }
  },
  plumbing_tools: {
    id: 'plumbing_tools',
    name: 'Plumbing Tool Set',
    tier: 'uncommon',
    category: 'tools',
    description: 'Specialized tools for plumbing work including pipe wrenches and drain snakes.',
    value: 180,
    usable: true,
    source: 'Shop',
    breakChance: 0.02,
    boost: {
      type: 'work',
      multiplier: 1.3,
      uses: 25
    }
  },
  welding_equipment: {
    id: 'welding_equipment',
    name: 'Welding Equipment',
    tier: 'rare',
    category: 'tools',
    description: 'Professional welding gear including helmet, gloves, and welding machine.',
    value: 350,
    usable: true,
    source: 'Shop',
    breakChance: 0.008,
    boost: {
      type: 'work',
      multiplier: 1.4,
      uses: 20
    }
  },
  medical_license: {
    id: 'medical_license',
    name: 'Medical License',
    tier: 'rare',
    category: 'tools',
    description: 'Official certification allowing medical practice and pharmacy work.',
    value: 500,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },
  cdl_license: {
    id: 'cdl_license',
    name: 'Commercial Driver\'s License',
    tier: 'rare',
    category: 'tools',
    description: 'License required for operating commercial vehicles and trucks.',
    value: 300,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },

  // Professional certifications and degrees
  medical_degree: {
    id: 'medical_degree',
    name: 'Medical Degree (MD)',
    tier: 'epic',
    category: 'tools',
    description: 'Advanced medical degree allowing surgical practice and high-level healthcare.',
    value: 2000,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },
  law_degree: {
    id: 'law_degree',
    name: 'Law Degree (JD)',
    tier: 'epic',
    category: 'tools',
    description: 'Juris Doctor degree for legal practice and courtroom representation.',
    value: 1800,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },
  computer_science_degree: {
    id: 'computer_science_degree',
    name: 'Computer Science Degree',
    tier: 'epic',
    category: 'tools',
    description: 'Bachelor\'s degree in computer science for software development roles.',
    value: 1500,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },
  finance_degree: {
    id: 'finance_degree',
    name: 'Finance Degree',
    tier: 'epic',
    category: 'tools',
    description: 'Degree in finance for investment banking and financial management.',
    value: 2200,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },
  architecture_degree: {
    id: 'architecture_degree',
    name: 'Architecture Degree',
    tier: 'epic',
    category: 'tools',
    description: 'Professional degree in architecture for building design and construction oversight.',
    value: 1600,
    usable: false,
    source: 'Achievement',
    breakChance: 0
  },

  // Additional WDYFT Tools
  codename_operative_toolkit: {
    id: 'codename_operative_toolkit',
    name: 'Codename Operative\'s Toolkit',
    tier: 'wdyft',
    category: 'tools',
    description: 'A mysterious toolkit that seems to contain tools for every situation.',
    value: 10000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0,
    icon: '🛠️'
  },

  // NEW TOOLS - Enhanced Toolkit

  // Uncommon Tools
  digital_multimeter: {
    id: 'digital_multimeter',
    name: 'Digital Multimeter',
    tier: 'uncommon',
    category: 'tools',
    description: 'Professional electrical testing tool for precise measurements and diagnostics.',
    value: 180,
    usable: true,
    source: 'Shop',
    breakChance: 0.02,
    boost: {
      type: 'work',
      multiplier: 1.25,
      uses: 50
    },
    icon: '🔋'
  },
  professional_camera: {
    id: 'professional_camera',
    name: 'Professional Camera',
    tier: 'uncommon',
    category: 'tools',
    description: 'High-end DSLR camera for capturing stunning photographs and videos.',
    value: 250,
    usable: true,
    source: 'Shop',
    breakChance: 0.015,
    boost: {
      type: 'search',
      multiplier: 1.3,
      uses: 40
    },
    icon: '📷'
  },
  smart_watch: {
    id: 'smart_watch',
    name: 'Smart Watch',
    tier: 'uncommon',
    category: 'tools',
    description: 'Advanced wearable technology for tracking activities and notifications.',
    value: 220,
    usable: true,
    source: 'Shop',
    breakChance: 0.01,
    icon: '⌚'
  },

  // Rare Tools
  quantum_computer: {
    id: 'quantum_computer',
    name: 'Quantum Computer',
    tier: 'rare',
    category: 'tools',
    description: 'Revolutionary computing device that can solve impossible problems in seconds.',
    value: 800,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.005,
    boost: {
      type: 'work',
      multiplier: 2.0,
      uses: 25
    },
    icon: '💻'
  },
  molecular_assembler: {
    id: 'molecular_assembler',
    name: 'Molecular Assembler',
    tier: 'rare',
    category: 'tools',
    description: 'Nanotechnology device that can assemble items at the molecular level.',
    value: 1200,
    usable: true,
    source: 'Crafting',
    breakChance: 0.002,
    icon: '🧬'
  },

  // Epic Tools
  time_dilation_device: {
    id: 'time_dilation_device',
    name: 'Time Dilation Device',
    tier: 'epic',
    category: 'tools',
    description: 'Experimental device that can slow down or speed up time in localized areas.',
    value: 3000,
    usable: true,
    source: 'Quest',
    breakChance: 0.001,
    boost: {
      type: 'work',
      multiplier: 3.0,
      uses: 10
    },
    icon: '⏰'
  },
  neural_interface: {
    id: 'neural_interface',
    name: 'Neural Interface',
    tier: 'epic',
    category: 'tools',
    description: 'Direct brain-computer interface for enhanced mental capabilities and control.',
    value: 4500,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0005,
    boost: {
      type: 'search',
      multiplier: 2.5,
      uses: 15
    },
    icon: '🧠'
  },

  // Legendary Tools
  reality_engine: {
    id: 'reality_engine',
    name: 'Reality Engine',
    tier: 'legendary',
    category: 'tools',
    description: 'A device capable of manipulating the fundamental laws of physics.',
    value: 15000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0001,
    boost: {
      type: 'work',
      multiplier: 5.0,
      uses: 5
    },
    icon: '🌌'
  },
  consciousness_uploader: {
    id: 'consciousness_uploader',
    name: 'Consciousness Uploader',
    tier: 'legendary',
    category: 'tools',
    description: 'Technology that can digitize and upload consciousness to the digital realm.',
    value: 25000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.00005,
    icon: '☁️'
  },

  // Mythical Tools
  universe_simulator: {
    id: 'universe_simulator',
    name: 'Universe Simulator',
    tier: 'mythical',
    category: 'tools',
    description: 'A computer that can simulate entire universes and predict any outcome.',
    value: 50000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.00001,
    boost: {
      type: 'work',
      multiplier: 10.0,
      uses: 3
    },
    icon: '🌍'
  },

  // WDYFT Tools
  developer_console: {
    id: 'developer_console',
    name: 'Developer Console',
    tier: 'wdyft',
    category: 'tools',
    description: 'The ultimate debugging tool that can modify reality itself. "console.log(\'Hello, Universe\');"',
    value: 100000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.000001,
    icon: '💻'
  },
  existence_compiler: {
    id: 'existence_compiler',
    name: 'Existence Compiler',
    tier: 'wdyft',
    category: 'tools',
    description: 'A compiler that can compile existence itself. Warning: May cause stack overflow in reality.',
    value: 999999,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0,
    icon: '⚡'
  }
}
