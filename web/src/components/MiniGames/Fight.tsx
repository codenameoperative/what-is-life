import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useMultiplayer } from '../../contexts/MultiplayerContext'

export interface FightState {
  type: 'fight'
  players: string[] // player IDs
  currentPlayerIndex: number
  playerHealth: number
  targetHealth: number
  playerAction: 'block' | 'dodge' | 'punch' | 'kick' | null
  targetAction: 'block' | 'dodge' | 'punch' | 'kick' | null
  gamePhase: 'waiting' | 'choosing' | 'revealing' | 'result' | 'game_over'
  wager: {
    money: number
    items: string[]
  }
  winner?: string
  turnOrder: string[]
}

interface FightProps {
  targetPlayerId?: string
  onComplete: (result: any) => void
}

export default function Fight({ targetPlayerId, onComplete }: FightProps) {
  const { state, actions } = useGame()
  const { broadcastActivity, players } = useMultiplayer()
  const [gameState, setGameState] = useState<FightState | null>(null)
  const [myAction, setMyAction] = useState<'block' | 'dodge' | 'punch' | 'kick' | null>(null)
  const [wagerInput, setWagerInput] = useState({ money: '', items: [] as string[] })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showItemSelector, setShowItemSelector] = useState(false)

  // Initialize game
  useEffect(() => {
    if (!gameState && targetPlayerId) {
      const playerIds = [state.profile.playerId, targetPlayerId]
      const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5)

      const initialState: FightState = {
        type: 'fight',
        players: playerIds,
        currentPlayerIndex: 0,
        playerHealth: 100,
        targetHealth: 100,
        playerAction: null,
        targetAction: null,
        gamePhase: 'waiting',
        wager: { money: 0, items: [] },
        turnOrder: shuffledPlayers
      }
      setGameState(initialState)
    }
  }, [targetPlayerId, state.profile.playerId, gameState])

  // Submit action
  const submitAction = useCallback((action: 'block' | 'dodge' | 'punch' | 'kick') => {
    if (!gameState || gameState.gamePhase !== 'choosing') return

    setMyAction(action)
    setGameState(prev => prev ? {
      ...prev,
      playerAction: action,
      gamePhase: 'waiting'
    } : null)

    // Simulate opponent action after delay
    setTimeout(() => {
      const opponentAction = ['block', 'dodge', 'punch', 'kick'][Math.floor(Math.random() * 4)] as any
      resolveTurn(action, opponentAction)
    }, 2000)
  }, [gameState])

  // Resolve turn
  const resolveTurn = useCallback((playerAction: string, targetAction: string) => {
    if (!gameState) return

    const playerDamage = calculateDamage(playerAction, targetAction)
    const targetDamage = calculateDamage(targetAction, playerAction)

    const newPlayerHealth = Math.max(0, gameState.playerHealth - targetDamage)
    const newTargetHealth = Math.max(0, gameState.targetHealth - playerDamage)

    const result = {
      playerAction,
      targetAction,
      playerDamage,
      targetDamage,
      playerHealth: newPlayerHealth,
      targetHealth: newTargetHealth,
      playerWins: newTargetHealth <= 0,
      targetWins: newPlayerHealth <= 0
    }

    setGameState(prev => prev ? {
      ...prev,
      playerHealth: newPlayerHealth,
      targetHealth: newTargetHealth,
      playerAction: playerAction as any,
      targetAction: targetAction as any,
      gamePhase: newTargetHealth <= 0 || newPlayerHealth <= 0 ? 'game_over' : 'result'
    } : null)

    broadcastActivity('FIGHT', result)

    if (newTargetHealth <= 0 || newPlayerHealth <= 0) {
      setTimeout(() => onComplete(result), 3000)
    } else {
      setTimeout(() => {
        setGameState(prev => prev ? {
          ...prev,
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.turnOrder.length,
          playerAction: null,
          targetAction: null,
          gamePhase: 'choosing'
        } : null)
        setMyAction(null)
      }, 3000)
    }
  }, [gameState, broadcastActivity, onComplete])

  // Calculate damage
  const calculateDamage = (attacker: string, defender: string) => {
    if (defender === 'block' && attacker === 'punch') return 0
    if (defender === 'dodge' && attacker === 'kick') return 0
    if (attacker === 'punch') return 20
    if (attacker === 'kick') return 25
    return 0
  }

  // Set wager
  const setWager = useCallback(() => {
    const moneyAmount = parseInt(wagerInput.money) || 0
    if (moneyAmount > state.wallet) return

    setGameState(prev => prev ? {
      ...prev,
      wager: {
        money: moneyAmount,
        items: selectedItems
      }
    } : null)

    setShowItemSelector(false)
  }, [wagerInput.money, selectedItems, state.wallet])

  // Add item to wager
  const addItemToWager = useCallback((itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    } else {
      setSelectedItems(prev => [...prev, itemId])
    }
  }, [selectedItems])

  if (!gameState || !targetPlayerId) return null

  const currentPlayer = gameState.turnOrder[gameState.currentPlayerIndex]
  const isMyTurn = currentPlayer === state.profile.playerId
  const opponentPlayer = players.find(p => p.id === targetPlayerId)
  const currentPlayerInfo = players.find(p => p.id === currentPlayer)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-lg mx-4 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Fight!</h2>

        {/* Health Bars */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-300">{state.profile.username}</span>
            <span className="text-sm text-neutral-300">{opponentPlayer?.username}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-neutral-800 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${gameState.playerHealth}%` }}
              ></div>
            </div>
            <div className="flex-1 bg-neutral-800 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${gameState.targetHealth}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-neutral-400 mt-1">
            <span>{gameState.playerHealth}/100</span>
            <span>{gameState.targetHealth}/100</span>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <div className="text-lg text-white mb-2">
            {gameState.gamePhase === 'waiting' && `Waiting for ${currentPlayerInfo?.username} to choose...`}
            {gameState.gamePhase === 'choosing' && `${currentPlayerInfo?.username}'s turn to choose action`}
            {gameState.gamePhase === 'revealing' && 'Revealing actions...'}
            {gameState.gamePhase === 'result' && 'Turn resolved!'}
            {gameState.gamePhase === 'game_over' && `${players.find(p => p.id === gameState.winner)?.username} wins!`}
          </div>
        </div>

        {/* Wager Display */}
        {gameState.wager.money > 0 || gameState.wager.items.length > 0 ? (
          <div className="bg-neutral-800 rounded p-3 mb-4">
            <h3 className="text-sm font-semibold text-white mb-2">Current Wager:</h3>
            <div className="text-xs text-neutral-300">
              <p>Money: {gameState.wager.money} WTC</p>
              <p>Items: {gameState.wager.items.length}</p>
            </div>
          </div>
        ) : null}

        {/* Action Selection */}
        {gameState.gamePhase === 'choosing' && isMyTurn ? (
          <div className="space-y-4">
            <div className="text-center text-white mb-4">Choose your action:</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => submitAction('block')}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                🛡️ Block
              </button>
              <button
                onClick={() => submitAction('dodge')}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              >
                💨 Dodge
              </button>
              <button
                onClick={() => submitAction('punch')}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
              >
                👊 Punch
              </button>
              <button
                onClick={() => submitAction('kick')}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
              >
                🦵 Kick
              </button>
            </div>

            {/* Wager Setup */}
            <div className="border-t border-neutral-700 pt-3">
              <button
                onClick={() => setShowItemSelector(!showItemSelector)}
                className="w-full px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded mb-2"
              >
                Set Wager ({gameState.wager.money > 0 || gameState.wager.items.length > 0 ? 'Edit' : 'Add'})
              </button>

              {showItemSelector && (
                <div className="bg-neutral-800 rounded p-3 mb-3">
                  <input
                    type="number"
                    placeholder="Wager amount"
                    value={wagerInput.money}
                    onChange={(e) => setWagerInput(prev => ({ ...prev, money: e.target.value }))}
                    className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm mb-2"
                    max={state.wallet}
                  />
                  <div className="text-xs text-neutral-400 mb-2">Items to wager:</div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {state.inventory.map(item => (
                      <button
                        key={item.id}
                        onClick={() => addItemToWager(item.id)}
                        className={`w-full text-left px-2 py-1 text-xs rounded ${
                          selectedItems.includes(item.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {item.id} {selectedItems.includes(item.id) && '✓'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={setWager}
                    className="w-full mt-2 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                  >
                    Confirm Wager
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : gameState.gamePhase === 'result' ? (
          <div className="text-center">
            <div className="text-lg text-white mb-2">
              {gameState.playerAction && gameState.targetAction && (
                <>
                  <div className="mb-2">
                    {state.profile.username}: {getActionEmoji(gameState.playerAction)} {gameState.playerAction}
                  </div>
                  <div className="mb-2">
                    {opponentPlayer?.username}: {getActionEmoji(gameState.targetAction)} {gameState.targetAction}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {gameState.playerHealth < 100 && `You took ${100 - gameState.playerHealth} damage!`}
                    {gameState.targetHealth < 100 && ` ${opponentPlayer?.username} took ${100 - gameState.targetHealth} damage!`}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : gameState.gamePhase === 'game_over' ? (
          <div className="text-center">
            <div className="text-2xl mb-4">🏆</div>
            <div className="text-xl text-white mb-2">Fight Over!</div>
            <div className="text-neutral-300">{players.find(p => p.id === gameState.winner)?.username} wins!</div>
          </div>
        ) : (
          <div className="text-center text-neutral-400">
            {isMyTurn ? 'Choose your action...' : `Waiting for ${currentPlayerInfo?.username}...`}
          </div>
        )}

        <button
          onClick={() => onComplete({ cancelled: true })}
          className="w-full mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded"
        >
          {gameState.gamePhase === 'game_over' ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

// Helper function to get emoji for actions
function getActionEmoji(action: string) {
  switch (action) {
    case 'block': return '🛡️'
    case 'dodge': return '💨'
    case 'punch': return '👊'
    case 'kick': return '🦵'
    default: return '❓'
  }
}
