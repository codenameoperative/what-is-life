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
    }

    // Loading complete after a short delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Q for fullscreen toggle
      if (event.ctrlKey && event.key === 'q') {
        event.preventDefault()
        toggleFullscreen()
      }

      // F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault()
        toggleFullscreen()
      }

      // ESC to exit fullscreen or show exit confirmation
      if (event.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen()
        } else {
          setShowExitConfirm(true)
        }
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

  const handleExitConfirm = () => {
    if (window.confirm('Are you sure you want to exit the game? Your progress will be saved.')) {
      window.close()
    }
  }

  const handleSetupComplete = (newUsername: string, newPlayerId: string) => {
    // Save setup data
    localStorage.setItem('setup-complete', 'true')
    localStorage.setItem('username', newUsername)
    localStorage.setItem('playerId', newPlayerId)

    setUsername(newUsername)
    setPlayerId(newPlayerId)
    setIsFirstTime(false)
    setShowSaveSelector(true)
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

  // Show save selector
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

  // Show first time setup for new saves
  if (isFirstTime && !currentSaveId) {
    return (
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <FirstTimeSetup onComplete={handleSetupComplete} />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <NotifyProvider>
        <GameProvider initialUsername={username} initialPlayerId={playerId} saveId={currentSaveId}>
          <MultiplayerProvider>
            {isFirstTime ? (
              <FirstTimeSetup onComplete={handleSetupComplete} />
            ) : (
              <Game onBackToMenu={handleBackToSaveSelector} />
            )}
          </MultiplayerProvider>
        </GameProvider>
      </NotifyProvider>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
          <div className="bg-neutral-900/80 border border-border/50 rounded-lg p-6 max-w-md mx-4 glass-strong shadow-2xl">
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

  // Note: ErrorLogViewer is accessible via button in the UI
  // It's not returned here as it's a modal component
}

export default App
