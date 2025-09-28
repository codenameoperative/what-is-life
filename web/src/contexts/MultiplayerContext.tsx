import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useGame } from './GameContext'
import { generatePlayerId } from '../utils/safeUUID'
import { multiplayerManager, type MultiplayerState, type MultiplayerActions } from '../services/MultiplayerManager'
import { invoke } from '@tauri-apps/api/core'

interface MultiplayerContextType {
  // Legacy interface for backward compatibility
  session: any | null
  isHost: boolean
  isConnected: boolean
  players: any[]
  serverIp: string
  setServerIp: (ip: string) => void
  createSession: () => void
  joinSession: (sessionId: string, playerId: string, serverIp?: string) => void
  leaveSession: () => void
  toggleSessionLock: () => void
  sendGameState: (gameState: any) => void
  broadcastActivity: (activity: string, data: any) => void

  // New comprehensive multiplayer interface
  multiplayerState: MultiplayerState
  multiplayerActions: MultiplayerActions
  isInitialized: boolean
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined)

export const MultiplayerProvider = ({ children }: { children: ReactNode }) => {
  const { state, actions } = useGame()
  const [session, setSession] = useState<any | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [serverIp, setServerIp] = useState('')
  const [localIp, setLocalIp] = useState<string>('')

  // New multiplayer system state
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>(multiplayerManager.getState())
  const [isInitialized, setIsInitialized] = useState(false)

  // Get local IP address on component mount
  useEffect(() => {
    const getLocalIP = async () => {
      try {
        const ip = await invoke<string>('get_local_ip')
        setLocalIp(ip)
        setServerIp(ip) // Set default server IP to local IP
      } catch (error) {
        console.error('Failed to get local IP:', error)
        setLocalIp('192.168.1.100') // Fallback
        setServerIp('192.168.1.100')
      }
    }

    getLocalIP()
  }, [])

  // Initialize new multiplayer system
  useEffect(() => {
    const initializeMultiplayer = async () => {
      try {
        const playerId = state.profile.playerId || generatePlayerId()
        const success = await multiplayerManager.initialize(playerId)
        if (success) {
          setIsInitialized(true)
        }
      } catch (error) {
        console.error('Failed to initialize multiplayer:', error)
      }
    }

    initializeMultiplayer()

    // Set up state listener
    const handleStateChange = (newState: MultiplayerState) => {
      setMultiplayerState(newState)
    }

    multiplayerManager.addListener(handleStateChange)

    return () => {
      multiplayerManager.removeListener(handleStateChange)
    }
  }, [state.profile.playerId])

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }, [])

  // Create a new multiplayer session (legacy + new system)
  const createSession = useCallback(async () => {
    const sessionId = generateSessionId()

    // Create session in new system
    const gameSession = await multiplayerManager.getActions().createGameSession('custom')
    if (gameSession) {
      setSession({
        id: sessionId,
        hostId: state.profile.playerId,
        hostIp: localIp || serverIp || 'localhost',
        players: new Map([[state.profile.playerId, {
          id: state.profile.playerId,
          username: state.profile.username,
          isHost: true,
          isConnected: true,
          lastSeen: Date.now()
        }]]),
        isLocked: false,
        maxPlayers: 10,
        gameState: state
      })
      setIsHost(true)
      setPlayers([{
        id: state.profile.playerId,
        username: state.profile.username,
        isHost: true,
        isConnected: true,
        lastSeen: Date.now()
      }])
    }
  }, [state.profile.playerId, state.profile.username, state, localIp, serverIp, generateSessionId])

  // Join an existing session (legacy + new system)
  const joinSession = useCallback(async (sessionId: string, playerId: string, targetServerIp?: string) => {
    const ip = targetServerIp || serverIp
    if (!ip) {
      console.error('No server IP provided')
      return
    }

    // Join session in new system
    const success = await multiplayerManager.getActions().joinGameSession(sessionId)
    if (success) {
      setIsConnected(true)
      const currentSession = multiplayerManager.getState().currentSession
      if (currentSession) {
        setSession({
          id: sessionId,
          hostId: currentSession.hostId,
          hostIp: ip,
          players: new Map(currentSession.players.map(p => [p.id, p])),
          isLocked: currentSession.isPrivate,
          maxPlayers: currentSession.maxPlayers,
          gameState: currentSession
        })
        setPlayers(currentSession.players)
      }
    }
  }, [serverIp])

  // Leave current session (legacy + new system)
  const leaveSession = useCallback(() => {
    multiplayerManager.getActions().leaveGameSession()
    setSession(null)
    setIsHost(false)
    setIsConnected(false)
    setPlayers([])
  }, [])

  // Toggle session lock (only host can do this)
  const toggleSessionLock = useCallback(() => {
    if (!isHost || !session) return

    const updatedSession = {
      ...session,
      isLocked: !session.isLocked
    }
    setSession(updatedSession)

    // Broadcast session lock change
    broadcastMessage({
      type: 'SESSION_LOCK',
      data: { isLocked: updatedSession.isLocked }
    })
  }, [isHost, session])

  // Send game state to other players
  const sendGameState = useCallback((gameState: any) => {
    if (!isConnected) return

    broadcastMessage({
      type: 'GAME_STATE',
      data: gameState
    })
  }, [isConnected])

  // Broadcast activity to other players
  const broadcastActivity = useCallback((activity: string, data: any) => {
    if (!isConnected) return

    broadcastMessage({
      type: 'ACTIVITY',
      data: { activity, ...data, playerId: state.profile.playerId, username: state.profile.username }
    })
  }, [isConnected, state.profile.playerId, state.profile.username])

  // Broadcast message to all players (legacy WebSocket simulation)
  const broadcastMessage = useCallback((message: any) => {
    // In the new system, this would use the secure communication layer
    console.log('Broadcasting message:', message)
  }, [])

  const value: MultiplayerContextType = {
    // Legacy interface
    session,
    isHost,
    isConnected,
    players,
    serverIp,
    setServerIp,
    createSession,
    joinSession,
    leaveSession,
    toggleSessionLock,
    sendGameState,
    broadcastActivity,

    // New comprehensive interface
    multiplayerState,
    multiplayerActions: multiplayerManager.getActions(),
    isInitialized
  }

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  )
}

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext)
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider')
  }
  return context
}
