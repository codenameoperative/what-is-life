import { useEffect, useState } from 'react'
import { useGame } from '../../contexts/GameContext'

type Props = {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const [tempSettings, setTempSettings] = useState(state.settings)

  // Update temp settings when modal opens
  useEffect(() => {
    if (open) {
      setTempSettings(state.settings)
    }
  }, [open, state.settings])

  const handleSave = () => {
    actions.updateSettings(tempSettings)
    onClose()
  }

  const handleCancel = () => {
    setTempSettings(state.settings)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay backdrop-blur-sm" onClick={handleCancel}>
      {/* Container */}
      <div className="relative mt-16 w-[min(92vw,600px)] modal-content glass-strong border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-border/30 flex items-center justify-between backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-primary">Settings</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-muted hover:text-primary hover:bg-tertiary/50 rounded-lg transition-all duration-200 hover:scale-105"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Gameplay Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Gameplay</h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between glass p-4 rounded-lg hover:glass-strong transition-all duration-200">
                <div>
                  <div className="text-sm font-medium text-primary">Confirm Selling</div>
                  <div className="text-xs text-muted">Show confirmation dialog when selling items</div>
                </div>
                <button
                  onClick={() => setTempSettings(prev => ({ ...prev, confirmSell: !prev.confirmSell }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    tempSettings.confirmSell ? 'bg-success' : 'bg-tertiary'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      tempSettings.confirmSell ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between glass p-4 rounded-lg hover:glass-strong transition-all duration-200">
                <div>
                  <div className="text-sm font-medium text-primary">Performance Mode</div>
                  <div className="text-xs text-muted">Disable ambient animations for low-end devices</div>
                </div>
                <button
                  onClick={() => setTempSettings(prev => ({ ...prev, performanceMode: !prev.performanceMode }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    tempSettings.performanceMode ? 'bg-orange-500' : 'bg-tertiary'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      tempSettings.performanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>


          {/* Animation Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Animation</h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between glass p-4 rounded-lg hover:glass-strong transition-all duration-200">
                <div>
                  <div className="text-sm font-medium text-primary">Animation Speed</div>
                  <div className="text-xs text-muted">Control how fast animations play</div>
                </div>
                <select
                  value={tempSettings.animationSpeed}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, animationSpeed: e.target.value as 'slow' | 'normal' | 'fast' }))}
                  className="px-3 py-1 input-modern"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 flex items-center justify-end gap-3 backdrop-blur-xl">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-lg btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg btn-primary"
          >
            Save Settings
          </button>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 160ms ease-out; }
        .animate-scaleIn { animation: scaleIn 180ms ease-out; transform-origin: top center; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(-6px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
