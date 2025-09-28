import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'
export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
}

interface NotifyContextValue {
  toasts: Toast[]
  notify: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const NotifyContext = createContext<NotifyContextValue | null>(null)

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify: NotifyContextValue['notify'] = (t) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const toast: Toast = { id, ...t }
    setToasts((prev) => [...prev, toast])
    // auto-dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 3500)
  }

  const dismiss: NotifyContextValue['dismiss'] = (id) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts])

  return (
    <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(NotifyContext)
  if (!ctx) throw new Error('useNotify must be used within NotifyProvider')
  return ctx
}
