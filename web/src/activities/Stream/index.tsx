import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { streamTypes } from '../../utils/streamTypes'
import { postingPlatforms } from '../../utils/postingPlatformData'

const PHONE_ID = 'phone'
const LAPTOP_ID = 'laptop'
const PC_SETUP_ID = 'pc_setup'

interface StreamActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onStreamComplete: () => void
}

export default function StreamActivity({ isOnCooldown, cooldownTime, onCooldownChange, onStreamComplete }: StreamActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedStreamType, setSelectedStreamType] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<number | ''>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Check for required streaming equipment
  const hasPhone = state.inventory.some(item => item.id === PHONE_ID)
  const hasLaptop = state.inventory.some(item => item.id === LAPTOP_ID)
  const hasPCSetup = state.inventory.some(item => item.id === PC_SETUP_ID)
  const hasStreamingEquipment = hasPhone || hasLaptop || hasPCSetup

  const handleGoLive = () => {
    if (isOnCooldown || isTransitioning) return

    // Check for streaming equipment
    if (!hasStreamingEquipment) {
      notify({
        type: 'info',
        title: 'Equipment Required',
        message: 'You need a Phone, Laptop, or PC Setup to stream.'
      })
      return
    }

    // Check if all selections are made
    if (!selectedStreamType || !selectedDuration || !selectedPlatform) {
      notify({
        type: 'error',
        title: 'Selection Required',
        message: 'Please select stream type, duration, and platform.'
      })
      return
    }

    performStream()
  }

  const performStream = () => {
    setIsTransitioning(true)

    const streamType = streamTypes[selectedStreamType as keyof typeof streamTypes]
    const platform = postingPlatforms[selectedPlatform as keyof typeof postingPlatforms]
    const duration = selectedDuration as number

    if (!streamType || !platform) {
      notify({ type: 'error', title: 'Invalid Selection', message: 'Please make valid selections.' })
      setIsTransitioning(false)
      return
    }

    // Track activity
    actions.trackActivity(`Stream: ${streamType.name} for ${duration}min on ${platform.name}`)

    // Calculate base reward based on duration and stream type
    const baseReward = gameRNG.nextInt(streamType.baseReward.min, streamType.baseReward.max)
    const durationMultiplier = duration / 10 // 10 minutes = 1x, 60 minutes = 6x
    const baseWtc = Math.floor(baseReward * durationMultiplier)

    let finalWtc = baseWtc
    let viral = false
    let itemReward = null

    // Determine stream outcome
    const randomOutcome = Math.random()

    // Check for viral success
    const viralChance = platform.viralChance * streamType.viralMultiplier * (duration / 15) // Longer streams have higher viral chance
    const isViral = randomOutcome < viralChance

    if (isViral) {
      // Viral success - massive rewards
      const viralBonus = Math.floor((platform.baseReward.max * platform.platformMultiplier * durationMultiplier) + (Math.random() * 1000))
      finalWtc += viralBonus
      viral = true

      // Chance for viral items
      const itemTier = gameRNG.getRandomTier({
        ...platform.itemDropChances,
        wdyft: platform.itemDropChances.wdyft * 2 // Double WDYFT chance for viral
      })

      if (itemTier && itemTier !== 'useless') {
        const tierItems = Object.values(items).filter(item => item.tier === itemTier && item.source === 'Found')
        if (tierItems.length > 0) {
          const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)]
          itemReward = randomItem.id
          actions.addItem(randomItem.id)
        }
      }

      notify({
        type: 'success',
        title: 'STREAM EXPLODED! 🚀',
        message: `Your ${duration}min ${streamType.name} stream went VIRAL on ${platform.name}! +${finalWtc} WTC${itemReward ? ` and ${items[itemReward]?.name}!` : ''}`
      })
    }
    // Check for regular success
    else if (randomOutcome < viralChance + streamType.successRate) {
      // Regular success
      notify({
        type: 'success',
        title: 'Stream Successful!',
        message: `Your ${duration}min ${streamType.name} stream got good viewership on ${platform.name}! +${finalWtc} WTC`
      })
    }
    // Check for failure
    else if (randomOutcome < viralChance + streamType.successRate + streamType.failureRate) {
      // Failure - possible WTC loss
      if (Math.random() < platform.failurePenalty) {
        // Penalty applied
        const penalty = Math.floor(baseWtc * 0.3)
        if (state.wallet >= penalty) {
          actions.deductFromWallet(penalty)
          finalWtc = -penalty // Negative to show loss
          notify({
            type: 'error',
            title: 'Stream Failed!',
            message: `Your ${streamType.name} stream flopped on ${platform.name}. Lost ${penalty} WTC due to technical issues.`
          })
        } else {
          actions.deductFromWallet(state.wallet)
          finalWtc = -state.wallet
          notify({
            type: 'error',
            title: 'Stream Failed!',
            message: `Your ${streamType.name} stream flopped on ${platform.name}. Lost all ${state.wallet} WTC due to major technical failure.`
          })
        }
      } else {
        // No penalty, just low viewership
        finalWtc = Math.floor(baseWtc * 0.2) // Only 20% of potential earnings
        notify({
          type: 'info',
          title: 'Low Viewership',
          message: `Your ${duration}min ${streamType.name} stream had low engagement on ${platform.name}. +${finalWtc} WTC`
        })
      }
    }
    // Neutral outcome
    else {
      // Mild success
      finalWtc = Math.floor(baseWtc * 0.6) // 60% of potential earnings
      notify({
        type: 'info',
        title: 'Decent Stream',
        message: `Your ${duration}min ${streamType.name} stream got some views on ${platform.name}. +${finalWtc} WTC`
      })
    }

    // Add WTC if positive
    if (finalWtc > 0) {
      actions.addToWallet(finalWtc)
    }

    // Start 10s cooldown and return to main UI
    onCooldownChange(true, 10)

    setTimeout(() => {
      onStreamComplete()
      setIsTransitioning(false)
    }, 50)
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Stream</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Go Live</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Choose your stream type, duration, and platform to start streaming
          </p>
        </div>

        <div className="grid gap-4">
          {/* Stream Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Stream Type
            </label>
            <select
              value={selectedStreamType}
              onChange={(e) => setSelectedStreamType(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
              disabled={isOnCooldown || isTransitioning}
            >
              <option value="">Select stream type...</option>
              {Object.values(streamTypes).map((streamType) => (
                <option key={streamType.id} value={streamType.id}>
                  {streamType.name} - {streamType.description}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Duration (minutes)
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
              disabled={isOnCooldown || isTransitioning}
            >
              <option value="">Select duration...</option>
              {[5, 10, 15, 20, 30, 45, 60].map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
          </div>

          {/* Platform Dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
              disabled={isOnCooldown || isTransitioning}
            >
              <option value="">Select platform...</option>
              {Object.values(postingPlatforms).filter(platform =>
                ['youtube', 'twitch', 'tiktok', 'kick', 'instagram', 'facebook'].includes(platform.id)
              ).map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name} - {platform.description}
                </option>
              ))}
            </select>
          </div>

          {/* Go Live Button */}
          <button
            onClick={handleGoLive}
            disabled={isOnCooldown || isTransitioning || !hasStreamingEquipment || !selectedStreamType || !selectedDuration || !selectedPlatform}
            className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
              isOnCooldown || isTransitioning || !hasStreamingEquipment || !selectedStreamType || !selectedDuration || !selectedPlatform
                ? 'cursor-not-allowed opacity-50'
                : 'hover:scale-105'
            }`}
          >
            {isTransitioning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Going Live...</span>
              </div>
            ) : isOnCooldown ? (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-400">Streaming Cooldown</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-purple-700 text-purple-100">
                      Stream
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Cooldown: {cooldownTime}s remaining
                </p>
                <div className="text-xs text-neutral-400">
                  <p>Rest and prepare for your next stream</p>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Go Live</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-red-700 text-red-100">
                      Live
                    </span>
                    {!hasStreamingEquipment && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-700 text-red-100">
                        No Device
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Start your live stream and engage with viewers!
                </p>
                <div className="text-xs text-neutral-400">
                  <p>10 second cooldown • Variable outcomes based on duration</p>
                  {!selectedStreamType || !selectedDuration || !selectedPlatform ? (
                    <p className="text-blue-400">Select stream type, duration, and platform to go live</p>
                  ) : null}
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Selected Options Display */}
        {selectedStreamType && selectedDuration && selectedPlatform && (
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-300">
              <p><strong>Type:</strong> {streamTypes[selectedStreamType as keyof typeof streamTypes]?.name}</p>
              <p><strong>Duration:</strong> {selectedDuration} minutes</p>
              <p><strong>Platform:</strong> {postingPlatforms[selectedPlatform as keyof typeof postingPlatforms]?.name}</p>
              <p className="text-xs text-neutral-400 mt-1">
                Est. Reward: {Math.floor((streamTypes[selectedStreamType as keyof typeof streamTypes]?.baseReward.min || 0) * (selectedDuration / 10))}-{Math.floor((streamTypes[selectedStreamType as keyof typeof streamTypes]?.baseReward.max || 0) * (selectedDuration / 10))} WTC
              </p>
            </div>
          </div>
        )}

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
