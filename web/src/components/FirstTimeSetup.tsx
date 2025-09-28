import { useState, useEffect } from 'react'
import { generateUniquePlayerId } from '../utils/playerId'

interface FirstTimeSetupProps {
  onComplete: (username: string, playerId: string) => void
}

export default function FirstTimeSetup({ onComplete }: FirstTimeSetupProps) {
  const [username, setUsername] = useState('')
  const [playerId] = useState(generateUniquePlayerId())
  const [step, setStep] = useState<'welcome' | 'username' | 'playerId' | 'complete'>('welcome')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (step === 'welcome') {
      setStep('username')
    } else if (step === 'username') {
      if (username.trim().length >= 2 && username.trim().length <= 20) {
        setStep('playerId')
      }
    } else if (step === 'playerId') {
      setStep('complete')
      // Complete setup after showing player ID
      setTimeout(() => {
        onComplete(username.trim(), playerId)
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step === 'username') {
      setStep('welcome')
    } else if (step === 'playerId') {
      setStep('username')
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
              Get Started
            </button>
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
                onKeyPress={(e) => e.key === 'Enter' && isUsernameValid && handleNext()}
                autoFocus
              />
              <div className="mt-2 text-xs text-gray-400">
                {username.length}/20 characters
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isUsernameValid}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                  isUsernameValid
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'playerId' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔑</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your Player ID</h2>
              <p className="text-gray-300 text-sm mb-4">This unique identifier connects your game progress</p>

              <div className="bg-gray-800 border-2 border-green-500/50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-mono font-bold text-green-400 tracking-wider">
                  {playerId}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Save this ID! You'll need it to access your account and multiplayer sessions.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              I've Saved My Player ID - Start Playing!
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Setup Complete!</h2>
              <p className="text-gray-300">Welcome to the game, {username}!</p>
              <p className="text-sm text-gray-400 mt-2">Loading your adventure...</p>
            </div>
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  )
}
