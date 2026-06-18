import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Trash2, BookOpen, Compass, Users, Layers, X, GraduationCap } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { accent as getAccent, cn } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { CATEGORY_META } from '../data/courses'
import { OPP_CATEGORY_META, FORMATS } from '../data/opportunities'
import { PageHeader } from '../components/headers'
import StatCard from '../components/StatCard'

// Demo data only (RFC 2606 example.com addresses). Replace with an is_admin()-gated query in production.
const MOCK_USERS = [
  { name: 'Алибек С.', email: 'student1@example.com', grade: 10, courses: 3 },
  { name: 'Динара Қ.', email: 'student2@example.com', grade: 11, courses: 5 },
  { name: 'Ерлан М.', email: 'student3@example.com', grade: 9, courses: 1 },
  { name: 'Аружан Т.', email: 'student4@example.com', grade: 10, courses: 4 },
  { name: 'Санжар Ә.', email: 'student5@example.com', grade: 11, courses: 2 },
]

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-soft dark:text-slate-300">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

export default function Admin() {
  const { t, courses, opportunities, addCourse, deleteCourse, addOpportunity, deleteOpportunity, stats, canAdmin } = useApp()
  const [tab, setTab] = useState('courses')
  const [showForm, setShowForm] = useState(false)

  const [courseForm, setCourseForm] = useState({
    title: '', category: 'math', level: 'Начальный', language: 'ru', hours: 10, description: '',
  })
  const [oppForm, setOppForm] = useState({
    title: '', organization: '', category: 'olympiad', format: 'Онлайн', grades: '9–11', deadline: '2026-09-01', description: '', eligibility: 'Все ученики старших классов',
  })

  if (!canAdmin) return <Navigate to="/" replace />

  const submitCourse = (e) => {
    e.preventDefault()
    addCourse({
      id: `c-custom-${Date.now()}`,
      ...courseForm,
      hours: Number(courseForm.hours) || 8,
      students: 0,
      rating: 5.0,
      tags: ['stem'],
      lessons: [
        {
          id: 'l1',
          title: 'Вводный урок',
          duration: '10 мин',
          points: ['Знакомство с курсом', 'Что вы изучите', 'Как проходить уроки'],
          quiz: { q: 'Готовы начать обучение?', options: ['Да!', 'Конечно', 'Поехали', 'Все варианты верны'], correct: 3 },
        },
      ],
    })
    setCourseForm({ title: '', category: 'math', level: 'Начальный', language: 'ru', hours: 10, description: '' })
    setShowForm(false)
  }

  const submitOpp = (e) => {
    e.preventDefault()
    addOpportunity({
      id: `o-custom-${Date.now()}`,
      ...oppForm,
      tags: ['stem'],
      link: 'https://example.org/apply',
    })
    setOppForm({ title: '', organization: '', category: 'olympiad', format: 'Онлайн', grades: '9–11', deadline: '2026-09-01', description: '', eligibility: 'Все ученики старших классов' })
    setShowForm(false)
  }

  const tabs = [
    { key: 'courses', label: t('admin.courses'), icon: BookOpen },
    { key: 'opps', label: t('admin.opps'), icon: Compass },
    { key: 'users', label: t('admin.users'), icon: Users },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('admin.title')} subtitle={t('admin.subtitle')} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label={t('admin.courses')} value={courses.length} accent="brand" />
        <StatCard icon={Compass} label={t('admin.opps')} value={opportunities.length} accent="amber" />
        <StatCard icon={Users} label={t('admin.users')} value={MOCK_USERS.length} accent="emerald" />
        <StatCard icon={Layers} label="Уроков всего" value={courses.reduce((s, c) => s + (c.lessons?.length || 0), 0)} accent="blue" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowForm(false) }}
              className={cn('px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2', tab === key ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-ink-muted hover:text-ink dark:hover:text-white')}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        {tab !== 'users' && (
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
            {showForm ? <><X className="h-4 w-4" /> {t('admin.cancel')}</> : <><Plus className="h-4 w-4" /> {tab === 'courses' ? t('admin.addCourse') : t('admin.addOpp')}</>}
          </button>
        )}
      </div>

      {/* Add course form */}
      {showForm && tab === 'courses' && (
        <form onSubmit={submitCourse} className="card p-6 grid sm:grid-cols-2 gap-4 animate-scale-in">
          <div className="sm:col-span-2">
            <Field label="Название курса">
              <input required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="input" placeholder="Напр. Основы химии" />
            </Field>
          </div>
          <Field label="Категория">
            <select value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} className="input cursor-pointer">
              {Object.entries(CATEGORY_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Уровень">
            <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })} className="input cursor-pointer">
              {['Начальный', 'Средний', 'Продвинутый'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Язык">
            <select value={courseForm.language} onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })} className="input cursor-pointer">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="Часов">
            <input type="number" value={courseForm.hours} onChange={(e) => setCourseForm({ ...courseForm, hours: e.target.value })} className="input" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Описание">
              <textarea required value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="input min-h-[80px] resize-y" placeholder="Краткое описание курса" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> {t('admin.add')}</button>
          </div>
        </form>
      )}

      {/* Add opportunity form */}
      {showForm && tab === 'opps' && (
        <form onSubmit={submitOpp} className="card p-6 grid sm:grid-cols-2 gap-4 animate-scale-in">
          <div className="sm:col-span-2">
            <Field label="Название">
              <input required value={oppForm.title} onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })} className="input" placeholder="Напр. Олимпиада по химии" />
            </Field>
          </div>
          <Field label="Организатор">
            <input required value={oppForm.organization} onChange={(e) => setOppForm({ ...oppForm, organization: e.target.value })} className="input" placeholder="Напр. НЦТ" />
          </Field>
          <Field label="Категория">
            <select value={oppForm.category} onChange={(e) => setOppForm({ ...oppForm, category: e.target.value })} className="input cursor-pointer">
              {Object.entries(OPP_CATEGORY_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
            </select>
          </Field>
          <Field label="Формат">
            <select value={oppForm.format} onChange={(e) => setOppForm({ ...oppForm, format: e.target.value })} className="input cursor-pointer">
              {FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Классы">
            <input value={oppForm.grades} onChange={(e) => setOppForm({ ...oppForm, grades: e.target.value })} className="input" placeholder="9–11" />
          </Field>
          <Field label="Дедлайн">
            <input type="date" value={oppForm.deadline} onChange={(e) => setOppForm({ ...oppForm, deadline: e.target.value })} className="input cursor-pointer" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Описание">
              <textarea required value={oppForm.description} onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })} className="input min-h-[80px] resize-y" placeholder="Краткое описание возможности" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> {t('admin.add')}</button>
          </div>
        </form>
      )}

      {/* Courses list */}
      {tab === 'courses' && (
        <div className="card divide-y divide-slate-100 dark:divide-white/5">
          {courses.map((c) => {
            const meta = CATEGORY_META[c.category] || { label: c.category, icon: 'Sparkles', accent: 'brand' }
            const Icon = getIcon(meta.icon)
            const a = getAccent(meta.accent)
            return (
              <div key={c.id} className="flex items-center gap-4 p-4">
                <div className={cn('h-10 w-10 rounded-xl grid place-items-center shrink-0', a.iconWrap)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-ink-muted">{meta.label} · {c.level} · {c.lessons?.length || 0} {t('common.lessons')}</p>
                </div>
                <button onClick={() => deleteCourse(c.id)} className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 !px-2" aria-label={t('admin.delete')}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Opportunities list */}
      {tab === 'opps' && (
        <div className="card divide-y divide-slate-100 dark:divide-white/5">
          {opportunities.map((o) => {
            const meta = OPP_CATEGORY_META[o.category] || { label: o.category, icon: 'Sparkles', accent: 'brand' }
            const Icon = getIcon(meta.icon)
            const a = getAccent(meta.accent)
            return (
              <div key={o.id} className="flex items-center gap-4 p-4">
                <div className={cn('h-10 w-10 rounded-xl grid place-items-center shrink-0', a.iconWrap)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink dark:text-white truncate">{o.title}</p>
                  <p className="text-xs text-ink-muted">{meta.label} · {o.organization} · {o.format}</p>
                </div>
                <button onClick={() => deleteOpportunity(o.id)} className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 !px-2" aria-label={t('admin.delete')}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Users list */}
      {tab === 'users' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            Демо-данные — реальные пользователи доступны в Supabase Dashboard.
          </div>
        <div className="card divide-y divide-slate-100 dark:divide-white/5">
          {MOCK_USERS.map((u) => (
            <div key={u.email} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-xl bg-brand-gradient grid place-items-center text-white text-xs font-bold shrink-0">
                {u.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink dark:text-white truncate">{u.name}</p>
                <p className="text-xs text-ink-muted">{u.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-ink dark:text-white">{u.grade} класс</p>
                <p className="text-xs text-ink-muted">{u.courses} курса</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  )
}
