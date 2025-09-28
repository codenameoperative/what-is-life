import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useMultiplayer } from '../../contexts/MultiplayerContext'

export interface RussianRouletteState {
  type: 'russian_roulette'
  players: string[] // player IDs
  currentPlayerIndex: number
  chamber: boolean[] // true = bullet
  currentChamber: number
  isSpinning: boolean
  gamePhase: 'waiting' | 'spinning' | 'shooting' | 'result' | 'game_over'
  wager: {
    money: number
    items: string[]
  }
  winner?: string
  loser?: string
  turnOrder: string[]
}

interface RussianRouletteProps {
  targetPlayerId?: string
  onComplete: (result: any) => void
}

export default function RussianRoulette({ targetPlayerId, onComplete }: RussianRouletteProps) {
  const { state, actions } = useGame()
  const { broadcastActivity, players, session } = useMultiplayer()
  const [gameState, setGameState] = useState<RussianRouletteState | null>(null)
  const [wagerInput, setWagerInput] = useState({ money: '', items: [] as string[] })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showItemSelector, setShowItemSelector] = useState(false)

  // Initialize game
  useEffect(() => {
    if (!gameState && targetPlayerId) {
      const playerIds = [state.profile.playerId, targetPlayerId]
      const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5)

      const initialState: RussianRouletteState = {
        type: 'russian_roulette',
        players: playerIds,
        currentPlayerIndex: 0,
        chamber: [false, false, false, false, false, true], // 1 bullet in 6 chambers
        currentChamber: 0,
        isSpinning: false,
        gamePhase: 'waiting',
        wager: { money: 0, items: [] },
        turnOrder: shuffledPlayers
      }
      setGameState(initialState)
    }
  }, [targetPlayerId, state.profile.playerId, gameState])

  // Spin the chamber
  const spinChamber = useCallback(() => {
    if (!gameState) return

    setGameState(prev => prev ? {
      ...prev,
      isSpinning: true,
      gamePhase: 'spinning'
    } : null)

    // Simulate spinning animation
    setTimeout(() => {
      const newChamber = Math.floor(Math.random() * 6)
      setGameState(prev => prev ? {
        ...prev,
        currentChamber: newChamber,
        isSpinning: false,
        gamePhase: 'shooting'
      } : null)
    }, 2000)
  }, [gameState])

  // Pull trigger
  const pullTrigger = useCallback(() => {
    if (!gameState) return

    const hit = gameState.chamber[gameState.currentChamber]
    const currentPlayer = gameState.turnOrder[gameState.currentPlayerIndex]

    if (hit) {
      // Player dies
      const result = {
        hit: true,
        deadPlayer: currentPlayer,
        survived: false,
        winner: gameState.turnOrder[gameState.currentPlayerIndex === 0 ? 1 : 0],
        wagerWon: gameState.wager
      }

      // Check for revival bill
      const hasRevivalBill = state.inventory.some(item => item.id === 'revival_bill')
      if (hasRevivalBill) {
        // Use revival bill to survive
        actions.useItem('revival_bill')
        result.survived = true
        result.hit = false

        // Move to next player
        setGameState(prev => prev ? {
          ...prev,
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.turnOrder.length,
          gamePhase: 'result'
        } : null)
      } else {
        // Player dies - game over
        setGameState(prev => prev ? {
          ...prev,
          gamePhase: 'game_over',
          winner: gameState.turnOrder[gameState.currentPlayerIndex === 0 ? 1 : 0],
          loser: currentPlayer
        } : null)
      }

      broadcastActivity('RUSSIAN_ROULETTE', result)
      setTimeout(() => onComplete(result), 3000)
    } else {
      // Miss - next player's turn
      const result = {
        hit: false,
        currentPlayer,
        survived: true
      }

      setGameState(prev => prev ? {
        ...prev,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.turnOrder.length,
        gamePhase: 'result'
      } : null)

      broadcastActivity('RUSSIAN_ROULETTE', result)
      setTimeout(() => {
        setGameState(prev => prev ? {
          ...prev,
          gamePhase: 'waiting'
        } : null)
      }, 2000)
    }
  }, [gameState, state.inventory, actions, broadcastActivity, onComplete])

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
      <div className="w-full max-w-md mx-4 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Russian Roulette</h2>

        {/* Game Status */}
        <div className="text-center mb-6">
          <div className="text-lg text-white mb-2">
            {gameState.gamePhase === 'waiting' && `Waiting for ${currentPlayerInfo?.username}'s turn`}
            {gameState.gamePhase === 'spinning' && 'Spinning chamber...'}
            {gameState.gamePhase === 'shooting' && `${currentPlayerInfo?.username} pulls the trigger!`}
            {gameState.gamePhase === 'result' && `Chamber ${gameState.currentChamber + 1} - ${gameState.chamber[gameState.currentChamber] ? 'BANG!' : 'Click...'}`}
            {gameState.gamePhase === 'game_over' && `${currentPlayerInfo?.username} died! ${players.find(p => p.id === gameState.winner)?.username} wins!`}
          </div>

          {/* Chamber visualization */}
          <div className="flex justify-center gap-1 mb-4">
            {gameState.chamber.map((hasBullet, index) => (
              <div
                key={index}
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === gameState.currentChamber
                    ? 'border-red-500 bg-red-900/50'
                    : 'border-neutral-600'
                } ${hasBullet ? 'text-red-400' : 'text-neutral-400'}`}
              >
                {hasBullet ? '💥' : index + 1}
              </div>
            ))}
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

        {/* Game Controls */}
        {gameState.gamePhase === 'waiting' && !isMyTurn ? (
          <div className="text-center text-neutral-400">
            Waiting for {currentPlayerInfo?.username} to spin...
          </div>
        ) : gameState.gamePhase === 'waiting' && isMyTurn ? (
          <div className="space-y-3">
            <button
              onClick={spinChamber}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Spin Chamber
            </button>

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
        ) : gameState.gamePhase === 'shooting' && isMyTurn ? (
          <button
            onClick={pullTrigger}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg"
          >
            PULL TRIGGER
          </button>
        ) : gameState.gamePhase === 'result' ? (
          <div className="text-center text-lg text-white">
            {gameState.chamber[gameState.currentChamber] ? '💀 BANG! 💀' : '💨 Click... 💨'}
          </div>
        ) : gameState.gamePhase === 'game_over' ? (
          <div className="text-center">
            <div className="text-2xl mb-4">🏆</div>
            <div className="text-xl text-white mb-2">Game Over!</div>
            <div className="text-neutral-300">{players.find(p => p.id === gameState.winner)?.username} wins!</div>
          </div>
        ) : null}

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
