import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'
import { gameRNG } from '../../utils/rng'

interface TicTacToeProps {
  difficulty?: 'easy' | 'medium' | 'hard'

  open: boolean
  onClose: () => void
  opponentName?: string
}

type CellValue = 'X' | 'O' | null
type GameState = 'playing' | 'won' | 'lost' | 'draw'

export default function TicTacToe({ open, onClose, opponentName = 'CPU' }: TicTacToeProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [gameState, setGameState] = useState<GameState>('playing')
  const [bet, setBet] = useState(100)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  // Reset game when modal opens
  useEffect(() => {
    if (open) {
      setBoard(Array(9).fill(null))
      setCurrentPlayer('X')
      setGameState('playing')
      setIsPlayerTurn(true)
      setBet(100)
    }
  }, [open])

  // Check for winner
  const checkWinner = (squares: CellValue[]): CellValue => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  // Make CPU move
  const makeCPUMove = () => {
    if (gameState !== 'playing' || currentPlayer !== 'O') return

    // Simple AI: try to win, block player, or random
    const squares = [...board]

    // Check if CPU can win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O'
        if (checkWinner(squares) === 'O') {
          setTimeout(() => {
            setBoard(squares)
            setCurrentPlayer('X')
            setIsPlayerTurn(true)
            checkGameEnd(squares)
          }, 500)
          return
        }
        squares[i] = null
      }
    }

    // Check if CPU needs to block player
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'X'
        if (checkWinner(squares) === 'X') {
          setTimeout(() => {
            setBoard(squares.map((sq, idx) => idx === i ? 'O' : sq))
            setCurrentPlayer('X')
            setIsPlayerTurn(true)
            checkGameEnd(squares.map((sq, idx) => idx === i ? 'O' : sq))
          }, 500)
          return
        }
        squares[i] = null
      }
    }

    // Random move
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null) as number[]

    if (emptySquares.length > 0) {
      const randomIndex = emptySquares[Math.floor(gameRNG.nextFloat() * emptySquares.length)]
      setTimeout(() => {
        const newBoard = [...squares]
        newBoard[randomIndex] = 'O'
        setBoard(newBoard)
        setCurrentPlayer('X')
        setIsPlayerTurn(true)
        checkGameEnd(newBoard)
      }, 500)
    }
  }

  // Check if game has ended
  const checkGameEnd = (currentBoard: CellValue[]) => {
    const winner = checkWinner(currentBoard)
    const isDraw = !winner && currentBoard.every(square => square !== null)

    if (winner) {
      setGameState(winner === 'X' ? 'won' : 'lost')
    } else if (isDraw) {
      setGameState('draw')
    }
  }

  // Handle player move
  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || currentPlayer !== 'X' || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setCurrentPlayer('O')
    setIsPlayerTurn(false)
    checkGameEnd(newBoard)
  }

  // CPU move effect
  useEffect(() => {
    if (currentPlayer === 'O' && gameState === 'playing' && !isPlayerTurn) {
      makeCPUMove()
    }
  }, [currentPlayer, gameState, isPlayerTurn])

  // Game end effect
  useEffect(() => {
    if (gameState !== 'playing') {
      const won = gameState === 'won'
      const betAmount = bet

      if (won) {
        actions.addToWallet(betAmount)
        notify({
          type: 'success',
          title: 'Tic-Tac-Toe Victory!',
          message: `You won ${betAmount} WTC against ${opponentName}!`
        })
      } else if (gameState === 'lost') {
        actions.addToWallet(-betAmount)
        notify({
          type: 'error',
          title: 'Tic-Tac-Toe Defeat',
          message: `You lost ${betAmount} WTC to ${opponentName}!`
        })
      } else {
        notify({
          type: 'info',
          title: 'Tic-Tac-Toe Draw',
          message: `It's a draw! No WTC exchanged.`
        })
      }

      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [gameState])

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setGameState('playing')
    setIsPlayerTurn(true)
  }

  const getBetOptions = () => [50, 100, 200, 500, 1000]

  if (state.wallet < bet) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl mb-4">Tic-Tac-Toe</h2>
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Insufficient funds! You need at least {bet} WTC to play.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Back to Game
        </button>
      </div>
    )
  }

  return (
    <div className="text-center p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Tic-Tac-Toe vs {opponentName}</h2>

      {/* Betting Section */}
      <div className="mb-4 p-3 bg-neutral-800 rounded-lg">
        <div className="text-sm text-neutral-300 mb-2">Bet Amount: {bet} WTC</div>
        <div className="flex gap-2 justify-center">
          {getBetOptions().map(amount => (
            <button
              key={amount}
              onClick={() => setBet(amount)}
              disabled={amount > state.wallet}
              className={`px-2 py-1 text-xs rounded ${
                bet === amount
                  ? 'bg-purple-600 text-white'
                  : amount > state.wallet
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={cell !== null || gameState !== 'playing' || !isPlayerTurn}
              className={`w-16 h-16 border-2 border-neutral-600 rounded-lg text-2xl font-bold transition-all ${
                cell === null && gameState === 'playing' && isPlayerTurn
                  ? 'hover:bg-neutral-700 hover:border-neutral-500'
                  : cell === 'X'
                    ? 'bg-blue-900/30 text-blue-400'
                    : cell === 'O'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-neutral-800'
              } ${cell !== null || gameState !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-4">
        {gameState === 'playing' ? (
          <p className="text-sm text-neutral-300">
            {isPlayerTurn ? 'Your turn (X)' : `${opponentName}'s turn (O)`}
          </p>
        ) : gameState === 'won' ? (
          <p className="text-green-400 font-semibold">🎉 You Win!</p>
        ) : gameState === 'lost' ? (
          <p className="text-red-400 font-semibold">😔 You Lose!</p>
        ) : (
          <p className="text-yellow-400 font-semibold">🤝 It's a Draw!</p>
        )}
      </div>

      {/* Action Buttons */}
      {gameState === 'playing' ? (
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Forfeit Game
        </button>
      ) : (
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  )
}
