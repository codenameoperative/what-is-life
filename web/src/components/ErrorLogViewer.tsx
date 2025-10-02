// Error log viewer component
import { useState, useEffect } from 'react'
import { ErrorLogger } from '../components/LoadingScreen'

export function ErrorLogViewer() {
  const [logs, setLogs] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLogs(ErrorLogger.getRecentLogs())
    }
  }, [isOpen])

  const downloadLogs = () => {
    const logContent = logs.join('\n---\n')
    const blob = new Blob([logContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.log`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearLogs = () => {
    localStorage.removeItem('error_logs')
    setLogs([])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg"
      >
        📋 Error Logs
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 modal-content glass-strong border border-border/50 shadow-2xl p-6 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Error Logs</h2>
          <div className="flex gap-2">
            {logs.length > 0 && (
              <>
                <button onClick={downloadLogs} className="btn-secondary text-sm">
                  📥 Download
                </button>
                <button onClick={clearLogs} className="btn-secondary text-sm">
                  🗑️ Clear
                </button>
              </>
            )}
            <button onClick={() => setIsOpen(false)} className="btn-secondary text-sm">
              Close
            </button>
          </div>
        </div>

        <div className="bg-neutral-900/50 rounded p-4 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center text-muted py-8">
              No error logs found. Errors will be logged here when they occur.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                try {
                  const parsed = JSON.parse(log)
                  return (
                    <div key={index} className="bg-red-500/10 border border-red-500/20 rounded p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-red-400 font-semibold">Error #{index + 1}</span>
                        <span className="text-xs text-muted">
                          {new Date(parsed.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>Context:</strong> {parsed.context}</div>
                        <div><strong>Error:</strong> {parsed.error}</div>
                        {parsed.stack && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs">Stack Trace</summary>
                            <pre className="text-xs mt-2 whitespace-pre-wrap bg-black/50 p-2 rounded overflow-auto max-h-32">
                              {parsed.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  )
                } catch {
                  return (
                    <div key={index} className="bg-red-500/10 border border-red-500/20 rounded p-3">
                      <pre className="text-xs whitespace-pre-wrap">{log}</pre>
                    </div>
                  )
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
