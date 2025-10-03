import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

type Props = {
  open: boolean
  onClose: () => void
}

export default function UpdateModal({ open, onClose }: Props) {
  const [currentVersion, setCurrentVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('')
  const [downloadPath, setDownloadPath] = useState('')

  useEffect(() => {
    if (open) {
      checkForUpdates()
    }
  }, [open])

  const checkForUpdates = async () => {
    setIsChecking(true)
    setUpdateStatus('Checking for updates...')

    try {
      const current = await invoke<string>('get_current_version')
      const latest = await invoke<string>('check_for_updates')

      setCurrentVersion(current)
      setLatestVersion(latest)

      if (current !== latest) {
        setUpdateStatus(`Update available: ${current} → ${latest}`)
      } else {
        setUpdateStatus('You have the latest version')
      }
    } catch (error) {
      setUpdateStatus('Failed to check for updates')
      console.error('Update check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const downloadUpdate = async () => {
    if (currentVersion === latestVersion) return

    setIsDownloading(true)
    setUpdateStatus('Downloading update...')

    try {
      const path = await invoke<string>('download_update', { version: latestVersion })
      setDownloadPath(path)
      setUpdateStatus('Download complete')
    } catch (error) {
      setUpdateStatus('Download failed')
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const installUpdate = async () => {
    if (!downloadPath) return

    setIsInstalling(true)
    setUpdateStatus('Installing update...')

    try {
      const success = await invoke<boolean>('install_update', { updatePath: downloadPath })

      if (success) {
        setUpdateStatus('Update installed successfully! Please restart the application.')
        // In a real implementation, this would restart the app
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        setUpdateStatus('Installation failed')
      }
    } catch (error) {
      setUpdateStatus('Installation failed')
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  if (!open) return null

  const needsUpdate = currentVersion !== latestVersion && latestVersion

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center modal-overlay backdrop-blur-sm" onClick={onClose}>
      <div className="relative mt-16 w-[min(92vw,600px)] modal-content glass-strong border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-border/30 flex items-center justify-between backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-primary">Update System</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:text-primary hover:bg-tertiary/50 rounded-lg transition-all duration-200 hover:scale-105"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Version Info */}
          <div className="glass p-4 rounded-lg">
            <h3 className="text-lg font-medium text-primary mb-3">Version Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Current Version:</span>
                <span className="font-mono text-sm">{currentVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Latest Version:</span>
                <span className="font-mono text-sm">{latestVersion || 'Checking...'}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glass p-4 rounded-lg">
            <div className="text-sm text-muted mb-2">Status:</div>
            <div className="text-primary font-medium">{updateStatus}</div>
          </div>

          {/* Update Actions */}
          {needsUpdate && (
            <div className="glass p-4 rounded-lg border border-green-500/30">
              <h3 className="text-lg font-medium text-green-400 mb-3">Update Available</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadUpdate}
                  disabled={isDownloading || isInstalling}
                  className="w-full btn-primary"
                >
                  {isDownloading ? 'Downloading...' : 'Download Update'}
                </button>

                {downloadPath && (
                  <button
                    onClick={installUpdate}
                    disabled={isInstalling}
                    className="w-full btn-secondary"
                  >
                    {isInstalling ? 'Installing...' : 'Install Update'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Update Info */}
          <div className="glass p-4 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Update Information</h3>
            <div className="text-sm text-muted space-y-1">
              <p>• Updates preserve all save data and settings</p>
              <p>• Application will restart after installation</p>
              <p>• Check for updates regularly for new features</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 flex items-center justify-end backdrop-blur-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg btn-secondary"
          >
            Close
          </button>
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
