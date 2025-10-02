import { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import { useNotify } from '../contexts/NotifyContext'

interface HiddenAchievement {
  id: string
  name: string
  description: string
  condition: (state: any) => boolean
  reward: {
    title?: string
    item?: string
    wtc?: number
  }
  isHidden: boolean
  unlockMessage: string
}

// Hidden achievements that unlock Easter eggs
const hiddenAchievements: HiddenAchievement[] = [
  {
    id: 'easter_egg_hunter',
    name: 'Easter Egg Hunter',
    description: 'Found all hidden secrets in the game',
    condition: (state) => {
      // Check if player has found multiple secrets
      const secretCount = Object.values(state.secrets || {}).filter(Boolean).length
      return secretCount >= 3
    },
    reward: { title: 'Secret Keeper', item: 'mystery_box' },
    isHidden: true,
    unlockMessage: '🎉 You\'ve discovered the hidden achievement system!'
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Completed 50 activities in under 24 hours',
    condition: (state) => {
      const totalActivities = Object.values(state.profile?.activityUsage || {}).reduce<number>((sum, value) => {
        const count = typeof value === 'number' ? value : 0
        return sum + count
      }, 0)
      const playTime = state.profile?.totalTimePlayed || 0
      return totalActivities >= 50 && playTime < 24 * 60 * 60 // 24 hours in seconds
    },
    reward: { title: 'Speed Demon', wtc: 1000 },
    isHidden: true,
    unlockMessage: '⚡ Lightning fast! You\'re a natural!'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieved level 25 without dying once',
    condition: (state) => {
      return (state.profile?.level || 0) >= 25 && (state.profile?.deathCount || 0) === 0
    },
    reward: { title: 'Flawless', item: 'invincibility_potion' },
    isHidden: true,
    unlockMessage: '🌟 Perfection achieved! You\'re untouchable!'
  },
  {
    id: 'jack_of_all_trades',
    name: 'Jack of All Trades',
    description: 'Used every activity type at least 10 times',
    condition: (state) => {
      const activities = state.profile?.activityUsage || {}
      const activityTypes = ['Search', 'Crime', 'Work', 'Hunt', 'Fish', 'Dig', 'Post', 'Stream', 'Explore', 'Garden']
      return activityTypes.every(type => (activities[type] || 0) >= 10)
    },
    reward: { title: 'Master of All', wtc: 500 },
    isHidden: true,
    unlockMessage: '🎭 You\'re a master of every trade!'
  },
  {
    id: 'lucky_duck',
    name: 'Lucky Duck',
    description: 'Found 10 rare items in a single day',
    condition: (state) => {
      // This would need to track daily rare item finds
      // For now, check total rare items owned
      const rareItems = (state.inventory ?? []).filter((item: { tier?: string }) => {
        // Check if item is rare tier
        return item.tier === 'rare' || item.tier === 'epic'
      }).length || 0
      return rareItems >= 10
    },
    reward: { item: 'lucky_charm' },
    isHidden: true,
    unlockMessage: '🍀 Luck is on your side today!'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Played for 12 hours straight after midnight',
    condition: (state) => {
      // This would need session tracking
      // For now, just check if it's late at night
      const hour = new Date().getHours()
      return hour >= 0 && hour <= 6 // Between midnight and 6 AM
    },
    reward: { title: 'Night Owl', item: 'midnight_snack' },
    isHidden: true,
    unlockMessage: '🦉 Who needs sleep when you have adventures?'
  }
]

// Easter egg triggers
const easterEggs = [
  {
    trigger: 'konami',
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    reward: { title: 'Retro Gamer', item: 'arcade_machine' },
    message: '🎮 Konami Code activated! Old school gaming unlocked!'
  },
  {
    trigger: 'doom',
    sequence: ['KeyI', 'KeyD', 'KeyD', 'KeyQ', 'KeyD'],
    reward: { title: 'Doom Slayer', item: 'bfg_9000' },
    message: '🚀 Doom reference detected! Weapon unlocked!'
  },
  {
    trigger: 'matrix',
    sequence: ['KeyR', 'KeyE', 'KeyD', 'KeyP', 'KeyI', 'KeyL', 'KeyL'],
    reward: { title: 'The One', item: 'red_pill' },
    message: '💊 Welcome to the real world...'
  }
]

export function useHiddenAchievements() {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [unlockedHidden, setUnlockedHidden] = useState<string[]>([])
  const [keySequence, setKeySequence] = useState<string[]>([])

  // Check for hidden achievements
  useEffect(() => {
    hiddenAchievements.forEach(achievement => {
      if (!unlockedHidden.includes(achievement.id) && achievement.condition(state)) {
        setUnlockedHidden(prev => [...prev, achievement.id])

        // Apply rewards
        if (achievement.reward.title) {
          actions.equipTitle(achievement.reward.title)
        }
        if (achievement.reward.item) {
          actions.addItem(achievement.reward.item)
        }
        if (achievement.reward.wtc) {
          actions.addToWallet(achievement.reward.wtc)
        }

        notify({
          type: 'success',
          title: '🎉 Hidden Achievement Unlocked!',
          message: `${achievement.name}: ${achievement.unlockMessage}`
        })
      }
    })
  }, [state, unlockedHidden, actions, notify])

  // Easter egg keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...keySequence, event.code].slice(-10) // Keep last 10 keys
      setKeySequence(newSequence)

      // Check for easter eggs
      easterEggs.forEach(egg => {
        if (newSequence.length >= egg.sequence.length) {
          const lastKeys = newSequence.slice(-egg.sequence.length)
          if (JSON.stringify(lastKeys) === JSON.stringify(egg.sequence)) {
            // Easter egg activated!
            if (egg.reward.title) {
              actions.equipTitle(egg.reward.title)
            }
            if (egg.reward.item) {
              actions.addItem(egg.reward.item)
            }

            notify({
              type: 'success',
              title: '🎊 Easter Egg Found!',
              message: egg.message
            })

            // Reset sequence
            setKeySequence([])
          }
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keySequence, actions, notify])

  return {
    unlockedHidden,
    totalHidden: hiddenAchievements.length,
    easterEggProgress: keySequence
  }
}

// Achievement chains system
interface AchievementChain {
  id: string
  name: string
  description: string
  steps: {
    id: string
    name: string
    condition: (state: any) => boolean
    reward?: { wtc?: number, item?: string }
  }[]
  chainReward: { title?: string, item?: string, wtc?: number }
}

const achievementChains: AchievementChain[] = [
  {
    id: 'wealth_chain',
    name: 'Path to Wealth',
    description: 'Build your fortune step by step',
    steps: [
      {
        id: 'first_100',
        name: 'First 100 WTC',
        condition: (state) => (state.wallet + state.bank + (state.stash || 0)) >= 100,
        reward: { wtc: 10 }
      },
      {
        id: 'first_1000',
        name: 'First 1000 WTC',
        condition: (state) => (state.wallet + state.bank + (state.stash || 0)) >= 1000,
        reward: { wtc: 50 }
      },
      {
        id: 'first_10000',
        name: 'First 10,000 WTC',
        condition: (state) => (state.wallet + state.bank + (state.stash || 0)) >= 10000,
        reward: { item: 'gold_watch' }
      }
    ],
    chainReward: { title: 'Wealthy', wtc: 100 }
  }
]

export function useAchievementChains() {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [completedChains, setCompletedChains] = useState<string[]>([])
  const [chainProgress, setChainProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    achievementChains.forEach(chain => {
      const completedSteps = chain.steps.filter(step => step.condition(state)).length
      const previousProgress = chainProgress[chain.id] || 0

      setChainProgress(prev => ({ ...prev, [chain.id]: completedSteps }))

      // Check if chain is completed
      if (completedSteps === chain.steps.length && !completedChains.includes(chain.id)) {
        setCompletedChains(prev => [...prev, chain.id])

        // Apply chain reward
        if (chain.chainReward.title) {
          actions.equipTitle(chain.chainReward.title)
        }
        if (chain.chainReward.item) {
          actions.addItem(chain.chainReward.item)
        }
        if (chain.chainReward.wtc) {
          actions.addToWallet(chain.chainReward.wtc)
        }

        notify({
          type: 'success',
          title: '🏆 Achievement Chain Complete!',
          message: `${chain.name}: ${chain.description}`
        })
      }

      // Award step rewards
      chain.steps.forEach((step, index) => {
        if (completedSteps > previousProgress && index < completedSteps) {
          if (step.reward) {
            if (step.reward.wtc) actions.addToWallet(step.reward.wtc)
            if (step.reward.item) actions.addItem(step.reward.item)

            notify({
              type: 'success',
              title: 'Chain Step Complete!',
              message: `${step.name} - Reward earned!`
            })
          }
        }
      })
    })
  }, [state, chainProgress, completedChains, actions, notify])

  return {
    chains: achievementChains,
    progress: chainProgress,
    completed: completedChains
  }
}
