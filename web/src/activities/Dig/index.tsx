import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { diggingLocations } from '../../utils/diggingLocations'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { oresItems } from '../../utils/items/ores'

const SHOVEL_ID = 'shovel'
const PICKAXE_ID = 'pickaxe'

interface DigActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onDigComplete: () => void
}

export default function DigActivity({ isOnCooldown, cooldownTime, onCooldownChange, onDigComplete }: DigActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showLocationSelect, setShowLocationSelect] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [digResults, setDigResults] = useState<{
    ores?: string[]
    chest?: { wtcReward: number }
    toolBroke?: boolean
    toolUsed?: boolean
  } | null>(null)

  // Check if user has been to dig before (first time experience)
  const hasVisitedDig = localStorage.getItem('dig-visited') === 'true'
  const hasShovel = state.inventory.some(item => item.id === SHOVEL_ID)
  const hasPickaxe = state.inventory.some(item => item.id === PICKAXE_ID)

  // Load selected location from localStorage (default to forest for new players)
  useEffect(() => {
    if (hasVisitedDig) {
      const savedLocation = localStorage.getItem('dig-location')
      if (savedLocation && diggingLocations[savedLocation as keyof typeof diggingLocations]) {
        setSelectedLocation(savedLocation)
      }
    } else {
      // Default to forest for new players
      setSelectedLocation('forest')
    }
  }, [hasVisitedDig])

  const handleStartDig = () => {
    if (isOnCooldown || isTransitioning) return

    // First time visiting dig - show location selection
    if (!hasVisitedDig) {
      setShowLocationSelect(true)
      localStorage.setItem('dig-visited', 'true')
      return
    }

    // Regular dig with selected location
    if (!selectedLocation) {
      notify({ type: 'error', title: 'No location selected', message: 'Please select a digging location first.' })
      return
    }

    performDig()
  }

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId)
    localStorage.setItem('dig-location', locationId)
    setShowLocationSelect(false)
    performDig()
  }

  const performDig = () => {
    setIsTransitioning(true)

    const location = diggingLocations[(selectedLocation || 'forest') as keyof typeof diggingLocations]
    if (!location) {
      notify({ type: 'error', title: 'Invalid location', message: 'Please select a valid digging location.' })
      setIsTransitioning(false)
      return
    }

    // Check for required items
    if (location.requiredItemId && !state.inventory.some(item => item.id === location.requiredItemId)) {
      notify({
        type: 'error',
        title: 'Missing requirement',
        message: `This location requires ${items[location.requiredItemId]?.name || 'a special tool'}.`
      })
      setIsTransitioning(false)
      return
    }

    // Generate dig results
    const results: {
      ores?: string[]
      chest?: { wtcReward: number }
      toolBroke?: boolean
      toolUsed?: boolean
    } = {}

    // Use tool and check for breaking (shovel or pickaxe)
    let toolId: string | null = null
    if (location.requiredItemId === 'pickaxe' && hasPickaxe) {
      toolId = PICKAXE_ID
    } else if (hasShovel) {
      toolId = SHOVEL_ID
    }

    if (toolId) {
      const { broken } = actions.useItem(toolId)
      results.toolUsed = true

      if (broken) {
        results.toolBroke = true
        notify({ type: 'error', title: 'Tool Broke!', message: `Your ${items[toolId]?.name || 'Tool'} broke while digging!` })
      }
    }

    // Dig logic: Always find ores (max 50 per session)
    const oreCount = Math.min(
      50, // Max cap
      1 + Math.floor(Math.random() * Math.random() * 50) // Very rare to get high numbers
    )

    const foundOres: string[] = []
    for (let i = 0; i < oreCount; i++) {
      const oreTier = gameRNG.getRandomTier(location.oreDropChances)
      if (oreTier) {
        const tierOres = Object.values(oresItems).filter(ore => ore.tier === oreTier)
        if (tierOres.length > 0) {
          const randomOre = tierOres[Math.floor(Math.random() * tierOres.length)]
          foundOres.push(randomOre.id)
          actions.addItem(randomOre.id)
        }
      }
    }

    if (foundOres.length > 0) {
      results.ores = foundOres
    }

    // Check for buried treasure chest
    if (Math.random() < location.chestChance) {
      const chestWtc = gameRNG.nextInt(40000, 80000) // 40k-80k WTC as requested
      results.chest = { wtcReward: chestWtc }
      actions.addToWallet(chestWtc)
      notify({
        type: 'success',
        title: 'Buried Treasure Found!',
        message: `You discovered buried treasure worth ${chestWtc} WTC!`
      })
    }

    // Notifications for different outcomes
    if (results.ores && results.ores.length > 0) {
      const oreNames = [...new Set(results.ores.map(oreId => oresItems[oreId]?.name || 'Unknown Ore'))].join(', ')
      const totalOres = results.ores.length
      notify({
        type: 'success',
        title: 'Ores Found!',
        message: `You dug up ${totalOres} ore(s): ${oreNames}! Added to inventory.`
      })
    }

    // Show result summary notification
    const outcomeMessages: string[] = []
    if (results.ores && results.ores.length > 0) {
      const oreNames = [...new Set(results.ores.map(oreId => oresItems[oreId]?.name || 'Unknown Ore'))].join(', ')
      const totalOres = results.ores.length
      outcomeMessages.push(`Found ${totalOres} ore(s): ${oreNames}`)
    }

    if (outcomeMessages.length === 0) {
      notify({
        type: 'info',
        title: 'Empty Hole',
        message: 'You dug but found nothing this time. Better luck next time!'
      })
    } else {
      notify({
        type: results.toolBroke ? 'error' : 'success',
        title: 'Dig Complete',
        message: `Dig results: ${outcomeMessages.join(', ')}`
      })
    }

    setDigResults(results)
    actions.trackActivity(`Dig: ${location.name}`)

    // Start 5s cooldown and return to main UI
    onCooldownChange(true, 5)

    setTimeout(() => {
      onDigComplete()
      setIsTransitioning(false)
      setDigResults(null)
    }, 50)
  }

  const getLocationName = () => {
    if (!selectedLocation) return 'No location selected'
    const location = diggingLocations[selectedLocation as keyof typeof diggingLocations]
    return location ? location.name : 'Unknown Location'
  }

  if (showLocationSelect) {
    return (
      <div className="text-center p-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <h2 className="text-xl mb-4">Choose Your Digging Location</h2>
        <p className="text-sm text-neutral-400 mb-6">Select where you'd like to dig from. This will be your permanent digging spot!</p>

        <div className="grid gap-3">
          {Object.values(diggingLocations).map((location) => {
            const available = !location.requiredItemId || state.inventory.some(item => item.id === location.requiredItemId)

            return (
              <button
                key={location.id}
                onClick={() => available && handleLocationSelect(location.id)}
                disabled={!available}
                className={`w-full p-4 rounded-lg border transition-all duration-300 text-left ${
                  available
                    ? 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 hover:scale-105'
                    : 'border-red-800 bg-red-900/30 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{location.name}</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-700 text-yellow-100">
                      Dig
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">{location.description}</p>
                <div className="text-xs text-neutral-400">
                  <p>Ores: {Object.keys(location.oreDropChances).join(', ')} • Treasure: {Math.round(location.chestChance * 100)}%</p>
                  {location.requiredItemId && (
                    <p className="text-red-400 mt-1">⚠️ Requires: {items[location.requiredItemId]?.name || 'Special Tool'}</p>
                  )}
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
      <h2 className="text-xl mb-4">Dig</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Dig in {getLocationName()}</h3>
          {selectedLocation && (
            <p className="text-sm text-neutral-400 mt-1">
              {diggingLocations[selectedLocation as keyof typeof diggingLocations]?.description}
            </p>
          )}
        </div>

        <div className="grid gap-3">
          <button
            onClick={handleStartDig}
            disabled={isOnCooldown || isTransitioning || (!hasShovel && !hasPickaxe)}
            className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
              isOnCooldown || isTransitioning || (!hasShovel && !hasPickaxe)
                ? 'cursor-not-allowed opacity-50'
                : 'hover:scale-105'
            }`}
          >
            {isTransitioning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Going digging...</span>
              </div>
            ) : isOnCooldown ? (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-400">Digging Cooldown</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-700 text-yellow-100">
                      Dig
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Cooldown: {cooldownTime}s remaining
                </p>
                <div className="text-xs text-neutral-400">
                  <p>Please wait before digging again</p>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Go Digging</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-700 text-yellow-100">
                      Dig
                    </span>
                    {(!hasShovel && !hasPickaxe) && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-700 text-red-100">
                        No Tool
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Dig for ores and buried treasure in {getLocationName()}
                </p>
                <div className="text-xs text-neutral-400">
                  <p>5 second cooldown • Fast results</p>
                  {!selectedLocation && <p className="text-blue-400">First time: Choose your digging location!</p>}
                </div>
              </div>
            )}
          </button>

          {hasVisitedDig && (
            <button
              onClick={() => setShowLocationSelect(true)}
              disabled={isOnCooldown || isTransitioning}
              className={`w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 ${
                isOnCooldown || isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold text-white mb-1">Change Location</h4>
                <p className="text-xs text-neutral-400">Select a different digging spot</p>
              </div>
            </button>
          )}
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
