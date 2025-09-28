// Explore locations data - adventure areas for exploration
export const exploreLocations = {
  // Forest - Safe exploration area
  forest: {
    id: 'forest',
    name: 'Ancient Forest',
    description: 'A dense forest with winding paths and hidden treasures.',
    dangerLevel: 'low', // low, medium, high
    deathChance: 0.005, // 0.5% chance of death
    explorationTime: 30, // seconds
    baseReward: { min: 50, max: 200 },
    itemDropChances: {
      useless: 0.3,
      common: 0.25,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.02
    },
    paths: [
      {
        id: 'path_1',
        text: 'You come across a fork in the path. To your left, you see a shimmering pond. To your right, a dark cave entrance beckons.',
        choices: [
          { text: 'Go left to the pond', outcome: 'pond_success' },
          { text: 'Go right to the cave', outcome: 'cave_risk' },
          { text: 'Turn back', outcome: 'turn_back' }
        ]
      },
      {
        id: 'pond_success',
        text: 'At the pond, you find some interesting rocks and a small treasure chest!',
        choices: [
          { text: 'Open the chest', outcome: 'chest_reward' }
        ]
      },
      {
        id: 'cave_risk',
        text: 'The cave is dark and damp. You hear strange noises echoing from within.',
        choices: [
          { text: 'Enter the cave', outcome: 'cave_explore' },
          { text: 'Return to the path', outcome: 'return_path' }
        ]
      },
      {
        id: 'turn_back',
        text: 'You decide to turn back. The forest seems less inviting now.',
        choices: []
      }
    ]
  },

  // Mountain - Medium danger
  mountain: {
    id: 'mountain',
    name: 'Mysterious Mountain',
    description: 'Steep cliffs and hidden valleys await the adventurous explorer.',
    dangerLevel: 'medium',
    deathChance: 0.015, // 1.5% chance of death
    explorationTime: 45,
    baseReward: { min: 100, max: 400 },
    itemDropChances: {
      useless: 0.25,
      common: 0.2,
      uncommon: 0.2,
      rare: 0.2,
      epic: 0.1,
      legendary: 0.05
    },
    paths: [
      {
        id: 'cliff_path',
        text: 'You reach a steep cliff. A narrow ledge leads around it, but you could also try climbing directly.',
        choices: [
          { text: 'Take the ledge', outcome: 'ledge_success' },
          { text: 'Climb directly', outcome: 'climb_risk' },
          { text: 'Look for another way', outcome: 'find_alternative' }
        ]
      }
    ]
  },

  // Ruins - High danger, high reward
  ruins: {
    id: 'ruins',
    name: 'Forgotten Ruins',
    description: 'Ancient ruins filled with mystery and untold dangers.',
    dangerLevel: 'high',
    deathChance: 0.03, // 3% chance of death
    explorationTime: 60,
    baseReward: { min: 200, max: 800 },
    itemDropChances: {
      useless: 0.2,
      common: 0.15,
      uncommon: 0.15,
      rare: 0.25,
      epic: 0.15,
      legendary: 0.1
    },
    paths: [
      {
        id: 'ruins_entrance',
        text: 'The ancient ruins loom before you. Strange symbols cover the entrance, and you feel an otherworldly presence.',
        choices: [
          { text: 'Enter the main chamber', outcome: 'main_chamber' },
          { text: 'Investigate the symbols', outcome: 'symbols_mystery' },
          { text: 'Look for a back entrance', outcome: 'back_entrance' }
        ]
      }
    ]
  },

  // Beach - Relaxed exploration
  beach: {
    id: 'beach',
    name: 'Hidden Beach',
    description: 'A secluded beach with crystal waters and buried secrets.',
    dangerLevel: 'low',
    deathChance: 0.003, // 0.3% chance of death
    explorationTime: 25,
    baseReward: { min: 30, max: 150 },
    itemDropChances: {
      useless: 0.35,
      common: 0.3,
      uncommon: 0.2,
      rare: 0.1,
      epic: 0.05
    },
    paths: [
      {
        id: 'beach_start',
        text: 'The waves lap gently at the shore. You notice some interesting shells and what looks like a bottle in the sand.',
        choices: [
          { text: 'Examine the bottle', outcome: 'bottle_message' },
          { text: 'Look for shells', outcome: 'shell_hunting' },
          { text: 'Swim in the water', outcome: 'ocean_swim' }
        ]
      }
    ]
  },

  // Swamp - Unpredictable and dangerous
  swamp: {
    id: 'swamp',
    name: 'Murky Swamp',
    description: 'A treacherous swamp filled with fog and unknown perils.',
    dangerLevel: 'high',
    deathChance: 0.025, // 2.5% chance of death
    explorationTime: 50,
    baseReward: { min: 150, max: 600 },
    itemDropChances: {
      useless: 0.25,
      common: 0.2,
      uncommon: 0.15,
      rare: 0.2,
      epic: 0.12,
      legendary: 0.08
    },
    paths: [
      {
        id: 'swamp_entrance',
        text: 'The swamp is thick with fog. Strange sounds echo from all directions, and the ground squelches underfoot.',
        choices: [
          { text: 'Follow the main path', outcome: 'main_path' },
          { text: 'Try to navigate through the fog', outcome: 'fog_navigation' },
          { text: 'Look for higher ground', outcome: 'higher_ground' }
        ]
      }
    ]
  }
}

// Template for creating new exploration locations
export const explorationLocationTemplate = {
  id: 'location_id',
  name: 'Location Name',
  description: 'Description of the exploration area.',
  dangerLevel: 'low|medium|high',
  deathChance: 0.01, // 0.0 - 1.0 chance of death
  explorationTime: 30, // seconds
  baseReward: { min: 50, max: 200 },
  itemDropChances: {
    useless: 0.3,
    common: 0.25,
    uncommon: 0.2,
    rare: 0.15,
    epic: 0.08,
    legendary: 0.02
  },
  paths: [
    {
      id: 'path_id',
      text: 'Description of the current situation.',
      choices: [
        { text: 'Choice description', outcome: 'outcome_id' },
        { text: 'Another choice', outcome: 'another_outcome' }
      ]
    }
  ]
}
