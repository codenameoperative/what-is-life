import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'

type Props = {
  open: boolean
  onClose: () => void
}

type Tab = 'stash' | 'unstash'

export default function StashModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [tab, setTab] = useState<Tab>('stash')
  const [amountStr, setAmountStr] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setTab('stash')
      setAmountStr('')
      setConfirmOpen(false)
    }
  }, [open])

  const maxAmount = useMemo(() => (tab === 'stash' ? state.wallet : (state.stash ?? 0)), [tab, state.wallet, state.stash])

  const parseAmount = (): number => {
    const raw = amountStr.trim().toLowerCase()
    if (!raw) return 0
    if (['all', 'max', 'everything'].includes(raw)) return maxAmount
    const n = parseInt(raw, 10)
    if (!Number.isFinite(n) || n <= 0) return 0
    return Math.min(n, maxAmount)
  }

  const handleSubmit = () => {
    const amt = parseAmount()
    if (amt <= 0) {
      notify({ type: 'error', title: 'Invalid amount', message: 'Enter a valid amount or use all/max/everything.' })
      return
    }
    setConfirmOpen(true)
  }

  const confirm = () => {
    const amt = parseAmount()
    if (amt <= 0) return
    if (tab === 'stash') {
      actions.stashMoney(amt)
      notify({ type: 'success', title: 'Stash complete', message: `Stashed ${amt} WTC.` })
    } else {
      actions.unstashMoney(amt)
      notify({ type: 'success', title: 'Unstash complete', message: `Unstashed ${amt} WTC to wallet.` })
    }
    setConfirmOpen(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      {/* Container */}
      <div className="relative mt-16 w-[min(92vw,520px)] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl animate-scaleIn">
        {/* Tabs */}
        <div className="p-3 border-b border-neutral-800 flex items-center gap-2">
          {(['stash','unstash'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                tab === t
                  ? 'bg-neutral-800/70 border-neutral-700 text-white'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700'
              }`}
              aria-pressed={tab === t}
            >
              {t === 'stash' ? 'Stash' : 'Unstash'}
            </button>
          ))}
          <div className="ml-auto" />
          <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800">Close</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="text-sm text-neutral-300">
            Available: <span className="text-white font-medium">{maxAmount} WTC</span>
          </div>
          <input
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder={tab === 'stash' ? 'Amount to stash (e.g., 100 or all)' : 'Amount to unstash (e.g., 50 or max)'}
            className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <button
            onClick={handleSubmit}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'stash'
                ? 'bg-purple-700 hover:bg-purple-800'
                : 'bg-indigo-700 hover:bg-indigo-800'
            }`}
          >
            {tab === 'stash' ? 'Stash' : 'Unstash'}
          </button>
          <div className="text-xs text-neutral-400">Tip: You can type all, max, or everything.</div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 animate-fadeIn" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-[min(92vw,420px)] rounded-xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-xl animate-scaleIn">
            <div className="text-sm text-neutral-200 mb-4">Are you sure you want to {tab} {parseAmount()} WTC?</div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setConfirmOpen(false)} className="px-3 py-1.5 text-sm rounded-lg bg-red-700 hover:bg-red-800">Cancel</button>
              <button onClick={confirm} className="px-3 py-1.5 text-sm rounded-lg bg-green-700 hover:bg-green-800">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn { animation: fadeIn 160ms ease-out; }
        .animate-scaleIn { animation: scaleIn 180ms ease-out; transform-origin: top center; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(-6px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
