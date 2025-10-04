import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { huntAnimals } from '../../utils/huntAnimals'
import { huntLocations } from '../../utils/huntLocations'

const HUNTING_RIFLE_ID = 'hunting_rifle'

interface HuntResults {
  success: boolean
  rewards?: { wtc: number; items: string[] }
  consequences?: {
    lost: boolean
    injured: boolean
    equipmentFailure: boolean
    fatigue: boolean
    itemsLost: string[]
  }
  animals?: any[]
  chest?: { wtcReward: number }
  gunJammed?: boolean
  rifleUsed?: boolean
  reputation?: number
  specialEncounter?: any
}

interface HuntActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onHuntComplete: () => void
}

export default function HuntActivity({ isOnCooldown, cooldownTime, onCooldownChange, onHuntComplete }: HuntActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [showLocationSelect, setShowLocationSelect] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [hasVisitedHunt, setHasVisitedHunt] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [huntResults, setHuntResults] = useState<HuntResults | null>(null)
  const [crimeReputation, setCrimeReputation] = useState(() => {
    const saved = localStorage.getItem('crime-reputation')
    return saved ? parseInt(saved) : 0
  })

  // Check if player has hunting rifle
  const hasHuntingRifle = state.inventory.some(item => item.id === HUNTING_RIFLE_ID)

  // Load selected location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('selected-hunt-location')
    if (savedLocation && huntLocations[savedLocation]) {
      setSelectedLocation(savedLocation)
      setHasVisitedHunt(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('crime-reputation', crimeReputation.toString())
  }, [crimeReputation])

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId)
    setShowLocationSelect(false)
    setHasVisitedHunt(true)
    localStorage.setItem('selected-hunt-location', locationId)
  }

  const handleStartHunt = () => {
    if (isOnCooldown || isTransitioning || !hasHuntingRifle || !selectedLocation) return

    setIsTransitioning(true)

    const location = huntLocations[selectedLocation]
    if (!location) return

    // Hunt reputation system (using crime reputation as proxy)
    const huntReputation = crimeReputation

    const results: HuntResults = {
      success: false,
      rewards: { wtc: 0, items: [] },
      consequences: { lost: false, injured: false, equipmentFailure: false, fatigue: false, itemsLost: [] },
      animals: [],
      reputation: 0
    }

    // Use hunting rifle and check for jamming
    const rifleItem = state.inventory.find(item => item.id === HUNTING_RIFLE_ID)

    if (rifleItem) {
      const { broken } = actions.useItem(HUNTING_RIFLE_ID)
      results.rifleUsed = true

      if (broken) {
        results.gunJammed = true
        notify({ type: 'error', title: 'Gun Jammed!', message: 'Your Hunting Rifle jammed and broke!' })
      }
    }

    // Calculate success modifiers
    const reputationBonus = getReputationBonus(huntReputation)
    const equipmentBonus = getEquipmentBonus()
    const weatherBonus = getWeatherBonus()
    const totalSuccessChance = Math.min(0.95, 0.5 + reputationBonus + equipmentBonus + weatherBonus)

    // Check if hunt succeeds
    if (gameRNG.nextFloat() < totalSuccessChance) {
      results.success = true

      // Calculate WTC reward
      const baseAmount = gameRNG.nextInt(location.wtcReward.min, location.wtcReward.max)
      const multi = 1 + reputationBonus + equipmentBonus + weatherBonus
      results.rewards = {
        wtc: Math.floor(baseAmount * multi),
        items: []
      }

      // Enhanced item drops with weather effects
      if (gameRNG.nextFloat() < location.itemChance) {
        Object.values(items).forEach(item => {
          if (item.source === 'Found') {
            const huntChance = location.itemDropChances[item.tier as keyof typeof location.itemDropChances] || 0
            const modifiedChance = huntChance * (1 + reputationBonus + weatherBonus)

            if (gameRNG.nextFloat() < modifiedChance) {
              actions.addItem(item.id)
              results.rewards!.items.push(item.name)
            }
          }
        })
      }

      // Special encounters based on location
      const specialEncounter = gameRNG.nextFloat() < 0.1 // 10% chance
      if (specialEncounter) {
        const encounters = [
          { type: 'rare_animal', description: 'You spot a rare animal!', reward: 'Rare pelt' },
          { type: 'treasure', description: 'You find an old treasure map!', reward: 'Ancient map' },
          { type: 'rival_hunter', description: 'You encounter another hunter!', reward: 'Shared knowledge' },
          { type: 'wildlife_photographer', description: 'A photographer offers to buy your photos!', reward: 'Extra WTC' }
        ]
        const encounter = encounters[Math.floor(gameRNG.nextFloat() * encounters.length)]
        results.specialEncounter = encounter

        // Add extra rewards for special encounters
        if (encounter.type === 'rare_animal') {
          actions.addItem('rare_pelt')
          results.rewards!.items.push('Rare Pelt')
        } else if (encounter.type === 'treasure') {
          actions.addItem('ancient_map')
          results.rewards!.items.push('Ancient Map')
        } else if (encounter.type === 'wildlife_photographer') {
          results.rewards!.wtc += 200
        }
      }

      // Gain reputation on success
      const repGain = Math.floor(location.riskLevel === 'extreme' ? 5 : location.riskLevel === 'high' ? 3 : 2)
      setCrimeReputation(prev => Math.min(100, prev + repGain))
      results.reputation = repGain

      // Use equipment (chance to break)
      if (equipmentBonus > 0) {
        const equipment = ['hunting_rifle', 'binoculars', 'hunting_knife'].filter(id =>
          state.inventory.some(item => item.id === id)
        )
        if (equipment.length > 0 && gameRNG.nextFloat() < 0.1) { // 10% chance to break equipment
          const brokenItem = equipment[Math.floor(gameRNG.nextFloat() * equipment.length)]
          const { broken } = actions.useItem(brokenItem)
          if (broken) {
            notify({
              type: 'warning',
              title: 'Equipment Broken',
              message: `Your ${items[brokenItem]?.name} broke during the hunt!`
            })
          }
        }
      }

      actions.addToWallet(results.rewards!.wtc)
      actions.trackActivity(`Hunt: ${location.name}`)

    } else {
      // Hunt failed - various consequences
      results.success = false

      // Determine consequences based on risk level and weather
      const randomConsequence = gameRNG.nextFloat()
      if (randomConsequence < 0.25) {
        // Lost in woods - lose time and money
        results.consequences = {
          lost: true,
          injured: false,
          equipmentFailure: false,
          fatigue: false,
          itemsLost: []
        }
        const lossPercentage = 0.1 + (gameRNG.nextFloat() * 0.2) // 10-30%
        const coinsLost = Math.floor(state.wallet * lossPercentage)
        actions.addToWallet(-coinsLost)
      } else if (randomConsequence < 0.5) {
        // Animal encounter gone wrong
        results.consequences = {
          lost: false,
          injured: true,
          equipmentFailure: false,
          fatigue: false,
          itemsLost: []
        }
        const coinsLost = Math.floor(state.wallet * 0.15) // 15% loss
        actions.addToWallet(-coinsLost)
      } else if (randomConsequence < 0.75) {
        // Equipment malfunction
        results.consequences = {
          lost: false,
          injured: false,
          equipmentFailure: true,
          fatigue: false,
          itemsLost: []
        }
        // Break random equipment
        const equipment = ['hunting_rifle', 'binoculars', 'hunting_knife'].filter(id =>
          state.inventory.some(item => item.id === id)
        )
        if (equipment.length > 0) {
          const brokenItem = equipment[Math.floor(gameRNG.nextFloat() * equipment.length)]
          const { broken } = actions.useItem(brokenItem)
          if (broken) {
            results.consequences!.itemsLost.push(items[brokenItem]?.name || 'Unknown Item')
          }
        }
      } else {
        // Just fatigue - no major losses
        results.consequences = {
          lost: false,
          injured: false,
          equipmentFailure: false,
          fatigue: true,
          itemsLost: []
        }
      }

      // Lose reputation on failure
      const repLoss = Math.floor(location.riskLevel === 'extreme' ? -3 : location.riskLevel === 'high' ? -2 : -1)
      setCrimeReputation(prev => Math.max(-50, prev + repLoss))
      results.reputation = repLoss
    }

    // Notifications for different outcomes
    if (results.rewards?.items && results.rewards.items.length > 0) {
      const itemNames = results.rewards.items.join(', ')
      notify({
        type: 'success',
        title: 'Items Found!',
        message: `You found: ${itemNames}`
      })
    }

    if (results.animals && results.animals.length > 0) {
      const animalNames = [...new Set(results.animals.map((animal: any) => animal.name))].join(', ')
      const totalAnimals = results.animals.length
      notify({
        type: 'success',
        title: 'Animals Captured!',
        message: `You successfully captured ${totalAnimals} animal(s): ${animalNames}! Added to inventory.`
      })
    }

    // Show result summary notification
    const outcomeMessages: string[] = []
    if (results.rewards?.items && results.rewards.items.length > 0) {
      const itemNames = results.rewards.items.map((itemId: string) => items[itemId]?.name || 'Unknown Item').join(', ')
      outcomeMessages.push(`Found: ${itemNames}`)
    }

    if (results.animals && results.animals.length > 0) {
      const animalNames = [...new Set(results.animals.map((animal: any) => animal.name))].join(', ')
      const totalAnimals = results.animals.length
      outcomeMessages.push(`Captured ${totalAnimals} ${totalAnimals === 1 ? 'animal' : 'animals'}: ${animalNames}`)
    }

    if (outcomeMessages.length === 0) {
      notify({
        type: 'info',
        title: 'Quiet Hunt',
        message: 'The hunt was quiet this time. Better luck next time!'
      })
    } else {
      notify({
        type: results.gunJammed ? 'error' : 'success',
        title: 'Hunt Complete',
        message: `Hunt results: ${outcomeMessages.join(', ')}`
      })
    }

    setHuntResults(results)
    actions.trackActivity(`Hunt: ${location.name}`)

    // Start 5s cooldown and return to main UI
    onCooldownChange(true, 5)

    setTimeout(() => {
      onHuntComplete()
      setIsTransitioning(false)
      setHuntResults(null)
    }, 50)
  }

  const getLocationName = () => {
    return selectedLocation ? huntLocations[selectedLocation]?.name || 'Unknown Location' : 'Unknown Location'
  }

  const formatTierName = (tier: string) => {
    return tier.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const getReputationBonus = (reputation: number) => {
    // Higher reputation gives better success rates
    return Math.min(0.3, reputation / 100) // Max 30% bonus
  }

  const getEquipmentBonus = () => {
    // Check for hunting-related equipment
    let bonus = 0
    if (state.inventory.some(item => item.id === 'hunting_rifle')) bonus += 0.1
    if (state.inventory.some(item => item.id === 'binoculars')) bonus += 0.1
    if (state.inventory.some(item => item.id === 'hunting_knife')) bonus += 0.15
    return bonus
  }

  const getWeatherBonus = () => {
    // Weather affects hunting success (this would need to be implemented in game state)
    // For now, return 0 as a placeholder
    return 0
  }

  // Helper function to get random animal by tier
  const getRandomAnimalByTier = (tier: string): any | null => {
    const tierAnimals = Object.values(huntAnimals).filter(animal => animal.tier === tier)
    if (tierAnimals.length === 0) return null

    const randomIndex = Math.floor(Math.random() * tierAnimals.length)
    return tierAnimals[randomIndex]
  }

  // Helper function to get random items by tier (used when outcome is items)
  const getRandomItemsByTier = (tier: string, count: number = 1): string[] => {
    const tierItems = Object.values(items).filter(item => item.tier === tier)
    if (tierItems.length === 0) return []

    const selectedItems: string[] = []
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * tierItems.length)
      selectedItems.push(tierItems[randomIndex].id)
    }
    return selectedItems
  }

  if (showLocationSelect) {
    return (
      <div className="text-center p-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <h2 className="text-xl mb-4">Choose Your Hunting Location</h2>
        <p className="text-sm text-neutral-400 mb-6">Select where you'd like to hunt from. This will be your permanent hunting ground!</p>

        <div className="grid gap-3">
          {Object.values(huntLocations).map((location) => {
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
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-orange-700 text-orange-100">
                      Hunt
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">{location.description}</p>
                <div className="text-xs text-neutral-400">
                  <p>Items: {Object.keys(location.itemDropChances).join(', ')} • Chest: {Math.round(location.chestChance * 100)}%</p>
                  {location.requiredItemId && (
                    <p className="text-red-400 mt-1">⚠️ Requires: {items[location.requiredItemId]?.name || 'Special Item'}</p>
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
      <h2 className="text-xl mb-4">Hunt</h2>

      {huntResults ? (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Hunt Results</h3>
            <p className="text-sm text-neutral-400">You went hunting in {getLocationName()}</p>
          </div>

          <div className="bg-neutral-800 p-6 rounded-lg text-left">
            {huntResults.gunJammed && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded">
                <h4 className="text-lg font-semibold text-red-400">⚠️ Gun Jammed!</h4>
                <p className="text-white">Your Hunting Rifle jammed and broke during the hunt!</p>
              </div>
            )}

            {huntResults.rewards?.items && huntResults.rewards.items.length > 0 && (
              <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
                <h4 className="text-lg font-semibold text-blue-400">🎒 Items Found!</h4>
                <p className="text-white">
                  You found: {huntResults.rewards.items.map((itemId: string) => items[itemId]?.name || 'Unknown Item').join(', ')}
                </p>
              </div>
            )}

            {huntResults.animals && huntResults.animals.length > 0 && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded">
                <h4 className="text-lg font-semibold text-green-400">🦌 Animals Captured!</h4>
                <p className="text-white">
                  You captured {huntResults.animals.length} animal(s): {[...new Set(huntResults.animals.map((animal: any) => animal.name))].join(', ')}
                </p>
                <p className="text-sm text-green-300">Added to inventory</p>
              </div>
            )}

            {huntResults.chest && (
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded">
                <h4 className="text-lg font-semibold text-yellow-400">💰 Hidden Chest Found!</h4>
                <p className="text-white">You discovered a hidden treasure chest!</p>
                <p className="text-sm text-yellow-300">+{huntResults.chest.wtcReward} WTC</p>
              </div>
            )}

            {!huntResults.rewards?.items?.length && !huntResults.chest && !huntResults.gunJammed && (!huntResults.animals || huntResults.animals.length === 0) && (
              <div className="p-3 bg-neutral-700 rounded">
                <p className="text-neutral-300">The hunt was quiet this time. No items, animals, or treasure found.</p>
              </div>
            )}
          </div>

          {isTransitioning && (
            <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-neutral-400">Processing...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Hunt in {getLocationName()}</h3>
            {selectedLocation && (
              <p className="text-sm text-neutral-400 mt-1">
                {huntLocations[selectedLocation]?.description}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <button
              onClick={handleStartHunt}
              disabled={isOnCooldown || isTransitioning || !hasHuntingRifle}
              className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
                isOnCooldown || isTransitioning || !hasHuntingRifle
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:scale-105'
              }`}
            >
              {isTransitioning ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Going hunting...</span>
                </div>
              ) : (
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Go Hunting</h4>
                    <div className="flex gap-2">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-orange-700 text-orange-100">
                        Hunt
                      </span>
                      {!hasHuntingRifle && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-700 text-red-100">
                          No Rifle
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 mb-2">
                    Hunt for animals and items, and possibly discover hidden treasure in {getLocationName()}
                  </p>
                  <div className="text-xs text-neutral-400">
                    <p>What will you find today?</p>
                    {!hasVisitedHunt && <p className="text-blue-400">First time: Choose your hunting location!</p>}
                  </div>
                </div>
              )}
            </button>

            {hasVisitedHunt && (
              <button
                onClick={() => setShowLocationSelect(true)}
                disabled={isOnCooldown || isTransitioning}
                className={`w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 ${
                  isOnCooldown || isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
                }`}
              >
                <div className="text-left">
                  <h4 className="font-semibold text-white mb-1">Change Location</h4>
                  <p className="text-xs text-neutral-400">Select a different hunting ground</p>
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
      )}
    </div>
  )
}
