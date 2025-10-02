// Difficulty scaling system
export const getActivityDifficulty = (activityName: string, playerLevel: number) => {
  const baseDifficulty = {
    Search: { min: 1, max: 3 },
    Crime: { min: 2, max: 5 },
    Work: { min: 1, max: 4 },
    Hunt: { min: 2, max: 4 },
    Fish: { min: 1, max: 3 },
    Dig: { min: 1, max: 3 },
    Post: { min: 1, max: 3 },
    Stream: { min: 2, max: 4 },
    Explore: { min: 3, max: 5 },
    Garden: { min: 1, max: 2 }
  }

  const activity = baseDifficulty[activityName as keyof typeof baseDifficulty]
  if (!activity) return 1

  // Scale difficulty based on player level
  const levelMultiplier = Math.min(playerLevel / 10, 2) // Max 2x scaling
  const scaledMin = Math.floor(activity.min + (activity.max - activity.min) * levelMultiplier * 0.3)
  const scaledMax = Math.floor(activity.max + (activity.max - activity.min) * levelMultiplier * 0.5)

  return Math.floor(Math.random() * (scaledMax - scaledMin + 1)) + scaledMin
}

// Streak bonus system
interface StreakData {
  currentStreak: number
  bestStreak: number
  lastActivityDate: string
  multiplier: number
}

export const calculateStreakBonus = (streakData: StreakData, activityDate: string): { newStreak: number, bonus: number, multiplier: number } => {
  const today = new Date().toDateString()
  const lastDate = new Date(streakData.lastActivityDate).toDateString()

  let newStreak = streakData.currentStreak

  if (lastDate === today) {
    // Already did activity today, no streak change
    return { newStreak, bonus: 0, multiplier: streakData.multiplier }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (lastDate === yesterdayStr) {
    // Continued streak
    newStreak = streakData.currentStreak + 1
  } else {
    // Streak broken
    newStreak = 1
  }

  // Calculate bonus based on streak length
  const streakMultiplier = Math.min(newStreak * 0.1, 1.0) // Max 100% bonus
  const bonus = Math.floor(newStreak * 5) // 5 WTC per streak day

  return {
    newStreak,
    bonus,
    multiplier: 1 + streakMultiplier
  }
}

// Daily challenges
export interface DailyChallenge {
  id: string
  title: string
  description: string
  activityType: string
  targetCount: number
  reward: {
    wtc: number
    xp: number
    item?: string
  }
  expiresAt: number
}

export const generateDailyChallenges = (playerLevel: number): DailyChallenge[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const challenges: DailyChallenge[] = [
    {
      id: 'search_master',
      title: 'Search Master',
      description: 'Complete 5 search activities',
      activityType: 'Search',
      targetCount: 5,
      reward: { wtc: 100, xp: 50 },
      expiresAt: tomorrow.getTime()
    },
    {
      id: 'work_ethic',
      title: 'Work Ethic',
      description: 'Answer 3 work questions correctly',
      activityType: 'Work',
      targetCount: 3,
      reward: { wtc: 75, xp: 40 },
      expiresAt: tomorrow.getTime()
    },
    {
      id: 'crime_spree',
      title: 'Crime Spree',
      description: 'Complete 3 crime activities',
      activityType: 'Crime',
      targetCount: 3,
      reward: { wtc: 150, xp: 60, item: 'getaway_car' },
      expiresAt: tomorrow.getTime()
    },
    {
      id: 'gardener',
      title: 'Dedicated Gardener',
      description: 'Water plants 10 times',
      activityType: 'Garden',
      targetCount: 10,
      reward: { wtc: 50, xp: 30 },
      expiresAt: tomorrow.getTime()
    }
  ]

  // Scale rewards based on player level
  return challenges.map(challenge => ({
    ...challenge,
    reward: {
      ...challenge.reward,
      wtc: Math.floor(challenge.reward.wtc * (1 + playerLevel * 0.1)),
      xp: Math.floor(challenge.reward.xp * (1 + playerLevel * 0.05))
    }
  }))
}
