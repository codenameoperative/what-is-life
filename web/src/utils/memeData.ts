// Meme types data - actual meme type definitions
export const memeTypes = {
  // Fresh memes - high risk, high reward
  fresh_meme: {
    id: 'fresh_meme',
    name: 'Fresh Meme',
    description: 'A brand new meme that could go viral or flop spectacularly.',
    successRate: 0.3, // 30% chance of success
    failureRate: 0.4, // 40% chance of failure
    viralMultiplier: 2.5, // High viral potential
    template: {
      id: 'fresh_meme_template',
      name: 'Fresh Meme Template',
      description: 'A new meme that\'s never been seen before.',
      value: 50,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  },

  // Classic memes - reliable but lower reward
  classic_meme: {
    id: 'classic_meme',
    name: 'Classic Meme',
    description: 'A tried-and-true meme format that always gets some engagement.',
    successRate: 0.6, // 60% chance of success
    failureRate: 0.1, // 10% chance of failure
    viralMultiplier: 1.2, // Moderate viral potential
    template: {
      id: 'classic_meme_template',
      name: 'Classic Meme Template',
      description: 'A reliable meme that people will recognize.',
      value: 25,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  },

  // Dank memes - edgy, unpredictable results
  dank_meme: {
    id: 'dank_meme',
    name: 'Dank Meme',
    description: 'An edgy, controversial meme that could spark debates.',
    successRate: 0.4, // 40% chance of success
    failureRate: 0.35, // 35% chance of failure
    viralMultiplier: 3.0, // Very high viral potential
    template: {
      id: 'dank_meme_template',
      name: 'Dank Meme Template',
      description: 'A bold meme that might offend some people.',
      value: 75,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  },

  // Wholesome memes - safe, positive content
  wholesome_meme: {
    id: 'wholesome_meme',
    name: 'Wholesome Meme',
    description: 'A heartwarming, positive meme that spreads good vibes.',
    successRate: 0.5, // 50% chance of success
    failureRate: 0.15, // 15% chance of failure
    viralMultiplier: 1.8, // Good viral potential
    template: {
      id: 'wholesome_meme_template',
      name: 'Wholesome Meme Template',
      description: 'A feel-good meme that brings smiles.',
      value: 40,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  },

  // Niche memes - specialized audience, unpredictable
  niche_meme: {
    id: 'niche_meme',
    name: 'Niche Meme',
    description: 'A meme for a specific community or interest group.',
    successRate: 0.25, // 25% chance of success
    failureRate: 0.5, // 50% chance of failure
    viralMultiplier: 4.0, // Extremely high viral potential in niche
    template: {
      id: 'niche_meme_template',
      name: 'Niche Meme Template',
      description: 'A specialized meme for dedicated fans.',
      value: 100,
      usable: false,
      source: 'Created',
      breakChance: 0
    }
  }
}
