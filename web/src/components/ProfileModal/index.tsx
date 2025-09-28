import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { achievements, achievementCategories, rarityColors } from '../../utils/achievements'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  isOwnProfile?: boolean // Only owner can see player ID
}

export default function ProfileModal({ open, onClose, isOwnProfile = true }: ProfileModalProps) {
  const { state, actions } = useGame()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'titles'>('stats')
  const [tempUsername, setTempUsername] = useState(state.profile.username)
  const [tempDescription, setTempDescription] = useState(state.profile.description)

  if (!open) return null

  // Calculate total WTC
  const totalWTC = state.wallet + state.bank + (state.stash || 0)

  // Find most used activity
  const mostUsedActivity = Object.entries(state.profile.activityUsage)
    .sort(([,a], [,b]) => b - a)[0]

  const mostUsed = mostUsedActivity ? mostUsedActivity[0] : 'None yet'
  const mostUsedCount = mostUsedActivity ? mostUsedActivity[1] : 0

  const handleSave = () => {
    if (tempUsername.trim()) {
      actions.updateUsername(tempUsername.trim())
    }
    if (tempDescription.trim()) {
      actions.updateDescription(tempDescription.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempUsername(state.profile.username)
    setTempDescription(state.profile.description)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative mt-16 w-[min(92vw,700px)] rounded-xl border border-neutral-800 bg-neutral-950/95 shadow-2xl animate-scaleIn">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <div className="text-sm text-neutral-300">Profile</div>
          <button
            onClick={onClose}
            className="ml-auto px-3 py-2 text-sm rounded-lg bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel - Basic Info */}
          <div className="p-6 border-r border-neutral-900/60">
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">
                    {state.profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {state.profile.username}
                  {state.profile.equippedTitle && (
                    <span className="text-sm text-yellow-400 ml-2">[{state.profile.equippedTitle}]</span>
                  )}
                </h2>
                <p className="text-neutral-400 text-sm italic">"{state.profile.description}"</p>

                {/* Level Display */}
                <div className="mt-3 bg-neutral-900/50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-white mb-1">Level {state.profile.level}</div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(state.profile.xp / state.profile.xpToNextLevel) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {state.profile.xp.toLocaleString()} / {state.profile.xpToNextLevel.toLocaleString()} XP
                  </div>
                </div>
              </div>

              {/* Player ID - Only show to owner */}
              {isOwnProfile && (
                <div className="bg-neutral-900/50 rounded-lg p-3">
                  <div className="text-xs font-medium text-neutral-300 mb-1">Player ID</div>
                  <div className="text-xs text-neutral-500 font-mono break-all">
                    {state.profile.playerId}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Tabbed Content */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-neutral-900/50 rounded-lg p-1">
              {[
                { id: 'stats', label: 'Statistics', count: null },
                { id: 'achievements', label: 'Achievements', count: state.profile.unlockedAchievements.length },
                { id: 'titles', label: 'Titles', count: state.profile.availableTitles.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                      activeTab === tab.id ? 'bg-blue-500' : 'bg-neutral-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4">
                  <div className="text-sm text-neutral-400">Total WTC</div>
                  <div className="text-2xl font-bold text-white">💰 {totalWTC.toLocaleString()}</div>
                </div>

                <div className="bg-neutral-900/50 rounded-lg p-4">
                  <div className="text-sm text-neutral-400">Most Used Activity</div>
                  <div className="text-lg font-semibold text-white">🎯 {mostUsed}</div>
                  <div className="text-xs text-neutral-500 mt-1">({mostUsedCount} times)</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-neutral-400">Total Earned</div>
                    <div className="text-sm font-semibold text-green-400">📈 {state.profile.totalEarnings.toLocaleString()}</div>
                  </div>

                  <div className="bg-neutral-900/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-neutral-400">Total Spent</div>
                    <div className="text-sm font-semibold text-red-400">💸 {state.profile.totalSpent.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-neutral-900/50 rounded-lg p-4">
                  <div className="text-sm text-neutral-400">Deaths</div>
                  <div className="text-lg font-semibold text-red-400">💀 {state.profile.deathCount}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {state.profile.level > 1 ? `Higher levels = greater losses on death` : 'Safe for now...'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(achievementCategories).map(([categoryKey, categoryName]) => {
                  const categoryAchievements = Object.values(achievements).filter(a => a.category === categoryKey)
                  const unlockedInCategory = categoryAchievements.filter(a => state.profile.unlockedAchievements.includes(a.id))

                  return (
                    <div key={categoryKey} className="bg-neutral-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-white">{categoryName}</h4>
                        <span className="text-xs text-neutral-400">
                          {unlockedInCategory.length}/{categoryAchievements.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {categoryAchievements.map((achievement) => {
                          const isUnlocked = state.profile.unlockedAchievements.includes(achievement.id)
                          return (
                            <div
                              key={achievement.id}
                              className={`flex items-center gap-3 p-2 rounded ${
                                isUnlocked ? 'bg-neutral-800/50' : 'bg-neutral-900/30 opacity-60'
                              }`}
                            >
                              <div className={`text-lg ${isUnlocked ? '' : 'grayscale'}`}>
                                {achievement.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
                                  {achievement.name}
                                </div>
                                <div className={`text-xs truncate ${isUnlocked ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                  {achievement.description}
                                </div>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded ${rarityColors[achievement.rarity]} bg-current/20`}>
                                {achievement.rarity}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'titles' && (
              <div className="space-y-4">
                <div className="bg-neutral-900/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Available Titles</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {state.profile.availableTitles.length > 0 ? (
                      state.profile.availableTitles.map((title) => (
                        <div key={title} className="flex items-center justify-between p-2 bg-neutral-800/50 rounded">
                          <span className="text-sm text-white">[{title}]</span>
                          <div className="flex gap-2">
                            {state.profile.equippedTitle === title ? (
                              <button
                                onClick={() => actions.unequipTitle()}
                                className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                              >
                                Unequip
                              </button>
                            ) : (
                              <button
                                onClick={() => actions.equipTitle(title)}
                                className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                              >
                                Equip
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-neutral-500 text-center py-4">
                        No titles earned yet. Complete achievements to unlock titles!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Actions */}
            {isOwnProfile && (
              <div className="pt-4 border-t border-neutral-800 mt-6">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white text-sm"
                        maxLength={20}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-white resize-none text-sm"
                        rows={3}
                        maxLength={180}
                        placeholder="Tell your story... (max 180 characters)"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-700 hover:bg-green-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-800 hover:bg-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-orange-700 hover:bg-orange-800"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
