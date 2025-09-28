import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { crimeLocations, getRandomCrimes, type CrimeLocation } from '../../utils/crimeLocations'

interface CrimeActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onCrimeComplete: () => void
}

export default function CrimeActivity({ isOnCooldown, cooldownTime, onCooldownChange, onCrimeComplete }: CrimeActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [showCrimes, setShowCrimes] = useState(false)
  const [currentCrimes, setCurrentCrimes] = useState<CrimeLocation[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [crimeResults, setCrimeResults] = useState<{
    crime: CrimeLocation
    success: boolean
    rewards: { wtc: number; items: string[] }
    consequences: { arrested: boolean; injured: boolean; itemsLost: string[] }
    reputation: number
  } | null>(null)

  // Crime reputation system
  const [crimeReputation, setCrimeReputation] = useState(() => {
    const saved = localStorage.getItem('crime-reputation')
    return saved ? parseInt(saved) : 0
  })

  // Save reputation to localStorage
  useEffect(() => {
    localStorage.setItem('crime-reputation', crimeReputation.toString())
  }, [crimeReputation])

  // Initialize with crimes shown
  useEffect(() => {
    setCurrentCrimes(getRandomCrimes(3))
    setShowCrimes(true)
  }, [])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-700 text-green-100'
      case 'medium': return 'bg-yellow-700 text-yellow-100'
      case 'high': return 'bg-orange-700 text-orange-100'
      case 'extreme': return 'bg-red-700 text-red-100'
      default: return 'bg-gray-700 text-gray-100'
    }
  }

  const formatTierName = (tier: string) => {
    return tier.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const getReputationBonus = (reputation: number) => {
    // Higher reputation gives better success rates
    return Math.min(0.3, reputation / 100) // Max 30% bonus
  }

  const getEquipmentBonus = () => {
    // Check for crime-related equipment
    let bonus = 0
    if (state.inventory.some(item => item.id === 'lockpick_set')) bonus += 0.1
    if (state.inventory.some(item => item.id === 'disguise_kit')) bonus += 0.1
    if (state.inventory.some(item => item.id === 'getaway_car')) bonus += 0.15
    return bonus
  }

  const handleCrime = (crime: CrimeLocation) => {
    if (isOnCooldown || isTransitioning) return

    setIsTransitioning(true)

    const results = {
      crime,
      success: false,
      rewards: { wtc: 0, items: [] as string[] },
      consequences: { arrested: false, injured: false, itemsLost: [] as string[] },
      reputation: 0
    }

    let gotCaught = false
    let jobLost = false

    // Calculate success chance with modifiers
    const baseSuccessChance = 1 - crime.caughtChance
    const reputationBonus = getReputationBonus(crimeReputation)
    const equipmentBonus = getEquipmentBonus()
    const totalSuccessChance = Math.min(0.95, baseSuccessChance + reputationBonus + equipmentBonus)

    // Check if player succeeds
    if (gameRNG.nextFloat() < totalSuccessChance) {
      results.success = true

      // Calculate WTC reward
      const baseAmount = gameRNG.nextInt(crime.wtcReward.min, crime.wtcReward.max)
      const multi = 1 + reputationBonus + equipmentBonus
      results.rewards.wtc = Math.floor(baseAmount * multi)

      // Check for item drops
      if (gameRNG.nextFloat() < crime.itemChance) {
        Object.values(items).forEach(item => {
          if (item.source === 'Found') {
            const crimeChance = crime.itemDropChances[item.tier as keyof typeof crime.itemDropChances] || 0
            const modifiedChance = crimeChance * (1 + reputationBonus)
            if (gameRNG.nextFloat() < modifiedChance) {
              actions.addItem(item.id)
              results.rewards.items.push(item.name)
            }
          }
        })
      }

      // Gain reputation on success
      const repGain = Math.floor(crime.riskLevel === 'extreme' ? 5 : crime.riskLevel === 'high' ? 3 : 2)
      setCrimeReputation(prev => Math.min(100, prev + repGain))
      results.reputation = repGain

      // Use equipment (chance to break)
      if (equipmentBonus > 0) {
        const equipment = ['lockpick_set', 'disguise_kit', 'getaway_car'].filter(id =>
          state.inventory.some(item => item.id === id)
        )
        if (equipment.length > 0 && gameRNG.nextFloat() < 0.1) { // 10% chance to break equipment
          const brokenItem = equipment[Math.floor(gameRNG.nextFloat() * equipment.length)]
          const { broken } = actions.useItem(brokenItem)
          if (broken) {
            notify({
              type: 'warning',
              title: 'Equipment Broken',
              message: `Your ${items[brokenItem]?.name} broke during the crime!`
            })
          }
        }
      }

      actions.addToWallet(results.rewards.wtc)
      actions.trackActivity(`Crime: ${crime.name}`)

    } else {
      // Crime failed - various consequences
      results.success = false
      gotCaught = true

      // Determine consequences based on risk level
      const randomConsequence = gameRNG.nextFloat()
      if (randomConsequence < 0.3) {
        // Arrested - lose money and items
        results.consequences.arrested = true
        const lossPercentage = 0.2 + (gameRNG.nextFloat() * 0.3) // 20-50%
        const coinsLost = Math.floor(state.wallet * lossPercentage)
        actions.addToWallet(-coinsLost)

        // Chance to lose random items
        const loseItems = gameRNG.nextFloat() < 0.3
        if (loseItems && state.inventory.length > 0) {
          const randomItem = state.inventory[Math.floor(gameRNG.nextFloat() * state.inventory.length)]
          actions.removeItem(randomItem.id)
          results.consequences.itemsLost.push(items[randomItem.id]?.name || 'Unknown Item')
        }

        // Chance to lose job (only if player has a job)
        if (state.profile.job && gameRNG.nextFloat() < 0.4) { // 40% chance to lose job when arrested
          jobLost = true
          actions.loseJob()
          results.consequences.itemsLost.push('Job')
        }
      } else if (randomConsequence < 0.6) {
        // Injured - no money loss but potential item damage
        results.consequences.injured = true
        // Could add health system here in the future
      } else {
        // Just money loss
        const lossPercentage = 0.1 + (gameRNG.nextFloat() * 0.2) // 10-30%
        const coinsLost = Math.floor(state.wallet * lossPercentage)
        actions.addToWallet(-coinsLost)
      }

      // Lose reputation on failure
      const repLoss = Math.floor(crime.riskLevel === 'extreme' ? -3 : crime.riskLevel === 'high' ? -2 : -1)
      setCrimeReputation(prev => Math.max(-50, prev + repLoss))
      results.reputation = repLoss
    }

    setCrimeResults(results)

    // Create notification message
    let message = ''
    if (results.success) {
      message = `Successfully committed ${crime.name}!`
      if (results.rewards.wtc > 0) message += ` Earned ${results.rewards.wtc} WTC`
      if (results.rewards.items.length > 0) message += ` and found: ${results.rewards.items.join(', ')}`
      if (results.reputation > 0) message += ` (+${results.reputation} reputation)`
      notify({ type: 'success', title: 'Crime Successful', message })
    } else {
      if (results.consequences.arrested) {
        message = `Got arrested during ${crime.name}!`
        if (results.consequences.itemsLost.length > 0) {
          message += ` Lost: ${results.consequences.itemsLost.join(', ')}`
        }
        if (jobLost) message += ` (You got fired from your job!)`
      } else if (results.consequences.injured) {
        message = `Got injured during ${crime.name}!`
      } else {
        message = `Failed ${crime.name} and lost some money!`
      }
      if (results.reputation < 0) message += ` (${results.reputation} reputation)`;
      notify({ type: 'error', title: 'Crime Failed', message })
    }

    // Start cooldown and return to main UI with smooth transition
    onCooldownChange(true, crime.riskLevel === 'extreme' ? 8 : crime.riskLevel === 'high' ? 6 : 4)

    // Delay the UI transition slightly for smooth animation
    const transitionDelay = crime.riskLevel === 'extreme' || crime.riskLevel === 'high' ? 50 : 100
    setTimeout(() => {
      onCrimeComplete()
      setIsTransitioning(false)
      setCrimeResults(null)
    }, transitionDelay)
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Crime</h2>

      {crimeResults ? (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="bg-neutral-800 p-6 rounded-lg text-left">
            <h3 className="text-lg font-semibold mb-4">Crime Results: {crimeResults.crime.name}</h3>

            {crimeResults.success ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-900/30 border border-green-700 rounded">
                  <h4 className="text-green-400 font-semibold">Success!</h4>
                  <p className="text-white">
                    {crimeResults.rewards.wtc > 0 && `+${crimeResults.rewards.wtc} WTC`}
                    {crimeResults.rewards.items.length > 0 && ` • Found: ${crimeResults.rewards.items.join(', ')}`}
                  </p>
                </div>
                {crimeResults.reputation > 0 && (
                  <div className="p-2 bg-blue-900/30 border border-blue-700 rounded">
                    <p className="text-blue-400 text-sm">Reputation +{crimeResults.reputation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-red-900/30 border border-red-700 rounded">
                  <h4 className="text-red-400 font-semibold">Failed!</h4>
                  <p className="text-white">
                    {crimeResults.consequences.arrested && "Got arrested!"}
                    {crimeResults.consequences.injured && "Got injured!"}
                    {crimeResults.consequences.itemsLost.length > 0 && ` Lost: ${crimeResults.consequences.itemsLost.join(', ')}`}
                  </p>
                </div>
                {crimeResults.reputation < 0 && (
                  <div className="p-2 bg-red-900/30 border border-red-700 rounded">
                    <p className="text-red-400 text-sm">Reputation {crimeResults.reputation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : !showCrimes ? (
        <div className="space-y-4">
          <div className="text-sm text-neutral-400">
            <p>Choose a crime to commit!</p>
            {isOnCooldown && (
              <p className="mt-2 text-yellow-400">⏰ Cooldown: {cooldownTime}s remaining</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Choose Crime</h3>
            <div className="text-sm text-neutral-400 mb-4">
              <p>Reputation: {crimeReputation}/100</p>
              <p>Equipment Bonus: +{Math.round(getEquipmentBonus() * 100)}%</p>
            </div>
          </div>

          <div className="grid gap-3">
            {currentCrimes.map((crime) => {
              const reputationBonus = getReputationBonus(crimeReputation)
              const equipmentBonus = getEquipmentBonus()
              const totalSuccessChance = Math.min(0.95, (1 - crime.caughtChance) + reputationBonus + equipmentBonus)

              return (
                <button
                  key={crime.id}
                  onClick={() => handleCrime(crime)}
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
                      <span>Committing crime...</span>
                    </div>
                  ) : (
                    <div className="text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{crime.name}</h4>
                        <div className="flex gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRiskColor(crime.riskLevel)}`}>
                            {crime.riskLevel.charAt(0).toUpperCase() + crime.riskLevel.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">{crime.description}</p>
                      <div className="text-xs text-neutral-400">
                        <p className="text-red-400">Risk Level: {crime.riskLevel.charAt(0).toUpperCase() + crime.riskLevel.slice(1)}</p>
                        <p className="text-blue-400">Reward: {crime.wtcReward.min}-{crime.wtcReward.max} WTC</p>
                        <p className="text-yellow-400">⚠️ Results are completely random!</p>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
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
