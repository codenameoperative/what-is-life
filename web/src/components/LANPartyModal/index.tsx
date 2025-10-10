import { useState, useEffect } from 'react'
import { useMultiplayer } from '../../contexts/MultiplayerContext'
import { useGame } from '../../contexts/GameContext'
import { invoke } from '@tauri-apps/api/tauri'

interface LANPartyModalProps {
  open: boolean
  onClose: () => void
  onComplete?: () => void
  gameType: string
  targetPlayerId?: string
}

export default function LANPartyModal({ open, onClose, onComplete, gameType, targetPlayerId }: LANPartyModalProps) {
  const { serverIp, setServerIp, createSession, joinSession } = useMultiplayer()
  const { state } = useGame()
  const [hostIp, setHostIp] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [localIp, setLocalIp] = useState('')

  // Get local IP on component mount
  useEffect(() => {
    const getLocalIP = async () => {
      try {
        const ip = await invoke<string>('get_local_ip')
        setLocalIp(ip)
      } catch (error) {
        console.error('Failed to get local IP:', error)
        setLocalIp('192.168.1.100')
      }
    }

    if (open) {
      getLocalIP()
      setHostIp('')
      setSessionId('')
    }
  }, [open])

  const handleCreateSession = async () => {
    if (!hostIp.trim()) {
      setHostIp(localIp)
      return
    }

    setIsCreating(true)
    try {
      setServerIp(hostIp)
      await createSession()

      // Auto-populate session ID for joining
      setSessionId('') // In a real implementation, this would be generated

      setIsCreating(false)
      onComplete?.()
    } catch (error) {
      console.error('Failed to create session:', error)
      setIsCreating(false)
    }
  }

  const handleJoinSession = async () => {
    if (!hostIp.trim() || !sessionId.trim()) return

    setIsJoining(true)
    try {
      setServerIp(hostIp)
      await joinSession(sessionId, state.profile.playerId, hostIp)
      onComplete?.()
      onClose()
    } catch (error) {
      console.error('Failed to join session:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleQuickJoin = async () => {
    if (!localIp) return

    setIsJoining(true)
    try {
      setServerIp(localIp)
      // Try to join with a default session ID or create one
      await createSession()
      onComplete?.()
      onClose()
    } catch (error) {
      console.error('Failed to quick join:', error)
    } finally {
      setIsJoining(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="modal-content max-w-md glass-strong border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🌐</div>
            <div>
              <h2 className="text-xl font-semibold text-white">LAN Party Setup</h2>
              <p className="text-sm text-muted">Set up multiplayer for {gameType}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Host IP Input */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Host IP Address
              </label>
              <input
                type="text"
                placeholder={localIp || "192.168.1.100"}
                value={hostIp}
                onChange={(e) => setHostIp(e.target.value)}
                className="input-modern"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              />
              <p className="text-xs text-muted mt-1">
                Enter the host's IP address or leave blank to use your local IP
              </p>
            </div>

            {/* Session ID Input (for joining) */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Session ID (to join existing)
              </label>
              <input
                type="text"
                placeholder="Enter session ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="input-modern"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCreateSession}
                disabled={isCreating || isJoining}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <div className="loading-spinner w-4 h-4"></div>
                ) : (
                  '🎮'
                )}
                {isCreating ? 'Creating...' : 'Create Session'}
              </button>

              <button
                onClick={handleJoinSession}
                disabled={!hostIp.trim() || !sessionId.trim() || isCreating || isJoining}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                {isJoining ? (
                  <div className="loading-spinner w-4 h-4"></div>
                ) : (
                  '🔗'
                )}
                {isJoining ? 'Joining...' : 'Join Session'}
              </button>
            </div>

            {/* Quick Join */}
            <div className="border-t border-border/30 pt-4">
              <button
                onClick={handleQuickJoin}
                disabled={!localIp || isCreating || isJoining}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                ⚡ Quick Join Local
              </button>
              <p className="text-xs text-muted mt-2 text-center">
                Instantly join/create a session on your local network
              </p>
            </div>

            {/* Network Info */}
            {localIp && (
              <div className="glass p-3 rounded-lg backdrop-blur-sm border border-border/30">
                <div className="text-xs text-muted mb-1">Your Local IP:</div>
                <div className="text-sm font-mono text-primary">{localIp}</div>
                <div className="text-xs text-muted mt-1">
                  Share this IP with friends to join your session
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
