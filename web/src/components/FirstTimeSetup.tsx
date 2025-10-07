import { useState, useEffect } from 'react'
import { generateUniquePlayerId } from '../utils/playerId'
import CharacterCreation from './PhaserCharacterCreation'

interface FirstTimeSetupProps {
  onComplete: (username: string, playerId: string, characterData?: any) => void
}

export default function FirstTimeSetup({ onComplete }: FirstTimeSetupProps) {
  const [username, setUsername] = useState('')
  const [playerId] = useState(generateUniquePlayerId())
  const [step, setStep] = useState<'welcome' | 'username' | 'character' | 'playerId' | 'loading'>('welcome')
  const [characterData, setCharacterData] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Enter key handler for continue/next
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleNext()
      }
    }

    if (step === 'welcome' || (step === 'username' && username.trim().length >= 2) || step === 'playerId') {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [step, username])

  const handleNext = () => {
    if (step === 'welcome') {
      setStep('username')
    } else if (step === 'username') {
      if (username.trim().length >= 2 && username.trim().length <= 20) {
        setStep('character')
      }
    } else if (step === 'character') {
      setStep('playerId')
    } else if (step === 'playerId') {
      setStep('loading')
      // Complete setup after showing loading for 2 seconds
      setTimeout(() => {
        onComplete(username.trim(), playerId, characterData)
      }, 2000)
    }
  }

  const isUsernameValid = username.trim().length >= 2 && username.trim().length <= 20

  if (!isVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-lg font-semibold">Loading Game...</div>
          <div className="w-64 bg-black/30 rounded-full h-2 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md w-full bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 shadow-2xl">
        {step === 'welcome' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to "What is Life?"</h1>
              <p className="text-gray-300">
                An immersive life simulation game where every choice matters. Hunt, fish, work, and explore in a world full of opportunities and dangers.
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue
            </button>
            <p className="text-xs text-gray-400">Press Enter to continue</p>
          </div>
        )}

        {step === 'username' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Choose Your Username</h2>
              <p className="text-gray-300 text-sm">This will be your identity in the game world</p>
            </div>

            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username (2-20 characters)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                maxLength={20}
                autoFocus
              />
              <div className="mt-2 text-xs text-gray-400">
                {username.length}/20 characters
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!isUsernameValid}
              className={`w-full py-3 px-6 rounded-lg transition-all duration-300 ${
                isUsernameValid
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
            <p className="text-xs text-gray-400 text-center">Press Enter when ready</p>
          </div>
        )}

        {step === 'character' && (
          <CharacterCreation onComplete={(data) => {
            setCharacterData(data)
            setStep('playerId')
          }} />
        )}

        {step === 'playerId' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Your Player ID</h2>
              <p className="text-gray-300 text-sm">This is your unique identifier in the game</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Player ID:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono">
                  {playerId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(playerId)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Keep this safe! You'll need it for account recovery and multiplayer sessions.
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue to Game
            </button>
            <p className="text-xs text-gray-400 text-center">Press Enter to continue</p>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to the Game!</h2>
              <p className="text-gray-300">Setting up your adventure...</p>
            </div>
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  )
}
