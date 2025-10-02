import { useState } from 'react'
import { useLeaderboards } from '../utils/leaderboards'

interface TournamentModalProps {
  isOpen: boolean
  onClose: () => void
  playerId: string
  playerName: string
}

export function TournamentModal({ isOpen, onClose, playerId, playerName }: TournamentModalProps) {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const { getActiveTournaments, getTournamentRankings } = useLeaderboards()

  if (!isOpen) return null

  const tournaments = getActiveTournaments()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 modal-content glass-strong border border-border/50 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Mini-Game Tournaments</h2>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Tournaments */}
          <div>
            <h3 className="font-semibold mb-4">Active Tournaments</h3>
            <div className="space-y-3">
              {tournaments.map(tournament => (
                <div
                  key={tournament.id}
                  onClick={() => setSelectedTournament(tournament.id)}
                  className="glass border border-border/30 rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors"
                >
                  <h4 className="font-semibold text-primary">{tournament.name}</h4>
                  <p className="text-sm text-muted">{tournament.gameType.replace('_', ' ').toUpperCase()}</p>
                  <div className="mt-2 text-xs">
                    <div>🥇 {tournament.rewards.first.wtc} WTC</div>
                    <div>🥈 {tournament.rewards.second.wtc} WTC</div>
                    <div>🥉 {tournament.rewards.third.wtc} WTC</div>
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Ends: {new Date(tournament.endTime).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tournament Rankings */}
          <div>
            <h3 className="font-semibold mb-4">Current Rankings</h3>
            {selectedTournament ? (
              <div className="space-y-2">
                {getTournamentRankings(selectedTournament).map((entry, index) => (
                  <div
                    key={entry.playerId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.playerId === playerId ? 'bg-accent/20 border border-accent/50' : 'glass border border-border/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-600' : 'text-muted'
                      }`}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{entry.playerName}</div>
                        <div className="text-xs text-muted">{entry.score} points</div>
                      </div>
                    </div>
                    {entry.playerId === playerId && (
                      <span className="text-xs text-accent">You</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-8">
                Select a tournament to view rankings
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
