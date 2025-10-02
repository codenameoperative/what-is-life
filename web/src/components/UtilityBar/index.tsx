import { useGame } from '../../contexts/GameContext'
import { useState } from 'react'
import ItemSearchModal from '../ItemSearchModal'
import DepositWithdrawModal from '../DepositWithdrawModal'
import StashModal from '../StashModal'
import InventoryModal from '../InventoryModal'
import ShopModal from '../ShopModal'
import JobModal from '../JobModal'
import CraftModal from '../CraftModal'
import TicTacToe from '../MiniGames/TicTacToe'

const items = [
  'ItemSearch',
  'Deposit/Withdraw',
  'Stash',
  'Inventory',
  'Shop',
  'Job',
  'Craft',
  'Mini Games',
]

export default function UtilityBar() {
  const { state, actions } = useGame()
  const [showSearch, setShowSearch] = useState(false)
  const [showBank, setShowBank] = useState(false)
  const [showStash, setShowStash] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showJob, setShowJob] = useState(false)
  const [showCraft, setShowCraft] = useState(false)
  const [showMiniGames, setShowMiniGames] = useState(false)
  
  const handleUtilityClick = (label: string) => {
    if (label === 'Deposit/Withdraw') {
      setShowBank(true)
    } else if (label === 'ItemSearch') {
      setShowSearch(true)
    } else if (label === 'Stash') {
      setShowStash(true)
    } else if (label === 'Inventory') {
      setShowInventory(true)
    } else if (label === 'Shop') {
      setShowShop(true)
    } else if (label === 'Job') {
      setShowJob(true)
    } else if (label === 'Craft') {
      setShowCraft(true)
    } else if (label === 'Mini Games') {
      setShowMiniGames(true)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl overflow-x-auto">
        <ul className="flex items-center gap-2 min-w-max glass border border-border/30 rounded-xl p-2 backdrop-blur-xl custom-scrollbar">
          {items.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => handleUtilityClick(label)}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-lg glass hover:glass-strong border border-border text-primary hover:text-accent transition-all duration-200 hover:scale-105 cursor-pointer select-none"
                aria-label={`${label}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ItemSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
      <DepositWithdrawModal open={showBank} onClose={() => setShowBank(false)} />
      <StashModal open={showStash} onClose={() => setShowStash(false)} />
      <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} />
      <ShopModal open={showShop} onClose={() => setShowShop(false)} />
      <JobModal open={showJob} onClose={() => setShowJob(false)} />
      <CraftModal open={showCraft} onClose={() => setShowCraft(false)} />
      <TicTacToe open={showMiniGames} onClose={() => setShowMiniGames(false)} />
    </div>
  )
}
