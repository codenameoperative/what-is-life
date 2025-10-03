import { useState } from 'react'
import { MiniGameType } from './MiniGames'

interface MiniGamesSelectorProps {
  onSelectGame: (gameType: MiniGameType) => void
  onClose: () => void
}

const MINI_GAMES = [
  {
    id: 'fight' as MiniGameType,
    name: 'Fight',
    description: 'Test your combat skills against another player',
    icon: '⚔️'
  },
  {
    id: 'race' as MiniGameType,
    name: 'Race',
    description: 'Speed against other players in a thrilling race',
    icon: '🏎️'
  },
  {
    id: 'russian_roulette' as MiniGameType,
    name: 'Russian Roulette',
    description: 'High stakes gambling with dangerous consequences',
    icon: '🔫'
  },
  {
    id: 'steal' as MiniGameType,
    name: 'Steal',
    description: 'Attempt to steal items from other players',
    icon: '🦹'
  },
  {
    id: 'gamble' as MiniGameType,
    name: 'Gamble',
    description: 'Bet your WTC in card games and games of chance',
    icon: '🎰'
  }
]

export default function MiniGamesSelector({ onSelectGame, onClose }: MiniGamesSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
      <div className="modal-content glass-strong border border-border/50 shadow-2xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Mini Games</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Close mini games selector"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {MINI_GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className="p-4 glass border border-border/30 rounded-lg hover:glass-strong hover:border-accent/50 transition-all duration-200 hover:scale-105 text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                    {game.name}
                  </h3>
                </div>
                <p className="text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">
                  {game.description}
                </p>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-secondary hover:bg-tertiary text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
