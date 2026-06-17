import { useState } from 'react'
import { Mail, Pencil, Flame, Clock, GraduationCap, CheckCircle2, Lock, Check, X } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { accent as getAccent, cn } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { CATEGORY_META, INTERESTS } from '../data/courses'
import { badges } from '../data/badges'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'

const ANALYTICS_SUBJECTS = ['math', 'cs', 'physics', 'english']

export default function Profile() {
  const { t, user, updateUser, stats, courses, courseProgress } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name, email: user.email })

  const initials = (user.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  const save = () => {
    updateUser(form)
    setEditing(false)
  }

  const subjectProgress = (cat) => {
    const list = courses.filter((c) => c.category === cat)
    if (!list.length) return 0
    return Math.round(list.reduce((sum, c) => sum + courseProgress(c), 0) / list.length)
  }

  const userInterests = INTERESTS.filter((i) => (user.interests || []).includes(i.key))

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="card p-6 sm:p-8 relative overflow-hidden animate-fade-up">
        <div className="absolute inset-x-0 top-0 h-24 bg-brand-gradient opacity-90" />
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="h-24 w-24 rounded-3xl bg-brand-gradient ring-4 ring-white dark:ring-navy-800 grid place-items-center text-white text-3xl font-bold shadow-lift shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 sm:pb-1">
            {editing ? (
              <div className="space-y-2 max-w-sm">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Имя" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="Email" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-ink dark:text-white">{user.name}</h1>
                <p className="text-ink-muted dark:text-slate-400 inline-flex items-center gap-1.5 mt-1">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
                <p className="text-sm text-ink-muted mt-1">{user.grade} класс</p>
              </>
            )}
          </div>
          <div className="sm:pb-1">
            {editing ? (
              <div className="flex gap-2">
                <button onClick={save} className="btn-primary"><Check className="h-4 w-4" /> Сохранить</button>
                <button onClick={() => setEditing(false)} className="btn-secondary"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => { setForm({ name: user.name, email: user.email }); setEditing(true) }} className="btn-secondary">
                <Pencil className="h-4 w-4" /> {t('profile.edit')}
              </button>
            )}
          </div>
        </div>

        {userInterests.length > 0 && !editing && (
          <div className="relative flex flex-wrap gap-2 mt-5">
            {userInterests.map((i) => (
              <span key={i.key} className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{i.label}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label={t('stats.completed')} value={stats.completedCourses} accent="brand" />
        <StatCard icon={Clock} label={t('stats.hours')} value={stats.hours} accent="blue" />
        <StatCard icon={Flame} label={t('stats.streak')} value={stats.streak} accent="amber" />
        <StatCard icon={CheckCircle2} label={t('stats.lessonsDone')} value={stats.completedLessons} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Analytics */}
        <div className="card p-6">
          <h2 className="font-bold text-ink dark:text-white mb-5">{t('profile.analytics')}</h2>
          <div className="space-y-4">
            {ANALYTICS_SUBJECTS.map((cat) => {
              const meta = CATEGORY_META[cat]
              const Icon = getIcon(meta.icon)
              const a = getAccent(meta.accent)
              const p = subjectProgress(cat)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink dark:text-white inline-flex items-center gap-2">
                      <span className={cn('h-6 w-6 rounded-lg grid place-items-center', a.iconWrap)}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold text-ink-muted">{p}%</span>
                  </div>
                  <ProgressBar value={p} accent={meta.accent} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="card p-6">
          <h2 className="font-bold text-ink dark:text-white mb-5">{t('profile.badges')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => {
              const unlocked = b.check(stats)
              const Icon = getIcon(b.icon)
              const a = getAccent(b.accent)
              return (
                <div
                  key={b.id}
                  className={cn(
                    'rounded-2xl p-3 text-center border transition-colors',
                    unlocked ? 'border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800' : 'border-dashed border-slate-200 dark:border-white/10 opacity-50',
                  )}
                  title={b.description}
                >
                  <div className={cn('h-12 w-12 rounded-2xl grid place-items-center mx-auto', unlocked ? a.iconWrap : 'bg-slate-100 dark:bg-white/5 text-slate-400')}>
                    {unlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <p className="text-xs font-semibold text-ink dark:text-white mt-2 leading-tight">{b.title}</p>
                  <p className="text-[10px] text-ink-muted mt-0.5 leading-tight">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
