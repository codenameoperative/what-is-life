import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { items, type Item } from '../../utils/items'
import { useNotify } from '../../contexts/NotifyContext'

type Props = { open: boolean; onClose: () => void }

export default function CraftModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) setSelectedId(null)
  }, [open])

  const craftableItems = useMemo(() => {
    return Object.values(items).filter(item => item.craftable)
  }, [])

  const selected = selectedId ? items[selectedId] : null

  const canCraft = (item: Item) => {
    if (!item.recipe) return false
    return Object.entries(item.recipe.requiredItems).every(([itemId, requiredQty]) => {
      const ownedQty = state.inventory.filter(invItem => invItem.id === itemId).length
      return ownedQty >= requiredQty
    })
  }

  const craft = () => {
    if (!selected || !selected.recipe) return
    const missingItems: string[] = []

    Object.entries(selected.recipe.requiredItems).forEach(([itemId, requiredQty]) => {
      const ownedQty = state.inventory.filter(invItem => invItem.id === itemId).length
      if (ownedQty < requiredQty) {
        missingItems.push(`${items[itemId]?.name || itemId} (${requiredQty - ownedQty} more)`)
      }
    })

    if (missingItems.length > 0) {
      notify({
        type: 'error',
        title: 'Missing Items',
        message: `You need: ${missingItems.join(', ')}`
      })
      return
    }

    // Remove required items from inventory
    const newInventory = [...state.inventory]
    Object.entries(selected.recipe.requiredItems).forEach(([itemId, requiredQty]) => {
      for (let i = 0; i < requiredQty; i++) {
        const index = newInventory.findIndex(invItem => invItem.id === itemId)
        if (index !== -1) {
          newInventory.splice(index, 1)
        }
      }
    })

    // Add crafted item to inventory
    actions.addItem(selected.id)

    // Update state with new inventory
    state.inventory = newInventory

    notify({
      type: 'success',
      title: 'Crafted!',
      message: `Successfully crafted ${selected.name}`
    })
    onClose()
  }

  const formatRequirements = (item: Item) => {
    if (!item.recipe) return 'No recipe'
    return Object.entries(item.recipe.requiredItems)
      .map(([itemId, qty]) => `${items[itemId]?.name || itemId} x${qty}`)
      .join(', ')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative mt-16 w-[min(92vw,900px)] rounded-xl border border-neutral-800 bg-neutral-950/90 shadow-2xl animate-scaleIn">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <div className="text-sm text-neutral-300">Craft</div>
          <button
            onClick={onClose}
            className="ml-auto px-3 py-2 text-sm rounded-lg bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-3 max-h-[60vh] overflow-y-auto border-r border-neutral-900/60">
            <ul className="divide-y divide-neutral-900/60">
              {craftableItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-900/60 transition-colors rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="text-xs text-neutral-400">{item.tier} • {formatRequirements(item)}</div>
                    </div>
                    <div className="text-xs text-neutral-300">{item.value} WTC</div>
                  </button>
                </li>
              ))}
            </ul>
            {craftableItems.length === 0 && (
              <div className="text-center text-neutral-400 text-sm py-8">No craftable items available</div>
            )}
          </div>

          <div className="p-4 min-h-[300px]">
            {selected ? (
              <div className="space-y-2">
                <div className="text-lg font-semibold">{selected.name}</div>
                <div className="text-sm text-neutral-400">Tier: {selected.tier} • {selected.category}</div>
                <div className="text-sm text-neutral-300">Value: {selected.value} WTC</div>
                <p className="text-sm text-neutral-200 pt-2 leading-relaxed">{selected.description}</p>

                <div className="pt-4">
                  <div className="text-sm font-medium text-neutral-300 mb-2">Requirements:</div>
                  <div className="text-sm text-neutral-400">
                    {formatRequirements(selected)}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={craft}
                    disabled={!canCraft(selected)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                      canCraft(selected)
                        ? 'bg-green-700 hover:bg-green-800'
                        : 'bg-neutral-800 cursor-not-allowed'
                    }`}
                  >
                    {canCraft(selected) ? 'Craft' : 'Missing Requirements'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                Select an item to craft
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
