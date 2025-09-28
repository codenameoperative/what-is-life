import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useNotify } from '../../contexts/NotifyContext'

type Props = {
  open: boolean
  onClose: () => void
}

type Tab = 'deposit' | 'withdraw'

export default function DepositWithdrawModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [tab, setTab] = useState<Tab>('deposit')
  const [amountStr, setAmountStr] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setTab('deposit')
      setAmountStr('')
      setConfirmOpen(false)
    }
  }, [open])

  const maxAmount = useMemo(() => (tab === 'deposit' ? state.wallet : state.bank), [tab, state.wallet, state.bank])

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
    if (tab === 'deposit') {
      actions.deposit(amt)
      notify({ type: 'success', title: 'Deposit complete', message: `Deposited ${amt} WTC to bank.` })
    } else {
      actions.withdraw(amt)
      notify({ type: 'success', title: 'Withdraw complete', message: `Withdrew ${amt} WTC to wallet.` })
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
      <div className="relative mt-16 w-[min(92vw,480px)] h-[min(90vh,600px)] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl animate-scaleIn">
        {/* Tabs with sliding highlighter */}
        <div className="p-6 border-b border-neutral-800">
          <div className="relative flex items-center bg-neutral-900/50 rounded-xl p-1">
            {/* Sliding background */}
            <div
              className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transition-all duration-300 ease-in-out shadow-lg"
              style={{
                left: tab === 'deposit' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 4px)'
              }}
            />

            {(['deposit','withdraw'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative z-10 flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                  tab === t
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
                aria-pressed={tab === t}
              >
                {t === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-6">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Amount display */}
          <div className="text-center">
            <div className="text-sm text-neutral-400 mb-2">
              Available to {tab}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {maxAmount.toLocaleString()} WTC
            </div>
            <div className="text-sm text-neutral-500">
              {tab === 'deposit' ? 'From Wallet' : 'From Bank'}
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-300">
              Amount to {tab}
            </label>
            <input
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder={`Enter amount or type "all"`}
              className="w-full bg-neutral-900/70 border border-neutral-800 rounded-xl px-4 py-4 text-lg outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <div className="text-xs text-neutral-400">
              Quick options: all, max, everything
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
              tab === 'deposit'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/25'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25'
            }`}
          >
            {tab === 'deposit' ? 'Deposit' : 'Withdraw'} {parseAmount() > 0 ? `${parseAmount().toLocaleString()} WTC` : ''}
          </button>
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
