// Weapons Category Items
import { type Item } from './index'

export const weaponsItems: Record<string, Item> = {
  // Common Weapons
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    tier: 'common',
    category: 'weapons',
    description: 'A basic wooden sword for beginners.',
    value: 45,
    usable: false,
    source: 'Shop',
    breakChance: 0.05
  },
  stone_knife: {
    id: 'stone_knife',
    name: 'Stone Knife',
    tier: 'common',
    category: 'weapons',
    description: 'A sharp stone knife.',
    value: 35,
    usable: false,
    source: 'Shop',
    breakChance: 0.05
  },
  rusty_dagger: {
    id: 'rusty_dagger',
    name: 'Rusty Dagger',
    tier: 'common',
    category: 'weapons',
    description: 'An old, rusty dagger found in the streets. "Trusty" is not the word that comes to mind. More like "tetanus delivery system."',
    value: 25,
    usable: false,
    source: 'Found',
    breakChance: 0.08,
    craftable: true,
    recipe: {
      requiredItems: {
        'broken_glass': 1,
        'empty_bottle': 1
      }
    }
  },
  wooden_club: {
    id: 'wooden_club',
    name: 'Wooden Club',
    tier: 'common',
    category: 'weapons',
    description: 'A heavy wooden club for close combat. Perfect for when you want to "branch" out your fighting style. Warning: May attract squirrels.',
    value: 50,
    usable: false,
    source: 'Shop',
    breakChance: 0.06,
    craftable: true,
    recipe: {
      requiredItems: {
        'sharpened_stick': 3
      }
    }
  },
  slingshot: {
    id: 'slingshot',
    name: 'Slingshot',
    tier: 'common',
    category: 'weapons',
    description: 'A simple slingshot made from wood and rubber. For when you want to "shoot" your shot from a distance. Remember kids: with great power comes great "ouch."',
    value: 30,
    usable: false,
    source: 'Shop',
    breakChance: 0.04
  },
  butter_knife: {
    id: 'butter_knife',
    name: 'Butter Knife',
    tier: 'common',
    category: 'weapons',
    description: 'Not very effective, but better than nothing. Perfect for when you\'re feeling "buttery" smooth in combat. Warning: May cause opponents to laugh themselves to death.',
    value: 15,
    usable: false,
    source: 'Found',
    breakChance: 0.1
  },
  sharpened_stick: {
    id: 'sharpened_stick',
    name: 'Sharpened Stick',
    tier: 'common',
    category: 'weapons',
    description: 'A pointy stick sharpened on a rock. The original "stick \'em up" weapon. Proof that sometimes the simplest solutions are the "pointiest."',
    value: 20,
    usable: false,
    source: 'Found',
    breakChance: 0.09
  },
  brass_knuckles: {
    id: 'brass_knuckles',
    name: 'Brass Knuckles',
    tier: 'common',
    category: 'weapons',
    description: 'Metal knuckles for hand-to-hand combat. Because sometimes you need to "punch" above your weight class. Style points for the golden touch.',
    value: 40,
    usable: false,
    source: 'Shop',
    breakChance: 0.03,
    craftable: true,
    recipe: {
      requiredItems: {
        'broken_glass': 2,
        'empty_bottle': 1
      }
    }
  },
  throwing_stones: {
    id: 'throwing_stones',
    name: 'Throwing Stones',
    tier: 'common',
    category: 'weapons',
    description: 'A handful of rocks for ranged attacks. Because sometimes you gotta throw shade... literally. "Stone" cold killer approved.',
    value: 10,
    usable: true,
    source: 'Found',
    breakChance: 0.02
  },

  // Uncommon Weapons
  iron_dagger: {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A sturdy iron dagger.',
    value: 120,
    usable: false,
    source: 'Shop',
    breakChance: 0.04
  },
  bronze_spear: {
    id: 'bronze_spear',
    name: 'Bronze Spear',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A bronze spear for hunting.',
    value: 140,
    usable: false,
    source: 'Shop',
    breakChance: 0.04
  },
  chain_whip: {
    id: 'chain_whip',
    name: 'Chain Whip',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A flexible chain weapon with a weighted end.',
    value: 180,
    usable: false,
    source: 'Shop',
    breakChance: 0.035
  },
  crossbow: {
    id: 'crossbow',
    name: 'Crossbow',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A mechanical bow that fires bolts.',
    value: 220,
    usable: false,
    source: 'Shop',
    breakChance: 0.03
  },
  morning_star: {
    id: 'morning_star',
    name: 'Morning Star',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A spiked ball on a chain, devastating in close combat.',
    value: 160,
    usable: false,
    source: 'Shop',
    breakChance: 0.04
  },
  curved_sword: {
    id: 'curved_sword',
    name: 'Curved Sword',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A sword with a curved blade for slashing.',
    value: 150,
    usable: false,
    source: 'Shop',
    breakChance: 0.035
  },
  throwing_knives: {
    id: 'throwing_knives',
    name: 'Throwing Knives',
    tier: 'uncommon',
    category: 'weapons',
    description: 'Balanced knives designed for throwing.',
    value: 130,
    usable: true,
    source: 'Shop',
    breakChance: 0.025
  },
  hand_cannon: {
    id: 'hand_cannon',
    name: 'Hand Cannon',
    tier: 'uncommon',
    category: 'weapons',
    description: 'An early firearm, powerful but inaccurate.',
    value: 200,
    usable: false,
    source: 'Shop',
    breakChance: 0.06
  },
  spiked_shield: {
    id: 'spiked_shield',
    name: 'Spiked Shield',
    tier: 'uncommon',
    category: 'weapons',
    description: 'A shield with spikes for both defense and offense.',
    value: 170,
    usable: false,
    source: 'Shop',
    breakChance: 0.02
  },

  // Rare Weapons
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    tier: 'rare',
    category: 'weapons',
    description: 'A finely crafted steel sword.',
    value: 320,
    usable: false,
    source: 'Shop',
    breakChance: 0.03
  },
  silver_bow: {
    id: 'silver_bow',
    name: 'Silver Bow',
    tier: 'rare',
    category: 'weapons',
    description: 'An elegant silver bow.',
    value: 380,
    usable: false,
    source: 'Shop',
    breakChance: 0.03
  },
  diamond_blade: {
    id: 'diamond_blade',
    name: 'Diamond Blade',
    tier: 'rare',
    category: 'weapons',
    description: 'A sword with a blade made of pure diamond.',
    value: 450,
    usable: false,
    source: 'Shop',
    breakChance: 0.015
  },
  enchanted_crossbow: {
    id: 'enchanted_crossbow',
    name: 'Enchanted Crossbow',
    tier: 'rare',
    category: 'weapons',
    description: 'A crossbow enchanted with magical properties.',
    value: 420,
    usable: false,
    source: 'Shop',
    breakChance: 0.025
  },
  frost_axe: {
    id: 'frost_axe',
    name: 'Frost Axe',
    tier: 'rare',
    category: 'weapons',
    description: 'An axe that freezes enemies on impact.',
    value: 400,
    usable: false,
    source: 'Shop',
    breakChance: 0.02
  },
  venom_dagger: {
    id: 'venom_dagger',
    name: 'Venom Dagger',
    tier: 'rare',
    category: 'weapons',
    description: 'A dagger coated with deadly venom.',
    value: 350,
    usable: true,
    source: 'Shop',
    breakChance: 0.035
  },
  thunder_hammer: {
    id: 'thunder_hammer',
    name: 'Thunder Hammer',
    tier: 'rare',
    category: 'weapons',
    description: 'A hammer that calls down thunder when swung.',
    value: 480,
    usable: false,
    source: 'Shop',
    breakChance: 0.018
  },
  shadow_blade: {
    id: 'shadow_blade',
    name: 'Shadow Blade',
    tier: 'rare',
    category: 'weapons',
    description: 'A blade that can phase through armor.',
    value: 410,
    usable: false,
    source: 'Shop',
    breakChance: 0.022
  },
  crystal_spear: {
    id: 'crystal_spear',
    name: 'Crystal Spear',
    tier: 'rare',
    category: 'weapons',
    description: 'A spear made from enchanted crystal.',
    value: 370,
    usable: false,
    source: 'Shop',
    breakChance: 0.028
  },

  // Epic Weapons
  enchanted_blade: {
    id: 'enchanted_blade',
    name: 'Enchanted Blade',
    tier: 'epic',
    category: 'weapons',
    description: 'A blade infused with magical energy.',
    value: 850,
    usable: false,
    source: 'Shop',
    breakChance: 0.02
  },
  mystic_staff: {
    id: 'mystic_staff',
    name: 'Mystic Staff',
    tier: 'epic',
    category: 'weapons',
    description: 'A staff imbued with mystical power.',
    value: 920,
    usable: false,
    source: 'Shop',
    breakChance: 0.02
  },
  soul_reaper: {
    id: 'soul_reaper',
    name: 'Soul Reaper',
    tier: 'epic',
    category: 'weapons',
    description: 'A scythe that harvests souls.',
    value: 1100,
    usable: false,
    source: 'Shop',
    breakChance: 0.012
  },
  star_forge_blade: {
    id: 'star_forge_blade',
    name: 'Star Forge Blade',
    tier: 'epic',
    category: 'weapons',
    description: 'A blade forged from fallen stars.',
    value: 980,
    usable: false,
    source: 'Shop',
    breakChance: 0.015
  },
  void_walker: {
    id: 'void_walker',
    name: 'Void Walker',
    tier: 'epic',
    category: 'weapons',
    description: 'A weapon that allows travel between dimensions.',
    value: 1050,
    usable: false,
    source: 'Shop',
    breakChance: 0.01
  },
  blood_letter: {
    id: 'blood_letter',
    name: 'Blood Letter',
    tier: 'epic',
    category: 'weapons',
    description: 'A sword that feeds on the blood of its victims.',
    value: 950,
    usable: true,
    source: 'Shop',
    breakChance: 0.02
  },
  storm_bringer: {
    id: 'storm_bringer',
    name: 'Storm Bringer',
    tier: 'epic',
    category: 'weapons',
    description: 'A hammer that summons devastating storms.',
    value: 1200,
    usable: false,
    source: 'Shop',
    breakChance: 0.008
  },
  eclipse_bow: {
    id: 'eclipse_bow',
    name: 'Eclipse Bow',
    tier: 'epic',
    category: 'weapons',
    description: 'A bow that shoots arrows of pure darkness.',
    value: 880,
    usable: false,
    source: 'Shop',
    breakChance: 0.018
  },
  phantom_blade: {
    id: 'phantom_blade',
    name: 'Phantom Blade',
    tier: 'epic',
    category: 'weapons',
    description: 'A blade that phases in and out of reality.',
    value: 1000,
    usable: false,
    source: 'Shop',
    breakChance: 0.014
  },

  // Legendary Weapons
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'Dragon Slayer',
    tier: 'legendary',
    category: 'weapons',
    description: 'A legendary sword said to have slain dragons.',
    value: 2100,
    usable: false,
    source: 'Shop',
    breakChance: 0.01
  },
  phoenix_bow: {
    id: 'phoenix_bow',
    name: 'Phoenix Bow',
    tier: 'legendary',
    category: 'weapons',
    description: 'A bow forged from phoenix feathers.',
    value: 2350,
    usable: false,
    source: 'Shop',
    breakChance: 0.01
  },
  titan_crusher: {
    id: 'titan_crusher',
    name: 'Titan Crusher',
    tier: 'legendary',
    category: 'weapons',
    description: 'A hammer wielded by ancient titans.',
    value: 2800,
    usable: false,
    source: 'Shop',
    breakChance: 0.005
  },
  infinity_blade: {
    id: 'infinity_blade',
    name: 'Infinity Blade',
    tier: 'legendary',
    category: 'weapons',
    description: 'A blade that exists beyond the boundaries of time.',
    value: 2500,
    usable: false,
    source: 'Shop',
    breakChance: 0.007
  },
  chaos_orb: {
    id: 'chaos_orb',
    name: 'Chaos Orb',
    tier: 'legendary',
    category: 'weapons',
    description: 'An orb that unleashes chaotic energies.',
    value: 2200,
    usable: true,
    source: 'Shop',
    breakChance: 0.012
  },
  death_bringer: {
    id: 'death_bringer',
    name: 'Death Bringer',
    tier: 'legendary',
    category: 'weapons',
    description: 'A scythe that brings inevitable death.',
    value: 2600,
    usable: false,
    source: 'Shop',
    breakChance: 0.006
  },
  star_eater: {
    id: 'star_eater',
    name: 'Star Eater',
    tier: 'legendary',
    category: 'weapons',
    description: 'A weapon that consumes stars for power.',
    value: 2400,
    usable: false,
    source: 'Shop',
    breakChance: 0.008
  },
  world_end: {
    id: 'world_end',
    name: 'World End',
    tier: 'legendary',
    category: 'weapons',
    description: 'A sword said to bring about the end of worlds.',
    value: 2900,
    usable: false,
    source: 'Shop',
    breakChance: 0.004
  },
  soul_harvester: {
    id: 'soul_harvester',
    name: 'Soul Harvester',
    tier: 'legendary',
    category: 'weapons',
    description: 'A blade that harvests the souls of the fallen.',
    value: 2300,
    usable: false,
    source: 'Shop',
    breakChance: 0.009
  },

  // Mythical Weapons
  gods_fury: {
    id: 'gods_fury',
    name: 'Gods Fury',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon blessed by the gods themselves.',
    value: 4800,
    usable: false,
    source: 'Shop',
    breakChance: 0.005
  },
  celestial_blade: {
    id: 'celestial_blade',
    name: 'Celestial Blade',
    tier: 'mythical',
    category: 'weapons',
    description: 'A blade from the celestial realms.',
    value: 5200,
    usable: false,
    source: 'Shop',
    breakChance: 0.005
  },
  omega_weapon: {
    id: 'omega_weapon',
    name: 'Omega Weapon',
    tier: 'mythical',
    category: 'weapons',
    description: 'The ultimate weapon, containing all others.',
    value: 6000,
    usable: false,
    source: 'Shop',
    breakChance: 0.002
  },
  universe_splitter: {
    id: 'universe_splitter',
    name: 'Universe Splitter',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon capable of splitting the fabric of reality.',
    value: 5500,
    usable: false,
    source: 'Shop',
    breakChance: 0.003
  },
  time_stopper: {
    id: 'time_stopper',
    name: 'Time Stopper',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon that can halt the flow of time.',
    value: 5800,
    usable: true,
    source: 'Shop',
    breakChance: 0.004
  },
  reality_bender: {
    id: 'reality_bender',
    name: 'Reality Bender',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon that bends the rules of reality itself.',
    value: 5300,
    usable: false,
    source: 'Shop',
    breakChance: 0.0025
  },
  god_killer: {
    id: 'god_killer',
    name: 'God Killer',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon forged to slay even the gods.',
    value: 6200,
    usable: false,
    source: 'Shop',
    breakChance: 0.001
  },
  existence_ender: {
    id: 'existence_ender',
    name: 'Existence Ender',
    tier: 'mythical',
    category: 'weapons',
    description: 'A weapon that can end all existence.',
    value: 6500,
    usable: false,
    source: 'Shop',
    breakChance: 0.0005
  },
  primordial_blade: {
    id: 'primordial_blade',
    name: 'Primordial Blade',
    tier: 'mythical',
    category: 'weapons',
    description: 'A blade from the beginning of time itself.',
    value: 5600,
    usable: false,
    source: 'Shop',
    breakChance: 0.002
  },

  // WDYFT Weapons
  reality_breaker: {
    id: 'reality_breaker',
    name: 'Reality Breaker',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that bends reality itself.',
    value: 15000,
    usable: false,
    source: 'Shop',
    breakChance: 0.001
  },
  void_sword: {
    id: 'void_sword',
    name: 'Void Sword',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A sword that commands the void.',
    value: 18000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.001
  },
  quantum_disruptor: {
    id: 'quantum_disruptor',
    name: 'Quantum Disruptor',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that disrupts quantum fields.',
    value: 22000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.0001
  },
  multiverse_shredder: {
    id: 'multiverse_shredder',
    name: 'Multiverse Shredder',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that shreds through multiple universes.',
    value: 25000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.00005
  },
  paradox_engine: {
    id: 'paradox_engine',
    name: 'Paradox Engine',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that creates and destroys paradoxes.',
    value: 20000,
    usable: true,
    source: 'WDYFT',
    breakChance: 0.0002
  },
  dimension_ripper: {
    id: 'dimension_ripper',
    name: 'Dimension Ripper',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that rips through dimensional barriers.',
    value: 19000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.0003
  },
  fate_weaver: {
    id: 'fate_weaver',
    name: 'Fate Weaver',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that weaves the threads of fate.',
    value: 21000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.00015
  },
  causality_breaker: {
    id: 'causality_breaker',
    name: 'Causality Breaker',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that breaks the chains of cause and effect.',
    value: 24000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.00008
  },
  existence_eraser: {
    id: 'existence_eraser',
    name: 'Existence Eraser',
    tier: 'wdyft',
    category: 'weapons',
    description: 'A weapon that erases things from existence.',
    value: 28000,
    usable: false,
    source: 'WDYFT',
    breakChance: 0.00001
  }
}
