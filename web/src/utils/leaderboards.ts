import { useState, useEffect } from 'react'

export interface LeaderboardEntry {
  playerId: string
  playerName: string
  score: number
  gameType: string
  timestamp: number
  rank?: number
}

export interface Tournament {
  id: string
  name: string
  gameType: string
  startTime: number
  endTime: number
  rewards: {
    first: { wtc: number, item?: string }
    second: { wtc: number, item?: string }
    third: { wtc: number, item?: string }
  }
  isActive: boolean
  participants: string[]
}

class LeaderboardManager {
  private leaderboards: Map<string, LeaderboardEntry[]> = new Map()
  private tournaments: Tournament[] = []

  constructor() {
    this.loadFromStorage()
    this.initializeTournaments()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('leaderboards')
      if (stored) {
        const data = JSON.parse(stored)
        this.leaderboards = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load leaderboards:', error)
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.leaderboards)
      localStorage.setItem('leaderboards', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save leaderboards:', error)
    }
  }

  private initializeTournaments() {
    const now = Date.now()
    const tomorrow = now + 24 * 60 * 60 * 1000

    this.tournaments = [
      {
        id: 'daily_click_champ',
        name: 'Daily Click Champion',
        gameType: 'quick_click',
        startTime: now,
        endTime: tomorrow,
        rewards: {
          first: { wtc: 500, item: 'champion_belt' },
          second: { wtc: 300 },
          third: { wtc: 150 }
        },
        isActive: true,
        participants: []
      },
      {
        id: 'memory_master',
        name: 'Memory Master',
        gameType: 'memory',
        startTime: now,
        endTime: tomorrow,
        rewards: {
          first: { wtc: 400, item: 'brain_booster' },
          second: { wtc: 250 },
          third: { wtc: 125 }
        },
        isActive: true,
        participants: []
      },
      {
        id: 'timing_guru',
        name: 'Timing Guru',
        gameType: 'timing',
        startTime: now,
        endTime: tomorrow,
        rewards: {
          first: { wtc: 450, item: 'perfect_timing_watch' },
          second: { wtc: 275 },
          third: { wtc: 135 }
        },
        isActive: true,
        participants: []
      }
    ]
  }

  submitScore(playerId: string, playerName: string, gameType: string, score: number) {
    const entry: LeaderboardEntry = {
      playerId,
      playerName,
      score,
      gameType,
      timestamp: Date.now()
    }

    const leaderboard = this.leaderboards.get(gameType) || []
    leaderboard.push(entry)

    // Sort by score (higher is better for most games)
    leaderboard.sort((a, b) => b.score - a.score)

    // Keep only top 100 entries
    if (leaderboard.length > 100) {
      leaderboard.splice(100)
    }

    // Add ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    this.leaderboards.set(gameType, leaderboard)
    this.saveToStorage()

    // Check tournament participation
    const activeTournament = this.tournaments.find(t =>
      t.gameType === gameType && t.isActive && Date.now() >= t.startTime && Date.now() <= t.endTime
    )

    if (activeTournament && !activeTournament.participants.includes(playerId)) {
      activeTournament.participants.push(playerId)
    }

    return entry.rank
  }

  getLeaderboard(gameType: string, limit: number = 10): LeaderboardEntry[] {
    const leaderboard = this.leaderboards.get(gameType) || []
    return leaderboard.slice(0, limit)
  }

  getPlayerRank(playerId: string, gameType: string): LeaderboardEntry | null {
    const leaderboard = this.leaderboards.get(gameType) || []
    return leaderboard.find(entry => entry.playerId === playerId) || null
  }

  getActiveTournaments(): Tournament[] {
    return this.tournaments.filter(t => t.isActive && Date.now() <= t.endTime)
  }

  getTournamentRankings(tournamentId: string): LeaderboardEntry[] {
    const tournament = this.tournaments.find(t => t.id === tournamentId)
    if (!tournament) return []

    const leaderboard = this.leaderboards.get(tournament.gameType) || []
    return leaderboard
      .filter(entry =>
        entry.timestamp >= tournament.startTime &&
        entry.timestamp <= tournament.endTime &&
        tournament.participants.includes(entry.playerId)
      )
      .slice(0, 10)
  }

  awardTournamentRewards(tournamentId: string) {
    const tournament = this.tournaments.find(t => t.id === tournamentId)
    if (!tournament || Date.now() < tournament.endTime) return null

    const rankings = this.getTournamentRankings(tournamentId)
    const rewards: Record<string, any> = {}

    rankings.slice(0, 3).forEach((entry, index) => {
      const reward = index === 0 ? tournament.rewards.first :
                    index === 1 ? tournament.rewards.second :
                    tournament.rewards.third

      rewards[entry.playerId] = {
        rank: index + 1,
        rewards: reward
      }
    })

    return rewards
  }
}

// Singleton instance
const leaderboardManager = new LeaderboardManager()

// React hook for using leaderboards
export function useLeaderboards() {
  const [leaderboards, setLeaderboards] = useState<Map<string, LeaderboardEntry[]>>(new Map())

  useEffect(() => {
    // Load initial data
    const gameTypes = ['quick_click', 'memory', 'timing', 'pattern']
    const initialLeaderboards = new Map()

    gameTypes.forEach(type => {
      initialLeaderboards.set(type, leaderboardManager.getLeaderboard(type))
    })

    setLeaderboards(initialLeaderboards)
  }, [])

  const submitScore = (playerId: string, playerName: string, gameType: string, score: number) => {
    const rank = leaderboardManager.submitScore(playerId, playerName, gameType, score)

    // Update local state
    setLeaderboards(prev => {
      const newMap = new Map(prev)
      newMap.set(gameType, leaderboardManager.getLeaderboard(gameType))
      return newMap
    })

    return rank
  }

  const getPlayerRank = (playerId: string, gameType: string) => {
    return leaderboardManager.getPlayerRank(playerId, gameType)
  }

  return {
    leaderboards,
    submitScore,
    getPlayerRank,
    getActiveTournaments: () => leaderboardManager.getActiveTournaments(),
    getTournamentRankings: (tournamentId: string) => leaderboardManager.getTournamentRankings(tournamentId),
    awardTournamentRewards: (tournamentId: string) => leaderboardManager.awardTournamentRewards(tournamentId)
  }
}

export { leaderboardManager }
