import { useState, useEffect, useMemo, useRef, useCallback, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import Header from './Header'
import UtilityBar from './UtilityBar'
import LANPartyModal from './LANPartyModal'
import UsernameModal from './UsernameModal/index'
import Footer from './Footer'
import CrimeActivity from '../activities/Crime'
import WorkActivity from '../activities/Work'
import SearchActivity from '../activities/Search'
import HuntActivity from '../activities/Hunt'
import FishActivity from '../activities/Fish'
import DigActivity from '../activities/Dig'
import PostActivity from '../activities/Post'
import StreamActivity from '../activities/Stream'
import ExploreActivity from '../activities/Explore'
import GardenActivity from '../activities/Garden'
import Toaster from './Toaster/index'
import { ErrorLogViewer } from './ErrorLogViewer'
import MiniGamesSelector from './MiniGamesSelector'
import MiniGames, { type MiniGameType } from './MiniGames'
import { useGame } from '../contexts/GameContext'
import { useMultiplayer } from '../contexts/MultiplayerContext'
import { useNotify } from '../contexts/NotifyContext'

const ACTIVITY_LIST = ['Search', 'Crime', 'Work', 'Hunt', 'Fish', 'Dig', 'Post', 'Stream', 'Explore', 'Garden'] as const
type ActivityName = typeof ACTIVITY_LIST[number]

const ACTIVITY_SHORTCUTS: Record<string, ActivityName> = {
  Digit1: 'Search',
  Digit2: 'Crime',
  Digit3: 'Work',
  Digit4: 'Hunt',
  Digit5: 'Fish',
  Digit6: 'Dig',
  Digit7: 'Post',
  Digit8: 'Stream',
  Digit9: 'Explore',
  Digit0: 'Garden'
}

const ACTIVITY_SHORTCUT_LABELS: Record<ActivityName, string> = {
  Search: '1',
  Crime: '2',
  Work: '3',
  Hunt: '4',
  Fish: '5',
  Dig: '6',
  Post: '7',
  Stream: '8',
  Explore: '9',
  Garden: '0'
}

const ACTIVITY_THEME: Record<ActivityName | 'default', { primary: string; secondary: string; pointer: string }> = {
  default: {
    primary: 'rgba(107, 77, 255, 0.55)',
    secondary: 'rgba(59, 255, 215, 0.35)',
    pointer: 'rgba(255, 255, 255, 0.18)'
  },
  Search: {
    primary: 'rgba(59, 255, 215, 0.58)',
    secondary: 'rgba(59, 255, 215, 0.28)',
    pointer: 'rgba(59, 255, 215, 0.2)'
  },
  Crime: {
    primary: 'rgba(255, 113, 198, 0.55)',
    secondary: 'rgba(255, 113, 198, 0.26)',
    pointer: 'rgba(255, 113, 198, 0.18)'
  },
  Work: {
    primary: 'rgba(107, 77, 255, 0.5)',
    secondary: 'rgba(107, 77, 255, 0.26)',
    pointer: 'rgba(107, 77, 255, 0.18)'
  },
  Hunt: {
    primary: 'rgba(255, 148, 77, 0.52)',
    secondary: 'rgba(255, 148, 77, 0.24)',
    pointer: 'rgba(255, 169, 113, 0.18)'
  },
  Fish: {
    primary: 'rgba(59, 206, 255, 0.5)',
    secondary: 'rgba(59, 206, 255, 0.24)',
    pointer: 'rgba(59, 206, 255, 0.18)'
  },
  Dig: {
    primary: 'rgba(255, 200, 113, 0.5)',
    secondary: 'rgba(255, 200, 113, 0.24)',
    pointer: 'rgba(255, 214, 150, 0.18)'
  },
  Post: {
    primary: 'rgba(255, 113, 198, 0.5)',
    secondary: 'rgba(255, 113, 198, 0.22)',
    pointer: 'rgba(255, 140, 210, 0.18)'
  },
  Stream: {
    primary: 'rgba(93, 126, 255, 0.5)',
    secondary: 'rgba(93, 126, 255, 0.24)',
    pointer: 'rgba(128, 154, 255, 0.18)'
  },
  Explore: {
    primary: 'rgba(255, 255, 113, 0.5)',
    secondary: 'rgba(255, 255, 113, 0.22)',
    pointer: 'rgba(255, 255, 152, 0.18)'
  },
  Garden: {
    primary: 'rgba(132, 255, 170, 0.5)',
    secondary: 'rgba(132, 255, 170, 0.24)',
    pointer: 'rgba(150, 255, 190, 0.18)'
  }
}

const ACTIVITY_ICONS: Record<ActivityName, string> = {
  Search: '🔍',
  Crime: '🦹',
  Work: '💼',
  Hunt: '🏹',
  Fish: '🐟',
  Dig: '⛏️',
  Post: '💬',
  Stream: '⏺️',
  Explore: '🗺️',
  Garden: '🌾'
}

const ACTIVITY_DESCRIPTIONS: Record<ActivityName, string> = {
  Search: 'Discover hidden treasures',
  Crime: 'Take risks for big rewards',
  Work: 'Earn steady income',
  Hunt: 'Track wild game',
  Fish: 'Cast your line',
  Dig: 'Unearth buried secrets',
  Post: 'Share your thoughts',
  Stream: 'Broadcast to the world',
  Explore: 'Adventure awaits',
  Garden: 'Cultivate your crops'
}

const isActivityName = (value: string | null): value is ActivityName =>
  !!value && (ACTIVITY_LIST as readonly string[]).includes(value)

type TimePhase = 'dawn' | 'day' | 'dusk' | 'night'

interface TimeSegment {
  phase: TimePhase
  start: number
  end: number
  next: TimePhase
}

interface TimeBlendState {
  current: TimePhase
  next: TimePhase
  ratio: number
}

const TIME_SEGMENTS: TimeSegment[] = [
  { phase: 'dawn', start: 5, end: 11, next: 'day' },
  { phase: 'day', start: 11, end: 17, next: 'dusk' },
  { phase: 'dusk', start: 17, end: 21, next: 'night' },
  { phase: 'night', start: 21, end: 29, next: 'dawn' }
]

const TIME_COLORS: Record<TimePhase, string> = {
  dawn: 'rgba(255, 189, 105, 0.32)',
  day: 'rgba(107, 77, 255, 0.2)',
  dusk: 'rgba(255, 113, 198, 0.28)',
  night: 'rgba(38, 59, 136, 0.38)'
}

const SECRET_CODE = 'codenameoperative'

const computeTimeBlend = (): TimeBlendState => {
  const now = new Date()
  const hourFloat = now.getHours() + now.getMinutes() / 60
  const segment = TIME_SEGMENTS.find(seg => hourFloat >= seg.start && hourFloat < seg.end) || TIME_SEGMENTS[TIME_SEGMENTS.length - 1]
  const segmentLength = segment.end - segment.start
  const progress = Math.min(1, Math.max(0, (hourFloat - segment.start) / segmentLength))
  return {
    current: segment.phase,
    next: segment.next,
    ratio: progress
  }
}

const blendColors = (colorA: string, colorB: string, ratio: number) => {
  const parse = (color: string) => {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/)
    if (!match) return [0, 0, 0, 0] as const
    return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] as const
  }

  const [r1, g1, b1, a1] = parse(colorA)
  const [r2, g2, b2, a2] = parse(colorB)
  const mix = (v1: number, v2: number) => Math.round(v1 + (v2 - v1) * ratio)
  const mixAlpha = (v1: number, v2: number) => Number((v1 + (v2 - v1) * ratio).toFixed(2))
  return `rgba(${mix(r1, r2)}, ${mix(g1, g2)}, ${mix(b1, b2)}, ${mixAlpha(a1, a2)})`
}

function Game({ onBackToMenu, onLoad }: { onBackToMenu?: () => void; onLoad?: () => void }) {
  const { state, actions } = useGame()
  const { session, isHost, isConnected, players, serverIp, setServerIp, createSession, joinSession, leaveSession, toggleSessionLock } = useMultiplayer()
  const { notify } = useNotify()
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showMultiplayerMenu, setShowMultiplayerMenu] = useState(false)
  const [sessionIdInput, setSessionIdInput] = useState('')
  const [showMiniGamesSelector, setShowMiniGamesSelector] = useState(false)
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameType | null>(null)
  const [searchCooldown, setSearchCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [crimeCooldown, setCrimeCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [workCooldown, setWorkCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [huntCooldown, setHuntCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [fishCooldown, setFishCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [digCooldown, setDigCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [postCooldown, setPostCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [streamCooldown, setStreamCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [exploreCooldown, setExploreCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })
  const [gardenCooldown, setGardenCooldown] = useState<{isOnCooldown: boolean, timeLeft: number}>({
    isOnCooldown: false,
    timeLeft: 0
  })

  const handleOpenMiniGames = () => {
    setShowMiniGamesSelector(true)
  }

  const handleSelectMiniGame = (gameType: MiniGameType) => {
    setShowMiniGamesSelector(false)
    setActiveMiniGame(gameType)
  }

  const handleMiniGameComplete = (result: any) => {
    setActiveMiniGame(null)
    // Handle mini game results here
    console.log('Mini game completed:', result)
  }

  const handleCloseMiniGame = () => {
    setActiveMiniGame(null)
  }
  const pointerRef = useRef<HTMLDivElement | null>(null)
  const pointerFrame = useRef<number | null>(null)
  const pointerTimeout = useRef<number | null>(null)
  const pointerTarget = useRef({ x: 0, y: 0 })
  const secretBufferRef = useRef('')

  const [timeBlend, setTimeBlend] = useState<TimeBlendState>(() => computeTimeBlend())
  const [retroModeActive, setRetroModeActive] = useState(() => {
    if (typeof window === 'undefined') return state.secrets.retroUnlocked
    const stored = localStorage.getItem('retro-mode-enabled')
    if (stored !== null) return stored === 'true'
    return state.secrets.retroUnlocked
  })
  const [cheatCooldownMs, setCheatCooldownMs] = useState(0)

  const performanceMode = state.settings.performanceMode

  const currentActivity = useMemo<ActivityName | null>(() => (
    isActivityName(activeActivity) ? activeActivity : null
  ), [activeActivity])

  const activeTheme = useMemo(() => (
    currentActivity ? ACTIVITY_THEME[currentActivity] : ACTIVITY_THEME.default
  ), [currentActivity])

  const ambientStyle = useMemo(() => ({
    '--ambient-primary': activeTheme.primary,
    '--ambient-secondary': activeTheme.secondary,
    '--ambient-pointer': activeTheme.pointer
  }) as CSSProperties, [activeTheme])

  const flairStyle = useMemo(() => ({
    background: `radial-gradient(circle, ${activeTheme.primary} 0%, transparent 70%)`
  }) as CSSProperties, [activeTheme])

  const timeMixStyle = useMemo(() => {
    const currentColor = TIME_COLORS[timeBlend.current]
    const nextColor = TIME_COLORS[timeBlend.next]
    const blended = blendColors(currentColor, nextColor, timeBlend.ratio)
    return {
      background: `radial-gradient(circle at 25% 20%, ${currentColor} 0%, transparent 65%), radial-gradient(circle at 75% 80%, ${nextColor} 0%, transparent 60%), linear-gradient(135deg, ${blended} 0%, transparent 70%)`
    } as CSSProperties
  }, [timeBlend])

  const shellClasses = useMemo(() => [
    'game-shell',
    retroModeActive ? 'retro-mode' : '',
    performanceMode ? 'performance-mode' : ''
  ].filter(Boolean).join(' '), [retroModeActive, performanceMode])

  const cooldownMap = useMemo(() => ({
    Search: searchCooldown,
    Crime: crimeCooldown,
    Work: workCooldown,
    Hunt: huntCooldown,
    Fish: fishCooldown,
    Dig: digCooldown,
    Post: postCooldown,
    Stream: streamCooldown,
    Explore: exploreCooldown,
    Garden: gardenCooldown
  }), [searchCooldown, crimeCooldown, workCooldown, huntCooldown, fishCooldown, digCooldown, postCooldown, streamCooldown, exploreCooldown, gardenCooldown])

  const startActivity = useCallback((activity: ActivityName) => {
    const cooldown = cooldownMap[activity]
    if (!cooldown || cooldown.isOnCooldown) return
    setActiveActivity(activity)
  }, [cooldownMap])

  const animatePointer = useCallback(() => {
    if (!pointerRef.current) return
    const { x, y } = pointerTarget.current
    pointerRef.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
    pointerRef.current.classList.add('active')
    pointerFrame.current = requestAnimationFrame(animatePointer)
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (performanceMode) return
    pointerTarget.current = { x: event.clientX, y: event.clientY }
    if (pointerFrame.current === null) {
      pointerFrame.current = requestAnimationFrame(animatePointer)
    }
    if (pointerTimeout.current) {
      window.clearTimeout(pointerTimeout.current)
    }
    pointerTimeout.current = window.setTimeout(() => {
      if (pointerRef.current) {
        pointerRef.current.classList.remove('active')
      }
      if (pointerFrame.current) {
        cancelAnimationFrame(pointerFrame.current)
        pointerFrame.current = null
      }
    }, 1600)
  }, [animatePointer, performanceMode])

  useEffect(() => {
    const blendState = computeTimeBlend()
    setTimeBlend(blendState)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeBlend(computeTimeBlend())
    }, 60 * 1000)

    return () => window.clearInterval(interval)
  }, [])

  const toggleRetroMode = useCallback((enable: boolean, silent = false) => {
    setRetroModeActive(enable)
    try {
      localStorage.setItem('retro-mode-enabled', enable ? 'true' : 'false')
    } catch (error) {
      console.warn('Failed to persist retro mode state', error)
    }
    if (!silent) {
      notify({
        type: enable ? 'success' : 'info',
        title: enable ? 'Retro Mode Enabled' : 'Retro Mode Disabled',
        message: enable
          ? 'Welcome to the codenameoperative timeline.'
          : 'Returning to the modern shell.'
      })
    }
    if (enable && !state.secrets.retroUnlocked) {
      actions.markSecretFound('retro')
    }
  }, [actions, notify, state.secrets.retroUnlocked])

  const handleCheat = useCallback(() => {
    if (!state.secrets.cheatUnlocked) {
      actions.markSecretFound('cheat')
    } else {
      notify({
        type: 'info',
        title: 'Cheat Already Used',
        message: 'The forbidden protocol has already been activated.'
      })
    }
  }, [actions, state.secrets.cheatUnlocked, notify])

  // Cooldown management
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setCrimeCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setWorkCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setHuntCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setFishCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setDigCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setPostCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setStreamCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setExploreCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
      setGardenCooldown(prev => {
        if (prev.isOnCooldown && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        } else if (prev.isOnCooldown && prev.timeLeft <= 0) {
          return { isOnCooldown: false, timeLeft: 0 }
        }
        return prev // Return unchanged state if no conditions are met
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Keyboard navigation and secrets
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close active mini game first (highest priority)
        if (activeMiniGame) {
          setActiveMiniGame(null)
          secretBufferRef.current = ''
          return
        }

        // Close mini games selector
        if (showMiniGamesSelector) {
          setShowMiniGamesSelector(false)
          secretBufferRef.current = ''
          return
        }

        // Close active activity first (highest priority)
        if (activeActivity) {
          setActiveActivity(null)
          secretBufferRef.current = ''
          return
        }

        // Close multiplayer menu
        if (showMultiplayerMenu) {
          setShowMultiplayerMenu(false)
          secretBufferRef.current = ''
          return
        }

        // Close username modal
        if (showUsernameModal) {
          setShowUsernameModal(false)
          secretBufferRef.current = ''
          return
        }

        secretBufferRef.current = ''
        return
      }

      const shortcutActivity = ACTIVITY_SHORTCUTS[event.code]
      if (shortcutActivity) {
        startActivity(shortcutActivity)
        return
      }

      const keyLower = event.key.toLowerCase()
      if (keyLower.length === 1) {
        secretBufferRef.current = (secretBufferRef.current + keyLower).slice(-SECRET_CODE.length)
        if (secretBufferRef.current === SECRET_CODE) {
          toggleRetroMode(!retroModeActive)
          secretBufferRef.current = ''
        }
      } else {
        secretBufferRef.current = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeActivity, showMultiplayerMenu, showUsernameModal, retroModeActive, startActivity, toggleRetroMode])


  const renderActivity = () => {
    switch (activeActivity) {
      case 'Crime':
        return <CrimeActivity
          isOnCooldown={crimeCooldown.isOnCooldown}
          cooldownTime={crimeCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setCrimeCooldown({ isOnCooldown, timeLeft })
          }
          onCrimeComplete={() => setActiveActivity(null)}
        />
      case 'Work':
        return <WorkActivity
          isOnCooldown={workCooldown.isOnCooldown}
          cooldownTime={workCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setWorkCooldown({ isOnCooldown, timeLeft })
          }
          onWorkComplete={() => setActiveActivity(null)}
        />
      case 'Search':
        return <SearchActivity
          isOnCooldown={searchCooldown.isOnCooldown}
          cooldownTime={searchCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setSearchCooldown({ isOnCooldown, timeLeft })
          }
          onSearchComplete={() => setActiveActivity(null)}
        />
      case 'Hunt':
        return <HuntActivity
          isOnCooldown={huntCooldown.isOnCooldown}
          cooldownTime={huntCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setHuntCooldown({ isOnCooldown, timeLeft })
          }
          onHuntComplete={() => setActiveActivity(null)}
        />
      case 'Fish':
        return <FishActivity
          isOnCooldown={fishCooldown.isOnCooldown}
          cooldownTime={fishCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setFishCooldown({ isOnCooldown, timeLeft })
          }
          onFishComplete={() => setActiveActivity(null)}
        />
      case 'Dig':
        return <DigActivity
          isOnCooldown={digCooldown.isOnCooldown}
          cooldownTime={digCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setDigCooldown({ isOnCooldown, timeLeft })
          }
          onDigComplete={() => setActiveActivity(null)}
        />
      case 'Post':
        return <PostActivity
          isOnCooldown={postCooldown.isOnCooldown}
          cooldownTime={postCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setPostCooldown({ isOnCooldown, timeLeft })
          }
          onPostComplete={() => setActiveActivity(null)}
        />
      case 'Stream':
        return <StreamActivity
          isOnCooldown={streamCooldown.isOnCooldown}
          cooldownTime={streamCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setStreamCooldown({ isOnCooldown, timeLeft })
          }
          onStreamComplete={() => setActiveActivity(null)}
        />
      case 'Explore':
        return <ExploreActivity
          isOnCooldown={exploreCooldown.isOnCooldown}
          cooldownTime={exploreCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setExploreCooldown({ isOnCooldown, timeLeft })
          }
          onExploreComplete={() => setActiveActivity(null)}
        />
      case 'Garden':
        return <GardenActivity
          isOnCooldown={gardenCooldown.isOnCooldown}
          cooldownTime={gardenCooldown.timeLeft}
          onCooldownChange={(isOnCooldown, timeLeft) =>
            setGardenCooldown({ isOnCooldown, timeLeft })
          }
          onGardenComplete={() => setActiveActivity(null)}
        />
      default:
        return null
    }
  }

  // Check if user needs to set username (first time or no username set)
  useEffect(() => {
    const isFirstTime = !state.profile.username || state.profile.username === 'Player'
    setShowUsernameModal(isFirstTime)
  }, [state.profile.username])


  return (
    <div
      ref={shellRef}
      className={shellClasses}
      style={{ ...ambientStyle, ...timeMixStyle }}
      onPointerMove={handlePointerMove}
      role="main"
      aria-label="Game interface"
    >
      <div className="ambient-field" aria-hidden="true">
        <div ref={pointerRef} className="ambient-pointer" />
        <div className="ambient-overlay" />
        <div className="ambient-grain" />
        <div className={`activity-backdrop ${currentActivity ? 'active' : ''}`} />
        <div className={`activity-flair ${currentActivity ? 'active' : ''}`} style={flairStyle} />
      </div>

      <div className="shell-content">
        {/* Header */}
        <Header retroModeActive={retroModeActive} onCheat={handleCheat} onLoad={onLoad} />

      {/* Multiplayer Menu */}
      {showMultiplayerMenu && (
        <div className="fixed inset-0 z-40 flex items-center justify-center modal-overlay backdrop-blur-sm" onClick={() => setShowMultiplayerMenu(false)}>
          <div className="modal-content glass-strong border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">LAN Multiplayer</h2>

              {session ? (
                <div className="space-y-4">
                  <div className="glass p-4 rounded-lg backdrop-blur-sm border border-border/30">
                    <div className="text-sm text-secondary">
                      <p>Session ID: <code className="bg-tertiary px-2 py-1 rounded text-xs">{session.id}</code></p>
                      <p>Host IP: <code className="bg-tertiary px-2 py-1 rounded text-xs">{session.hostIp}</code></p>
                      <p>Players: {players.length}/{session.maxPlayers}</p>
                    </div>
                  </div>

                  {isHost && (
                    <button
                      onClick={toggleSessionLock}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg ${
                        session.isLocked
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {session.isLocked ? 'Unlock Session' : 'Lock Session'}
                    </button>
                  )}

                  <button
                    onClick={leaveSession}
                    className="w-full px-4 py-2 text-sm bg-secondary hover:bg-tertiary text-white font-medium rounded-lg"
                  >
                    Leave Session
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Server IP Address</label>
                    <input
                      type="text"
                      placeholder="192.168.1.100"
                      value={serverIp}
                      onChange={(e) => setServerIp(e.target.value)}
                      className="input-modern mb-3"
                    />
                    <p className="text-xs text-muted">Enter the host's IP address to join their session</p>
                  </div>

                  <button
                    onClick={createSession}
                    className="btn-primary w-full"
                  >
                    Create Session
                  </button>

                  <div className="border-t border-border pt-4">
                    <input
                      type="text"
                      placeholder="Enter Session ID"
                      value={sessionIdInput}
                      onChange={(e) => setSessionIdInput(e.target.value)}
                      className="input-modern mb-3"
                    />
                    <button
                      onClick={() => joinSession(sessionIdInput, state.profile.playerId, serverIp)}
                      disabled={!sessionIdInput.trim() || !serverIp.trim()}
                      className="btn-secondary w-full"
                    >
                      Join Session
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowMultiplayerMenu(false)}
                className="btn-secondary w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className={`flex-1 ${showUsernameModal ? 'hidden' : ''}`}>
        <section className="container-max pt-12 pb-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="title mb-4">What is Life?</h1>
            <p className="subtitle text-lg">Life is Full of Adventures...</p>
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="text-sm text-secondary">Use number keys</span>
                <kbd className="px-2 py-1 bg-tertiary rounded text-xs font-mono">1-0</kbd>
                <span className="text-sm text-secondary">for activities</span>
              </div>
            </div>
          </div>
        </section>

        {/* Utility Bar */}
        <section className="container-max mb-8">
          <UtilityBar onOpenMiniGames={handleOpenMiniGames} />
        </section>

        {/* Main Actions */}
        <section className="container-max pb-12">
          {activeActivity ? (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setActiveActivity(null)}
                className="mb-6 px-4 py-2 text-sm btn-secondary"
              >
                ← Back to Activities (ESC)
              </button>
              {renderActivity()}
            </div>
          ) : (
            <div>
              <div className="activity-grid">
                <button
                  onClick={() => setShowMultiplayerMenu(true)}
                  className="activity-card"
                >
                  <div className="activity-icon">🌐</div>
                  <div className="activity-title">Multiplayer</div>
                  <div className="activity-description">
                    {session ? 'Manage LAN session' : 'Start LAN multiplayer'}
                  </div>
                </button>
                {ACTIVITY_LIST.map((activity) => {
                  const isOnCooldown = cooldownMap[activity]?.isOnCooldown || false
                  const timeLeft = cooldownMap[activity]?.timeLeft || 0

                  return (
                    <button
                      key={activity}
                      onClick={() => !isOnCooldown && startActivity(activity)}
                      className={`activity-card ${isOnCooldown ? 'opacity-50' : ''}`}
                      disabled={isOnCooldown}
                    >
                      {isOnCooldown && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-pulse rounded-lg"></div>
                      )}
                      <div className="relative z-10">
                        <div className="activity-icon">
                          {ACTIVITY_ICONS[activity]}
                        </div>
                        <div className="activity-title">{activity}</div>
                        <div className="activity-description">
                          {isOnCooldown ? (
                            <div className="flex items-center gap-1">
                              <div className="loading-spinner w-3 h-3"></div>
                              <span>{timeLeft}s</span>
                            </div>
                          ) : (
                            ACTIVITY_DESCRIPTIONS[activity]
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
      {/* Notifications */}
      <Toaster />

      {/* Mini Games Selector */}
      {showMiniGamesSelector && (
        <MiniGamesSelector
          onSelectGame={handleSelectMiniGame}
          onClose={() => setShowMiniGamesSelector(false)}
        />
      )}

      {/* Active Mini Game */}
      {activeMiniGame && (
        <MiniGames
          gameType={activeMiniGame}
          onComplete={handleMiniGameComplete}
        />
      )}

      {/* Username Modal */}
      <UsernameModal
        open={showUsernameModal}
        onComplete={() => setShowUsernameModal(false)}
      />

      <ErrorLogViewer />
      </div>
    </div>
  )
}
