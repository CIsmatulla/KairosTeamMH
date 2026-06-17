import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { CATEGORY_META } from '../data/courses'
import { cn, accent as getAccent } from '../lib/ui'
import { getIcon } from '../lib/icons'
import CourseCard from '../components/CourseCard'
import { PageHeader } from '../components/headers'

const LEVELS = ['Начальный', 'Средний', 'Продвинутый']

export default function Courses() {
  const { t, courses } = useApp()
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState('popular')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
      if (category !== 'all' && c.category !== category) return false
      if (level !== 'all' && c.level !== level) return false
      if (language !== 'all' && c.language !== language) return false
      if (query && !`${c.title} ${c.description}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
    if (sort === 'popular') list = [...list].sort((a, b) => b.students - a.students)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'lessons') list = [...list].sort((a, b) => (b.lessons?.length || 0) - (a.lessons?.length || 0))
    return list
  }, [courses, category, level, language, sort, query])

  return (
    <div>
      <PageHeader title={t('courses.title')} subtitle={t('courses.subtitle')} />

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1 mb-4">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'chip whitespace-nowrap border',
            category === 'all'
              ? 'bg-brand-500 text-white border-brand-500'
              : 'border-slate-200 text-ink-soft dark:border-white/10 dark:text-slate-300 hover:border-brand-300',
          )}
        >
          {t('courses.all')}
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const Icon = getIcon(meta.icon)
          const active = category === key
          const a = getAccent(meta.accent)
          return (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                'chip whitespace-nowrap border',
                active ? cn(a.solid, 'text-white border-transparent') : 'border-slate-200 text-ink-soft dark:border-white/10 dark:text-slate-300 hover:border-brand-300',
              )}
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
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            placeholder={t('common.search')}
          />
        </div>
        <div className="flex gap-3 items-center">
          <SlidersHorizontal className="h-4 w-4 text-ink-muted hidden sm:block" />
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="input !py-2 !w-auto cursor-pointer">
            <option value="all">{t('courses.filterLevel')}: {t('courses.all')}</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input !py-2 !w-auto cursor-pointer">
            <option value="all">{t('courses.filterLanguage')}: {t('courses.all')}</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !py-2 !w-auto cursor-pointer">
            <option value="popular">{t('courses.sortBy')}: ⭐ популярные</option>
            <option value="rating">Рейтинг</option>
            <option value="lessons">Кол-во уроков</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-muted dark:text-slate-400 mb-4">
        {filtered.length} {t('courses.found')}
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-ink-muted dark:text-slate-400">
          <p className="text-lg font-semibold">Ничего не найдено</p>
          <p className="text-sm mt-1">Попробуй изменить фильтры</p>
        </div>
      )}
    </div>
  )
}
