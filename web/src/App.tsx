import { useState, useEffect } from 'react'
import { NotifyProvider } from './contexts/NotifyContext'
import { GameProvider } from './contexts/GameContext'
import { MultiplayerProvider } from './contexts/MultiplayerContext'
import Game from './components/Game'
import FirstTimeSetup from './components/FirstTimeSetup'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first time running the app
    const hasCompletedSetup = localStorage.getItem('setup-complete') === 'true'

    if (hasCompletedSetup) {
      setIsFirstTime(false)
      // Load existing user data
      const savedUsername = localStorage.getItem('username') || 'Player'
      const savedPlayerId = localStorage.getItem('player-id') || 'player-1'
      setUsername(savedUsername)
      setPlayerId(savedPlayerId)
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
      console.log('Saving game before exit...')
      window.close()
    }
  }

  const handleFirstTimeComplete = (username: string, playerId: string, characterData?: any) => {
    // Store character data if provided
    if (characterData) {
      localStorage.setItem('character-data', JSON.stringify(characterData))
    }

    // Complete the setup
    localStorage.setItem('setup-complete', 'true')
    localStorage.setItem('username', username)
    localStorage.setItem('player-id', playerId)

    setUsername(username)
    setPlayerId(playerId)
    setIsFirstTime(false)
  }

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  // Show first time setup for new users
  if (isFirstTime) {
    return (
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <FirstTimeSetup onComplete={handleFirstTimeComplete} />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <NotifyProvider>
          <GameProvider initialUsername={username} initialPlayerId={playerId}>
            <MultiplayerProvider>
              <Game onLoad={() => {}} />
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
