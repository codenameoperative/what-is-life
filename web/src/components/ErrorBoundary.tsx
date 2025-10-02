import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Log to local storage for debugging
    const crashLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    try {
      const existingLogs = JSON.parse(localStorage.getItem('crash-logs') || '[]')
      existingLogs.push(crashLog)
      // Keep only last 10 crash logs
      if (existingLogs.length > 10) {
        existingLogs.shift()
      }
      localStorage.setItem('crash-logs', JSON.stringify(existingLogs))
    } catch (storageError) {
      console.error('Failed to save crash log:', storageError)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-strong border border-border/50 rounded-lg p-6 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-4xl">💥</div>
              <h2 className="text-xl font-semibold text-white">Oops! Something went wrong</h2>
              <p className="text-sm text-muted">
                The game encountered an unexpected error. Your progress has been automatically saved.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="text-left bg-neutral-900/50 p-3 rounded text-xs font-mono">
                  <summary className="cursor-pointer text-primary">Error Details (Dev Mode)</summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1 overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 btn-secondary"
                >
                  Reload Game
                </button>
              </div>

              <p className="text-xs text-muted">
                If this keeps happening, please report this issue.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
