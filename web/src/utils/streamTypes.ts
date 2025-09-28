// Stream types data - actual stream type definitions
export const streamTypes = {
  // Gaming - Video game streaming, high engagement
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    description: 'Stream yourself playing video games with commentary and interaction.',
    successRate: 0.6, // 60% chance of success
    failureRate: 0.15, // 15% chance of failure
    viralMultiplier: 2.2, // High viral potential for gaming
    baseReward: { min: 80, max: 300 }, // Higher rewards for gaming
    durationOptions: [5, 10, 15, 20, 30, 45, 60], // Longer streams possible
    category: 'gaming',
    requirements: 'Gaming setup recommended but not required'
  },

  // Vlog - Personal vlogging, storytelling
  vlog: {
    id: 'vlog',
    name: 'Vlog',
    description: 'Share your daily life, thoughts, and experiences in a video blog format.',
    successRate: 0.5, // 50% chance of success
    failureRate: 0.2, // 20% chance of failure
    viralMultiplier: 1.8, // Good viral potential for personal content
    baseReward: { min: 50, max: 200 }, // Moderate rewards
    durationOptions: [5, 10, 15, 20, 30], // Standard durations
    category: 'vlog',
    requirements: 'Camera or good lighting recommended'
  },

  // Blog - Educational or informational content
  blog: {
    id: 'blog',
    name: 'Blog/Tutorial',
    description: 'Create educational content, tutorials, or share knowledge on topics.',
    successRate: 0.45, // 45% chance of success
    failureRate: 0.25, // 25% chance of failure
    viralMultiplier: 1.6, // Moderate viral potential
    baseReward: { min: 60, max: 250 }, // Good rewards for educational content
    durationOptions: [10, 15, 20, 30, 45], // Educational content often longer
    category: 'blog',
    requirements: 'Knowledge or expertise in chosen topic'
  },

  // Music - Music performance or discussion
  music: {
    id: 'music',
    name: 'Music',
    description: 'Stream music performances, discussions, or music-related content.',
    successRate: 0.4, // 40% chance of success
    failureRate: 0.3, // 30% chance of failure
    viralMultiplier: 2.5, // High viral potential for music
    baseReward: { min: 70, max: 350 }, // High rewards for music content
    durationOptions: [5, 10, 15, 20, 30, 45], // Variable lengths
    category: 'music',
    requirements: 'Musical instrument or audio equipment helpful'
  },

  // Art - Art creation and discussion
  art: {
    id: 'art',
    name: 'Art/Creative',
    description: 'Create art live, discuss creative processes, or showcase artwork.',
    successRate: 0.35, // 35% chance of success
    failureRate: 0.35, // 35% chance of failure
    viralMultiplier: 2.0, // Good viral potential for creative content
    baseReward: { min: 55, max: 220 }, // Moderate to high rewards
    durationOptions: [15, 20, 30, 45, 60], // Creative work often takes time
    category: 'art',
    requirements: 'Art supplies or creative tools'
  },

  // Chat - Casual conversation and community
  chat: {
    id: 'chat',
    name: 'Just Chatting',
    description: 'Casual conversation, Q&A sessions, or community interaction.',
    successRate: 0.55, // 55% chance of success
    failureRate: 0.1, // 10% chance of failure
    viralMultiplier: 1.3, // Lower viral potential but consistent
    baseReward: { min: 40, max: 150 }, // Consistent but moderate rewards
    durationOptions: [10, 15, 20, 30, 45, 60], // Long conversations possible
    category: 'chat',
    requirements: 'Good communication skills and community engagement'
  }
}
