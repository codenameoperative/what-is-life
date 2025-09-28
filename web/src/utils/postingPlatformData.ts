// Posting platforms data - actual platform definitions
export const postingPlatforms = {
  // YouTube - Video platform, good for viral content
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Video platform perfect for memes with high viral potential.',
    postType: 'video',
    baseReward: { min: 50, max: 200 },
    viralChance: 0.15, // 15% chance for viral success
    failurePenalty: 0.1, // 10% chance for harsh penalty
    platformMultiplier: 2.0, // Doubles viral rewards
    itemDropChances: {
      useless: 0.2,
      common: 0.25,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    specialEffects: 'High viral potential, video format required',
    audience: 'Mass market, diverse viewers'
  },

  // Twitter - Fast-paced, quick engagement
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    description: 'Fast-paced platform where memes spread quickly but fade fast.',
    postType: 'image/text',
    baseReward: { min: 20, max: 100 },
    viralChance: 0.25, // 25% chance for viral success
    failurePenalty: 0.05, // 5% chance for penalty
    platformMultiplier: 1.5, // 1.5x viral rewards
    itemDropChances: {
      useless: 0.3,
      common: 0.3,
      uncommon: 0.2,
      rare: 0.1,
      epic: 0.05,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    specialEffects: 'Quick engagement, trends change rapidly',
    audience: 'Tech-savvy, quick consumption'
  },

  // Reddit - Community-focused, quality matters
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community-driven platform where quality and relevance determine success.',
    postType: 'image/text',
    baseReward: { min: 30, max: 150 },
    viralChance: 0.2, // 20% chance for viral success
    failurePenalty: 0.15, // 15% chance for downvote penalty
    platformMultiplier: 1.8, // 1.8x viral rewards
    itemDropChances: {
      useless: 0.25,
      common: 0.25,
      uncommon: 0.2,
      rare: 0.15,
      epic: 0.08,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    specialEffects: 'Community voting system, karma rewards',
    audience: 'Niche communities, quality-focused'
  },

  // Discord - Group chats, server communities
  discord: {
    id: 'discord',
    name: 'Discord',
    description: 'Group chat platform where memes thrive in server communities.',
    postType: 'image/text',
    baseReward: { min: 15, max: 80 },
    viralChance: 0.1, // 10% chance for viral success
    failurePenalty: 0.02, // 2% chance for penalty
    platformMultiplier: 1.2, // 1.2x viral rewards
    itemDropChances: {
      useless: 0.4,
      common: 0.3,
      uncommon: 0.15,
      rare: 0.08,
      epic: 0.04,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    specialEffects: 'Server-based, community sharing',
    audience: 'Gaming communities, close-knit groups'
  },

  // Facebook - Social networking, broad audience
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social networking platform with broad audience reach.',
    postType: 'video/text',
    baseReward: { min: 15, max: 75 },
    viralChance: 0.12, // 12% chance for viral success
    failurePenalty: 0.04, // 4% chance for penalty
    platformMultiplier: 1.1, // 1.1x viral rewards
    itemDropChances: {
      useless: 0.4,
      common: 0.3,
      uncommon: 0.15,
      rare: 0.08,
      epic: 0.04,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    specialEffects: 'Broad audience reach, community-focused',
    audience: 'Diverse social network users'
  },

  // Instagram - Photo/video sharing, visual content
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Photo and video sharing platform perfect for visual content.',
    postType: 'video/photo',
    baseReward: { min: 20, max: 90 },
    viralChance: 0.18, // 18% chance for viral success
    failurePenalty: 0.06, // 6% chance for penalty
    platformMultiplier: 1.6, // 1.6x viral rewards
    itemDropChances: {
      useless: 0.28,
      common: 0.3,
      uncommon: 0.2,
      rare: 0.12,
      epic: 0.06,
      legendary: 0.03,
      mythical: 0.01,
      wdyft: 0.005
    },
    specialEffects: 'Visual content focus, aesthetic appeal',
    audience: 'Young adults, visual content creators'
  },

  // TikTok - Short-form video, dance and trend focused
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Short-form video platform perfect for viral dance and trend memes.',
    postType: 'video',
    baseReward: { min: 25, max: 120 },
    viralChance: 0.35, // 35% chance for viral success
    failurePenalty: 0.08, // 8% chance for penalty
    platformMultiplier: 2.2, // 2.2x viral rewards
    itemDropChances: {
      useless: 0.25,
      common: 0.3,
      uncommon: 0.2,
      rare: 0.12,
      epic: 0.06,
      legendary: 0.04,
      mythical: 0.02,
      wdyft: 0.01
    },
    specialEffects: 'Trend-focused, extremely viral potential for dance/trend memes',
    audience: 'Gen Z, trend-followers, youth culture'
  }
}
