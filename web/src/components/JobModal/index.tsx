import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { jobs, jobTierOrder, type JobDefinition } from '../../utils/jobs'
import { useNotify } from '../../contexts/NotifyContext'

type Props = { open: boolean; onClose: () => void }

export default function JobModal({ open, onClose }: Props) {
  const { state, actions } = useGame()
  const { notify } = useNotify()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const tiers = ['entry', 'intermediate', 'advanced', 'expert'] as const
  const [activeTiers, setActiveTiers] = useState<Record<(typeof tiers)[number], boolean>>({
    entry: true,
    intermediate: true,
    advanced: true,
    expert: true,
  })

  useEffect(() => {
    if (!open) setSelectedId(null)
  }, [open])

  const allJobs = useMemo(() => Object.values(jobs), [])
  const list = useMemo(() => {
    return allJobs
      .filter(j => activeTiers[j.tier])
      .sort((a, b) => (jobTierOrder[a.tier] - jobTierOrder[b.tier]) || a.name.localeCompare(b.name))
  }, [allJobs, activeTiers])

  const selected = selectedId ? jobs[selectedId] : null
  const employedHere = !!selected && state.currentJobId === selected.id

  const reqText = (j: JobDefinition) => {
    const r = []
    if (j.requirements?.minWTC) r.push(`Min WTC: ${j.requirements.minWTC}`)
    if (j.requirements?.requiredItemId) r.push(`Needs: ${j.requirements.requiredItemId}`)
    return r.join(' • ') || 'None'
  }

  const apply = () => {
    if (!selected) return
    const res = actions.applyForJob(selected.id)
    if (res.ok) {
      notify({ type: 'success', title: 'Hired', message: `You are now a ${selected.name}.` })
      onClose()
    } else {
      notify({ type: 'error', title: 'Application Failed', message: res.reason || 'Unknown reason' })
    }
  }

  const resign = () => {
    actions.resignJob()
    notify({ type: 'success', title: 'Resigned', message: 'You resigned from your job.' })
    setSelectedId(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="relative mt-16 w-[min(92vw,900px)] rounded-xl border border-neutral-800 bg-neutral-950/95 shadow-2xl animate-scaleIn">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <div className="text-sm text-neutral-300">Jobs</div>
          <div className="hidden md:flex items-center gap-1 ml-2">
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => setActiveTiers(p => ({ ...p, [t]: !p[t] }))}
                className={`px-2 py-1 text-xs rounded-md border ${
                  activeTiers[t] ? 'bg-neutral-800/70 border-neutral-700' : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="ml-auto px-3 py-2 text-sm rounded-lg bg-neutral-900/70 border border-neutral-800 hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-3 max-h-[60vh] overflow-y-auto border-r border-neutral-900/60">
            <ul className="divide-y divide-neutral-900/60">
              {list.map(j => (
                <li key={j.id}>
                  <button
                    onClick={() => setSelectedId(j.id)}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-900/60 transition-colors rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{j.name}</div>
                      <div className="text-xs text-neutral-400">{j.tier} • {reqText(j)}</div>
                    </div>
                    <div className="text-xs text-neutral-300">{j.payPerWork.min}-{j.payPerWork.max} WTC</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 min-h-[300px]">
            {selected ? (
              <div className="space-y-2">
                <div className="text-lg font-semibold">{selected.name}</div>
                <div className="text-sm text-neutral-400">Tier: {selected.tier}</div>
                <div className="text-sm text-neutral-300">Pay: {selected.payPerWork.min}-{selected.payPerWork.max} WTC per work</div>
                <div className="text-sm text-neutral-300">Requirements: {reqText(selected)}</div>
                <p className="text-sm text-neutral-200 pt-2 leading-relaxed">{selected.description}</p>
                <div className="pt-4 flex gap-2">
                  {employedHere ? (
                    <button
                      onClick={resign}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-700 hover:bg-red-800"
                    >
                      Resign
                    </button>
                  ) : (
                    <button
                      onClick={apply}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-700 hover:bg-green-800"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                Select a job to view details
              </div>
            )}
          </div>
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
