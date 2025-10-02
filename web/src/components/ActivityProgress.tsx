import { useState, useEffect, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import { useNotify } from '../contexts/NotifyContext'

interface ActivityProgressProps {
  activityName: string
  onComplete: () => void
  onFail?: () => void
}

export default function ActivityProgress({ activityName, onComplete, onFail }: ActivityProgressProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [miniGame, setMiniGame] = useState<string | null>(null)

  // Activity-specific mini-games
  const miniGames = useMemo(() => ({
    Search: ['memory', 'pattern', 'quick_click'],
    Crime: ['lockpick', 'stealth', 'timing'],
    Work: ['puzzle', 'logic', 'focus'],
    Hunt: ['aim', 'tracking', 'patience'],
    Fish: ['timing', 'precision', 'waiting'],
    Dig: ['strength', 'luck', 'perseverance'],
    Post: ['creativity', 'engagement', 'timing'],
    Stream: ['performance', 'interaction', 'endurance'],
    Explore: ['navigation', 'decision', 'survival'],
    Garden: ['care', 'timing', 'growth']
  }), [])

  const startMiniGame = () => {
    const availableGames = miniGames[activityName as keyof typeof miniGames] || ['quick_click']
    const selectedGame = availableGames[Math.floor(Math.random() * availableGames.length)]
    setMiniGame(selectedGame)
    setIsActive(true)
    setProgress(0)
  }

  const completeMiniGame = (success: boolean) => {
    if (success) {
      setProgress(100)
      notify({
        type: 'success',
        title: 'Mini-game Complete!',
        message: 'Great job! Activity bonus earned.'
      })
      setTimeout(() => {
        onComplete()
        setIsActive(false)
        setMiniGame(null)
      }, 1000)
    } else {
      setProgress(0)
      if (onFail) {
        onFail()
      } else {
        notify({
          type: 'error',
          title: 'Mini-game Failed',
          message: 'Activity completed without bonus.'
        })
        setTimeout(() => {
          onComplete()
          setIsActive(false)
          setMiniGame(null)
        }, 1000)
      }
    }
  }

  if (!isActive) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-4">Activity Progress Challenge</h3>
        <p className="text-sm text-muted mb-6">
          Complete a mini-game for bonus rewards and experience!
        </p>
        <button
          onClick={startMiniGame}
          className="btn-primary"
        >
          Start Challenge
        </button>
      </div>
    )
  }

  // Render different mini-games
  const renderMiniGame = () => {
    switch (miniGame) {
      case 'quick_click':
        return <QuickClickGame onComplete={completeMiniGame} />
      case 'memory':
        return <MemoryGame onComplete={completeMiniGame} />
      case 'timing':
        return <TimingGame onComplete={completeMiniGame} />
      case 'pattern':
        return <PatternGame onComplete={completeMiniGame} />
      default:
        return <QuickClickGame onComplete={completeMiniGame} />
    }
  }

  return (
    <div className="text-center p-4">
      <div className="mb-4">
        <div className="text-sm text-muted mb-2">Progress Challenge</div>
        <div className="w-full bg-tertiary rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {renderMiniGame()}
    </div>
  )
}

// Quick Click Mini-Game
function QuickClickGame({ onComplete }: { onComplete: (success: boolean) => void }) {
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (isActive && timeLeft === 0) {
      onComplete(clicks >= 15)
    }
  }, [isActive, timeLeft, clicks, onComplete])

  const handleClick = () => {
    if (!isActive) setIsActive(true)
    setClicks(prev => prev + 1)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Quick Click Challenge</h4>
      <p className="text-sm text-muted">
        Click as fast as you can! Get 15+ clicks in 5 seconds.
      </p>

      <div className="text-2xl font-bold text-primary">{timeLeft}s</div>
      <div className="text-lg">Clicks: {clicks}</div>

      <button
        onClick={handleClick}
        className="btn-primary px-8 py-4 text-lg"
        disabled={timeLeft === 0}
      >
        CLICK!
      </button>
    </div>
  )
}

// Memory Game
function MemoryGame({ onComplete }: { onComplete: (success: boolean) => void }) {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [showingSequence, setShowingSequence] = useState(true)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    generateSequence()
  }, [level])

  const generateSequence = () => {
    const newSeq = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 4))
    setSequence(newSeq)
    setPlayerSequence([])
    setShowingSequence(true)

    setTimeout(() => setShowingSequence(false), 2000)
  }

  const handleButtonClick = (index: number) => {
    if (showingSequence) return

    const newPlayerSeq = [...playerSequence, index]
    setPlayerSequence(newPlayerSeq)

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      onComplete(false)
      return
    }

    if (newPlayerSeq.length === sequence.length) {
      if (level >= 3) {
        onComplete(true)
      } else {
        setLevel(prev => prev + 1)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Memory Challenge</h4>
      <p className="text-sm text-muted">Remember the sequence! Level {level}/3</p>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`aspect-square rounded-lg border-2 transition-all ${
              showingSequence && sequence.includes(index)
                ? 'bg-primary border-primary'
                : 'bg-neutral-700 border-neutral-600 hover:bg-neutral-600'
            }`}
            disabled={showingSequence}
          />
        ))}
      </div>

      {showingSequence && (
        <p className="text-sm text-primary">Watch the sequence...</p>
      )}
    </div>
  )
}

// Timing Game
function TimingGame({ onComplete }: { onComplete: (success: boolean) => void }) {
  const [targetTime, setTargetTime] = useState(2000 + Math.random() * 3000)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  const startGame = () => {
    setIsActive(true)
    setStartTime(Date.now())
  }

  const stopGame = () => {
    if (!startTime) return

    const reactionTime = Date.now() - startTime
    const difference = Math.abs(reactionTime - targetTime)
    setResult(difference)

    if (difference <= 500) {
      onComplete(true)
    } else {
      onComplete(false)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Timing Challenge</h4>
      <p className="text-sm text-muted">
        Click "Stop" exactly when the progress bar reaches the target!
      </p>

      {!isActive ? (
        <button onClick={startGame} className="btn-primary">
          Start Timer
        </button>
      ) : (
        <div className="space-y-4">
          <div className="w-full bg-tertiary rounded-full h-4 relative">
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(100, ((Date.now() - (startTime || 0)) / targetTime) * 100)}%`
              }}
            />
            <div
              className="absolute top-0 w-1 h-4 bg-accent rounded-full"
              style={{ left: '70%' }}
            />
          </div>

          <button onClick={stopGame} className="btn-primary">
            Stop!
          </button>

          {result && (
            <div className="text-sm">
              Your timing: {result}ms difference
              {result <= 500 ? ' - Perfect!' : ' - Too slow/fast!'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Pattern Game
function PatternGame({ onComplete }: { onComplete: (success: boolean) => void }) {
  const [pattern, setPattern] = useState<number[]>([])
  const [playerPattern, setPlayerPattern] = useState<number[]>([])
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    const newPattern = [Math.floor(Math.random() * 9)]
    setPattern(newPattern)
    showPattern(newPattern)
  }, [])

  const showPattern = (pat: number[]) => {
    setShowing(true)
    pat.forEach((num, index) => {
      setTimeout(() => {
        // Highlight the button (this would need visual feedback)
        setTimeout(() => setShowing(false), 300)
      }, index * 600)
    })
  }

  const handleButtonClick = (index: number) => {
    if (showing) return

    const newPlayerPattern = [...playerPattern, index]
    setPlayerPattern(newPlayerPattern)

    if (newPlayerPattern[newPlayerPattern.length - 1] !== pattern[newPlayerPattern.length - 1]) {
      onComplete(false)
      return
    }

    if (newPlayerPattern.length === pattern.length) {
      onComplete(true)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Pattern Challenge</h4>
      <p className="text-sm text-muted">Repeat the pattern shown</p>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`aspect-square rounded border-2 transition-all ${
              showing && pattern.includes(index)
                ? 'bg-primary border-primary'
                : 'bg-neutral-700 border-neutral-600 hover:bg-neutral-600'
            }`}
            disabled={showing}
          />
        ))}
      </div>

      <div className="text-sm text-muted">
        Progress: {playerPattern.length}/{pattern.length}
      </div>
    </div>
  )
}
