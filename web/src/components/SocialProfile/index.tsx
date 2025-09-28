import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'

interface SocialProfileProps {
  userId?: string
  showStats?: boolean
  showBadges?: boolean
  compact?: boolean
}

export default function SocialProfile({
  userId,
  showStats = true,
  showBadges = true,
  compact = false
}: SocialProfileProps) {
  const { state } = useGame()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!state.profile && !userId) {
        setLoading(false)
        return
      }

      // Load profile data from game state
      setProfile(state.profile || null)
      setLoading(false)
    }

    loadProfile()
  }, [state.profile, userId])

  if (loading) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!profile && !state.profile) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 text-center">
        <p className="text-neutral-400 text-sm">No profile data available</p>
      </div>
    )
  }

  return (
    <div className={`bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 ${compact ? 'text-sm' : ''}`}>
      {/* Player ID Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {profile?.playerId?.[0] || state.profile?.playerId?.[0] || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {profile?.username || state.profile?.username || 'Player'}
            </h3>
            <p className="text-xs text-neutral-400">
              ID: {profile?.playerId || 'Not set'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-yellow-400">
            Level {profile?.level || state.profile?.level || 1}
          </div>
          <div className="text-xs text-neutral-400">
            {profile?.xp || state.profile?.xp || 0} / {profile?.xpToNextLevel || state.profile?.xpToNextLevel || 100} XP
          </div>
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-neutral-800/50 rounded p-3 text-center">
            <div className="text-lg font-bold text-green-400">
              {state.wallet || 0}
            </div>
            <div className="text-xs text-neutral-400">WTC</div>
          </div>
          <div className="bg-neutral-800/50 rounded p-3 text-center">
            <div className="text-lg font-bold text-blue-400">
              {profile?.totalEarnings || state.profile?.totalEarnings || 0}
            </div>
            <div className="text-xs text-neutral-400">Earned</div>
          </div>
        </div>
      )}

      {showBadges && (
        <div className="flex flex-wrap gap-2">
          {profile?.unlockedAchievements?.map((achievementId: string) => (
            <div key={achievementId} className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏆</span>
            </div>
          ))}
          {(!profile?.unlockedAchievements || profile.unlockedAchievements.length === 0) && (
            <div className="text-xs text-neutral-500">No achievements yet</div>
          )}
        </div>
      )}

      {/* Online Status Indicator */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-neutral-400">Online</span>
        <span className="text-xs text-neutral-500 ml-auto">
          Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
        </span>
      </div>
    </div>
  )
}
