import { useState, useEffect } from 'react'
import { NotifyProvider } from './contexts/NotifyContext'
import { GameProvider, useGame } from './contexts/GameContext'
import { MultiplayerProvider } from './contexts/MultiplayerContext'
import Game from './components/Game'
import FirstTimeSetup from './components/FirstTimeSetup'
import LoadingScreen from './components/LoadingScreen'
import SaveSelector from './components/SaveSelector'
import ErrorBoundary from './components/ErrorBoundary'
import { ErrorLogViewer } from './components/ErrorLogViewer'

function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSaveSelector, setShowSaveSelector] = useState(false)
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null)

  useEffect(() => {
    // Check if this is the first time running the app
    const hasCompletedSetup = localStorage.getItem('setup-complete') === 'true'

    if (hasCompletedSetup) {
      setIsFirstTime(false)
      setShowSaveSelector(true)
    } else {
      setIsFirstTime(true)
      setShowSaveSelector(false) // Don't show save selector on first time
    }

    // Loading complete after a short delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Q opens exit confirmation
      if (event.ctrlKey && event.key.toLowerCase() === 'q') {
        event.preventDefault()
        setShowExitConfirm(true)
        return
      }

      // F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault()
        toggleFullscreen()
        return
      }

      // Escape only exits fullscreen when active
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Prevent default F11 behavior
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F11') {
        e.preventDefault()
      }
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error)
    }
  }

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen()
      setIsFullscreen(false)
    } catch (error) {
      console.error('Exit fullscreen failed:', error)
    }
  }

  const handleExitConfirm = async () => {
    if (window.confirm('Are you sure you want to exit the game? Your progress will be automatically saved.')) {
      // Save the current game state before exiting
      try {
        // For now, we'll rely on the automatic save that happens when the app closes
        // The GameContext already saves on unmount via useEffect
        console.log('Saving game before exit...')
      } catch (error) {
        console.error('Error saving before exit:', error)
      }
      window.close()
    }
  }

  const handleSetupComplete = (newUsername: string, newPlayerId: string) => {
    // Save setup data
    localStorage.setItem('setup-complete', 'true')
    localStorage.setItem('username', newUsername)
    localStorage.setItem('playerId', newPlayerId)

    // Create initial save data
    const initialSaveData = {
      wallet: 100,
      bank: 0,
      stash: 0,
      currentJobId: undefined,
      useSeededRNG: false,
      seed: 12345,
      inventory: [
        { id: 'huntingrifle' },
        { id: 'fishingrod' },
        { id: 'shovel' },
        { id: 'phone' },
        { id: 'revivalbill', quantity: 5 },
      ],
      equipped: {},
      activeBoosts: [],
      shop: {
        essentials: ['huntingrifle','fishingrod','shovel','blanketcommon','usbcable','revivalbill'],
        rotatingIds: [],
        nextRefreshAt: Date.now() + 60 * 60 * 1000,
      },
      garden: {
        plots: Array.from({ length: 4 }, (_, i) => ({
          id: `plot_${i + 1}`,
          plantId: null,
          plantedAt: 0,
          wateredCount: 0,
          growthProgress: 0,
          isReady: false
        })),
        scarecrowEquipped: false,
        lastCheckTime: Date.now()
      },
      profile: {
        username: newUsername,
        description: 'Just started my journey...',
        playerId: newPlayerId,
        totalEarnings: 0,
        totalSpent: 0,
        activityUsage: {},
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        unlockedAchievements: [],
        availableTitles: [],
        deathCount: 0,
        totalTimePlayed: 0
      },
      settings: {
        confirmSell: true,
        confirmDeposit: true,
        animationSpeed: 'normal',
        performanceMode: false
      },
      secrets: {
        retroUnlocked: false,
        cheatUnlocked: false
      },
      lastPlayed: new Date().toISOString()
    }

    // Save to first available slot
    for (let i = 1; i <= 5; i++) {
      const saveKey = `save-slot-${i}`
      const existingSave = localStorage.getItem(saveKey)
      if (!existingSave) {
        localStorage.setItem(saveKey, JSON.stringify(initialSaveData))
        setCurrentSaveId(saveKey)
        break
      }
    }

    setUsername(newUsername)
    setPlayerId(newPlayerId)
    setIsFirstTime(false)
    setShowSaveSelector(false)
  }

  const handleSelectSave = (saveId: string) => {
    const saveData = localStorage.getItem(saveId)
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData)
        setUsername(parsed.profile?.username || 'Player')
        setPlayerId(parsed.profile?.playerId || 'player-1')
        setCurrentSaveId(saveId)
        setShowSaveSelector(false)
      } catch (error) {
        console.error('Failed to load save:', error)
      }
    }
  }

  const handleCreateSave = () => {
    setShowSaveSelector(false)
    setCurrentSaveId(null)
    // Will show the first time setup
  }

  const handleDeleteSave = (saveId: string) => {
    localStorage.removeItem(saveId)
  }

  // Load default save if set
  useEffect(() => {
    if (isFirstTime === false && !showSaveSelector) {
      // Check if user has a default save setting
      try {
        const savedSettings = localStorage.getItem('game_settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          if (settings.defaultSaveId) {
            // Auto-load the default save
            const defaultSaveId = settings.defaultSaveId
            const saveData = localStorage.getItem(defaultSaveId)
            if (saveData) {
              try {
                const parsed = JSON.parse(saveData)
                setUsername(parsed.profile?.username || 'Player')
                setPlayerId(parsed.profile?.playerId || 'player-1')
                setCurrentSaveId(defaultSaveId)
                // The GameProvider will automatically load the save data when it mounts
              } catch (error) {
                console.error('Failed to load default save:', error)
                // Fall back to save selector if default save is corrupted
                setShowSaveSelector(true)
              }
            } else {
              // Default save doesn't exist, fall back to save selector
              setShowSaveSelector(true)
            }
          } else {
            // No default save set, show save selector
            setShowSaveSelector(true)
          }
        } else {
          // No settings found, show save selector
          setShowSaveSelector(true)
        }
      } catch (error) {
        console.error('Error loading default save setting:', error)
        // Fall back to save selector on error
        setShowSaveSelector(true)
      }
    }
  }, [isFirstTime, showSaveSelector])

  const handleBackToSaveSelector = () => {
    // Save current game state if we have a save ID
    if (currentSaveId) {
      // TODO: Save game state
    }
    setShowSaveSelector(true)
  }

  // Show loading screen on app start
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  // Show loading while checking setup status
  if (isFirstTime === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-xl font-bold">What is Life?</div>
          <div className="text-neutral-300 text-sm">Loading your adventure...</div>
        </div>
      </div>
    )
  }

  // Show first time setup for new users
  if (isFirstTime) {
    return (
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <FirstTimeSetup onComplete={handleSetupComplete} />
      </div>
    )
  }

  // Show save selector for returning users
  if (showSaveSelector) {
    return (
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <SaveSelector
          onSelectSave={handleSelectSave}
          onCreateSave={handleCreateSave}
          onDeleteSave={handleDeleteSave}
        />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <NotifyProvider>
        <GameProvider initialUsername={username} initialPlayerId={playerId} saveId={currentSaveId}>
          <MultiplayerProvider>
            <Game onBackToMenu={handleBackToSaveSelector} onLoad={() => setShowSaveSelector(true)} />
          </MultiplayerProvider>
        </GameProvider>
      </NotifyProvider>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-neutral-900/95 border border-border/50 rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Exit Game?</h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to exit? Your progress will be automatically saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2 bg-tertiary/50 hover:bg-tertiary text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  )

 
}

export default App
