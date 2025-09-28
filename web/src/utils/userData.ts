import { safeUUID } from './safeUUID'
import { generateUniquePlayerId } from './playerId'

interface InitialUserData {
  profile: {
    username: string
    description: string
    playerId: string
    totalEarnings: number
    totalSpent: number
    activityUsage: Record<string, number>
    level: number
    xp: number
    xpToNextLevel: number
    unlockedAchievements: string[]
    availableTitles: string[]
    deathCount: number
    totalTimePlayed: number
  }
  settings: {
    automatedGrinding: boolean
    lightMode: boolean
    confirmSell: boolean
    confirmDeposit: boolean
    soundEnabled: boolean
    animationSpeed: 'slow' | 'normal' | 'fast'
  }
  inventory: Array<{ id: string; quantity?: number }>
  wallet: number
  bank: number
  stash: number
  character?: {
    appearance: {
      skinTone: number
      hairStyle: number
      hairColor: number
      eyeColor: number
    }
    clothing: {
      top: number
      bottom: number
      shoes: number
    }
  }
}

export const createInitialUserData = (username: string): InitialUserData => {
  // Generate unique player ID
  const playerId = generateUniquePlayerId()

  return {
    profile: {
      username: username,
      description: 'Just started my journey...',
      playerId: playerId,
      totalEarnings: 0,
      totalSpent: 0,
      activityUsage: {},
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      unlockedAchievements: [],
      availableTitles: [],
      deathCount: 0,
      totalTimePlayed: 0
    },
    settings: {
      automatedGrinding: false,
      lightMode: false,
      confirmSell: true,
      confirmDeposit: true,
      soundEnabled: true,
      animationSpeed: 'normal'
    },
    inventory: [
      { id: 'hunting_rifle' },
      { id: 'fishing_rod' },
      { id: 'shovel' },
      { id: 'phone' },
      { id: 'revival_bill', quantity: 5 }
    ],
    wallet: 100, // Starting money
    bank: 0,
    stash: 0,
    character: {
      appearance: {
        skinTone: 1, // Default skin tone
        hairStyle: 1, // Default hair
        hairColor: 2, // Default hair color
        eyeColor: 1   // Default eye color
      },
      clothing: {
        top: 1,     // Default top
        bottom: 1,  // Default bottom
        shoes: 1    // Default shoes
      }
    }
  }
}

export const initializeNewUser = (userId: string, username: string) => {
  // Desktop build doesn't need Supabase
  return { success: true, data: createInitialUserData(username) }
}

export const loadUserData = async (userId: string) => {
  // Desktop build uses local storage, not Supabase
  return createInitialUserData('Player')
}

export const saveUserData = async (userId: string, gameData: any) => {
  // Desktop build uses local storage, not Supabase
  return { success: true }
}
