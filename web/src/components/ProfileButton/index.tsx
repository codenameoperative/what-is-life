import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import ProfileHoverCard from '../ProfileHoverCard'
import ProfileModal from '../ProfileModal'

export default function ProfileButton() {
  const { state } = useGame()
  const [showHover, setShowHover] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="relative">
      {/* Profile button */}
      <button
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 glass hover:glass-strong border border-border rounded-lg transition-all duration-200 hover:scale-105"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xs sm:text-sm">
            {state.profile.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-primary font-medium text-xs sm:text-sm hidden sm:block">{state.profile.username}</span>
      </button>

      {/* Hover card */}
      {showHover && <ProfileHoverCard />}

      {/* Profile modal */}
      <ProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        isOwnProfile={true}
      />
    </div>
  )
}
