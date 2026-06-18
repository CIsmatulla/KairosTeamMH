import { useMemo, useState } from 'react'
import { Search, Bookmark } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { OPP_CATEGORY_META, FORMATS } from '../data/opportunities'
import { cn, accent as getAccent } from '../lib/ui'
import { getIcon } from '../lib/icons'
import OpportunityCard from '../components/OpportunityCard'
import { PageHeader } from '../components/headers'

export default function Opportunities() {
  const { t, opportunities, saved } = useApp()
  const [category, setCategory] = useState('all')
  const [format, setFormat] = useState('all')
  const [sort, setSort] = useState('deadline')
  const [query, setQuery] = useState('')
  const [onlySaved, setOnlySaved] = useState(false)

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => {
      if (category !== 'all' && o.category !== category) return false
      if (format !== 'all' && o.format !== format) return false
      if (onlySaved && !saved.includes(o.id)) return false
      if (query && !`${o.title} ${o.organization} ${o.description}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
    if (sort === 'deadline') list = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    return list
  }, [opportunities, category, format, sort, query, onlySaved, saved])

  return (
    <div>
      <PageHeader title={t('opp.title')} subtitle={t('opp.subtitle')}>
        <button
          onClick={() => setOnlySaved((v) => !v)}
          className={cn('btn px-4 py-2.5 border', onlySaved ? 'bg-brand-500 text-white border-brand-500' : 'btn-secondary')}
        >
          <Bookmark className={cn('h-4 w-4', onlySaved && 'fill-current')} />
          {t('nav.bookmarks')} {saved.length > 0 && `(${saved.length})`}
        </button>
      </PageHeader>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1 mb-4">
        <button
          onClick={() => setCategory('all')}
          className={cn('chip whitespace-nowrap border', category === 'all' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-200 text-ink-soft dark:border-white/10 dark:text-slate-300 hover:border-brand-300')}
        >
          {t('courses.all')}
        </button>
        {Object.entries(OPP_CATEGORY_META).map(([key, meta]) => {
          const Icon = getIcon(meta.icon)
          const active = category === key
          const a = getAccent(meta.accent)
          return (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn('chip whitespace-nowrap border', active ? cn(a.solid, 'text-white border-transparent') : 'border-slate-200 text-ink-soft dark:border-white/10 dark:text-slate-300 hover:border-brand-300')}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </button>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="card p-3 sm:p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-10" placeholder={t('common.search')} />
        </div>
        <div className="flex gap-3">
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="input !py-2 !w-auto cursor-pointer">
            <option value="all">Формат: {t('courses.all')}</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !py-2 !w-auto cursor-pointer">
            <option value="deadline">Сначала срочные</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-muted dark:text-slate-400 mb-4">{filtered.length} {t('courses.found')}</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((o) => (
          <OpportunityCard key={o.id} opp={o} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-ink-muted dark:text-slate-400">
          <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-semibold">{onlySaved ? 'Нет сохранённых возможностей' : 'Ничего не найдено'}</p>
          <p className="text-sm mt-1">{onlySaved ? 'Нажми на закладку у карточки, чтобы сохранить' : 'Попробуй изменить фильтры'}</p>
        </div>
      )}
    </div>
  )
}
