import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  playerId: string
  username: string
  level: number
  totalEarnings: number
  achievements: number
  rank: number
}

interface LeaderboardsProps {
  type?: 'level' | 'wealth' | 'achievements'
  limit?: number
}

export default function Leaderboards({ type = 'level', limit = 10 }: LeaderboardsProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true)

      // Mock data - in a real app, this would fetch from database
      const mockData: LeaderboardEntry[] = [
        { playerId: 'A1B2C', username: 'DragonSlayer', level: 45, totalEarnings: 150000, achievements: 23, rank: 1 },
        { playerId: 'X9Y8Z', username: 'ShadowNinja', level: 42, totalEarnings: 125000, achievements: 19, rank: 2 },
        { playerId: 'M7N6O', username: 'MysticMage', level: 40, totalEarnings: 98000, achievements: 21, rank: 3 },
        { playerId: 'P5Q4R', username: 'FireWarrior', level: 38, totalEarnings: 87500, achievements: 17, rank: 4 },
        { playerId: 'S3T2U', username: 'IceQueen', level: 35, totalEarnings: 72000, achievements: 15, rank: 5 },
        { playerId: 'V1W0X', username: 'StormBreaker', level: 33, totalEarnings: 68000, achievements: 14, rank: 6 },
        { playerId: 'B9C8D', username: 'EarthShaker', level: 30, totalEarnings: 55000, achievements: 12, rank: 7 },
        { playerId: 'E7F6G', username: 'WindWalker', level: 28, totalEarnings: 49000, achievements: 11, rank: 8 },
        { playerId: 'H5I4J', username: 'LightBringer', level: 25, totalEarnings: 42000, achievements: 10, rank: 9 },
        { playerId: 'K3L2M', username: 'DarkRider', level: 22, totalEarnings: 38000, achievements: 9, rank: 10 },
      ]

      // Sort based on type
      const sorted = [...mockData].sort((a, b) => {
        switch (type) {
          case 'wealth':
            return b.totalEarnings - a.totalEarnings
          case 'achievements':
            return b.achievements - a.achievements
          default: // level
            return b.level - a.level
        }
      })

      // Update ranks
      const ranked = sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))

      setLeaderboard(ranked)

      setLoading(false)
    }

    loadLeaderboard()
  }, [type])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getValueLabel = () => {
    switch (type) {
      case 'wealth': return 'Total Earnings'
      case 'achievements': return 'Achievements'
      default: return 'Level'
    }
  }

  const getValue = (entry: LeaderboardEntry) => {
    switch (type) {
      case 'wealth': return entry.totalEarnings.toLocaleString()
      case 'achievements': return entry.achievements
      default: return entry.level
    }
  }

  if (loading) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">🏆 Leaderboards</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🏆 {getValueLabel()} Leaderboard</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => window.location.hash = '#leaderboard-level'}
            className={`px-3 py-1 rounded transition-colors ${
              type === 'level' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Level
          </button>
          <button
            onClick={() => window.location.hash = '#leaderboard-wealth'}
            className={`px-3 py-1 rounded transition-colors ${
              type === 'wealth' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Wealth
          </button>
          <button
            onClick={() => window.location.hash = '#leaderboard-achievements'}
            className={`px-3 py-1 rounded transition-colors ${
              type === 'achievements' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            Achievements
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, limit).map((entry) => (
          <div
            key={entry.playerId}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              'bg-neutral-800/30 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <div className="font-medium text-white">{entry.username}</div>
                <div className="text-xs text-neutral-400">ID: {entry.playerId}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">
                {type === 'wealth' ? `${getValue(entry)} WTC` :
                 type === 'achievements' ? `${getValue(entry)} 🏆` :
                 `Level ${getValue(entry)}`}
              </div>
              <div className="text-xs text-neutral-400">
                {entry.achievements} achievements
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
