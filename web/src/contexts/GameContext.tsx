import { createContext, useContext, useState, useRef, type ReactNode, useEffect } from 'react'
import { items, type Item, type OwnedItem, isStackable, getDefaultQuantity } from '../utils/items'
import { jobs, type JobDefinition } from '../utils/jobs'
import { achievements, type Achievement } from '../utils/achievements'
import { safeUUID, generatePlayerId } from '../utils/safeUUID'
import { invoke } from '@tauri-apps/api/core'

const getInitialSecrets = (): { retroUnlocked: boolean; cheatUnlocked: boolean } => {
  if (typeof window === 'undefined') {
    return { retroUnlocked: false, cheatUnlocked: false }
  }

  try {
    const retro = localStorage.getItem('secret-retro') === 'unlocked'
    const cheat = localStorage.getItem('secret-cheat') === 'unlocked'
    return { retroUnlocked: retro, cheatUnlocked: cheat }
  } catch (error) {
    console.warn('Failed to initialize secret state from storage', error)
    return { retroUnlocked: false, cheatUnlocked: false }
  }
}

export interface GameState {
  wallet: number
  bank: number
  stash: number
  currentJobId?: string
  // For testing with seeded RNG
  useSeededRNG: boolean
  seed: number
  // Inventory (OwnedItem carries durability)
  inventory: OwnedItem[]
  equipped: Record<string, OwnedItem>
  activeBoosts: { type: 'work' | 'search'; multiplier: number; uses: number }[]
  shop: {
    essentials: string[]
    rotatingIds: string[]
    nextRefreshAt: number // epoch ms
  }
  garden: {
    plots: { id: string; plantId: string | null; plantedAt: number; wateredCount: number; growthProgress: number; isReady: boolean }[]
    scarecrowEquipped: boolean
    lastCheckTime: number
  }
  // Profile data
  profile: {
    username: string
    description: string
    playerId: string
    totalEarnings: number
    totalSpent: number
    activityUsage: Record<string, number> // activity name -> count
    level: number
    xp: number
    xpToNextLevel: number
    unlockedAchievements: string[]
    equippedTitle?: string
    availableTitles: string[]
    deathCount: number
    totalTimePlayed: number // in seconds
    job?: string // current job ID
  }
  character?: {
    appearance: {
      skinTone: number
      hairStyle: number
      hairColor: number
      eyeColor: number
      bodyType: number
      age: number
    }
    clothing: {
      top: number
      bottom: number
      shoes: number
      accessories: number[]
    }
    traits: {
      personality: string
      background: string
      specialAbility: string
    }
  }
  // Settings
  settings: {
    confirmSell: boolean
    confirmDeposit: boolean
    animationSpeed: 'slow' | 'normal' | 'fast'
    performanceMode: boolean
  }
  secrets: {
    retroUnlocked: boolean
    cheatUnlocked: boolean
  }
}

interface GameActions {
  setWallet: (amount: number) => void
  setBank: (amount: number) => void
  depositAll: () => void
  withdrawAll: () => void
  stashMoney: (amount: number) => void
  unstashMoney: (amount: number) => void
  deposit: (amount: number) => void
  withdraw: (amount: number) => void
  addToWallet: (amount: number) => void
  deductFromWallet: (amount: number) => void
  setSeed: (seed: number) => void
  toggleRNGMode: () => void
  // Inventory actions
  addItem: (itemId: string) => void
  removeItem: (itemId: string) => void
  equipItem: (slot: string, itemId: string) => void
  useItem: (itemId: string) => { broken: boolean; remaining: number }
  applyBoostFromItem: (itemId: string) => void
  consumeBoostUse: (type: 'work' | 'search') => void
  // Jobs
  applyForJob: (jobId: string) => { ok: boolean; reason?: string }
  resignJob: () => void
  loseJob: () => void
  // Shop actions
  refreshShop: () => void
  buyItem: (itemId: string, qty: number, source: 'wallet' | 'bank') => boolean
  // Profile actions
  updateUsername: (username: string) => void
  updateDescription: (description: string) => void
  trackActivity: (activity: string) => void
  trackEarnings: (amount: number) => void
  trackSpending: (amount: number) => void
  markSecretFound: (secret: 'retro' | 'cheat') => void
  // Garden actions
  plantInGarden: (plotId: string, plantId: string | null) => void
  waterPlant: (plotId: string) => void
  harvestPlant: (plotId: string) => void
  equipScarecrow: () => void
  unequipScarecrow: () => void
  updateGardenGrowth: () => void
  // Achievement and Level actions
  gainXP: (amount: number) => void
  checkAchievements: () => void
  unlockAchievement: (achievementId: string) => void
  equipTitle: (titleId: string) => void
  unequipTitle: () => void
  recordDeath: () => void
  updatePlayTime: (seconds: number) => void
  // Sell actions
  sellItem: (itemId: string, quantity: number) => boolean
  // Settings actions
  updateSettings: (settings: Partial<GameState['settings']>) => void
  // Character actions
  createCharacter: (characterData: GameState['character']) => void
  // User data actions
  loadGameData: () => Promise<boolean>
  saveGameData: () => Promise<boolean>
  initializeNewUser: (userId: string, username: string) => void
  // Anti-cheat actions
  validateGameState: () => Promise<boolean>
  banPlayer: (playerId: string, reason: string) => Promise<boolean>
  isPlayerBanned: (playerId: string) => Promise<boolean>
  getBanReason: (playerId: string) => Promise<string>
}

const GameContext = createContext<{
  state: GameState
  actions: GameActions
} | null>(null)

// Level rewards system
const getLevelRewards = (level: number) => {
  const baseWTC = level * 100 // 100 WTC per level
  const rewards: { wtc?: number; items?: string[]; titles?: string[] } = {
    wtc: baseWTC
  }

  // Special level rewards
  if (level === 5) rewards.items = ['blanket_uncommon']
  if (level === 10) rewards.items = ['usb_cable']
  if (level === 15) rewards.items = ['blanket_rare']
  if (level === 20) rewards.items = ['time_warp_device']
  if (level === 25) rewards.titles = ['Apprentice']
  if (level === 30) rewards.items = ['blanket_epic']
  if (level === 35) rewards.titles = ['Expert']
  if (level === 40) rewards.items = ['time_warp_device']
  if (level === 45) rewards.titles = ['Master']
  if (level === 50) rewards.items = ['time_warp_device']

  return rewards
}

// Activity XP rewards
const getActivityXP = (activity: string): number => {
  const xpMap: Record<string, number> = {
    // Low risk activities
    'search': 5,
    'garden': 8,
    'post': 6,
    'stream': 10,

    // Medium risk activities
    'fish': 12,
    'dig': 15,
    'work': 18,

    // High risk activities
    'hunt': 25,
    'crime': 30,
    'explore': 35
  }

  return xpMap[activity] || 5 // Default 5 XP for unknown activities
}

// Safe UUID generator for environments where crypto.randomUUID may be unavailable

export const GameProvider = ({ children, initialUsername = '', initialPlayerId = '', saveId }: { children: ReactNode, initialUsername?: string, initialPlayerId?: string, saveId?: string | null }) => {
  const [state, setState] = useState<GameState>(() => {
    const initialSecrets = getInitialSecrets()

    // Try to load save data if saveId is provided
    if (saveId) {
      try {
        const saveData = localStorage.getItem(saveId)
        if (saveData) {
          const parsed = JSON.parse(saveData)
          // Update last played time
          parsed.lastPlayed = new Date().toISOString()
          localStorage.setItem(saveId, JSON.stringify(parsed))
          return parsed
        }
      } catch (error) {
        console.warn('Failed to load save data:', error)
      }
    }

    // Check if items registry is ready
    const registryReady =
      !!items && Object.keys(items).length > 0 &&
      !!items.hunting_rifle && !!items.fishing_rod && !!items.shovel && !!items.phone && !!items.blanket_common &&
      !!items.salmon && !!items.trout && !!items.revival_bill

    if (!registryReady) {
      // Return a minimal state if registry isn't ready yet
      return {
        wallet: 0,
        bank: 0,
        stash: 0,
        currentJobId: undefined,
        useSeededRNG: false,
        seed: 12345,
        inventory: [],
        equipped: {},
        activeBoosts: [],
        shop: {
          essentials: [],
          rotatingIds: [],
          nextRefreshAt: Date.now() + 60 * 60 * 1000,
        },
        garden: {
          plots: Array.from({ length: 4 }, (_, i) => ({
            id: `plot_${i + 1}`,
            plantId: null,
            plantedAt: 0,
            wateredCount: 0,
            growthProgress: 0,
            isReady: false
          })),
          scarecrowEquipped: false,
          lastCheckTime: Date.now()
        },
        profile: {
          username: initialUsername || 'Player',
          description: 'Just started my journey...',
          playerId: initialPlayerId || generatePlayerId(),
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
          confirmSell: true,
          confirmDeposit: true,
          animationSpeed: 'normal',
          performanceMode: false
        },
        secrets: initialSecrets
      }
    }

    // Normal initialization when registry is ready
    return {
      wallet: 100, // Starting money
      bank: 0,
      stash: 0,
      currentJobId: undefined,
      useSeededRNG: false,
      seed: 12345,
      inventory: [
        { id: 'hunting_rifle' },
        { id: 'fishing_rod' },
        { id: 'shovel' },
        { id: 'phone' },
        { id: 'revival_bill', quantity: 5 },
      ],
      equipped: {},
      activeBoosts: [],
      shop: {
        // Essentials: Required activity items + some variety
        essentials: ['hunting_rifle','fishing_rod','shovel','blanket_common','usb_cable','revival_bill'],
        rotatingIds: [],
        nextRefreshAt: Date.now() + 60 * 60 * 1000,
      },
      garden: {
        plots: Array.from({ length: 4 }, (_, i) => ({
          id: `plot_${i + 1}`,
          plantId: null,
          plantedAt: 0,
          wateredCount: 0,
          growthProgress: 0,
          isReady: false
        })),
        scarecrowEquipped: false,
        lastCheckTime: Date.now()
      },
      profile: {
        username: initialUsername || 'Player',
        description: 'Just started my journey...',
        playerId: initialPlayerId || generatePlayerId(),
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
        confirmSell: true,
        confirmDeposit: true,
        animationSpeed: 'normal',
        performanceMode: false
      },
      secrets: initialSecrets
    }
  })

  // Auto-save functionality
  useEffect(() => {
    if (state.profile && saveId) {
      const autoSave = async () => {
        try {
          const saveData = { ...state, lastPlayed: new Date().toISOString() }
          localStorage.setItem(saveId, JSON.stringify(saveData))
        } catch (error) {
          console.error('Auto-save failed:', error)
        }
      }

      const interval = setInterval(autoSave, 30000)
      return () => clearInterval(interval)
    }
  }, [state.profile, saveId])

  // Detect items registry readiness
  const registryReady =
    !!items && Object.keys(items).length > 0 &&
    !!items.hunting_rifle && !!items.fishing_rod && !!items.shovel && !!items.phone && !!items.blanket_common &&
    !!items.salmon && !!items.trout && !!items.revival_bill

  // Friendly fallback UI if registry is not ready to prevent blank screen
  if (!registryReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 text-center">
          <div className="w-6 h-6 mx-auto mb-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-lg font-semibold mb-1">Initializing game...</h2>
          <p className="text-sm text-neutral-400">Loading items and context. If this takes more than a second, click refresh.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const actions: GameActions = {
    setWallet: (amount) => setState(prev => ({ ...prev, wallet: amount })),
    setBank: (amount) => setState(prev => ({ ...prev, bank: amount })),
    depositAll: () => {
      setState(prev => ({
        ...prev,
        bank: prev.bank + prev.wallet,
        wallet: 0
      }))
    },
    deposit: (amount) => {
      const amt = Math.max(0, Math.floor(amount))
      if (!Number.isFinite(amt) || amt <= 0) return
      setState(prev => {
        const usable = Math.min(amt, prev.wallet)
        if (usable <= 0) return prev
        return { ...prev, wallet: prev.wallet - usable, bank: prev.bank + usable }
      })
    },
    withdrawAll: () => {
      setState(prev => ({
        ...prev,
        wallet: prev.wallet + prev.bank,
        bank: 0
      }))
    },
    withdraw: (amount) => {
      const amt = Math.max(0, Math.floor(amount))
      if (!Number.isFinite(amt) || amt <= 0) return
      setState(prev => {
        const usable = Math.min(amt, prev.bank)
        if (usable <= 0) return prev
        return { ...prev, wallet: prev.wallet + usable, bank: prev.bank - usable }
      })
    },
    stashMoney: (amount) => {
      const amt = Math.max(0, Math.floor(amount))
      if (!Number.isFinite(amt) || amt <= 0) return
      setState(prev => {
        const usable = Math.min(amt, prev.wallet)
        if (usable <= 0) return prev
        return { ...prev, wallet: prev.wallet - usable, stash: (prev.stash ?? 0) + usable }
      })
    },
    unstashMoney: (amount) => {
      const amt = Math.max(0, Math.floor(amount))
      if (!Number.isFinite(amt) || amt <= 0) return
      setState(prev => {
        const usable = Math.min(amt, prev.stash ?? 0)
        if (usable <= 0) return prev
        return { ...prev, wallet: prev.wallet + usable, stash: (prev.stash ?? 0) - usable }
      })
    },
    addToWallet: (amount) => {
      setState(prev => ({
        ...prev,
        wallet: prev.wallet + amount,
        profile: {
          ...prev.profile,
          totalEarnings: prev.profile.totalEarnings + amount
        }
      }))
    },
    deductFromWallet: (amount) => {
      setState(prev => ({
        ...prev,
        wallet: Math.max(0, prev.wallet - amount)
      }))
    },
    setSeed: (seed) => setState(prev => ({ ...prev, seed })),
    toggleRNGMode: () => {
      setState(prev => ({ 
        ...prev, 
        useSeededRNG: !prev.useSeededRNG 
      }))
    },
    // Inventory actions
    addItem: (itemId, quantity = 1) => {
      const def = items[itemId]
      if (!def) return

      setState(prev => {
        const inv = prev.inventory.slice()
        const existingIndex = inv.findIndex(it => it.id === itemId)

        if (existingIndex !== -1 && isStackable(def)) {
          // Item is stackable and already exists, increase quantity
          inv[existingIndex] = {
            ...inv[existingIndex],
            quantity: (inv[existingIndex].quantity || 1) + quantity
          }
        } else {
          // Item is not stackable or doesn't exist, add new entry
          inv.push({
            id: itemId,
            quantity: isStackable(def) ? quantity : undefined
          })
        }

        return { ...prev, inventory: inv }
      })
    },
    removeItem: (itemId) => {
      setState(prev => {
        const idx = prev.inventory.findIndex(it => it.id === itemId)
        if (idx === -1) return prev
        const nextInv = prev.inventory.slice()
        nextInv.splice(idx, 1)
        return { ...prev, inventory: nextInv }
      })
    },
    equipItem: (slot, itemId) => {
      const owned = state.inventory.find(it => it.id === itemId)
      if (!owned) return
      setState(prev => ({
        ...prev,
        equipped: { ...prev.equipped, [slot]: owned }
      }))
    },
    useItem: (itemId) => {
      const def = items[itemId]
      if (!def) return { broken: false, remaining: 0 }
      let broken = false
      let remaining = 0
      setState(prev => {
        const idx = prev.inventory.findIndex(it => it.id === itemId)
        if (idx === -1) return prev
        const inv = prev.inventory.slice()
        const owned = { ...inv[idx] }

        // Use breakChance to determine if item breaks
        const willBreak = Math.random() < def.breakChance
        if (willBreak) {
          // Item broke - remove from inventory entirely
          inv.splice(idx, 1)
          broken = true
        } else if (isStackable(def) && owned.quantity && owned.quantity > 1) {
          // Stackable item, decrease quantity
          inv[idx] = { ...owned, quantity: owned.quantity - 1 }
        } else if (isStackable(def)) {
          // Stackable item with quantity 1, remove from inventory
          inv.splice(idx, 1)
        }
        // Non-stackable items (weapons, etc.) stay in inventory unless they break
        return { ...prev, inventory: inv }
      })
      return { broken, remaining }
    },
    applyBoostFromItem: (itemId) => {
      const def = items[itemId]
      if (!def || !def.boost) return
      const { type, multiplier, uses } = def.boost

      setState(prev => {
        const inv = prev.inventory.slice()
        const idx = inv.findIndex(it => it.id === itemId)
        if (idx === -1) return prev

        const owned = { ...inv[idx] }

        if (isStackable(def) && owned.quantity && owned.quantity > 1) {
          // Stackable item, decrease quantity
          inv[idx] = { ...owned, quantity: owned.quantity - 1 }
        } else {
          // Non-stackable item or last item in stack - remove from inventory
          inv.splice(idx, 1)
        }

        const boosts = prev.activeBoosts.slice()
        boosts.push({ type, multiplier, uses })
        return { ...prev, inventory: inv, activeBoosts: boosts }
      })
    },
    consumeBoostUse: (type) => {
      setState(prev => {
        const boosts = prev.activeBoosts.slice()
        for (let i = 0; i < boosts.length; i++) {
          if (boosts[i].type === type && boosts[i].uses > 0) {
            boosts[i] = { ...boosts[i], uses: boosts[i].uses - 1 }
            if (boosts[i].uses <= 0) boosts.splice(i, 1)
            break
          }
        }
        return { ...prev, activeBoosts: boosts }
      })
    },
    applyForJob: (jobId) => {
      const job = jobs[jobId]
      if (!job) return { ok: false, reason: 'Job not found' }
      // requirements
      if (job.requirements?.minWTC && state.wallet < job.requirements.minWTC) {
        return { ok: false, reason: `Requires at least ${job.requirements.minWTC} WTC in wallet` }
      }
      if (job.requirements?.requiredItemId) {
        const hasItem = state.inventory.some((i) => i.id === job.requirements!.requiredItemId)
        if (!hasItem) return { ok: false, reason: 'Missing required item' }
      }
      setState(prev => ({ ...prev, currentJobId: jobId }))
      return { ok: true }
    },
    resignJob: () => {
      setState(prev => ({ ...prev, currentJobId: undefined }))
    },
    loseJob: () => {
      setState(prev => ({
        ...prev,
        currentJobId: undefined,
        profile: {
          ...prev.profile,
          job: undefined
        }
      }))
    },
    // Shop actions
    refreshShop: () => {
      // build candidate list excluding essentials
      const essentials = new Set(state.shop.essentials)
      const allIds = Object.keys(items).filter(id => !essentials.has(id))
      // simple shuffle
      for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[allIds[i], allIds[j]] = [allIds[j], allIds[i]]
      }
      const rotating = allIds.slice(0, 6)
      setState(prev => ({
        ...prev,
        shop: {
          ...prev.shop,
          rotatingIds: rotating,
          nextRefreshAt: Date.now() + 60 * 60 * 1000
        }
      }))
    },
    buyItem: (itemId: string, qty: number, source: 'wallet' | 'bank') => {
      const def = items[itemId]
      if (!def) return false
      const total = def.value * Math.max(1, Math.floor(qty))
      let success = false
      setState(prev => {
        const balance = source === 'wallet' ? prev.wallet : prev.bank
        if (balance < total) return prev
        success = true
        const newInv = prev.inventory.slice()

        const existingIndex = newInv.findIndex(it => it.id === itemId)
        if (existingIndex !== -1 && isStackable(def)) {
          // Item is stackable and already exists, increase quantity
          const existing = newInv[existingIndex]
          newInv[existingIndex] = {
            ...existing,
            quantity: (existing.quantity || 1) + qty
          }
        } else {
          // Item is not stackable or doesn't exist, add new entry
          newInv.push({
            id: itemId,
            quantity: isStackable(def) ? qty : undefined
          })
        }

        return {
          ...prev,
          wallet: source === 'wallet' ? prev.wallet - total : prev.wallet,
          bank: source === 'bank' ? prev.bank - total : prev.bank,
          inventory: newInv,
          profile: {
            ...prev.profile,
            totalSpent: prev.profile.totalSpent + total
          }
        }
      })
      return success
    },
    // Profile actions
    updateUsername: (username) => {
      const trimmed = username.trim()
      if (!trimmed) return

      const newPlayerId = generatePlayerId()
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          username: trimmed,
          playerId: newPlayerId
        }
      }))

      try {
        localStorage.setItem('username', trimmed)
        localStorage.setItem('playerId', newPlayerId)
        localStorage.setItem('setup-complete', 'true')
      } catch (error) {
        console.warn('Failed to persist updated username/playerId', error)
      }
    },
    updateDescription: (description) => {
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile, description }
      }))
    },
    trackActivity: (activity) => {
      setState(prev => {
        // Give XP for activity completion
        const xpReward = getActivityXP(activity)

        return {
          ...prev,
          profile: {
            ...prev.profile,
            activityUsage: {
              ...prev.profile.activityUsage,
              [activity]: (prev.profile.activityUsage[activity] || 0) + 1
            }
          }
        }
      })

      // Give XP and check achievements
      actions.gainXP(getActivityXP(activity))
      actions.checkAchievements()
    },
    trackEarnings: (amount) => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalEarnings: prev.profile.totalEarnings + amount
        }
      }))
    },
    trackSpending: (amount) => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalSpent: prev.profile.totalSpent + amount
        }
      }))
    },
    markSecretFound: (secret) => {
      let achievementId: string | null = null
      let titleReward: string | null = null

      if (secret === 'retro') {
        achievementId = 'retro_rewind'
        titleReward = 'Time Traveler'
      } else if (secret === 'cheat') {
        achievementId = 'glitch_hunter'
        titleReward = 'Glitch Hunter'
      }

      setState(prev => {
        const alreadyUnlocked = secret === 'retro' ? prev.secrets.retroUnlocked : prev.secrets.cheatUnlocked
        if (alreadyUnlocked) return prev

        const updatedSecrets = {
          ...prev.secrets,
          retroUnlocked: secret === 'retro' ? true : prev.secrets.retroUnlocked,
          cheatUnlocked: secret === 'cheat' ? true : prev.secrets.cheatUnlocked
        }

        const activityKey = secret === 'retro' ? 'secrets_retro' : 'secrets_cheat'
        const updatedActivityUsage = {
          ...prev.profile.activityUsage,
          [activityKey]: (prev.profile.activityUsage[activityKey] || 0) + 1
        }

        const updatedProfile = {
          ...prev.profile,
          activityUsage: updatedActivityUsage,
          unlockedAchievements: achievementId && !prev.profile.unlockedAchievements.includes(achievementId)
            ? [...prev.profile.unlockedAchievements, achievementId]
            : prev.profile.unlockedAchievements,
          availableTitles: titleReward && !prev.profile.availableTitles.includes(titleReward)
            ? [...prev.profile.availableTitles, titleReward]
            : prev.profile.availableTitles
        }

        try {
          localStorage.setItem(`secret-${secret}`, 'unlocked')
        } catch (error) {
          console.warn('Failed to persist secret unlock state', error)
        }

        return {
          ...prev,
          secrets: updatedSecrets,
          profile: updatedProfile
        }
      })

      setTimeout(() => {
        actions.checkAchievements()
      }, 0)
    },
    // Garden actions
    plantInGarden: (plotId, plantId) => {
      setState(prev => {
        const plots = prev.garden.plots.map(plot =>
          plot.id === plotId
            ? plantId === null
              ? {
                  id: plot.id,
                  plantId: null,
                  plantedAt: 0,
                  wateredCount: 0,
                  growthProgress: 0,
                  isReady: false
                }
              : {
                  ...plot,
                  plantId,
                  plantedAt: Date.now(),
                  wateredCount: 0,
                  growthProgress: 0,
                  isReady: false
                }
            : plot
        )
        return { ...prev, garden: { ...prev.garden, plots } }
      })
    },
    waterPlant: (plotId) => {
      setState(prev => {
        const plots = prev.garden.plots.map(plot =>
          plot.id === plotId && plot.plantId && !plot.isReady
            ? { ...plot, wateredCount: Math.min(plot.wateredCount + 1, 10) } // Max 10 waterings
            : plot
        )
        return { ...prev, garden: { ...prev.garden, plots } }
      })
    },
    harvestPlant: (plotId) => {
      setState(prev => {
        const plot = prev.garden.plots.find(p => p.id === plotId)
        if (!plot || !plot.plantId || !plot.isReady) return prev

        const plots = prev.garden.plots.map(p =>
          p.id === plotId
            ? {
                id: p.id,
                plantId: null,
                plantedAt: 0,
                wateredCount: 0,
                growthProgress: 0,
                isReady: false
              }
            : p
        )
        return { ...prev, garden: { ...prev.garden, plots } }
      })
    },
    equipScarecrow: () => {
      const hasScarecrow = state.inventory.some(item => item.id === 'scarecrow')
      if (!hasScarecrow) return

      setState(prev => ({ ...prev, garden: { ...prev.garden, scarecrowEquipped: true } }))
    },
    unequipScarecrow: () => {
      setState(prev => ({ ...prev, garden: { ...prev.garden, scarecrowEquipped: false } }))
    },
    updateGardenGrowth: () => {
      setState(prev => {
        const now = Date.now()
        const timeDiff = (now - prev.garden.lastCheckTime) / 1000 // seconds

        const plots = prev.garden.plots.map(plot => {
          if (!plot.plantId || plot.isReady) return plot

          const plant = items[plot.plantId]
          if (!plant) return plot

          // Simple growth calculation (this would be more complex in a real game)
          const growthRate = 0.01 // Base growth per second
          const newProgress = Math.min(100, plot.growthProgress + (growthRate * timeDiff))

          return {
            ...plot,
            growthProgress: newProgress,
            isReady: newProgress >= 100
          }
        })

        return {
          ...prev,
          garden: {
            ...prev.garden,
            plots,
            lastCheckTime: now
          }
        }
      })
    },
    // Achievement and Level actions
    gainXP: (amount) => {
      setState(prev => {
        const newXP = prev.profile.xp + amount
        const newLevel = prev.profile.level
        const xpToNext = prev.profile.xpToNextLevel

        // Check if level up
        if (newXP >= xpToNext && newLevel < 50) {
          const levelUpXP = xpToNext * 1.5 // XP requirement increases by 50% each level
          const rewards = getLevelRewards(newLevel + 1)

          // Apply level rewards
          let newWallet = prev.wallet
          let newInventory = prev.inventory

          if (rewards.wtc) {
            newWallet += rewards.wtc
          }

          if (rewards.items) {
            rewards.items.forEach(itemId => {
              const def = items[itemId]
              if (!def) return

              const existingIndex = newInventory.findIndex(it => it.id === itemId)
              if (existingIndex !== -1 && isStackable(def)) {
                newInventory[existingIndex] = {
                  ...newInventory[existingIndex],
                  quantity: (newInventory[existingIndex].quantity || 1) + 1
                }
              } else {
                newInventory.push({
                  id: itemId,
                  quantity: isStackable(def) ? 1 : undefined
                })
              }
            })
          }

          // Check for level achievements
          actions.checkAchievements()

          return {
            ...prev,
            wallet: newWallet,
            inventory: newInventory,
            profile: {
              ...prev.profile,
              level: newLevel + 1,
              xp: newXP - xpToNext,
              xpToNextLevel: levelUpXP,
              availableTitles: [...new Set([...prev.profile.availableTitles, ...(rewards.titles || [])])]
            }
          }
        }

        return {
          ...prev,
          profile: {
            ...prev.profile,
            xp: newXP
          }
        }
      })
    },
    checkAchievements: () => {
      const unlockedIds: string[] = []

      Object.values(achievements).forEach(achievement => {
        if (state.profile.unlockedAchievements.includes(achievement.id)) return

        let shouldUnlock = false

        switch (achievement.condition.type) {
          case 'activity_count':
            if (achievement.condition.target === 'any') {
              const totalActivities = Object.values(state.profile.activityUsage).reduce((sum, count) => sum + count, 0)
              shouldUnlock = totalActivities >= (achievement.condition.count || 0)
            } else {
              const count = state.profile.activityUsage[achievement.condition.target as string] || 0
              shouldUnlock = count >= (achievement.condition.count || 0)
            }
            break

          case 'total_wtc':
            shouldUnlock = state.profile.totalEarnings >= (achievement.condition.target as number)
            break

          case 'level_reached':
            shouldUnlock = state.profile.level >= (achievement.condition.target as number)
            break

          case 'death_count':
            shouldUnlock = state.profile.deathCount >= (achievement.condition.target as number)
            break

          case 'item_collected':
            shouldUnlock = state.inventory.length >= (achievement.condition.target as number)
            break
        }

        if (shouldUnlock) {
          unlockedIds.push(achievement.id)
        }
      })

      if (unlockedIds.length > 0) {
        unlockedIds.forEach(id => actions.unlockAchievement(id))
      }
    },
    unlockAchievement: (achievementId) => {
      const achievement = achievements[achievementId]
      if (!achievement) return

      setState(prev => {
        if (prev.profile.unlockedAchievements.includes(achievementId)) return prev

        // Apply achievement rewards
        let newWallet = prev.wallet
        let newInventory = prev.inventory
        let newTitles = prev.profile.availableTitles

        if (achievement.reward?.wtc) {
          newWallet += achievement.reward.wtc
        }

        if (achievement.reward?.items) {
          achievement.reward.items.forEach(itemId => {
            const def = items[itemId]
            if (!def) return

            const existingIndex = newInventory.findIndex(it => it.id === itemId)
            if (existingIndex !== -1 && isStackable(def)) {
              newInventory[existingIndex] = {
                ...newInventory[existingIndex],
                quantity: (newInventory[existingIndex].quantity || 1) + 1
              }
            } else {
              newInventory.push({
                id: itemId,
                quantity: isStackable(def) ? 1 : undefined
              })
            }
          })
        }

        if (achievement.reward?.title) {
          newTitles = [...new Set([...newTitles, achievement.reward.title])]
        }

        return {
          ...prev,
          wallet: newWallet,
          inventory: newInventory,
          profile: {
            ...prev.profile,
            unlockedAchievements: [...prev.profile.unlockedAchievements, achievementId],
            availableTitles: newTitles
          }
        }
      })
    },
    equipTitle: (titleId) => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          equippedTitle: titleId
        }
      }))
    },
    unequipTitle: () => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          equippedTitle: undefined
        }
      }))
    },
    recordDeath: () => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          deathCount: prev.profile.deathCount + 1
        }
      }))
      actions.checkAchievements()
    },
    updatePlayTime: (seconds) => {
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalTimePlayed: prev.profile.totalTimePlayed + seconds
        }
      }))
    },
    // Sell actions
    sellItem: (itemId: string, quantity: number): boolean => {
      const def = items[itemId]
      if (!def) return false

      const qty = Math.max(1, Math.floor(quantity))
      let success = false

      setState(prev => {
        const idx = prev.inventory.findIndex(it => it.id === itemId)
        if (idx === -1) return prev

        const inv = prev.inventory.slice()
        const owned = { ...inv[idx] }

        // Calculate how many we can actually sell
        const availableQuantity = owned.quantity || 1
        const sellQuantity = Math.min(qty, availableQuantity)

        if (sellQuantity <= 0) return prev

        const totalValue = def.value * sellQuantity

        // Update inventory
        if (isStackable(def) && owned.quantity && owned.quantity > sellQuantity) {
          // Stackable item, decrease quantity
          inv[idx] = { ...owned, quantity: owned.quantity - sellQuantity }
        } else {
          // Non-stackable item or selling entire stack - remove from inventory
          inv.splice(idx, 1)
        }

        success = true

        return {
          ...prev,
          inventory: inv,
          wallet: prev.wallet + totalValue,
          profile: {
            ...prev.profile,
            totalSpent: prev.profile.totalSpent - totalValue // Selling counts as negative spending
          }
        }
      })

      return success
    },
    // Settings actions
    updateSettings: (newSettings) => {
      setState(prev => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings }
      }))
    },
    // Character actions
    createCharacter: (characterData) => {
      setState(prev => ({
        ...prev,
        character: characterData
      }))
    },
    // User data actions
    saveGameData: async () => {
      try {
        // Validate game state before saving (anti-cheat)
        const isValid = await invoke('validate_game_state', {
          playerId: state.profile.playerId,
          gameState: JSON.stringify(state)
        }) as boolean

        if (!isValid) {
          console.error('Game state validation failed - possible cheating detected')
          // Don't save corrupted data
          return false
        }

        // Ensure we have a valid player ID for the save file name
        const playerId = state.profile.playerId || 'default'
        const saveData = {
          ...state,
          lastSaved: Date.now(),
          version: '1.0.0'
        }

        await invoke('save_game', {
          data: JSON.stringify(saveData),
          playerId: playerId
        })

        // Also save to localStorage as backup
        localStorage.setItem(`game_save_${playerId}`, JSON.stringify(saveData))

        return true
      } catch (error) {
        console.error('Error saving game data:', error)
        // Try localStorage fallback
        try {
          const playerId = state.profile.playerId || 'default'
          const saveData = {
            ...state,
            lastSaved: Date.now(),
            version: '1.0.0'
          }
          localStorage.setItem(`game_save_${playerId}`, JSON.stringify(saveData))
          return true
        } catch (localError) {
          console.error('LocalStorage save also failed:', localError)
          return false
        }
      }
    },
    loadGameData: async (): Promise<boolean> => {
      try {
        // Check if player is banned first
        const isBanned = await invoke('is_player_banned', {
          playerId: state.profile.playerId || 'default'
        }) as boolean

        if (isBanned) {
          const banReason = await invoke('get_ban_reason', {
            playerId: state.profile.playerId || 'default'
          }) as string

          console.error(`Player is banned: ${banReason}`)
          // You might want to show a ban message to the user here
          return false
        }

        // Try to load from Tauri backend first
        const playerId = state.profile.playerId || 'default'
        const data = await invoke('load_game', { playerId: playerId }) as string

        if (data) {
          const loadedState = JSON.parse(data)

          // Validate loaded state (anti-cheat)
          const isValid = await invoke('validate_game_state', {
            playerId: playerId,
            gameState: JSON.stringify(loadedState)
          }) as boolean

          if (!isValid) {
            console.error('Loaded game state validation failed - possible corrupted save')
            // Don't load corrupted data, use default state instead
            return false
          }

          // Validate the loaded data has required fields
          if (loadedState.profile && loadedState.profile.playerId) {
            setState(prev => ({ ...prev, ...loadedState }))
            return true
          }
        }

        // Fallback to localStorage
        const localData = localStorage.getItem(`game_save_${playerId}`)
        if (localData) {
          const loadedState = JSON.parse(localData)

          // Validate localStorage state too
          const isValid = await invoke('validate_game_state', {
            playerId: playerId,
            gameState: JSON.stringify(loadedState)
          }) as boolean

          if (isValid && loadedState.profile && loadedState.profile.playerId) {
            setState(prev => ({ ...prev, ...loadedState }))
            return true
          }
        }

        return false
      } catch (error) {
        console.error('Error loading game data:', error)

        // Try localStorage fallback
        try {
          const playerId = state.profile.playerId || 'default'
          const localData = localStorage.getItem(`game_save_${playerId}`)
          if (localData) {
            const loadedState = JSON.parse(localData)

            // Validate even localStorage data
            const isValid = await invoke('validate_game_state', {
              playerId: playerId,
              gameState: JSON.stringify(loadedState)
            }) as boolean

            if (isValid && loadedState.profile && loadedState.profile.playerId) {
              setState(prev => ({ ...prev, ...loadedState }))
              return true
            }
          }
        } catch (localError) {
          console.error('LocalStorage load also failed:', localError)
        }

        return false
      }
    },
    initializeNewUser: (userId: string, username: string) => {
      const newProfile = {
        username,
        description: 'Just started my journey...',
        playerId: userId,
        totalEarnings: 0,
        totalSpent: 0,
        activityUsage: {},
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        unlockedAchievements: [],
        availableTitles: [],
        deathCount: 0,
        totalTimePlayed: 0,
      }

      setState(prev => ({ ...prev, profile: newProfile }))
    },
    // Anti-cheat actions
    validateGameState: async (): Promise<boolean> => {
      try {
        return await invoke('validate_game_state', {
          playerId: state.profile.playerId,
          gameState: JSON.stringify(state)
        }) as boolean
      } catch (error) {
        console.error('Error validating game state:', error)
        return false
      }
    },
    banPlayer: async (playerId: string, reason: string): Promise<boolean> => {
      try {
        await invoke('ban_player', {
          playerId: playerId,
          reason: reason
        })
        return true
      } catch (error) {
        console.error('Error banning player:', error)
        return false
      }
    },
    isPlayerBanned: async (playerId: string): Promise<boolean> => {
      try {
        return await invoke('is_player_banned', {
          playerId: playerId
        }) as boolean
      } catch (error) {
        console.error('Error checking ban status:', error)
        return false
      }
    },
    getBanReason: async (playerId: string): Promise<string> => {
      try {
        return await invoke('get_ban_reason', {
          playerId: playerId
        }) as string
      } catch (error) {
        console.error('Error getting ban reason:', error)
        return ''
      }
    },
  }

  // Load game data on mount
  useEffect(() => {
    actions.loadGameData()
  }, [])

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
