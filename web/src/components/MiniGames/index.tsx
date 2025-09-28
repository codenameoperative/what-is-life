import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useMultiplayer } from '../../contexts/MultiplayerContext'
import Fight from './Fight'
import Race from './Race'

export type MiniGameType = 'steal' | 'russian_roulette' | 'gamble' | 'fight' | 'race'

export interface MiniGameState {
  type: MiniGameType
  players: string[] // player IDs
  currentPlayer: string
  gameData: any
  isActive: boolean
  winner?: string
}

interface MiniGamesProps {
  gameType: MiniGameType
  targetPlayerId?: string
  onComplete: (result: any) => void
}

export default function MiniGames({ gameType, targetPlayerId, onComplete }: MiniGamesProps) {
  const { state } = useGame()
  const { broadcastActivity, players, isConnected } = useMultiplayer()
  const [gameState, setGameState] = useState<MiniGameState | null>(null)
  const [localGameState, setLocalGameState] = useState<any>({})
  const [showLANModal, setShowLANModal] = useState(false)

  // Check if multiplayer is set up
  useEffect(() => {
    if (!isConnected) {
      setShowLANModal(true)
    } else {
      // Initialize mini-game
      const initialState: MiniGameState = {
        type: gameType,
        players: [state.profile.playerId, targetPlayerId || ''],
        currentPlayer: state.profile.playerId,
        gameData: getInitialGameData(gameType),
        isActive: true
      }
      setGameState(initialState)
      setLocalGameState(getInitialGameData(gameType))
    }
  }, [gameType, targetPlayerId, state.profile.playerId, isConnected])

  // Get initial game data based on type
  const getInitialGameData = useCallback((type: MiniGameType) => {
    switch (type) {
      case 'steal':
        return {
          targetItem: null,
          stealChance: 0.3,
          riskAmount: 100,
          isStealing: false
        }
      case 'gamble':
        return {
          betAmount: 50,
          playerCards: [],
          targetCards: [],
          deck: generateDeck(),
          isDealing: false
        }
      default:
        return {}
    }
  }, [])

  // Handle steal mini-game
  const handleSteal = useCallback(() => {
    if (!gameState || !targetPlayerId) return

    const success = Math.random() < localGameState.stealChance
    const result = {
      success,
      targetItem: success ? 'random_item' : null,
      lostAmount: success ? 0 : localGameState.riskAmount
    }

    broadcastActivity('STEAL', result)
    onComplete(result)
  }, [gameState, targetPlayerId, localGameState, broadcastActivity, onComplete])

  // Handle gamble
  const handleGamble = useCallback(() => {
    if (!gameState) return

    // Simple coin flip for demo
    const playerWins = Math.random() > 0.5
    const result = {
      playerWins,
      winnings: playerWins ? localGameState.betAmount * 2 : 0,
      loss: !playerWins ? localGameState.betAmount : 0
    }

    broadcastActivity('GAMBLE', result)
    onComplete(result)
  }, [gameState, localGameState, broadcastActivity, onComplete])

  // Generate a simple deck for gambling
  const generateDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    return suits.flatMap(suit => values.map(value => `${value}${suit}`))
  }

  if (!gameState) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md mx-4 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 capitalize">
          {gameType.replace('_', ' ')} Mini-Game
        </h2>

        {/* Game-specific UI */}
        {gameType === 'steal' && (
          <div className="space-y-4">
            <p className="text-neutral-300">
              Attempt to steal from {players.find(p => p.id === targetPlayerId)?.username}?
            </p>
            <div className="text-sm text-neutral-400">
              Success Rate: {Math.round(localGameState.stealChance * 100)}%<br />
              Risk: {localGameState.riskAmount} WTC
            </div>
            <button
              onClick={handleSteal}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
            >
              Attempt Steal
            </button>
          </div>
        )}

        {gameType === 'gamble' && (
          <div className="space-y-4">
            <p className="text-neutral-300">
              Gamble {localGameState.betAmount} WTC with {players.find(p => p.id === targetPlayerId)?.username}?
            </p>
            <button
              onClick={handleGamble}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg"
            >
              Place Bet
            </button>
          </div>
        )}

        <button
          onClick={() => onComplete({ cancelled: true })}
          className="w-full mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
