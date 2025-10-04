import { useState, useEffect } from 'react'

interface SaveSlot {
  id: string
  name: string
  lastPlayed: string
  level: number
  totalEarnings: number
}

interface SaveSelectorProps {
  onSelectSave: (saveId: string) => void
  onCreateSave: () => void
  onDeleteSave: (saveId: string) => void
}

export default function SaveSelector({ onSelectSave, onCreateSave, onDeleteSave }: SaveSelectorProps) {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadSaveSlots()
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If delete confirmation is open, close it first
        if (showDeleteConfirm) {
          setShowDeleteConfirm(null)
          return
        }
        // Otherwise, create a new save (go back to first time setup)
        onCreateSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDeleteConfirm, onCreateSave])

  const loadSaveSlots = () => {
    const slots: SaveSlot[] = []
    for (let i = 1; i <= 5; i++) {
      const saveKey = `save-slot-${i}`
      const saveData = localStorage.getItem(saveKey)
      if (saveData) {
        try {
          const parsed = JSON.parse(saveData)
          // Update the save data with current timestamp
          const updatedData = { ...parsed, lastPlayed: new Date().toISOString() }
          localStorage.setItem(saveKey, JSON.stringify(updatedData))
          
          slots.push({
            id: saveKey,
            name: parsed.profile?.username || `Save ${i}`,
            lastPlayed: updatedData.lastPlayed,
            level: parsed.profile?.level || 1,
            totalEarnings: parsed.profile?.totalEarnings || 0
          })
        } catch (error) {
          console.warn(`Failed to parse save data for slot ${i}:`, error)
          slots.push({
            id: saveKey,
            name: `Save ${i}`,
            lastPlayed: '',
            level: 0,
            totalEarnings: 0
          })
        }
      } else {
        slots.push({
          id: saveKey,
          name: `Empty Slot ${i}`,
          lastPlayed: '',
          level: 0,
          totalEarnings: 0
        })
      }
    }
    setSaveSlots(slots)
  }

  const handleDeleteSave = (saveId: string) => {
    localStorage.removeItem(saveId)
    setShowDeleteConfirm(null)
    loadSaveSlots()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4 glass-strong border border-border/50 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">What is Life?</h1>
          <p className="text-muted">Select a save slot to continue your adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {saveSlots.map((slot) => (
            <div
              key={slot.id}
              className={`glass-strong border border-border/30 rounded-lg p-4 transition-all duration-200 ${
                slot.level > 0 ? 'hover:border-accent/50 hover:shadow-lg' : 'hover:border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{slot.name}</h3>
                  {slot.level > 0 ? (
                    <div className="text-xs text-muted">
                      <div>Level {slot.level}</div>
                      <div>💰 {slot.totalEarnings.toLocaleString()} earned</div>
                      <div className="text-xs opacity-75">
                        Last played: {new Date(slot.lastPlayed).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted">Empty save slot</div>
                  )}
                </div>

                {slot.level > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm(slot.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors"
                    title="Delete save"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <button
                onClick={() => slot.level > 0 ? onSelectSave(slot.id) : onCreateSave()}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  slot.level > 0
                    ? 'btn-primary hover:scale-105'
                    : 'btn-secondary hover:bg-accent/20'
                }`}
              >
                {slot.level > 0 ? 'Continue' : 'Create New Save'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-muted">
          Maximum of 5 save slots • Each save is completely separate
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center modal-overlay backdrop-blur-sm">
            <div className="bg-neutral-900/80 border border-border/50 rounded-lg p-6 max-w-md mx-4 glass-strong shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Delete Save?</h3>
              <p className="text-neutral-300 mb-6">
                Are you sure you want to delete this save? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-tertiary/50 hover:bg-tertiary text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSave(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
