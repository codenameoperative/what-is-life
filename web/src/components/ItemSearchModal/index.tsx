import { useMemo, useState, useEffect, useRef } from 'react'
import { items, type Item } from '../../utils/items'

type Props = {
  open: boolean
  onClose: () => void
}

const tierOrder: Record<string, number> = {
  useless: 0,
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythical: 6,
  wdyft: 7,
}

export default function ItemSearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const categories = ['weapons','tools','clothing','collectables','animals','fish'] as const
  const [activeCats, setActiveCats] = useState<Record<typeof categories[number], boolean>>({
    weapons: true,
    tools: true,
    clothing: true,
    collectables: true,
    animals: true,
    fish: true,
  })
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      setQuery('')
      setSelectedId(null)
      setShowCategoryDropdown(false)
    }
  }, [open])

  const allItems: Item[] = useMemo(() => Object.values(items), [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filteredByQuery = q
      ? allItems.filter((i) =>
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
        )
      : allItems
    const filtered = filteredByQuery.filter(i => activeCats[i.category as keyof typeof activeCats])

    // sort by tier then name
    return filtered
      .slice()
      .sort((a, b) => {
        const ta = tierOrder[a.tier] ?? 99
        const tb = tierOrder[b.tier] ?? 99
        if (ta !== tb) return ta - tb
        return a.name.localeCompare(b.name)
      })
  }, [allItems, query, activeCats])

  const selected = selectedId ? items[selectedId] : null

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Container */}
      <div className="relative mt-16 w-[min(92vw,900px)] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl animate-scaleIn">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="flex-1 bg-neutral-900/70 border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-600"
            autoFocus
          />

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
              <div className="absolute top-full mt-1 right-0 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-10 py-1">
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

          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Results */}
          <div className="p-3 max-h-[60vh] overflow-y-auto border-r border-neutral-900/60">
            <ul className="divide-y divide-neutral-900/60">
              {results.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => setSelectedId(i.id)}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-900/60 transition-colors rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{i.name}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          i.tier === 'useless' ? 'bg-gray-600 text-gray-200' :
                          i.tier === 'common' ? 'bg-gray-500 text-gray-100' :
                          i.tier === 'uncommon' ? 'bg-green-600 text-green-100' :
                          i.tier === 'rare' ? 'bg-blue-600 text-blue-100' :
                          i.tier === 'epic' ? 'bg-purple-600 text-purple-100' :
                          i.tier === 'legendary' ? 'bg-yellow-600 text-yellow-100' :
                          i.tier === 'mythical' ? 'bg-red-600 text-red-100' :
                          'bg-pink-600 text-pink-100'
                        }`}>
                          {i.tier.charAt(0).toUpperCase() + i.tier.slice(1)}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-400">{i.category}</span>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-300">{i.value} WTC</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail */}
          <div className="p-4 min-h-[300px]">
            {selected ? (
              <div className="space-y-2">
                <div className="text-lg font-semibold">{selected.name}</div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selected.tier === 'useless' ? 'bg-gray-600 text-gray-200' :
                    selected.tier === 'common' ? 'bg-gray-500 text-gray-100' :
                    selected.tier === 'uncommon' ? 'bg-green-600 text-green-100' :
                    selected.tier === 'rare' ? 'bg-blue-600 text-blue-100' :
                    selected.tier === 'epic' ? 'bg-purple-600 text-purple-100' :
                    selected.tier === 'legendary' ? 'bg-yellow-600 text-yellow-100' :
                    selected.tier === 'mythical' ? 'bg-red-600 text-red-100' :
                    'bg-pink-600 text-pink-100'
                  }`}>
                    {selected.tier.charAt(0).toUpperCase() + selected.tier.slice(1)}
                  </span>
                  <span className="text-sm text-neutral-400">• {selected.category}</span>
                </div>
                <div className="text-sm text-neutral-300">Value: {selected.value} WTC</div>
                <div className="text-sm text-neutral-300">Usable: {selected.usable ? 'Yes' : 'No'}</div>
                <div className="text-sm text-neutral-300">Source: {selected.source}</div>
                <div className="text-sm text-neutral-300">Break Chance: {(selected.breakChance * 100).toFixed(1)}%</div>
                <p className="text-sm text-neutral-200 pt-2 leading-relaxed">{selected.description}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                Select an item to view details
              </div>
            )}
          </div>
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
