import { accent as getAccent, cn } from '../lib/ui'

export default function ProgressBar({ value = 0, accent = 'brand', className = '' }) {
  const a = getAccent(accent)
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', a.bar)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
