import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'

type Props = {
  open: boolean
  onClose: () => void
}

export default function AdminCommandsModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const [itemId, setItemId] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [moneyAmount, setMoneyAmount] = useState(1000)
  const [levelAmount, setLevelAmount] = useState(25)

  // Admin player IDs
  const adminPlayerIds = ['ADMIN123', 'DEV456', 'TEST789']

  const isAdmin = adminPlayerIds.includes(state.profile.playerId)

  if (!open) return null

  const handleGrantItem = () => {
    if (itemId.trim()) {
      actions.adminGrantItem(itemId.trim(), itemQuantity)
      setItemId('')
      setItemQuantity(1)
    }
  }

  const handleGrantMoney = () => {
    actions.adminGrantMoney(moneyAmount)
  }

  const handleSetLevel = () => {
    actions.adminSetLevel(levelAmount)
  }

  const handleUnlockAchievements = () => {
    actions.adminUnlockAllAchievements()
  }

  const handleResetCooldowns = () => {
    actions.adminResetCooldowns()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="relative mt-16 w-[min(92vw,700px)] modal-content glass-strong border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-border/30 flex items-center justify-between backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-primary">Admin Commands</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary hover:bg-tertiary/50 rounded-lg transition-all duration-200 hover:scale-105"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!isAdmin ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
              <p className="text-muted">You don't have admin privileges to access these commands.</p>
            </div>
          ) : (
            <>
              {/* Grant Items */}
              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-3">Grant Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Item ID (e.g., hunting_rifle)"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className="input-modern"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input-modern"
                    min="1"
                  />
                  <button
                    onClick={handleGrantItem}
                    disabled={!itemId.trim()}
                    className="btn-primary"
                  >
                    Grant Item
                  </button>
                </div>
              </div>

              {/* Grant Money */}
              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-3">Grant Money</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Amount (WTC)"
                    value={moneyAmount}
                    onChange={(e) => setMoneyAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="input-modern"
                    min="0"
                  />
                  <button
                    onClick={handleGrantMoney}
                    className="btn-primary"
                  >
                    Grant Money
                  </button>
                </div>
              </div>

              {/* Set Level */}
              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-3">Set Player Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Level (1-50)"
                    value={levelAmount}
                    onChange={(e) => setLevelAmount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    className="input-modern"
                    min="1"
                    max="50"
                  />
                  <button
                    onClick={handleSetLevel}
                    className="btn-primary"
                  >
                    Set Level
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-medium text-primary mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleUnlockAchievements}
                    className="btn-secondary"
                  >
                    Unlock All Achievements
                  </button>
                  <button
                    onClick={handleResetCooldowns}
                    className="btn-secondary"
                  >
                    Reset All Cooldowns
                  </button>
                </div>
              </div>

              {/* Admin Info */}
              <div className="glass p-4 rounded-lg border border-yellow-500/30">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">Admin Information</h3>
                <div className="text-sm text-muted space-y-1">
                  <p>Player ID: <code className="bg-tertiary px-2 py-1 rounded">{state.profile.playerId}</code></p>
                  <p>Current Level: <span className="text-primary font-medium">{state.profile.level}</span></p>
                  <p>Wallet: <span className="text-green-400 font-medium">{state.wallet.toLocaleString()} WTC</span></p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 flex items-center justify-end backdrop-blur-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg btn-secondary"
          >
            Close
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
