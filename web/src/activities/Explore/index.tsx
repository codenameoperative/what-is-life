import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { exploreLocations } from '../../utils/exploreLocations'

interface ExploreActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onExploreComplete: () => void
}

interface SelectedItem {
  id: string
  quantity: number
}

export default function ExploreActivity({ isOnCooldown, cooldownTime, onCooldownChange, onExploreComplete }: ExploreActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [isItemSelectionOpen, setIsItemSelectionOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('')
  const [explorationText, setExplorationText] = useState<string>('')
  const [isExploring, setIsExploring] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Get available inventory items (excluding essentials that shouldn't be brought)
  const availableItems = state.inventory.filter(item => {
    const itemDef = items[item.id]
    return itemDef && itemDef.usable === false && itemDef.category !== 'animals' && itemDef.category !== 'fish'
  })

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId)
    setSelectedItems([])
    setIsItemSelectionOpen(true)
  }

  const handleItemToggle = (itemId: string) => {
    const existingIndex = selectedItems.findIndex(item => item.id === itemId)

    if (existingIndex !== -1) {
      // Remove item
      setSelectedItems(prev => prev.filter(item => item.id !== itemId))
    } else if (selectedItems.length < 6) {
      // Add item (max 6)
      const inventoryItem = state.inventory.find(item => item.id === itemId)
      if (inventoryItem) {
        setSelectedItems(prev => [...prev, {
          id: itemId,
          quantity: inventoryItem.quantity || 1
        }])
      }
    } else {
      notify({
        type: 'info',
        title: 'Too Many Items',
        message: 'You can only bring up to 6 items on your exploration.'
      })
    }
  }

  const handleStartExploration = () => {
    if (!selectedLocation) {
      notify({
        type: 'error',
        title: 'Select Location',
        message: 'Please select an exploration location.'
      })
      return
    }

    const location = exploreLocations[selectedLocation as keyof typeof exploreLocations]
    if (!location) return

    // Check for death first
    const hasRevivalBill = state.inventory.some(item => item.id === 'revival_bill')
    const died = gameRNG.checkDeath(location.deathChance)

    if (died) {
      if (hasRevivalBill) {
        // Use revival bill to prevent death
        actions.removeItem('revival_bill')
        notify({
          type: 'error',
          title: 'REVIVAL BILL ACTIVATED!',
          message: 'You died during exploration, but your Revival Bill saved you! No items or WTC were lost.'
        })
      } else {
        // Death with level-based penalties
        const playerLevel = state.profile.level
        const levelMultiplier = Math.min(playerLevel * 0.1, 2.0) // Max 2x penalty at level 20+

        // Calculate WTC loss (percentage based on level)
        const wtcLossPercent = Math.min(0.3 + (playerLevel * 0.05), 1.0) // 30% + 5% per level, max 100%
        const lostWTC = Math.floor(state.wallet * wtcLossPercent * levelMultiplier)
        actions.deductFromWallet(lostWTC)

        // Calculate item loss chance (higher levels lose more items)
        const itemLossChance = Math.min(0.2 + (playerLevel * 0.03), 0.8) // 20% + 3% per level, max 80%
        const lostItems: string[] = []

        // Clear inventory based on level (keep essentials, but lose more at higher levels)
        const essentials = ['hunting_rifle', 'fishing_rod', 'shovel', 'phone']
        const nonEssentialItems = state.inventory.filter(item => !essentials.includes(item.id))

        nonEssentialItems.forEach(item => {
          if (Math.random() < itemLossChance) {
            actions.removeItem(item.id)
            lostItems.push(items[item.id]?.name || item.id)
          }
        })

        // Record death for achievements
        actions.recordDeath()

        const itemLossText = lostItems.length > 0
          ? ` Lost items: ${lostItems.join(', ')}.`
          : ' No items were lost.'

        notify({
          type: 'error',
          title: 'YOU DIED! 💀',
          message: `You perished during exploration at level ${playerLevel}. Lost ${lostWTC} WTC.${itemLossText} Higher levels bring greater rewards but greater risks!`
        })

        // Reset game state
        setTimeout(() => {
          window.location.reload()
        }, 3000)
        return
      }
    }

    // Start exploration
    setIsExploring(true)
    setIsItemSelectionOpen(false)
    setCurrentPath('start')

    // Track activity
    actions.trackActivity(`Explore: ${location.name} with ${selectedItems.length} items`)

    // Start with first path
    if (location.paths.length > 0) {
      setCurrentPath(location.paths[0].id)
      setExplorationText(location.paths[0].text)
    }

    // Set exploration duration
    onCooldownChange(true, 10)
  }

  const handleChoice = (outcomeId: string) => {
    const location = exploreLocations[selectedLocation as keyof typeof exploreLocations]
    if (!location) return

    // Find the path with this outcome
    const currentPathData = location.paths.find(p => p.id === currentPath)
    if (!currentPathData) return

    // Simple outcome resolution (in a real implementation, this would be more complex)
    const outcomes = {
      'pond_success': 'You find some interesting items by the pond!',
      'cave_risk': 'The cave is too dangerous. You retreat safely.',
      'chest_reward': 'The chest contains valuable items!',
      'cave_explore': 'You explore the cave and find hidden treasures!',
      'return_path': 'You return to the safety of the main path.',
      'turn_back': 'You return to the starting point.',

      // Mountain outcomes
      'ledge_success': 'The ledge leads to a beautiful viewpoint with treasures!',
      'climb_risk': 'The climb is successful! You find rare items at the top.',
      'find_alternative': 'You find a safer path around the mountain.',

      // Ruins outcomes
      'main_chamber': 'The main chamber holds ancient artifacts!',
      'symbols_mystery': 'The symbols reveal hidden knowledge and items.',
      'back_entrance': 'The back entrance leads to undisturbed treasures.',

      // Beach outcomes
      'bottle_message': 'The bottle contains a message and some items!',
      'shell_hunting': 'You find beautiful shells and hidden items.',
      'ocean_swim': 'The ocean holds underwater treasures!',

      // Swamp outcomes
      'main_path': 'The main path reveals swamp treasures.',
      'fog_navigation': 'Through the fog, you discover rare items.',
      'higher_ground': 'Higher ground provides safety and valuable finds.'
    }

    const outcomeText = outcomes[outcomeId as keyof typeof outcomes] || 'Your exploration continues...'

    // Generate rewards
    const baseReward = gameRNG.nextInt(location.baseReward.min, location.baseReward.max)
    let finalWTC = baseReward

    // Item drops based on location
    const itemTier = gameRNG.getRandomTier(location.itemDropChances)
    let foundItem = null

    if (itemTier && itemTier !== 'useless') {
      const tierItems = Object.values(items).filter(item => item.tier === itemTier && item.source === 'Found')
      if (tierItems.length > 0) {
        const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)]
        foundItem = randomItem.id
        actions.addItem(randomItem.id)
      }
    }

    // Bonus for bringing items
    const itemBonus = selectedItems.length * 10
    finalWTC += itemBonus

    actions.addToWallet(finalWTC)

    const rewardText = `${outcomeText} +${finalWTC} WTC${foundItem ? ` and found ${items[foundItem]?.name}!` : ''}`

    setExplorationText(rewardText)

    // Complete exploration after showing results
    setTimeout(() => {
      setIsExploring(false)
      setIsTransitioning(true)
      setTimeout(() => {
        onExploreComplete()
        setIsTransitioning(false)
        setSelectedLocation('')
        setSelectedItems([])
        setCurrentPath('')
        setExplorationText('')
      }, 50)
    }, 3000)
  }

  const getCurrentChoices = () => {
    if (!selectedLocation || !currentPath) return []

    const location = exploreLocations[selectedLocation as keyof typeof exploreLocations]
    if (!location) return []

    const pathData = location.paths.find(p => p.id === currentPath)
    return pathData?.choices || []
  }

  if (isExploring) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl mb-4">Exploring...</h2>

        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-lg mb-4">{explorationText}</p>

            {getCurrentChoices().length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-neutral-400 mb-2">What do you do?</p>
                {getCurrentChoices().map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice.outcome)}
                    className="w-full p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-left"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm text-neutral-400">
            Exploration time remaining: {cooldownTime}s
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Explore</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Choose Your Adventure</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Select a location to explore and choose up to 6 items to bring along
          </p>
        </div>

        <div className="grid gap-4">
          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Exploration Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationSelect(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
              disabled={isOnCooldown || isTransitioning}
            >
              <option value="">Select location...</option>
              {Object.values(exploreLocations).map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.description} ({location.dangerLevel} danger)
                </option>
              ))}
            </select>
          </div>

          {/* Item Selection Popup */}
          {isItemSelectionOpen && selectedLocation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Select Items to Bring (Max 6)</h3>

                <div className="space-y-2 mb-4">
                  {availableItems.map((item) => {
                    const itemDef = items[item.id]
                    const isSelected = selectedItems.some(selected => selected.id === item.id)

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemToggle(item.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-neutral-600 bg-neutral-800 hover:bg-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{itemDef?.name}</span>
                            {item.quantity && item.quantity > 1 && (
                              <span className="text-sm text-neutral-400 ml-2">(x{item.quantity})</span>
                            )}
                          </div>
                          {isSelected && <span className="text-blue-400">✓</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsItemSelectionOpen(false)}
                    className="flex-1 p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartExploration}
                    className="flex-1 p-3 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    Start Exploration
                  </button>
                </div>

                <div className="mt-2 text-xs text-neutral-400 text-center">
                  Selected: {selectedItems.length}/6 items
                </div>
              </div>
            </div>
          )}

          {/* Exploration Summary */}
          {selectedLocation && selectedItems.length > 0 && (
            <div className="p-4 bg-neutral-800 rounded-lg">
              <h4 className="font-semibold mb-2">Exploration Summary</h4>
              <div className="text-sm text-neutral-300 space-y-1">
                <p><strong>Location:</strong> {exploreLocations[selectedLocation as keyof typeof exploreLocations]?.name}</p>
                <p><strong>Items Bringing:</strong> {selectedItems.length}/6</p>
                <div className="mt-2">
                  <strong>Selected Items:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {selectedItems.map((item) => (
                      <li key={item.id}>{items[item.id]?.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warning about death */}
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400">⚠️</span>
              <span className="text-sm font-medium text-red-400">Death Risk</span>
            </div>
            <p className="text-xs text-neutral-300">
              Exploration carries a risk of death. Bring a Revival Bill to prevent losing everything on death.
              {state.inventory.some(item => item.id === 'revival_bill') ? (
                <span className="text-green-400 block mt-1">✓ Revival Bill available</span>
              ) : (
                <span className="text-red-400 block mt-1">✗ No Revival Bill - death means total loss!</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
