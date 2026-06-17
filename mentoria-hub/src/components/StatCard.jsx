import { accent as getAccent, cn } from '../lib/ui'

export default function StatCard({ icon: Icon, label, value, accent = 'brand' }) {
  const a = getAccent(accent)
  return (
    <div className="card p-4 sm:p-5 flex items-center gap-4">
      <div className={cn('h-12 w-12 rounded-2xl grid place-items-center shrink-0', a.iconWrap)}>
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none text-ink dark:text-white">{value}</p>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1 truncate">{label}</p>
      </div>
    </div>
  )
}
