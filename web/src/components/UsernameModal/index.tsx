import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'

type Props = {
  open: boolean
  onComplete: () => void
}

export default function UsernameModal({ open, onComplete }: Props) {
  const { state, actions } = useGame()
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Pre-fill with current username if available
    if (state.profile.username) {
      setUsername(state.profile.username)
    }
  }, [state.profile.username])

  const handleSubmit = async () => {
    if (!username.trim() || username.length < 2) return

    setIsSubmitting(true)

    try {
      // Update username
      actions.updateUsername(username.trim())

      // Initialize new user with the provided username
      actions.initializeNewUser(state.profile.playerId, username.trim())

      onComplete()
    } catch (error) {
      console.error('Error setting username:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 modal-content glass-strong border border-border/50 shadow-2xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Welcome to What is Life!</h2>
        <p className="text-muted text-sm mb-6">
          Enter a username to get started. This will be your unique identifier in the game.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username..."
              className="w-full input-modern"
              disabled={isSubmitting}
              maxLength={20}
            />
            <p className="text-xs text-muted mt-1">
              2-20 characters. Letters, numbers, and spaces allowed.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!username.trim() || username.length < 2 || isSubmitting}
              className="flex-1 btn-primary"
            >
              {isSubmitting ? 'Setting up...' : 'Continue'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted text-center">
          Your Player ID: <code className="glass px-2 py-1 rounded text-xs">{state.profile.playerId}</code>
        </div>
      </div>
    </div>
  )
}
