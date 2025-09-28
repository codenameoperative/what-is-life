import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { items, isStackable } from '../../utils/items'

interface SellModalProps {
  open: boolean
  onClose: () => void
  itemId: string
}

export default function SellModal({ open, onClose, itemId }: SellModalProps) {
  const { state, actions } = useGame()
  const [quantity, setQuantity] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!open) return null

  const item = items[itemId]
  const ownedItem = state.inventory.find(it => it.id === itemId)

  if (!item || !ownedItem) {
    onClose()
    return null
  }

  const maxQuantity = ownedItem.quantity || 1
  const totalValue = item.value * quantity
  const canSell = quantity > 0 && quantity <= maxQuantity

  const handleSell = () => {
    if (!canSell) return

    const success = actions.sellItem(itemId, quantity)
    if (success) {
      // Show success notification could be added here
      onClose()
    }
  }

  const handleQuickSell = (qty: number | 'all') => {
    const sellQty = qty === 'all' ? maxQuantity : Math.min(qty, maxQuantity)
    setQuantity(sellQty)
    setShowConfirm(true)
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowConfirm(false)} />
        <div className="relative bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-sm w-full animate-scaleIn">
          <h3 className="text-lg font-semibold text-white mb-4">Confirm Sale</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium">{item.name}</div>
                <div className="text-sm text-neutral-400">
                  Selling {quantity}x for {totalValue.toLocaleString()} WTC
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSell}
              className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
            >
              Confirm Sale
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-sm w-full animate-scaleIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Sell Item</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
            <div className="text-2xl">{item.icon}</div>
            <div className="flex-1">
              <div className="text-white font-medium">{item.name}</div>
              <div className="text-sm text-neutral-400">
                {item.value} WTC each • {isStackable(item) ? `${maxQuantity} owned` : 'Unique item'}
              </div>
            </div>
          </div>

          {isStackable(item) && maxQuantity > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-300">
                Quantity to Sell
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm"
                />
                <div className="flex gap-1">
                  {[1, 5, 10, 'all'].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => handleQuickSell(qty as number | 'all')}
                      className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs text-neutral-300 hover:text-white transition-colors"
                    >
                      {qty === 'all' ? 'All' : qty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-400 mb-1">Sale Summary</div>
            <div className="text-white font-medium">
              {quantity}x {item.name} = {totalValue.toLocaleString()} WTC
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canSell}
              className="flex-1 px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-neutral-600 rounded-lg text-sm font-medium transition-colors"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
