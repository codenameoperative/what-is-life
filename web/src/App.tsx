import { useState, useEffect } from 'react'
import Game from './components/Game'
import FirstTimeSetup from './components/FirstTimeSetup'
import { GameProvider } from './contexts/GameContext'
import { MultiplayerProvider } from './contexts/MultiplayerContext'
import { NotifyProvider } from './contexts/NotifyContext'

function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  useEffect(() => {
    // Check if this is the first time running the app
    const hasCompletedSetup = localStorage.getItem('setup-complete') === 'true'
    const savedUsername = localStorage.getItem('username')
    const savedPlayerId = localStorage.getItem('playerId')

    if (hasCompletedSetup && savedUsername && savedPlayerId) {
      setIsFirstTime(false)
      setUsername(savedUsername)
      setPlayerId(savedPlayerId)
    } else {
      setIsFirstTime(true)
    }

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
  }

  // Show loading while checking setup status
  if (isFirstTime === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-xl font-bold">What is Life?</div>
          <div className="text-neutral-300 text-sm">Loading your adventure...</div>
          <div className="w-80 bg-black/30 rounded-full h-3 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <div className="text-xs text-neutral-400 max-w-sm mx-auto">
            Initializing game world, loading items, preparing activities...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <NotifyProvider>
        <GameProvider initialUsername={username} initialPlayerId={playerId}>
          <MultiplayerProvider>
            {isFirstTime ? (
              <FirstTimeSetup onComplete={handleSetupComplete} />
            ) : (
              <Game />
            )}
          </MultiplayerProvider>
        </GameProvider>
      </NotifyProvider>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Exit Game?</h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to exit? Your progress will be automatically saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
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

      <style>{`
        .fullscreen-mode {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: black;
        }
      `}</style>
    </div>
  )
}

export default App
