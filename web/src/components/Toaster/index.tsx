import { useNotify } from '../../contexts/NotifyContext'

export default function Toaster() {
  const { toasts, dismiss } = useNotify()
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-[360px] max-w-[92vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            'group rounded-xl border backdrop-blur-xl px-4 py-3 shadow-soft transition-all ' +
            'glass-strong border-border/50 text-primary hover:glass ' +
            (t.type === 'success'
              ? 'ring-1 ring-accent/30'
              : t.type === 'error'
              ? 'ring-1 ring-red-600/30'
              : 'ring-1 ring-primary/30')
          }
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div
              className={
                'mt-1 h-2 w-2 rounded-full ' +
                (t.type === 'success'
                  ? 'bg-green-500'
                  : t.type === 'error'
                  ? 'bg-red-500'
                  : 'bg-blue-500')
              }
            />
            <div className="flex-1">
              {t.title && (
                <div className="text-sm font-semibold leading-tight">{t.title}</div>
              )}
              <div className="text-sm text-neutral-300 leading-snug">{t.message}</div>
            </div>
            <button
              className="opacity-60 hover:opacity-100 text-neutral-400 hover:text-neutral-200 transition"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
