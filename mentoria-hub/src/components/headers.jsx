import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white">
          {title}
        </h1>
        {subtitle && <p className="text-ink-muted dark:text-slate-400 mt-1.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function SectionTitle({ title, to, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-ink dark:text-white">{title}</h2>
      {to && (
        <Link
          to={to}
          className="text-sm font-semibold text-brand-600 dark:text-brand-300 inline-flex items-center gap-1 hover:gap-1.5 transition-[gap]"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
