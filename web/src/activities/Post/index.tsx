import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'
import { items } from '../../utils/items'
import { memeTypes } from '../../utils/memeData'
import { postingPlatforms } from '../../utils/postingPlatformData'

const PHONE_ID = 'phone'
const LAPTOP_ID = 'laptop'
const PC_SETUP_ID = 'pc_setup'

interface PostActivityProps {
  isOnCooldown: boolean
  cooldownTime: number
  onCooldownChange: (isOnCooldown: boolean, timeLeft: number) => void
  onPostComplete: () => void
}

export default function PostActivity({ isOnCooldown, cooldownTime, onCooldownChange, onPostComplete }: PostActivityProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedMemeType, setSelectedMemeType] = useState<string>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [postResults, setPostResults] = useState<{
    wtcReward?: number
    items?: string[]
    viral?: boolean
    failed?: boolean
  } | null>(null)

  // Check for required posting equipment
  const hasPhone = state.inventory.some(item => item.id === PHONE_ID)
  const hasLaptop = state.inventory.some(item => item.id === LAPTOP_ID)
  const hasPCSetup = state.inventory.some(item => item.id === PC_SETUP_ID)
  const hasPostingEquipment = hasPhone || hasLaptop || hasPCSetup

  const handlePost = () => {
    if (isOnCooldown || isTransitioning) return

    // Check for posting equipment
    if (!hasPostingEquipment) {
      notify({
        type: 'info',
        title: 'Equipment Required',
        message: 'You need a Phone, Laptop, or PC Setup to post memes.'
      })
      return
    }

    // Check if meme type and platform are selected
    if (!selectedMemeType || !selectedPlatform) {
      notify({
        type: 'error',
        title: 'Selection Required',
        message: 'Please select both a meme type and a platform.'
      })
      return
    }

    performPost()
  }

  const performPost = () => {
    setIsTransitioning(true)

    const memeType = memeTypes[selectedMemeType as keyof typeof memeTypes]
    const platform = postingPlatforms[selectedPlatform as keyof typeof postingPlatforms]

    if (!memeType || !platform) {
      notify({ type: 'error', title: 'Invalid Selection', message: 'Please make valid selections.' })
      setIsTransitioning(false)
      return
    }

    // Track activity
    actions.trackActivity(`Post: ${memeType.name} on ${platform.name}`)

    const results: {
      wtcReward?: number
      items?: string[]
      viral?: boolean
      failed?: boolean
    } = {}

    // Determine post outcome
    const randomOutcome = Math.random()

    // Check for viral success first
    const viralChance = platform.viralChance * memeType.viralMultiplier
    const isViral = randomOutcome < viralChance

    if (isViral) {
      // Viral success - high rewards
      const viralWtc = Math.floor((platform.baseReward.max * platform.platformMultiplier) + (Math.random() * 500))
      results.wtcReward = viralWtc
      results.viral = true
      actions.addToWallet(viralWtc)

      // Chance for viral items
      const itemTier = gameRNG.getRandomTier({
        ...platform.itemDropChances,
        wdyft: platform.itemDropChances.wdyft * 2 // Double WDYFT chance for viral
      })

      if (itemTier && itemTier !== 'useless') {
        const tierItems = Object.values(items).filter(item => item.tier === itemTier && item.source === 'Found')
        if (tierItems.length > 0) {
          const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)]
          results.items = [randomItem.id]
          actions.addItem(randomItem.id)
        }
      }

      notify({
        type: 'success',
        title: 'VIRAL SUCCESS! 🚀',
        message: `Your ${memeType.name} went VIRAL on ${platform.name}! +${viralWtc} WTC${results.items ? ` and ${items[results.items[0]]?.name}!` : ''}`
      })
    }
    // Check for regular success
    else if (randomOutcome < viralChance + memeType.successRate) {
      // Regular success
      const baseWtc = gameRNG.nextInt(platform.baseReward.min, platform.baseReward.max)
      results.wtcReward = baseWtc
      actions.addToWallet(baseWtc)

      // Chance for regular items
      const itemTier = gameRNG.getRandomTier(platform.itemDropChances)
      if (itemTier && itemTier !== 'useless') {
        const tierItems = Object.values(items).filter(item => item.tier === itemTier && item.source === 'Found')
        if (tierItems.length > 0) {
          const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)]
          results.items = [randomItem.id]
          actions.addItem(randomItem.id)
        }
      }

      notify({
        type: 'success',
        title: 'Post Successful!',
        message: `Your ${memeType.name} got some engagement on ${platform.name}! +${baseWtc} WTC${results.items ? ` and ${items[results.items[0]]?.name}!` : ''}`
      })
    }
    // Check for failure
    else if (randomOutcome < viralChance + memeType.successRate + memeType.failureRate) {
      // Failure - possible WTC loss
      results.failed = true

      if (Math.random() < platform.failurePenalty) {
        // Penalty applied
        const penalty = Math.floor(platform.baseReward.min * 0.5)
        if (state.wallet >= penalty) {
          actions.deductFromWallet(penalty)
          notify({
            type: 'error',
            title: 'Post Failed!',
            message: `Your ${memeType.name} flopped on ${platform.name}. Lost ${penalty} WTC due to backlash.`
          })
        } else {
          actions.deductFromWallet(state.wallet)
          notify({
            type: 'error',
            title: 'Post Failed!',
            message: `Your ${memeType.name} flopped on ${platform.name}. Lost all ${state.wallet} WTC due to major backlash.`
          })
        }
      } else {
        // No penalty, just no engagement
        notify({
          type: 'info',
          title: 'Crickets...',
          message: `Your ${memeType.name} got zero engagement on ${platform.name}. Better luck next time!`
        })
      }
    }
    // Neutral outcome (no success, no failure)
    else {
      notify({
        type: 'info',
        title: 'Mild Success',
        message: `Your ${memeType.name} got a few views on ${platform.name}, but nothing special.`
      })
    }

    setPostResults(results)

    // Start 10s cooldown and return to main UI
    onCooldownChange(true, 10)

    setTimeout(() => {
      onPostComplete()
      setIsTransitioning(false)
      setPostResults(null)
    }, 50)
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Post</h2>

      <div className="space-y-4 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Create and Share a Meme</h3>
          <p className="text-sm text-neutral-400 mt-1">
            Choose your meme type and platform to post on
          </p>
        </div>

        <div className="grid gap-4">
          {/* Meme Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Meme Type
            </label>
            <select
              value={selectedMemeType}
              onChange={(e) => setSelectedMemeType(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-white focus:border-neutral-400 focus:outline-none"
              disabled={isOnCooldown || isTransitioning}
            >
              <option value="">Select meme type...</option>
              {Object.values(memeTypes).filter(meme => meme.id !== 'meme_template').map((meme) => (
                <option key={meme.id} value={meme.id}>
                  {meme.name} - {meme.description}
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
              {Object.values(postingPlatforms).filter(platform => platform.id !== 'platform_template').map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name} - {platform.description}
                </option>
              ))}
            </select>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={isOnCooldown || isTransitioning || !hasPostingEquipment || !selectedMemeType || !selectedPlatform}
            className={`w-full p-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 ${
              isOnCooldown || isTransitioning || !hasPostingEquipment || !selectedMemeType || !selectedPlatform
                ? 'cursor-not-allowed opacity-50'
                : 'hover:scale-105'
            }`}
          >
            {isTransitioning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </div>
            ) : isOnCooldown ? (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-400">Posting Cooldown</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-purple-700 text-purple-100">
                      Post
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Cooldown: {cooldownTime}s remaining
                </p>
                <div className="text-xs text-neutral-400">
                  <p>Please wait before posting again</p>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Post Meme</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-purple-700 text-purple-100">
                      Post
                    </span>
                    {!hasPostingEquipment && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-700 text-red-100">
                        No Device
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mb-2">
                  Share your meme and hope it goes viral!
                </p>
                <div className="text-xs text-neutral-400">
                  <p>10 second cooldown • Variable outcomes</p>
                  {!selectedMemeType || !selectedPlatform ? (
                    <p className="text-blue-400">Select both meme type and platform to post</p>
                  ) : null}
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Selected Options Display */}
        {selectedMemeType && selectedPlatform && (
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-300">
              <p><strong>Meme:</strong> {memeTypes[selectedMemeType as keyof typeof memeTypes]?.name}</p>
              <p><strong>Platform:</strong> {postingPlatforms[selectedPlatform as keyof typeof postingPlatforms]?.name}</p>
              <p className="text-xs text-neutral-400 mt-1">
                Success: {Math.round((memeTypes[selectedMemeType as keyof typeof memeTypes]?.successRate || 0) * 100)}% •
                Viral: {Math.round((postingPlatforms[selectedPlatform as keyof typeof postingPlatforms]?.viralChance || 0) * 100)}%
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
