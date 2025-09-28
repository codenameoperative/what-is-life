import { useEffect, useMemo, useState, useRef } from 'react'
import { useGame } from '../../contexts/GameContext'
import { items, type Item } from '../../utils/items'
import { useNotify } from '../../contexts/NotifyContext'

type Props = {
  open: boolean
  onClose: () => void
}

type PaySource = 'wallet' | 'bank'

export default function ShopModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [qtyStr, setQtyStr] = useState('1')
  const [paySource, setPaySource] = useState<PaySource>('wallet')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const categories = ['weapons','tools','clothing','collectables'] as const
  const [activeCats, setActiveCats] = useState<Record<typeof categories[number], boolean>>({
    weapons: true,
    tools: true,
    clothing: true,
    collectables: true,
  })
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // tick every second for countdown
  useEffect(() => {
    if (!open) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [open])

  // refresh rotating items if empty or expired when opening
  useEffect(() => {
    if (!open) return
    if (!state.shop.rotatingIds.length || Date.now() >= state.shop.nextRefreshAt) {
      actions.refreshShop()
    }
    // also ensure essentials exist; if not, it's fine, we will filter them out below
  }, [open])

  // auto refresh on countdown end
  useEffect(() => {
    if (!open) return
    if (now >= state.shop.nextRefreshAt) {
      actions.refreshShop()
    }
  }, [now, open, state.shop.nextRefreshAt])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) {
      setSelectedId(null)
      setQtyStr('1')
      setPaySource('wallet')
      setConfirmOpen(false)
      setShowCategoryDropdown(false)
    }
  }, [open])

  const essentialsList: Item[] = useMemo(() => {
    const list = state.shop.essentials
      .map(id => items[id])
      .filter((x): x is Item => Boolean(x))
    return list.filter(it => activeCats[it.category as keyof typeof activeCats])
  }, [state.shop.essentials, activeCats])

  const rotatingList: Item[] = useMemo(() => {
    const list = state.shop.rotatingIds
      .map(id => items[id])
      .filter((x): x is Item => Boolean(x))
    return list.filter(it => activeCats[it.category as keyof typeof activeCats])
  }, [state.shop.rotatingIds, activeCats])

  const countdownMs = Math.max(0, state.shop.nextRefreshAt - now)
  const countdown = formatCountdown(countdownMs)

  const selected = selectedId ? items[selectedId] : null
  const qty = Math.max(1, Math.floor(Number.parseInt(qtyStr || '1', 10) || 1))
  const total = selected ? selected.value * qty : 0
  const balance = paySource === 'wallet' ? state.wallet : state.bank

  const handleBuy = () => {
    if (!selected) return
    if (balance < total) {
      notify({ type: 'error', title: 'Insufficient funds', message: `You need ${total} WTC, but only have ${balance} in ${paySource}.` })
      return
    }
    setConfirmOpen(true)
  }

  const confirm = () => {
    if (!selected) return
    const ok = actions.buyItem(selected.id, qty, paySource)
    if (ok) {
      notify({ type: 'success', title: 'Purchase complete', message: `Bought ${qty} × ${selected.name} for ${total} WTC from ${paySource}.` })
      setConfirmOpen(false)
      setSelectedId(null)
      setQtyStr('1')
      setPaySource('wallet')
      onClose()
    } else {
      notify({ type: 'error', title: 'Purchase failed', message: 'Unable to complete purchase.' })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      {/* Container */}
      <div className="relative mt-16 w-[min(92vw,980px)] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <div className="text-sm text-neutral-300">Shop</div>

          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="px-3 py-2 text-sm bg-neutral-900/70 border border-neutral-800 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
            >
              <span>Sort</span>
              <svg
                className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full mt-1 left-0 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-10 py-1">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center px-3 py-2 hover:bg-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeCats[cat]}
                      onChange={() => setActiveCats(prev => ({ ...prev, [cat]: !prev[cat] }))}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto text-xs text-neutral-400">Refresh in: <span className="text-neutral-200 font-medium">{countdown}</span></div>
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left: Essentials */}
          <div className="p-4 lg:border-r border-neutral-900/60">
            <div className="text-sm font-semibold mb-2">Essentials</div>
            <ul className="space-y-2">
              {essentialsList.map(it => (
                <li key={it.id}>
                  <button
                    onClick={() => setSelectedId(it.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-900/60 border border-neutral-900/60"
                  >
                    <div className="text-sm text-white">{it.name}</div>
                    <div className="text-xs text-neutral-400">{it.tier} • {it.category} • {it.value} WTC</div>
                  </button>
                </li>
              ))}
              {essentialsList.length === 0 && (
                <li className="text-xs text-neutral-500">No essentials configured.</li>
              )}
            </ul>
          </div>

          {/* Middle: Rotating */}
          <div className="p-4 lg:border-r border-neutral-900/60">
            <div className="text-sm font-semibold mb-2">Rotating</div>
            <ul className="space-y-2">
              {rotatingList.map(it => (
                <li key={it.id}>
                  <button
                    onClick={() => setSelectedId(it.id)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-900/60 border border-neutral-900/60"
                  >
                    <div className="text-sm text-white">{it.name}</div>
                    <div className="text-xs text-neutral-400">{it.tier} • {it.category} • {it.value} WTC</div>
                  </button>
                </li>
              ))}
              {rotatingList.length === 0 && (
                <li className="text-xs text-neutral-500">Refreshing items...</li>
              )}
            </ul>
          </div>

          {/* Right: Purchase panel */}
          <div className="p-4">
            {selected ? (
              <div className="space-y-3">
                <div className="text-base font-semibold text-white">{selected.name}</div>
                <div className="text-xs text-neutral-400">{selected.tier} • {selected.category}</div>
                <div className="text-sm text-neutral-300">Price: {selected.value} WTC each</div>
                <div className="text-sm text-neutral-200">{selected.description}</div>

                <div className="pt-2 space-y-2">
                  <input
                    value={qtyStr}
                    onChange={(e) => setQtyStr(e.target.value)}
                    placeholder="Quantity"
                    inputMode="numeric"
                    className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-600"
                  />

                  <div className="flex items-center gap-2 text-sm">
                    <button
                      className={`px-3 py-1.5 rounded-lg border ${paySource === 'wallet' ? 'bg-neutral-800/70 border-neutral-700' : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900'}`}
                      onClick={() => setPaySource('wallet')}
                    >Wallet ({state.wallet} WTC)</button>
                    <button
                      className={`px-3 py-1.5 rounded-lg border ${paySource === 'bank' ? 'bg-neutral-800/70 border-neutral-700' : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900'}`}
                      onClick={() => setPaySource('bank')}
                    >Bank ({state.bank} WTC)</button>
                  </div>

                  <div className="text-sm text-neutral-300">Total: <span className="text-white font-medium">{total} WTC</span></div>

                  <button
                    onClick={handleBuy}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-emerald-700 hover:bg-emerald-800"
                  >Buy</button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">Select an item to purchase</div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 animate-fadeIn" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-[min(92vw,420px)] rounded-xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-xl animate-scaleIn">
            <div className="text-sm text-neutral-200 mb-4">Confirm purchase of {qty} × {selected?.name} for {total} WTC from {paySource}?</div>
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

function formatCountdown(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  const mm = String(m % 60).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  const hh = Math.floor(m / 60)
  if (hh > 0) return `${String(hh).padStart(2, '0')}:${mm}:${ss}`
  return `${mm}:${ss}`
}
