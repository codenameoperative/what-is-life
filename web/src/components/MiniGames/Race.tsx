import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useMultiplayer } from '../../contexts/MultiplayerContext'

export interface RaceState {
  type: 'race'
  players: string[] // player IDs
  currentPlayerIndex: number
  positions: { [playerId: string]: number } // position 0-100
  trackLength: number
  gamePhase: 'starting' | 'racing' | 'corner' | 'finished'
  currentCorner: number
  corners: number[]
  winner?: string
  wager: {
    money: number
    items: string[]
  }
  turnOrder: string[]
}

interface RaceProps {
  targetPlayerId?: string
  onComplete: (result: any) => void
}

export default function Race({ targetPlayerId, onComplete }: RaceProps) {
  const { state, actions } = useGame()
  const { broadcastActivity, players } = useMultiplayer()
  const [gameState, setGameState] = useState<RaceState | null>(null)
  const [myCornerChoice, setMyCornerChoice] = useState<'left' | 'right' | null>(null)
  const [wagerInput, setWagerInput] = useState({ money: '', items: [] as string[] })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showItemSelector, setShowItemSelector] = useState(false)

  // Initialize race
  useEffect(() => {
    if (!gameState && targetPlayerId) {
      const playerIds = [state.profile.playerId, targetPlayerId]
      const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5)

      const initialState: RaceState = {
        type: 'race',
        players: playerIds,
        currentPlayerIndex: 0,
        positions: { [playerIds[0]]: 0, [playerIds[1]]: 0 },
        trackLength: 100,
        gamePhase: 'starting',
        currentCorner: 0,
        corners: [25, 50, 75], // corners at 25%, 50%, 75% of track
        wager: { money: 0, items: [] },
        turnOrder: shuffledPlayers
      }
      setGameState(initialState)

      // Start race after delay
      setTimeout(() => {
        setGameState(prev => prev ? { ...prev, gamePhase: 'racing' } : null)
        startRace()
      }, 2000)
    }
  }, [targetPlayerId, state.profile.playerId, gameState])

  // Start race
  const startRace = useCallback(() => {
    const raceInterval = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev

        const newPositions = { ...prev.positions }

        // Move players forward (with some randomness)
        Object.keys(newPositions).forEach(playerId => {
          const currentPos = newPositions[playerId]
          if (currentPos < prev.trackLength) {
            const speed = 1 + Math.random() * 2 // 1-3 units per tick
            newPositions[playerId] = Math.min(prev.trackLength, currentPos + speed)
          }
        })

        // Check for corners
        const nextCorner = prev.corners[prev.currentCorner]
        const playerAtCorner = Object.entries(newPositions).find(([_, pos]) => pos >= nextCorner)

        if (playerAtCorner && prev.gamePhase === 'racing') {
          clearInterval(raceInterval)
          return {
            ...prev,
            positions: newPositions,
            gamePhase: 'corner',
            currentCorner: prev.currentCorner + 1
          }
        }

        // Check for finish
        const finishedPlayer = Object.entries(newPositions).find(([_, pos]) => pos >= prev.trackLength)
        if (finishedPlayer) {
          clearInterval(raceInterval)
          const [winnerId] = finishedPlayer
          return {
            ...prev,
            positions: newPositions,
            gamePhase: 'finished',
            winner: winnerId
          }
        }

        return { ...prev, positions: newPositions }
      })
    }, 200)

    // Auto-resolve after 30 seconds if no winner
    setTimeout(() => {
      clearInterval(raceInterval)
      setGameState(prev => {
        if (!prev || prev.gamePhase === 'finished') return prev

        const [winnerId] = Object.entries(prev.positions).sort(([, a], [, b]) => b - a)[0]
        return {
          ...prev,
          gamePhase: 'finished',
          winner: winnerId
        }
      })
    }, 30000)
  }, [])

  // Handle corner choice
  const handleCornerChoice = useCallback((choice: 'left' | 'right') => {
    if (!gameState || gameState.gamePhase !== 'corner') return

    setMyCornerChoice(choice)

    // Determine success based on choice and car quality
    const myCar = getPlayerCar(state.profile.playerId)
    const opponentCar = getPlayerCar(targetPlayerId!)

    const mySuccess = calculateCornerSuccess(choice, myCar)
    const opponentChoice = Math.random() > 0.5 ? 'left' : 'right'
    const opponentSuccess = calculateCornerSuccess(opponentChoice, opponentCar)

    // Apply results
    setGameState(prev => {
      if (!prev) return prev

      const newPositions = { ...prev.positions }
      const positionBonus = 5

      if (mySuccess && !opponentSuccess) {
        newPositions[state.profile.playerId] += positionBonus
      } else if (!mySuccess && opponentSuccess) {
        newPositions[targetPlayerId!] += positionBonus
      }

      return {
        ...prev,
        positions: newPositions,
        gamePhase: 'racing'
      }
    })

    // Continue race after corner
    setTimeout(() => {
      startRace()
      setMyCornerChoice(null)
    }, 2000)
  }, [gameState, state.profile.playerId, targetPlayerId, startRace])

  // Get player's car
  const getPlayerCar = useCallback((playerId: string) => {
    // Find highest tier car in player's inventory
    const playerCars = state.inventory.filter(item =>
      item.id.includes('car') ||
      ['rusty_bicycle', 'used_scooter', 'compact_car', 'vintage_motorcycle', 'luxury_sedan', 'sports_car', 'electric_supercar', 'classic_muscle_car', 'hypercar', 'luxury_yacht_car', 'flying_car', 'time_travel_car'].includes(item.id)
    )

    if (playerCars.length === 0) return null

    // Return highest tier car
    const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical']
    return playerCars.sort((a, b) => {
      const aIndex = tierOrder.indexOf(a.id.split('_')[0])
      const bIndex = tierOrder.indexOf(b.id.split('_')[0])
      return bIndex - aIndex
    })[0]
  }, [state.inventory])

  // Calculate corner success
  const calculateCornerSuccess = useCallback((choice: 'left' | 'right', car: any) => {
    if (!car) return Math.random() > 0.7 // 30% success without car

    const baseSuccess = choice === 'left' ? 0.6 : 0.4 // Left is generally safer
    const carBonus = getCarTierMultiplier(car.id.split('_')[0])

    return Math.random() < baseSuccess + carBonus
  }, [])

  // Get car tier multiplier
  const getCarTierMultiplier = useCallback((tier: string) => {
    const multipliers = {
      'common': 0.1,
      'uncommon': 0.2,
      'rare': 0.3,
      'epic': 0.4,
      'legendary': 0.5,
      'mythical': 0.6
    }
    return multipliers[tier as keyof typeof multipliers] || 0
  }, [])

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
  const myPosition = gameState.positions[state.profile.playerId] || 0
  const opponentPosition = gameState.positions[targetPlayerId] || 0
  const myCar = getPlayerCar(state.profile.playerId)
  const opponentCar = getPlayerCar(targetPlayerId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-lg mx-4 bg-neutral-900 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">🏁 Race!</h2>

        {/* Race Track */}
        <div className="mb-6">
          <div className="relative bg-neutral-800 rounded-lg h-8 mb-4">
            {/* Track */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700 rounded-lg"></div>

            {/* Player positions */}
            <div
              className="absolute top-0 w-2 h-8 bg-blue-500 rounded transition-all duration-300"
              style={{ left: `${(myPosition / gameState.trackLength) * 100}%` }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white">
                {state.profile.username}
              </div>
            </div>

            <div
              className="absolute top-0 w-2 h-8 bg-red-500 rounded transition-all duration-300"
              style={{ left: `${(opponentPosition / gameState.trackLength) * 100}%` }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white">
                {opponentPlayer?.username}
              </div>
            </div>

            {/* Finish line */}
            <div className="absolute right-0 top-0 w-1 h-8 bg-yellow-400"></div>
          </div>

          {/* Position display */}
          <div className="flex justify-between text-sm text-neutral-300">
            <span>{Math.round(myPosition)}%</span>
            <span>{Math.round(opponentPosition)}%</span>
          </div>
        </div>

        {/* Car display */}
        <div className="mb-4 flex justify-between">
          <div className="text-center">
            <div className="text-2xl mb-1">{myCar ? '🚗' : '🚶'}</div>
            <div className="text-xs text-neutral-400">Your Vehicle</div>
            <div className="text-xs text-white">{myCar?.id || 'No car'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">{opponentCar ? '🚗' : '🚶'}</div>
            <div className="text-xs text-neutral-400">Opponent Vehicle</div>
            <div className="text-xs text-white">{opponentCar?.id || 'No car'}</div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <div className="text-lg text-white mb-2">
            {gameState.gamePhase === 'starting' && '🏁 Get ready to race!'}
            {gameState.gamePhase === 'racing' && '🏃‍♂️ Racing...'}
            {gameState.gamePhase === 'corner' && '⚡ Sharp corner ahead! Choose your path:'}
            {gameState.gamePhase === 'finished' && `🏆 Race finished! ${players.find(p => p.id === gameState.winner)?.username} wins!`}
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

        {/* Corner Choice */}
        {gameState.gamePhase === 'corner' && (
          <div className="space-y-4 mb-4">
            <div className="text-center text-white">Choose your racing line:</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCornerChoice('left')}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                ⬅️ Left (Safe)
              </button>
              <button
                onClick={() => handleCornerChoice('right')}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
              >
                ➡️ Right (Risky)
              </button>
            </div>
          </div>
        )}

        {/* Wager Setup */}
        {gameState.gamePhase === 'starting' && (
          <div className="border-t border-neutral-700 pt-3 mb-4">
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
        )}

        <button
          onClick={() => onComplete({ cancelled: true })}
          className="w-full mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded"
        >
          {gameState.gamePhase === 'finished' ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}
