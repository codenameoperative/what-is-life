import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { gardenPlants } from '../../utils/gardenPlants'

interface GardenActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onGardenComplete: () => void
}

interface GardenPlot {
  id: string
  plantId: string | null
  plantedAt: number
  wateredCount: number
  growthProgress: number // 0-100
  isReady: boolean
}

const MAX_PLOTS = 4
const WATERING_COOLDOWN = 5 // seconds between watering

export default function GardenActivity({ isOnCooldown, cooldownTime, onCooldownChange, onGardenComplete }: GardenActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()

  const [selectedPlant, setSelectedPlant] = useState<string>('')
  const [wateringCooldowns, setWateringCooldowns] = useState<Record<string, number>>({})
  const [lastNotificationCheck, setLastNotificationCheck] = useState(Date.now())

  // Update garden growth every second
  useEffect(() => {
    const interval = setInterval(() => {
      actions.updateGardenGrowth()

      // Check for pest attacks every 30 seconds
      const now = Date.now()
      if (now - lastNotificationCheck > 30000) {
        checkForPestAttacks()
        checkForReadyPlants()
        setLastNotificationCheck(now)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastNotificationCheck])

  // Update watering cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setWateringCooldowns(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(plotId => {
          if (updated[plotId] > 0) {
            updated[plotId]--
          } else {
            delete updated[plotId]
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const checkForPestAttacks = () => {
    if (!state.garden.scarecrowEquipped) {
      // 10% chance of pest attack per check (every 30 seconds)
      if (gameRNG.nextFloat() < 0.1) {
        const activePlots = state.garden.plots.filter(plot => plot.plantId && !plot.isReady)
        if (activePlots.length > 0) {
          const randomPlot = activePlots[Math.floor(Math.random() * activePlots.length)]
          const plant = gardenPlants[randomPlot.plantId as keyof typeof gardenPlants]

          if (!plant) return // Safety check

          // 50% chance to lose the plant completely
          if (gameRNG.nextFloat() < 0.5) {
            actions.plantInGarden(randomPlot.id, null) // Reset plot
            notify({
              type: 'error',
              title: '🐛 Pest Attack!',
              message: `Wild animals ate your ${plant.name}! Plant lost. Consider using a scarecrow.`
            })
          } else {
            // Otherwise, just slow growth
            notify({
              type: 'info',
              title: '🐛 Pest Warning!',
              message: `Pests damaged your ${plant.name}. Growth slowed. Use a scarecrow to prevent this.`
            })
          }
        }
      }
    }
  }

  const checkForReadyPlants = () => {
    const readyPlots = state.garden.plots.filter(plot => plot.isReady)
    if (readyPlots.length > 0) {
      const plantNames = readyPlots.map(plot => {
        const plant = gardenPlants[plot.plantId as keyof typeof gardenPlants]
        return plant?.name
      }).filter(Boolean)

      if (plantNames.length > 0) {
        notify({
          type: 'success',
          title: '🌱 Plants Ready!',
          message: `${plantNames.join(', ')} ${plantNames.length === 1 ? 'is' : 'are'} ready for harvest!`
        })
      }
    }
  }

  const handlePlant = (plotId: string) => {
    if (isOnCooldown || !selectedPlant) return

    const plot = state.garden.plots.find(p => p.id === plotId)
    if (!plot || plot.plantId) return

    actions.plantInGarden(plotId, selectedPlant)
    actions.trackActivity(`Garden: Planted ${gardenPlants[selectedPlant as keyof typeof gardenPlants]?.name}`)
    onCooldownChange(true, 10) // 10 second cooldown for planting

    notify({
      type: 'success',
      title: 'Plant Planted!',
      message: `You planted ${gardenPlants[selectedPlant as keyof typeof gardenPlants]?.name} in your garden.`
    })
  }

  const handleWater = (plotId: string) => {
    if (wateringCooldowns[plotId] || isOnCooldown) return

    const plot = state.garden.plots.find(p => p.id === plotId)
    if (!plot || !plot.plantId || plot.isReady) return

    actions.waterPlant(plotId)
    setWateringCooldowns(prev => ({ ...prev, [plotId]: WATERING_COOLDOWN }))

    const plant = gardenPlants[plot.plantId as keyof typeof gardenPlants]
    actions.trackActivity(`Garden: Watered ${plant.name}`)
    onCooldownChange(true, 10) // 10 second cooldown for watering

    notify({
      type: 'info',
      title: 'Plant Watered',
      message: `You watered your ${plant.name}.`
    })
  }

  const handleHarvest = (plotId: string) => {
    if (isOnCooldown) return

    const plot = state.garden.plots.find(p => p.id === plotId)
    if (!plot || !plot.plantId || !plot.isReady) return

    const plant = gardenPlants[plot.plantId as keyof typeof gardenPlants]
    if (!plant) return

    // Calculate yield based on watering
    const waterEfficiency = Math.min(plot.wateredCount / plant.waterNeeded, 1)
    const baseYield = gameRNG.nextInt(plant.yield.min, plant.yield.max)
    const finalYield = Math.max(1, Math.floor(baseYield * (0.5 + waterEfficiency * 0.5)))

    const totalValue = finalYield * plant.value

    actions.addToWallet(totalValue)
    actions.harvestPlant(plotId)
    actions.trackActivity(`Garden: Harvested ${finalYield}x ${plant.name}`)

    onCooldownChange(true, 10) // 10 second cooldown for harvesting

    notify({
      type: 'success',
      title: 'Harvest Successful!',
      message: `You harvested ${finalYield}x ${plant.name} worth ${totalValue} WTC!`
    })
  }

  const handleScarecrowToggle = () => {
    if (state.garden.scarecrowEquipped) {
      actions.unequipScarecrow()
      notify({
        type: 'info',
        title: 'Scarecrow Removed',
        message: 'Scarecrow unequipped from garden.'
      })
    } else {
      const hasScarecrow = state.inventory.some(item => item.id === 'scarecrow')
      if (!hasScarecrow) {
        notify({
          type: 'error',
          title: 'No Scarecrow',
          message: 'You need a scarecrow in your inventory to equip it.'
        })
        return
      }

      // Check if scarecrow breaks (5% chance)
      if (gameRNG.nextFloat() < 0.05) {
        actions.removeItem('scarecrow')
        notify({
          type: 'error',
          title: 'Scarecrow Broke!',
          message: 'Your scarecrow broke while equipping it. You lost the item.'
        })
        return
      }

      actions.equipScarecrow()
      notify({
        type: 'success',
        title: 'Scarecrow Equipped',
        message: 'Scarecrow is now protecting your garden from pests!'
      })
    }
  }

  const getPlotStatus = (plot: any) => {
    if (!plot.plantId) return 'Empty'

    const plant = gardenPlants[plot.plantId as keyof typeof gardenPlants]
    if (!plant) return 'Unknown'

    if (plot.isReady) return `Ready: ${plant.name}`
    if (plot.growthProgress < 25) return `Seedling: ${plant.name}`
    if (plot.growthProgress < 50) return `Growing: ${plant.name}`
    if (plot.growthProgress < 75) return `Maturing: ${plant.name}`
    return `Almost Ready: ${plant.name}`
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Garden</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Cultivate Your Garden</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Plant seeds, water them, and harvest for rewards. Garden grows even when you're away!
          </p>
        </div>

        {/* Plant Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Select Plant to Plant
          </label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
          >
            <option value="">Select plant...</option>
            {Object.values(gardenPlants).map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name} - {plant.description} ({plant.growthTime}s growth, {plant.value} WTC each)
              </option>
            ))}
          </select>
        </div>

        {/* Scarecrow Slot */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-600 min-w-32">
            <div className="text-sm font-medium mb-2">Garden Protection</div>
            <button
              onClick={handleScarecrowToggle}
              className={`w-full p-2 rounded text-sm transition-colors ${
                state.garden.scarecrowEquipped
                  ? 'bg-green-700 hover:bg-green-600'
                  : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
            >
              {state.garden.scarecrowEquipped ? '🧹 Scarecrow Active' : '👻 No Protection'}
            </button>
            <div className="text-xs text-neutral-400 mt-1">
              {state.garden.scarecrowEquipped
                ? '80% pest protection'
                : 'Vulnerable to pests'
              }
            </div>
          </div>
        </div>

        {/* Garden Plots Grid */}
        <div className="grid grid-cols-2 gap-4">
          {state.garden.plots.map((plot) => {
            const plant = plot.plantId ? gardenPlants[plot.plantId as keyof typeof gardenPlants] : null
            const canWater = plot.plantId && !plot.isReady && !wateringCooldowns[plot.id]
            const waterCooldown = wateringCooldowns[plot.id] || 0

            return (
              <div key={plot.id} className="p-4 bg-neutral-800 rounded-lg">
                <div className="text-sm font-medium mb-2">
                  Plot {plot.id.split('_')[1]}
                </div>

                <div className="text-xs text-neutral-400 mb-3 min-h-[2rem]">
                  {getPlotStatus(plot)}
                </div>

                {plant && !plot.isReady && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Growth</span>
                      <span>{Math.round(plot.growthProgress)}%</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${plot.growthProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Watered: {plot.wateredCount}/{plant.waterNeeded}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {!plot.plantId && (
                    <button
                      onClick={() => handlePlant(plot.id)}
                      disabled={isOnCooldown || !selectedPlant}
                      className="w-full p-2 bg-green-700 hover:bg-green-600 disabled:bg-neutral-600 rounded text-sm transition-colors"
                    >
                      {isOnCooldown ? `${cooldownTime}s` : 'Plant'}
                    </button>
                  )}

                  {canWater && (
                    <button
                      onClick={() => handleWater(plot.id)}
                      disabled={isOnCooldown}
                      className="w-full p-2 bg-blue-700 hover:bg-blue-600 disabled:bg-neutral-600 rounded text-sm transition-colors"
                    >
                      {isOnCooldown ? `${cooldownTime}s` : 'Water'}
                    </button>
                  )}

                  {waterCooldown > 0 && (
                    <div className="text-xs text-neutral-400 text-center">
                      Water cooldown: {waterCooldown}s
                    </div>
                  )}

                  {plot.isReady && (
                    <button
                      onClick={() => handleHarvest(plot.id)}
                      disabled={isOnCooldown}
                      className="w-full p-2 bg-yellow-700 hover:bg-yellow-600 disabled:bg-neutral-600 rounded text-sm transition-colors"
                    >
                      {isOnCooldown ? `${cooldownTime}s` : 'Harvest'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Garden Tips */}
        <div className="p-3 bg-neutral-800 rounded-lg">
          <h4 className="font-semibold mb-2">Gardening Tips</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>• Water plants regularly for faster growth</li>
            <li>• Different plants have different growth times and yields</li>
            <li>• Harvest when plants are fully grown (100% progress)</li>
            <li>• Higher-tier plants give better rewards but need more care</li>
            <li>• Equip a scarecrow to protect against pest attacks</li>
            <li>• Garden continues growing even when you're not playing!</li>
          </ul>
        </div>

        {/* Cooldown Display */}
        {isOnCooldown && (
          <div className="text-center p-3 bg-neutral-800 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-neutral-400">Action cooldown: {cooldownTime}s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
