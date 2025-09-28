import React, { useState } from 'react'

export interface UpdateInfo {
  available: boolean
  version?: string
  updateType?: 'immediate' | 'flexible' | 'store'
}

interface UpdateDialogProps {
  updateInfo: UpdateInfo | null
  onUpdateNow: () => Promise<void>
  onUpdateLater: () => void
  onOpenStore: () => void
  isUpdating?: boolean
}

export const UpdateDialog: React.FC<UpdateDialogProps> = ({
  updateInfo,
  onUpdateNow,
  onUpdateLater,
  onOpenStore,
  isUpdating = false
}) => {
  const [updateProgress, setUpdateProgress] = useState<'downloading' | 'installing' | null>(null)

  if (!updateInfo?.available) return null

  const handleUpdateNow = async () => {
    try {
      setUpdateProgress('downloading')
      await onUpdateNow()
      setUpdateProgress('installing')
    } catch (error) {
      console.error('Update failed:', error)
      setUpdateProgress(null)
    }
  }

  const getDialogContent = () => {
    if (updateProgress === 'downloading') {
      return (
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <div>
            <h3 className="text-lg font-semibold text-white">Downloading Update</h3>
            <p className="text-sm text-gray-400">Please wait while we download the latest version...</p>
          </div>
        </div>
      )
    }

    if (updateProgress === 'installing') {
      return (
        <div className="text-center space-y-4">
          <div className="animate-pulse w-8 h-8 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Installing Update</h3>
            <p className="text-sm text-gray-400">The app will restart automatically...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">⬆️</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Update Available</h3>
          <p className="text-sm text-gray-400">A new version of What Is Life is available!</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-sm text-gray-400">New Version</div>
          <div className="font-mono text-white">{updateInfo.version || 'Unknown'}</div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• New features and improvements</p>
          <p>• Bug fixes and performance updates</p>
          <p>• Enhanced stability</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleUpdateNow}
            disabled={isUpdating}
            className="discord-button flex-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Now'}
          </button>
          <button
            onClick={onUpdateLater}
            disabled={isUpdating}
            className="discord-secondary flex-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Later
          </button>
        </div>

        <button
          onClick={onOpenStore}
          className="w-full text-xs text-gray-400 hover:text-white transition-colors py-1"
        >
          Open Google Play Store →
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="discord-modal max-w-sm w-full mx-auto">
        <div className="discord-modal-body">
          {getDialogContent()}
        </div>
      </div>
    </div>
  )
}
