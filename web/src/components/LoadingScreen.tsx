import { useEffect, useState } from 'react'

type Props = {
  onComplete: () => void
}

// Simulated file loading operations with real checks
const LOADING_FILES = [
  '🌐 Initializing network connection...',
  '📦 Loading game engine core...',
  '🎨 Rendering UI components...',
  '💾 Connecting to save system...',
  '🎯 Loading activity modules...',
  '🏆 Initializing achievement system...',
  '🌱 Preparing garden system...',
  '🎪 Setting up LAN multiplayer...',
  '⚡ Optimizing performance...',
  '🚀 Launching What is Life?'
]

// Error logging utility
class ErrorLogger {
  static async logError(error: Error | string, context: string) {
    const timestamp = new Date().toISOString()
    const errorMessage = typeof error === 'string' ? error : error.message
    const stackTrace = typeof error === 'string' ? '' : error.stack || ''

    const logEntry = {
      timestamp,
      context,
      error: errorMessage,
      stack: stackTrace,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    try {
      // Create logs directory if it doesn't exist (in Tauri this would work)
      const logContent = JSON.stringify(logEntry, null, 2) + '\n---\n'

      // In browser, we'll use localStorage as fallback
      const existingLogs = localStorage.getItem('error_logs') || ''
      localStorage.setItem('error_logs', existingLogs + logContent)

      // Try to create actual file download for error logs
      const filename = `error-${new Date().toISOString().split('T')[0]}.log`
      const blob = new Blob([logContent], { type: 'text/plain' })

      // Auto-download error log file when errors occur
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.warn('Error logged:', logEntry)
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
  }

  static getRecentLogs(): string[] {
    try {
      const logs = localStorage.getItem('error_logs') || ''
      return logs.split('---\n').filter(log => log.trim().length > 0)
    } catch {
      return []
    }
  }
}

// File loading simulation with real error detection
async function simulateFileLoading(filename: string, delay: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        // Perform real checks based on file type
        if (filename.includes('network')) {
          // Check network connectivity
          const isOnline = navigator.onLine
          if (!isOnline) {
            throw new Error('Network connection unavailable - check your internet connection')
          }
          // Test API connectivity (if applicable)
          try {
            await fetch(window.location.origin + '/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
          } catch {
            throw new Error('Unable to connect to server')
          }
        } else if (filename.includes('engine')) {
          // Check browser capabilities
          if (!window || !document) {
            throw new Error('Browser environment not properly initialized')
          }
          if (!window.localStorage) {
            throw new Error('Browser does not support local storage')
          }
          if (!window.requestAnimationFrame) {
            throw new Error('Browser does not support required animation features')
          }
        } else if (filename.includes('UI')) {
          // Check if required DOM elements exist
          const root = document.getElementById('root')
          if (!root) {
            throw new Error('Root element not found - page structure corrupted')
          }
          // Check CSS custom properties support
          const testEl = document.createElement('div')
          testEl.style.setProperty('--test', '1')
          if (getComputedStyle(testEl).getPropertyValue('--test') !== '1') {
            throw new Error('Browser does not support CSS custom properties')
          }
        } else if (filename.includes('save')) {
          // Test localStorage functionality
          const testKey = 'loading_test_' + Date.now()
          try {
            localStorage.setItem(testKey, 'test')
            const retrieved = localStorage.getItem(testKey)
            if (retrieved !== 'test') {
              throw new Error('localStorage read/write test failed')
            }
            localStorage.removeItem(testKey)
          } catch (storageError) {
            throw new Error(`Save system error: ${storageError}`)
          }
        } else if (filename.includes('activity')) {
          // Check if required modules are available
          if (typeof Math === 'undefined' || typeof Date === 'undefined') {
            throw new Error('Required JavaScript APIs not available')
          }
        } else if (filename.includes('achievement')) {
          // Test JSON parsing
          try {
            JSON.parse('{"test": "data"}')
          } catch {
            throw new Error('JSON parsing not working')
          }
        }

        // Random chance of simulated error for testing (reduced to 2%)
        if (Math.random() < 0.02) {
          throw new Error(`Simulated loading error for ${filename}`)
        }

        resolve(true)
      } catch (error) {
        await ErrorLogger.logError(error as Error, `Loading: ${filename}`)
        resolve(false) // Continue loading even if one check fails
      }
    }, delay + Math.random() * 300) // Variable delay for realism
  })
}

export { ErrorLogger }

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [loadedFiles, setLoadedFiles] = useState<string[]>([])
  const [hasErrors, setHasErrors] = useState(false)

  useEffect(() => {
    const loadFilesSequentially = async () => {
      const failedFiles: string[] = []

      for (let i = 0; i < LOADING_FILES.length; i++) {
        const file = LOADING_FILES[i]
        setCurrentFile(file)

        // Perform actual loading check
        const success = await simulateFileLoading(file, 200 + Math.random() * 300)

        if (!success) {
          failedFiles.push(file)
          setHasErrors(true)
        }

        // Update loaded files list
        setLoadedFiles(prev => [...prev, file])

        // Update progress
        const newProgress = ((i + 1) / LOADING_FILES.length) * 100
        setProgress(newProgress)
      }

      // Show completion status
      if (failedFiles.length > 0) {
        console.warn('Loading completed with errors:', failedFiles)
        setCurrentFile(`⚠️ Completed with ${failedFiles.length} errors (check error logs)`)
      } else {
        setCurrentFile('✅ All systems loaded successfully!')
      }

      // Complete loading after a brief delay
      setTimeout(onComplete, 1000)
    }

    loadFilesSequentially()
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            What is Life?
          </h1>
          <p className="text-lg text-muted animate-fade-in">
            Life is Full of Adventures...
          </p>
          <div className="mt-4 p-3 glass rounded-lg border border-accent/30">
            <p className="text-sm text-accent">
              🎵 <strong>Pro Tip:</strong> The game has no sound effects yet. Consider listening to your favorite music while playing for the best experience!
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current file being loaded */}
          <div className={`text-sm font-medium animate-fade-in ${hasErrors ? 'text-red-400' : 'text-primary'}`}>
            {currentFile}
          </div>

          {/* Loaded files list */}
          <div className="text-xs text-muted space-y-1 max-h-32 overflow-y-auto">
            {loadedFiles.slice(-6).map((file, index) => (
              <div key={index} className="flex items-center gap-2 opacity-60">
                <span className={file.includes('⚠️') || file.includes('Error') ? 'text-red-400' : 'text-green-400'}>
                  {file.includes('⚠️') || file.includes('Error') ? '❌' : '✓'}
                </span>
                <span>{file.replace(/^[^\s]+/, '').trim()}</span>
              </div>
            ))}
          </div>

          {hasErrors && (
            <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
              Some systems failed to load. Error logs have been saved.
            </div>
          )}
        </div>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
