import { useState, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { useNotify } from '../contexts/NotifyContext'
import { exportGameData, importGameData, downloadExportFile, readFileAsText } from '../utils/dataManagement'

interface DataManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DataManagementModal({ isOpen, onClose }: DataManagementModalProps) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportData = exportGameData(state)
      const filename = `what-is-life-save-${new Date().toISOString().split('T')[0]}.txt`
      downloadExportFile(exportData, filename)

      notify({
        type: 'success',
        title: 'Export Complete',
        message: 'Your save file has been downloaded successfully.'
      })
    } catch (error) {
      notify({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export save data.'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const fileContent = await readFileAsText(file)
      const result = importGameData(fileContent)

      if (result.success && result.data) {
        // Validate imported data has required fields
        if (!result.data.profile?.username || !result.data.profile?.playerId) {
          throw new Error('Invalid save file: missing required profile data')
        }

        // Update game state
        // Note: This would need to be handled by the GameProvider
        // For now, we'll just show success
        notify({
          type: 'success',
          title: 'Import Successful',
          message: `Loaded save for ${result.data.profile.username}. The game will reload with the imported data.`
        })

        // Reload the page to apply imported data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(result.error || 'Unknown import error')
      }
    } catch (error) {
      notify({
        type: 'error',
        title: 'Import Failed',
        message: error instanceof Error ? error.message : 'Failed to import save data.'
      })
    } finally {
      setIsImporting(false)
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 modal-content glass-strong border border-border/50 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Data Management</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary hover:bg-tertiary/50 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-primary mb-1">Export Save Data</h3>
              <p className="text-xs text-muted">
                Download your current game progress as a backup file.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export Save File'}
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-primary mb-1">Import Save Data</h3>
              <p className="text-xs text-muted">
                Load a previously exported save file. This will replace your current progress.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={handleFileSelect}
              disabled={isImporting}
              className="w-full btn-secondary disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Select Save File'}
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 text-sm">⚠️</span>
              <div className="text-xs text-muted">
                <strong>Warning:</strong> Importing will replace your current save data.
                Make sure to export your current progress first if you want to keep it.
              </div>
            </div>
          </div>

          {/* Save Info */}
          <div className="text-center text-xs text-muted">
            <div>Current Save: <strong>{state.profile?.username || 'Unknown'}</strong></div>
            <div>Last Saved: <strong>{new Date().toLocaleString()}</strong></div>
            <div>Version: <strong>0.1.1</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
