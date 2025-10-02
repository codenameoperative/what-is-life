import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { items, type Item, isStackable } from '../../utils/items'
import { useNotify } from '../../contexts/NotifyContext'
import SellModal from '../SellModal'

type Props = {
  open: boolean
  onClose: () => void
}

export default function InventoryModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [itemToSell, setItemToSell] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setSelectedId(null)
    }
  }, [open])

  const inv = useMemo(() => {
    return state.inventory
      .map((owned) => {
        const def = items[owned.id]
        return def ? { ownedId: owned.id, durability: owned.durability, def } : null
      })
      .filter(Boolean) as { ownedId: string; durability: number; def: Item }[]
  }, [state.inventory])

  const selected = selectedId ? items[selectedId] : null
  const selectedOwned = selectedId ? state.inventory.find((i) => i.id === selectedId) : undefined

  const isCollectable = selected?.category === 'collectables'
  const canUse = !!selected?.boost

  const handleSell = () => {
    if (!selected) return
    setItemToSell(selected.id)
    setSellModalOpen(true)
  }

  const handleUse = () => {
    if (!selected) return
    if (!selected.boost) {
      notify({ type: 'info', title: 'Not usable', message: 'This item cannot be used.' })
      return
    }
    actions.applyBoostFromItem(selected.id)
    notify({ type: 'success', title: 'Boost applied', message: `${selected.name} boost active for ${selected.boost.uses} uses` })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay backdrop-blur-sm" onClick={onClose}>
      {/* Container */}
      <div className="relative mt-16 w-[min(92vw,900px)] glass-strong border border-border/50 shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-border/30 flex items-center gap-3 backdrop-blur-xl">
          <div className="text-sm text-primary">Inventory</div>
          <div className="ml-auto" />
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg glass hover:glass-strong transition-all duration-200 hover:scale-105"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* List */}
          <div className="p-3 max-h-[60vh] overflow-y-auto border-r border-border/30">
            <ul className="divide-y divide-border/30">
              {inv.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-neutral-500">No items in inventory</li>
              )}
              {inv.map((i) => {
                const ownedItem = state.inventory.find(item => item.id === i.ownedId)
                const quantity = ownedItem?.quantity || 1
                const isStack = isStackable(i.def)

                return (
                  <li key={`${i.ownedId}-${i.durability}`}>
                    <button
                      onClick={() => setSelectedId(i.ownedId)}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-900/60 transition-colors rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {i.def.name}
                          {isStack && quantity > 1 && (
                            <span className="px-1.5 py-0.5 bg-neutral-700 text-xs rounded">
                              {quantity}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400">{i.def.tier} • {i.def.category}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        {i.def.maxDurability && i.def.maxDurability > 0 && (
                          <span>{i.durability}/{i.def.maxDurability}</span>
                        )}
                        <span>{i.def.value} WTC</span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Detail */}
          <div className="p-4 min-h-[300px]">
            {selected ? (
              <div className="space-y-2">
                <div className="text-lg font-semibold">{selected.name}</div>
                <div className="text-sm text-neutral-400">Tier: {selected.tier} • {selected.category}</div>
                <div className="text-sm text-neutral-300">Value: {selected.value} WTC</div>
                <div className="text-sm text-neutral-300">Usable: {selected.usable ? 'Yes' : 'No'}</div>
                <div className="text-sm text-neutral-300">Source: {selected.source}</div>
                <div className="text-sm text-neutral-300">Durability: {selected.maxDurability && selected.maxDurability > 0 ? (selectedOwned?.durability ?? selected.maxDurability) : 'N/A'}</div>
                {selected.boost && (
                  <div className="text-sm text-neutral-300">Boost: {selected.boost.type} x{selected.boost.multiplier} for {selected.boost.uses} uses</div>
                )}
                <p className="text-sm text-neutral-200 pt-2 leading-relaxed">{selected.description}</p>

                {/* Actions */}
                <div className="pt-3 flex items-center gap-2">
                  {!isCollectable && canUse && (
                    <button onClick={handleUse} className="px-3 py-1.5 text-sm rounded-lg bg-green-700 hover:bg-green-800">Use</button>
                  )}
                  <button
                    onClick={handleSell}
                    className="px-3 py-1.5 text-sm rounded-lg bg-orange-700 hover:bg-orange-800"
                  >
                    Sell
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                Select an item to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sell Modal */}
      <SellModal
        open={sellModalOpen}
        onClose={() => {
          setSellModalOpen(false)
          setItemToSell(null)
        }}
        itemId={itemToSell || ''}
      />

      <style>{`
        .animate-fadeIn { animation: fadeIn 160ms ease-out; }
        .animate-scaleIn { animation: scaleIn 180ms ease-out; transform-origin: top center; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(-6px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}
