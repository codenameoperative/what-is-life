import { useState, useEffect } from 'react'
import Header from './Header'
import UtilityBar from './UtilityBar'
import Footer from './Footer'
import CrimeActivity from '../activities/Crime'
import WorkActivity from '../activities/Work'
import SearchActivity from '../activities/Search'
import HuntActivity from '../activities/Hunt'
import FishActivity from '../activities/Fish'
import DigActivity from '../activities/Dig'
import PostActivity from '../activities/Post'
import StreamActivity from '../activities/Stream'
import ExploreActivity from '../activities/Explore'
import GardenActivity from '../activities/Garden'
import Toaster from './Toaster/index'
import RussianRoulette from './MiniGames/RussianRoulette'
import Fight from './MiniGames/Fight'
import Race from './MiniGames/Race'
import UsernameModal from './UsernameModal'
import LANPartyModal from './LANPartyModal'
import { useGame } from '../contexts/GameContext'
import { useMultiplayer } from '../contexts/MultiplayerContext'

function Game() {
  const { state, actions } = useGame()
  const { session, isHost, isConnected, players, serverIp, setServerIp, createSession, joinSession, leaveSession, toggleSessionLock } = useMultiplayer()
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showMultiplayerMenu, setShowMultiplayerMenu] = useState(false)
  const [sessionIdInput, setSessionIdInput] = useState('')
  const [activeMiniGame, setActiveMiniGame] = useState<{ type: string, targetPlayerId?: string } | null>(null)
  const [showLANModal, setShowLANModal] = useState(false)
  const [pendingMiniGame, setPendingMiniGame] = useState<{ type: string, targetPlayerId?: string } | null>(null)
  const [searchCooldown, setSearchCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [crimeCooldown, setCrimeCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [workCooldown, setWorkCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [huntCooldown, setHuntCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [fishCooldown, setFishCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [digCooldown, setDigCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [postCooldown, setPostCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [streamCooldown, setStreamCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [exploreCooldown, setExploreCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [gardenCooldown, setGardenCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })

  // Cooldown management
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setCrimeCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setWorkCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setHuntCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setFishCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setDigCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setPostCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setStreamCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setExploreCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setGardenCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC key to go back
      if (event.key === 'Escape' && activeActivity) {
        setActiveActivity(null)
        return
      }

      // ENTER key to proceed (only when no activity is active)
      if (event.key === 'Enter' && !activeActivity) {
        // Find first available activity and select it
        const availableActivities = ['Search', 'Crime', 'Work', 'Hunt', 'Fish', 'Dig', 'Post', 'Stream', 'Explore', 'Garden']
        const firstAvailable = availableActivities.find(activity => {
          switch (activity) {
            case 'Search': return !searchCooldown.isOnCooldown
            case 'Crime': return !crimeCooldown.isOnCooldown
            case 'Work': return !workCooldown.isOnCooldown
            case 'Hunt': return !huntCooldown.isOnCooldown
            case 'Fish': return !fishCooldown.isOnCooldown
            case 'Dig': return !digCooldown.isOnCooldown
            case 'Post': return !postCooldown.isOnCooldown
            case 'Stream': return !streamCooldown.isOnCooldown
            case 'Explore': return !exploreCooldown.isOnCooldown
            case 'Garden': return !gardenCooldown.isOnCooldown
            default: return false
          }
        })

        if (firstAvailable) {
          setActiveActivity(firstAvailable)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeActivity, searchCooldown.isOnCooldown, crimeCooldown.isOnCooldown, workCooldown.isOnCooldown, huntCooldown.isOnCooldown, fishCooldown.isOnCooldown, digCooldown.isOnCooldown, postCooldown.isOnCooldown, streamCooldown.isOnCooldown, exploreCooldown.isOnCooldown, gardenCooldown.isOnCooldown])

  // Automated grinding
  useEffect(() => {
    if (!state.settings.automatedGrinding || activeActivity) return

    const interval = setInterval(() => {
      // Find the first available activity that's not on cooldown
      const availableActivities = [
        { name: 'Search', cooldown: searchCooldown },
        { name: 'Crime', cooldown: crimeCooldown },
        { name: 'Work', cooldown: workCooldown },
        { name: 'Hunt', cooldown: huntCooldown },
        { name: 'Fish', cooldown: fishCooldown },
        { name: 'Dig', cooldown: digCooldown },
        { name: 'Post', cooldown: postCooldown },
        { name: 'Stream', cooldown: streamCooldown },
        { name: 'Explore', cooldown: exploreCooldown },
        { name: 'Garden', cooldown: gardenCooldown }
      ]

      const nextActivity = availableActivities.find(activity => !activity.cooldown.isOnCooldown)
      if (nextActivity) {
        setActiveActivity(nextActivity.name)
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [state.settings.automatedGrinding, activeActivity, searchCooldown.isOnCooldown, crimeCooldown.isOnCooldown, workCooldown.isOnCooldown, huntCooldown.isOnCooldown, fishCooldown.isOnCooldown, digCooldown.isOnCooldown, postCooldown.isOnCooldown, streamCooldown.isOnCooldown, exploreCooldown.isOnCooldown, gardenCooldown.isOnCooldown])

  const renderActivity = () => {
    switch (activeActivity) {
      case 'Crime':
        return <CrimeActivity
          isOnCooldown={crimeCooldown.isOnCooldown}
          cooldownTime={crimeCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setCrimeCooldown({ isOnCooldown, timeLeft })
          }
          onCrimeComplete={() => setActiveActivity(null)}
        />
      case 'Work':
        return <WorkActivity
          isOnCooldown={workCooldown.isOnCooldown}
          cooldownTime={workCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setWorkCooldown({ isOnCooldown, timeLeft })
          }
          onWorkComplete={() => setActiveActivity(null)}
        />
      case 'Search':
        return <SearchActivity
          isOnCooldown={searchCooldown.isOnCooldown}
          cooldownTime={searchCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setSearchCooldown({ isOnCooldown, timeLeft })
          }
          onSearchComplete={() => setActiveActivity(null)}
        />
      case 'Hunt':
        return <HuntActivity
          isOnCooldown={huntCooldown.isOnCooldown}
          cooldownTime={huntCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setHuntCooldown({ isOnCooldown, timeLeft })
          }
          onHuntComplete={() => setActiveActivity(null)}
        />
      case 'Fish':
        return <FishActivity
          isOnCooldown={fishCooldown.isOnCooldown}
          cooldownTime={fishCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setFishCooldown({ isOnCooldown, timeLeft })
          }
          onFishComplete={() => setActiveActivity(null)}
        />
      case 'Dig':
        return <DigActivity
          isOnCooldown={digCooldown.isOnCooldown}
          cooldownTime={digCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setDigCooldown({ isOnCooldown, timeLeft })
          }
          onDigComplete={() => setActiveActivity(null)}
        />
      case 'Post':
        return <PostActivity
          isOnCooldown={postCooldown.isOnCooldown}
          cooldownTime={postCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setPostCooldown({ isOnCooldown, timeLeft })
          }
          onPostComplete={() => setActiveActivity(null)}
        />
      case 'Stream':
        return <StreamActivity
          isOnCooldown={streamCooldown.isOnCooldown}
          cooldownTime={streamCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setStreamCooldown({ isOnCooldown, timeLeft })
          }
          onStreamComplete={() => setActiveActivity(null)}
        />
      case 'Explore':
        return <ExploreActivity
          isOnCooldown={exploreCooldown.isOnCooldown}
          cooldownTime={exploreCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setExploreCooldown({ isOnCooldown, timeLeft })
          }
          onExploreComplete={() => setActiveActivity(null)}
        />
      case 'Garden':
        return <GardenActivity
          isOnCooldown={gardenCooldown.isOnCooldown}
          cooldownTime={gardenCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setGardenCooldown({ isOnCooldown, timeLeft })
          }
          onGardenComplete={() => setActiveActivity(null)}
        />
      default:
        return null
    }
  }

  // Check if user needs to set username (first time or no username set)
  useEffect(() => {
    const isFirstTime = !state.profile.username || state.profile.username === 'Player'
    setShowUsernameModal(isFirstTime)
  }, [state.profile.username])

  // Handle mini-game triggering
  const handleMiniGameTrigger = (gameType: string, targetPlayerId?: string) => {
    if (!isConnected) {
      // Show LAN modal first
      setPendingMiniGame({ type: gameType, targetPlayerId })
      setShowLANModal(true)
    } else {
      // Start mini-game directly
      setActiveMiniGame({ type: gameType, targetPlayerId })
    }
  }

  // Handle LAN modal completion
  const handleLANModalComplete = () => {
    setShowLANModal(false)
    if (pendingMiniGame && isConnected) {
      setActiveMiniGame(pendingMiniGame)
      setPendingMiniGame(null)
    }
  }

  // Handle LAN modal cancel
  const handleLANModalCancel = () => {
    setShowLANModal(false)
    setPendingMiniGame(null)
  }

  return (
    <div className="zorin-layout">
      {/* Header */}
      <Header />

      {/* Multiplayer Menu */}
      {showMultiplayerMenu && (
        <div className="fixed inset-0 z-40 flex items-center justify-center modal-overlay" onClick={() => setShowMultiplayerMenu(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">LAN Multiplayer</h2>

              {session ? (
                <div className="space-y-4">
                  <div className="glass p-4 rounded-lg">
                    <div className="text-sm text-secondary">
                      <p>Session ID: <code className="bg-tertiary px-2 py-1 rounded text-xs">{session.id}</code></p>
                      <p>Host IP: <code className="bg-tertiary px-2 py-1 rounded text-xs">{session.hostIp}</code></p>
                      <p>Players: {players.length}/{session.maxPlayers}</p>
                    </div>
                  </div>

                  {isHost && (
                    <button
                      onClick={toggleSessionLock}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg ${
                        session.isLocked
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {session.isLocked ? 'Unlock Session' : 'Lock Session'}
                    </button>
                  )}

                  <button
                    onClick={leaveSession}
                    className="w-full px-4 py-2 text-sm bg-secondary hover:bg-tertiary text-white font-medium rounded-lg"
                  >
                    Leave Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Server IP Address</label>
                    <input
                      type="text"
                      placeholder="192.168.1.100"
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      className="input-modern mb-3"
                    />
                    <p className="text-xs text-muted">Enter the host's IP address to join their session</p>
                  </div>

                  <button
                    onClick={createSession}
                    className="btn-primary w-full"
                  >
                    Create Session
                  </button>

                  <div className="border-t border-border pt-4">
                    <input
                      type="text"
                      placeholder="Enter Session ID"
                      value={sessionIdInput}
                      onChange={(e) => setSessionIdInput(e.target.value)}
                      className="input-modern mb-3"
                    />
                    <button
                      onClick={() => joinSession(sessionIdInput, state.profile.playerId, serverIp)}
                      disabled={!sessionIdInput.trim() || !serverIp.trim()}
                      className="btn-secondary w-full"
                    >
                      Join Session
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowMultiplayerMenu(false)}
                className="btn-secondary w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className={`flex-1 ${showUsernameModal ? 'hidden' : ''}`}>
        <section className="container-max pt-12 pb-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="title mb-4">What is Life?</h1>
            <p className="subtitle text-lg">Life is Full of Adventures...</p>
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="text-sm text-secondary">Press</span>
                <kbd className="px-2 py-1 bg-tertiary rounded text-xs font-mono">ENTER</kbd>
                <span className="text-sm text-secondary">to start first available activity</span>
              </div>
            </div>
          </div>
        </section>

        {/* Utility Bar */}
        <section className="container-max mb-8">
          <UtilityBar />
        </section>

        {/* Main Actions */}
        <section className="container-max pb-12">
          {activeActivity ? (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setActiveActivity(null)}
                className="mb-6 px-4 py-2 text-sm btn-secondary"
              >
                ← Back to Activities (ESC)
              </button>
              {renderActivity()}
            </div>
          ) : (
            <div>
              <div className="activity-grid">
                <button
                  onClick={() => setShowMultiplayerMenu(true)}
                  className="activity-card"
                >
                  <div className="activity-icon">🌐</div>
                  <div className="activity-title">Multiplayer</div>
                  <div className="activity-description">
                    {session ? 'Manage LAN session' : 'Start LAN multiplayer'}
                  </div>
                </button>
                {['Search','Crime','Work','Hunt','Fish','Dig','Post','Stream','Explore','Garden'].map((label) => {
                const isActive = ['Search', 'Crime', 'Work', 'Hunt', 'Fish', 'Dig', 'Post', 'Stream', 'Explore', 'Garden'].includes(label)
                const isSearchOnCooldown = label === 'Search' && searchCooldown.isOnCooldown
                const isCrimeOnCooldown = label === 'Crime' && crimeCooldown.isOnCooldown
                const isWorkOnCooldown = label === 'Work' && workCooldown.isOnCooldown
                const isFishOnCooldown = label === 'Fish' && fishCooldown.isOnCooldown
                const isHuntOnCooldown = label === 'Hunt' && huntCooldown.isOnCooldown
                const isDigOnCooldown = label === 'Dig' && digCooldown.isOnCooldown
                const isPostOnCooldown = label === 'Post' && postCooldown.isOnCooldown
                const isStreamOnCooldown = label === 'Stream' && streamCooldown.isOnCooldown
                const isExploreOnCooldown = label === 'Explore' && exploreCooldown.isOnCooldown
                const isGardenOnCooldown = label === 'Garden' && gardenCooldown.isOnCooldown
                const isOnCooldown = isSearchOnCooldown || isCrimeOnCooldown || isWorkOnCooldown || isHuntOnCooldown || isFishOnCooldown || isDigOnCooldown || isPostOnCooldown || isStreamOnCooldown || isExploreOnCooldown || isGardenOnCooldown

                return (
                  <button
                    key={label}
                    onClick={() => isActive && !isOnCooldown && setActiveActivity(label)}
                    className={`activity-card ${isOnCooldown ? 'opacity-50' : ''}`}
                    type="button"
                    disabled={isOnCooldown}
                  >
                    {isOnCooldown && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-pulse rounded-lg"></div>
                    )}
                    <div className="relative z-10">
                      <div className="activity-icon">
                        {label === 'Search' && '🔍'}
                        {label === 'Crime' && '🦹'}
                        {label === 'Work' && '💼'}
                        {label === 'Hunt' && '🏹'}
                        {label === 'Fish' && '🐟'}
                        {label === 'Dig' && '⛏️'}
                        {label === 'Post' && '💬'}
                        {label === 'Stream' && '⏺️'}
                        {label === 'Explore' && '🗺️'}
                        {label === 'Garden' && '🌾'}
                      </div>
                      <div className="activity-title">{label}</div>
                      <div className="activity-description">
                        {isOnCooldown ? (
                          <div className="flex items-center gap-1">
                            <div className="loading-spinner w-3 h-3"></div>
                            <span>
                              {label === 'Search' ? searchCooldown.timeLeft :
                               label === 'Crime' ? crimeCooldown.timeLeft :
                               label === 'Work' ? workCooldown.timeLeft :
                               label === 'Hunt' ? huntCooldown.timeLeft :
                               label === 'Fish' ? fishCooldown.timeLeft :
                               label === 'Dig' ? digCooldown.timeLeft :
                               label === 'Post' ? postCooldown.timeLeft :
                               label === 'Stream' ? streamCooldown.timeLeft :
                               label === 'Explore' ? exploreCooldown.timeLeft :
                               label === 'Garden' ? gardenCooldown.timeLeft : 0}s
                            </span>
                          </div>
                        ) : isActive ? (
                          label === 'Search' ? 'Discover hidden treasures' :
                          label === 'Crime' ? 'Take risks for big rewards' :
                          label === 'Work' ? 'Earn steady income' :
                          label === 'Hunt' ? 'Track wild game' :
                          label === 'Fish' ? 'Cast your line' :
                          label === 'Dig' ? 'Unearth buried secrets' :
                          label === 'Post' ? 'Share your thoughts' :
                          label === 'Stream' ? 'Broadcast to the world' :
                          label === 'Explore' ? 'Adventure awaits' :
                          label === 'Garden' ? 'Cultivate your crops' : 'Click to play'
                        ) : (
                          'Coming soon'
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
      {/* Notifications */}
      <Toaster />

      {/* Mini-Games */}
      {activeMiniGame?.type === 'russian_roulette' && activeMiniGame.targetPlayerId && (
        <RussianRoulette
          targetPlayerId={activeMiniGame.targetPlayerId}
          onComplete={(result) => {
            setActiveMiniGame(null)
            // Handle mini-game results
            if (result.winner) {
              // Process winnings/losses
            }
          }}
        />
      )}
      {activeMiniGame?.type === 'fight' && activeMiniGame.targetPlayerId && (
        <Fight
          targetPlayerId={activeMiniGame.targetPlayerId}
          onComplete={(result) => {
            setActiveMiniGame(null)
            // Handle mini-game results
          }}
        />
      )}
      {activeMiniGame?.type === 'race' && activeMiniGame.targetPlayerId && (
        <Race
          targetPlayerId={activeMiniGame.targetPlayerId}
          onComplete={(result) => {
            setActiveMiniGame(null)
            // Handle mini-game results
          }}
        />
      )}

      {/* Username Modal */}
      <UsernameModal
        open={showUsernameModal}
        onComplete={() => setShowUsernameModal(false)}
      />

      {/* LAN Party Modal */}
      <LANPartyModal
        open={showLANModal}
        onClose={handleLANModalCancel}
        onComplete={handleLANModalComplete}
        gameType={pendingMiniGame?.type || ''}
        targetPlayerId={pendingMiniGame?.targetPlayerId}
      />
    </div>
  )
}

export default Game
