import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'

const FISH_ITEM_ID = 'fishing_rod'

// Fishing locations
const fishingLocations = {
  river: {
    id: 'river',
    name: 'River',
    description: 'A calm freshwater river perfect for beginners.',
    // Fish drop chances by tier (0.0 to 1.0)
    fishDropChances: {
      common: 0.6,
      uncommon: 0.3,
      rare: 0.08,
      epic: 0.015,
      legendary: 0.004,
      mythical: 0.001,
      wdyft: 0.0005
    },
    // Item drop chances by tier (0.0 to 1.0)
    itemDropChances: {
      useless: 0.1,
      common: 0.2,
      uncommon: 0.15,
      rare: 0.1,
      epic: 0.05,
      legendary: 0.02,
      mythical: 0.01,
      wdyft: 0.005
    },
    // Special effects
    specialEffect: 'Higher chance of common fish'
  },
  sea: {
    id: 'sea',
    name: 'Sea',
    description: 'Open waters with diverse marine life.',
    // Fish drop chances by tier (0.0 to 1.0)
    fishDropChances: {
      common: 0.4,
      uncommon: 0.4,
      rare: 0.15,
      epic: 0.04,
      legendary: 0.008,
      mythical: 0.002,
      wdyft: 0.001
    },
    // Item drop chances by tier (0.0 to 1.0)
    itemDropChances: {
      useless: 0.08,
      common: 0.18,
      uncommon: 0.18,
      rare: 0.12,
      epic: 0.06,
      legendary: 0.025,
      mythical: 0.012,
      wdyft: 0.006
    },
    // Special effects
    specialEffect: 'Balanced fish and item chances'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep ocean waters with rare and exotic species.',
    // Fish drop chances by tier (0.0 to 1.0)
    fishDropChances: {
      common: 0.2,
      uncommon: 0.3,
      rare: 0.3,
      epic: 0.15,
      legendary: 0.04,
      mythical: 0.008,
      wdyft: 0.002
    },
    // Item drop chances by tier (0.0 to 1.0)
    itemDropChances: {
      useless: 0.05,
      common: 0.1,
      uncommon: 0.15,
      rare: 0.2,
      epic: 0.15,
      legendary: 0.08,
      mythical: 0.04,
      wdyft: 0.02
    },
    // Special effects
    specialEffect: 'Higher chance of rare fish and items'
  }
}

interface FishActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onFishComplete: () => void
}

export default function FishActivity({ isOnCooldown, cooldownTime, onCooldownChange, onFishComplete }: FishActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedLocation, setSelectedLocation] = useState<string | null>('river')
  const [showLocationSelect, setShowLocationSelect] = useState(false)
  const [fishResults, setFishResults] = useState<{
    fish?: string[]
    items?: string[]
    stash?: { wtcReward: number, epicItems?: string[], wdyftItem?: string }
    rodBroke?: boolean
  } | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const hasFishingRod = state.inventory.some(item => item.id === FISH_ITEM_ID)
  const location = selectedLocation ? fishingLocations[selectedLocation as keyof typeof fishingLocations] : null

  const handleStartFishing = () => {
    if (isOnCooldown || isTransitioning) return

    if (!hasFishingRod) {
      notify({ type: 'info', title: 'Item required', message: 'You need a Fishing Rod to fish.' })
      return
    }

    if (!location) {
      notify({ type: 'error', title: 'No location selected', message: 'Please select a fishing location.' })
      return
    }

    setIsTransitioning(true)

    // Use fishing rod and check for breaking
    const { broken } = actions.useItem(FISH_ITEM_ID)
    let rodBroke = false

    if (broken) {
      rodBroke = true
      notify({ type: 'error', title: 'Rod broke!', message: 'Your Fishing Rod broke!' })
    }

    // Track activity usage (only if rod didn't break)
    if (!broken) {
      actions.trackActivity(`Fish: ${location.name}`)
    }

    const results: {
      fish?: string[]
      items?: string[]
      stash?: { wtcReward: number, epicItems?: string[], wdyftItem?: string }
      rodBroke?: boolean
    } = {}

    // Generate fish catches (0-50 fish)
    const fishCount = gameRNG.nextInt(0, 50)
    const caughtFish: string[] = []

    for (let i = 0; i < fishCount; i++) {
      const fishTier = gameRNG.getRandomTier(location.fishDropChances)
      if (fishTier) {
        const tierFish = Object.values(items).filter(item =>
          item.category === 'fish' && item.tier === fishTier
        )
        if (tierFish.length > 0) {
          const randomFish = tierFish[Math.floor(Math.random() * tierFish.length)]
          caughtFish.push(randomFish.id)
          actions.addItem(randomFish.id)
        }
      }
    }

    if (caughtFish.length > 0) {
      results.fish = caughtFish
    }

    // Generate items (non-fish items)
    let foundItems: string[] = []
    let wtcFromItems = 0

    Object.values(items).forEach(item => {
      if (item.source === 'Found' && item.category !== 'fish') {
        const itemChance = (location.itemDropChances as any)[item.tier] || 0
        if (gameRNG.nextFloat() < itemChance) {
          actions.addItem(item.id)
          foundItems.push(item.name)
          wtcFromItems += gameRNG.generateWTCDrop(item.tier)
        }
      }
    })

    if (foundItems.length > 0) {
      results.items = foundItems
    }

    // Check for pirate's treasure stash (very rare - 0.5% chance)
    if (gameRNG.nextFloat() < 0.005 && !rodBroke) {
      const stashWtc = gameRNG.nextInt(40000, 90000) // 40k-90k WTC
      const epicItems: string[] = []
      const possibleEpicItems = Object.values(items).filter(item => item.tier === 'epic')

      // Get 3 random epic items
      for (let i = 0; i < 3 && possibleEpicItems.length > 0; i++) {
        const randomEpic = possibleEpicItems[Math.floor(Math.random() * possibleEpicItems.length)]
        epicItems.push(randomEpic.id)
        actions.addItem(randomEpic.id)
      }

      // 20% chance for a WDYFT item
      let wdyftItem: string | undefined
      if (gameRNG.nextFloat() < 0.2) {
        const wdyftItems = Object.values(items).filter(item => item.tier === 'wdyft')
        if (wdyftItems.length > 0) {
          const randomWdyft = wdyftItems[Math.floor(Math.random() * wdyftItems.length)]
          wdyftItem = randomWdyft.id
          actions.addItem(randomWdyft.id)
        }
      }

      results.stash = { wtcReward: stashWtc, epicItems, wdyftItem }
      actions.addToWallet(stashWtc)
      notify({
        type: 'success',
        title: 'Pirate\'s Stash Found!',
        message: `You discovered a pirate's hidden stash worth ${stashWtc} WTC!`
      })
    }

    // Calculate fishing outcome (-15 to +50 WTC)
    const baseOutcome = gameRNG.nextInt(-15, 50)

    if (baseOutcome > 0 || wtcFromItems > 0) {
      const totalWtc = baseOutcome + wtcFromItems
      actions.addToWallet(totalWtc)

      let message = `You earned +${baseOutcome} WTC from fishing`
      if (wtcFromItems > 0) {
        message += ` and +${wtcFromItems} WTC from items`
      }
      if (caughtFish.length > 0) {
        const fishNames = [...new Set(caughtFish.map(fishId => items[fishId]?.name || 'Unknown Fish'))].join(', ')
        message += ` and caught: ${fishNames}`
      }
      if (foundItems.length > 0) {
        message += ` and found: ${foundItems.join(', ')}`
      }

      notify({
        type: results.stash ? 'success' : 'success',
        title: results.stash ? 'Amazing Catch!' : 'Successful Fishing!',
        message
      })
    } else if (baseOutcome < 0) {
      const lossAmount = Math.abs(baseOutcome)
      const currentWallet = state.wallet
      if (currentWallet >= lossAmount) {
        actions.deductFromWallet(lossAmount)
        notify({ type: 'error', title: 'Bad Fishing', message: `You lost ${lossAmount} WTC` })
      } else {
        actions.deductFromWallet(currentWallet)
        notify({ type: 'error', title: 'Bad Fishing', message: `You lost all ${currentWallet} WTC you had` })
      }
    } else {
      let message = 'Nothing biting this time.'
      if (caughtFish.length > 0) {
        const fishNames = [...new Set(caughtFish.map(fishId => items[fishId]?.name || 'Unknown Fish'))].join(', ')
        message += ` But you caught: ${fishNames}`
      }
      if (foundItems.length > 0) {
        message += ` and found: ${foundItems.join(', ')}`
      }
      notify({ type: 'info', title: 'Quiet Fishing', message })
    }

    // Show results notification
    const outcomeMessages: string[] = []
    if (caughtFish.length > 0) {
      const fishNames = [...new Set(caughtFish.map(fishId => items[fishId]?.name || 'Unknown Fish'))].join(', ')
      const totalFish = caughtFish.length
      outcomeMessages.push(`Caught ${totalFish} fish: ${fishNames}`)
    }

    if (foundItems.length > 0) {
      outcomeMessages.push(`Found items: ${foundItems.join(', ')}`)
    }

    if (results.stash) {
      const stashItems = [...(results.stash.epicItems || []), ...(results.stash.wdyftItem ? [results.stash.wdyftItem] : [])]
      const stashItemNames = stashItems.map(itemId => items[itemId]?.name || 'Unknown Item').join(', ')
      outcomeMessages.push(`Found pirate's stash with ${stashItemNames}!`)
    }

    if (outcomeMessages.length === 0) {
      notify({
        type: 'info',
        title: 'Quiet Fishing',
        message: 'The fishing was quiet this time. Better luck next time!'
      })
    } else {
      notify({
        type: rodBroke ? 'error' : 'success',
        title: 'Fishing Complete',
        message: `Fishing results: ${outcomeMessages.join(', ')}`
      })
    }

    // Start 5s cooldown and return to main UI immediately
    onCooldownChange(true, 5)

    // Immediately return to main UI (like other activities)
    setTimeout(() => {
      onFishComplete()
      setIsTransitioning(false)
    }, 50)
  }

  if (showLocationSelect) {
    return (
      <div className="text-center p-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <h2 className="text-xl mb-4">Choose Your Fishing Location</h2>
        <p className="text-sm text-neutral-400 mb-6">Select where you'd like to fish from. This will be your permanent fishing spot!</p>

        <div className="grid gap-3">
          {Object.values(fishingLocations).map((location) => {
            return (
              <button
                key={location.id}
                onClick={() => {
                  setSelectedLocation(location.id)
                  setShowLocationSelect(false)
                }}
                className="w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 hover:scale-105 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{location.name}</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-700 text-blue-100">
                      Fish
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">{location.description}</p>
                <div className="text-xs text-neutral-400">
                  <p>Fish: {Object.keys(location.fishDropChances).join(', ')}</p>
                  <p>Items: {Object.keys(location.itemDropChances).join(', ')}</p>
                  <p className="text-blue-400 mt-1">{location.specialEffect}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Fish</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Fish in {location?.name || 'Unknown Location'}</h3>
          {location && (
            <p className="text-sm text-neutral-400 mt-1">
              {location.description}
            </p>
          )}
        </div>

        <div className="grid gap-3">
          <button
            onClick={handleStartFishing}
            disabled={isOnCooldown || isTransitioning || !hasFishingRod}
            className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
              isOnCooldown || isTransitioning || !hasFishingRod
                ? 'cursor-not-allowed opacity-50'
                : 'hover:scale-105'
            }`}
          >
            {isTransitioning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Going fishing...</span>
              </div>
            ) : isOnCooldown ? (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-400">Fishing Cooldown</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-700 text-blue-100">
                      Fish
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Cooldown: {cooldownTime}s remaining
                </p>
                <div className="text-xs text-neutral-400">
                  <p>Please wait before fishing again</p>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Go Fishing</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-700 text-blue-100">
                      Fish
                    </span>
                    {!hasFishingRod && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-700 text-red-100">
                        No Rod
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Fish for fish and items, and possibly discover hidden treasures in {location?.name || 'your location'}
                </p>
                <div className="text-xs text-neutral-400">
                  <p>5 second cooldown • Fast results</p>
                </div>
                {!selectedLocation && <p className="text-blue-400">First time: Choose your fishing location!</p>}
              </div>
            )}
          </button>

          <button
            onClick={() => setShowLocationSelect(true)}
            disabled={isOnCooldown || isTransitioning}
            className={`w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 ${
              isOnCooldown || isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
            }`}
          >
            <div className="text-left">
              <h4 className="font-semibold text-white mb-1">Change Location</h4>
              <p className="text-xs text-neutral-400">Select a different fishing spot</p>
            </div>
          </button>
        </div>

        {isOnCooldown && !isTransitioning && (
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-neutral-400">Cooldown: {cooldownTime}s remaining</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
