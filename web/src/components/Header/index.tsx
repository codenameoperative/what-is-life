import { useGame } from '../../contexts/GameContext'
import { useState, useEffect } from 'react'
import ProfileButton from '../ProfileButton'
import SettingsModal from '../SettingsModal'
import { invoke } from '@tauri-apps/api/tauri'

export default function Header({ retroModeActive, onCheat, onLoad }: { retroModeActive?: boolean; onCheat?: () => void; onLoad?: () => void }) {
  const { state, actions } = useGame()
  const [showStashOnly, setShowStashOnly] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const toggleCounters = () => setShowStashOnly(v => !v)

  // ESC key handler for settings modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSettings) {
        setShowSettings(false)
      }
    }

    if (showSettings) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showSettings])

  const handleSave = async () => {
    try {
      await actions.saveGameData()
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handleLoad = () => {
    if (onLoad) {
      onLoad()
    } else {
      // Fallback to old behavior
      actions.loadGameData()
    }
  }

  return (
    <>
      <header className="glass-strong sticky top-0 z-30 border-b border-border/50 backdrop-blur-xl">
        <div className="container-max h-16 flex items-center justify-between px-4">
          {/* Left: Profile + WTC Counters */}
          <div className="flex items-center gap-4">
            <ProfileButton />

            {/* Currency Display */}
            <div className="hidden sm:flex items-center gap-3">
              {showStashOnly ? (
                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                  <span className="text-xs text-muted">Stash:</span>
                  <span className="text-sm font-semibold text-accent">{state.stash ?? 0}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                    <span className="text-xs text-muted">WTC:</span>
                    <span className="text-sm font-semibold text-primary">{state.wallet}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                    <span className="text-xs text-muted">Bank:</span>
                    <span className="text-sm font-semibold text-success">{state.bank}</span>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Currency Toggle */}
            <button
              type="button"
              onClick={toggleCounters}
              className="sm:hidden px-2 py-1 text-xs glass rounded text-muted hover:text-primary transition-colors"
              title="Toggle counters"
            >
              {showStashOnly ? '💰' : '🏦'}
            </button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="btn-secondary flex items-center gap-2 px-3 py-2"
              aria-label="Open settings"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.36 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline text-sm">Settings</span>
            </button>

            {retroModeActive && onCheat && (
              <button
                type="button"
                onClick={onCheat}
                className="btn-secondary flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700"
                aria-label="Cheat"
                title="Forbidden Cheat Protocol"
              >
                <span className="text-sm">👾</span>
                <span className="hidden sm:inline text-sm">Cheat</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="btn-secondary flex items-center gap-2 px-3 py-2"
              aria-label="Save game"
              title="Save Game"
            >
              <span className="hidden sm:inline text-sm text-success">Save</span>
              <span className="sm:hidden">💾</span>
            </button>

            <button
              type="button"
              onClick={handleLoad}
              className="btn-secondary flex items-center gap-2 px-3 py-2"
              aria-label="Load game"
              title="Load Game"
            >
              <span className="hidden sm:inline text-sm text-primary">Load</span>
              <span className="sm:hidden">📂</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
