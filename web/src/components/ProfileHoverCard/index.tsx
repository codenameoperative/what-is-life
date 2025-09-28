import { useGame } from '../../contexts/GameContext'

export default function ProfileHoverCard() {
  const { state } = useGame()

  // Calculate total WTC
  const totalWTC = state.wallet + state.bank + (state.stash || 0)

  // Find most used activity
  const mostUsedActivity = Object.entries(state.profile.activityUsage)
    .sort(([,a], [,b]) => b - a)[0]

  const mostUsed = mostUsedActivity ? mostUsedActivity[0] : 'None yet'

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 glass-strong border border-border rounded-xl p-4 shadow-2xl z-50 min-w-[300px] animate-scaleIn">
      <div className="text-center">
        {/* Profile Header */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-white font-bold">
            {state.profile.username.charAt(0).toUpperCase()}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-primary mb-2">{state.profile.username}</h3>

        <div className="space-y-2 text-sm">
          <div className="glass rounded-lg p-3">
            <div className="text-muted">Total WTC</div>
            <div className="text-primary font-bold text-lg">💰 {totalWTC.toLocaleString()}</div>
          </div>

          <div className="glass rounded-lg p-3">
            <div className="text-muted">Most Used</div>
            <div className="text-primary font-medium">🎯 {mostUsed}</div>
          </div>
        </div>

        <div className="text-xs text-muted text-center mt-3 italic">
          "{state.profile.description}"
        </div>
      </div>

      <style>{`
        .animate-scaleIn { animation: scaleIn 180ms ease-out; transform-origin: top center; }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(-6px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
