import { Bookmark, Building2, CalendarClock, MapPin, GraduationCap, ArrowUpRight } from 'lucide-react'
import { accent as getAccent, cn, deadlineInfo } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { OPP_CATEGORY_META } from '../data/opportunities'
import { useApp } from '../store/AppContext'

export default function OpportunityCard({ opp }) {
  const { isSaved, toggleSaved, t } = useApp()
  const meta = OPP_CATEGORY_META[opp.category] || { label: opp.category, icon: 'Sparkles', accent: 'brand' }
  const a = getAccent(meta.accent)
  const Icon = getIcon(meta.icon)
  const saved = isSaved(opp.id)
  const { label: dLabel, days } = deadlineInfo(opp.deadline)
  const urgent = days >= 0 && days <= 14
  // only allow http(s) links — blocks javascript:/data: URI injection from stored rows
  const safeHref = /^https?:\/\//i.test(opp.link || '') ? opp.link : '#'

  return (
    <div className="group card card-hover p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('h-11 w-11 rounded-2xl grid place-items-center shrink-0', a.iconWrap)}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <span className={cn('chip', a.chip)}>{meta.label}</span>
          </div>
        </div>
        <button
          onClick={() => toggleSaved(opp.id)}
          aria-label={saved ? t('common.saved') : t('common.save')}
          className={cn(
            'h-9 w-9 grid place-items-center rounded-xl border transition-colors shrink-0',
            saved
              ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/15 dark:border-brand-500/30 dark:text-brand-300'
              : 'border-slate-200 text-ink-muted hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:text-slate-400',
          )}
        >
          <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
      </div>

      <h3 className="font-semibold text-ink dark:text-white leading-snug mt-3">{opp.title}</h3>

      <p className="text-xs text-ink-muted dark:text-slate-400 mt-1 inline-flex items-center gap-1.5">
        <Building2 className="h-3.5 w-3.5" />
        {opp.organization}
      </p>

      <p className="text-sm text-ink-muted dark:text-slate-400 mt-3 line-clamp-2 flex-1">
        {opp.description}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted dark:text-slate-400 mt-4">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {opp.format}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5" />
          {opp.grades} класс
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-semibold',
            urgent ? 'text-amber-600 dark:text-amber-400' : 'text-ink-soft dark:text-slate-300',
          )}
        >
          <CalendarClock className="h-3.5 w-3.5" />
          {dLabel}
          {days >= 0 && <span className="font-normal">· {days} {t('common.daysLeft')}</span>}
        </span>
      </div>

      <a
        href={safeHref}
        target="_blank"
        rel="noreferrer noopener"
        className="btn-primary w-full mt-5 text-sm"
      >
        {t('common.apply')}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}
