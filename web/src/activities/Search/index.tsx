import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { searchLocations, getRandomLocations, type SearchLocation } from '../../utils/searchLocations'

interface SearchActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onSearchComplete: () => void
}

export default function SearchActivity({ isOnCooldown, cooldownTime, onCooldownChange, onSearchComplete }: SearchActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [showLocations, setShowLocations] = useState(false)
  const [currentLocations, setCurrentLocations] = useState<SearchLocation[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize with locations shown
  useEffect(() => {
    setCurrentLocations(getRandomLocations(3))
    setShowLocations(true)
  }, [])

  const handleLocationSearch = (location: SearchLocation) => {
    if (isOnCooldown || isTransitioning) return

    setIsTransitioning(true)

    let foundItems: string[] = []
    let wtcFound = 0

    // Check for item drops based on location-specific chances
    Object.values(items).forEach(item => {
      if (item.source === 'Found') {
        // Use location-specific drop chances with safe property access
        const locationChance = (location.itemDropChances as any)[item.tier] || 0
        if (gameRNG.nextFloat() < locationChance) {
          actions.addItem(item.id)
          foundItems.push(item.name)
          wtcFound += gameRNG.generateWTCDrop(item.tier)
        }
      }
    })

    // Location-specific WTC reward
    const baseAmount = location.wtcReward && location.wtcReward.min <= location.wtcReward.max
      ? gameRNG.nextInt(location.wtcReward.min, location.wtcReward.max)
      : gameRNG.nextInt(10, 50) // Fallback to reasonable default
    const multi = state.activeBoosts
      .filter(b => b.type === 'search')
      .reduce((m, b) => m * b.multiplier, 1)
    const finalAmount = Math.floor(baseAmount * multi)

    actions.addToWallet(finalAmount + wtcFound)
    actions.trackActivity(`Search: ${location.name}`)
    if (multi > 1) actions.consumeBoostUse('search')

    let message = `You searched ${location.name} and got ${finalAmount + wtcFound} WTC`
    if (foundItems.length > 0) {
      message += ` and found: ${foundItems.join(', ')}`
    }

    notify({ type: 'success', title: 'Search Results', message })

    // Start cooldown and return to main UI with smooth transition
    onCooldownChange(true, 5)

    // Delay the UI transition based on location rarity for better feel
    // Higher rarity locations get faster transitions
    const transitionDelay = location.rarity === 'epic' ? 50 : 100
    setTimeout(() => {
      onSearchComplete()
      setIsTransitioning(false)
    }, transitionDelay)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'common': return 'bg-green-700 text-green-100'
      case 'uncommon': return 'bg-blue-700 text-blue-100'
      case 'rare': return 'bg-purple-700 text-purple-100'
      case 'epic': return 'bg-orange-700 text-orange-100'
      case 'ultra_rare': return 'bg-red-700 text-red-100'
      case 'ultra_epic': return 'bg-pink-700 text-pink-100'
      case 'legendary': return 'bg-yellow-700 text-yellow-100'
      case 'mythical': return 'bg-indigo-700 text-indigo-100'
      case 'wdyft': return 'bg-emerald-700 text-emerald-100'
      default: return 'bg-gray-700 text-gray-100'
    }
  }

  const formatTierName = (tier: string) => {
    return tier.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Search</h2>

      {!showLocations ? (
        <div className="space-y-4">
          <div className="text-sm text-neutral-400">
            <p>Choose a location to search for treasures!</p>
            {isOnCooldown && (
              <p className="mt-2 text-yellow-400">⏰ Cooldown: {cooldownTime}s remaining</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Choose Location</h3>
          </div>

          <div className="grid gap-3">
            {currentLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSearch(location)}
                disabled={isOnCooldown || isTransitioning}
                className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
                  isOnCooldown || isTransitioning
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:scale-105'
                }`}
              >
                {isTransitioning ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{location.name}</h4>
                      <div className="flex gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTierColor(location.rarity)}`}>
                          {formatTierName(location.rarity)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300 mb-2">{location.description}</p>
                    {/* Remove this section to hide result previews */}
                    {/* <div className="text-xs text-neutral-400">
                      <p>Possible rewards:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>WTC: {location.wtcReward?.min || 10}-{location.wtcReward?.max || 50}</li>
                        <li>Items: Various rarities</li>
                      </ul>
                    </div> */}
                  </div>
                )}
              </button>
            ))}
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
      )}
    </div>
  )
}
