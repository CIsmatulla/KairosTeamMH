import { Link } from 'react-router-dom'
import { PlayCircle, GraduationCap, Clock, Flame, CheckCircle2, CalendarClock, Sparkles } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { accent as getAccent, cn, deadlineInfo } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { CATEGORY_META } from '../data/courses'
import { OPP_CATEGORY_META } from '../data/opportunities'
import StatCard from '../components/StatCard'
import CourseCard from '../components/CourseCard'
import OpportunityCard from '../components/OpportunityCard'
import ProgressBar from '../components/ProgressBar'
import { SectionTitle } from '../components/headers'

function HeroContinue({ course }) {
  const { courseProgress, t } = useApp()
  if (!course) return null
  const meta = CATEGORY_META[course.category]
  const a = getAccent(meta.accent)
  const Icon = getIcon(meta.icon)
  const progress = courseProgress(course)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy-800 text-white p-6 sm:p-8 shadow-soft animate-fade-up">
      <div className={cn('absolute inset-0 opacity-90 bg-gradient-to-br', a.grad)} />
      <div className="absolute -right-8 -bottom-8 opacity-20">
        <Icon className="h-48 w-48" strokeWidth={1} />
      </div>
      <div className="relative">
        <span className="chip bg-white/20 text-white backdrop-blur-sm">{t('dash.continueLearning')}</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-4 max-w-md leading-tight">{course.title}</h2>
        <p className="text-white/80 mt-2 text-sm max-w-md line-clamp-2">{course.description}</p>

        <div className="mt-6 max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">{meta.label}</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="btn bg-white text-brand-700 px-6 py-3 mt-6 hover:bg-white/90 shadow-lg"
        >
          <PlayCircle className="h-5 w-5" />
          {progress > 0 ? t('common.continue') : t('common.enroll')}
        </Link>
      </div>
    </div>
  )
}

function DeadlinesPanel({ items }) {
  const { t } = useApp()
  return (
    <div className="card p-5 animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="h-5 w-5 text-amber-500" />
        <h3 className="font-bold text-ink dark:text-white">{t('dash.deadlines')}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((opp) => {
          const meta = OPP_CATEGORY_META[opp.category]
          const a = getAccent(meta.accent)
          const Icon = getIcon(meta.icon)
          const { label, days } = deadlineInfo(opp.deadline)
          const urgent = days <= 14
          return (
            <Link
              to="/opportunities"
              key={opp.id}
              className="flex items-center gap-3 group p-2 -m-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className={cn('h-9 w-9 rounded-xl grid place-items-center shrink-0', a.iconWrap)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {opp.title}
                </p>
                <p className="text-xs text-ink-muted">{opp.organization}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn('text-xs font-semibold', urgent ? 'text-amber-600 dark:text-amber-400' : 'text-ink-soft dark:text-slate-300')}>
                  {label}
                </p>
                <p className="text-[10px] text-ink-muted">{days} {t('common.daysLeft')}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t, user, stats, recommendedCourses, recommendedOpportunities, courseProgress } = useApp()

  const inProgress = recommendedCourses.find((c) => {
    const p = courseProgress(c)
    return p > 0 && p < 100
  })
  const featured = inProgress || recommendedCourses[0]
  const deadlineItems = [...recommendedOpportunities]
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="text-sm text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-brand-500" />
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white mt-1">
          {t('dash.greeting')}, {user.name}! 👋
        </h1>
        <p className="text-ink-muted dark:text-slate-400 mt-1">{t('dash.subtitle')}</p>
      </div>

      {/* Hero + deadlines */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeroContinue course={featured} />
        </div>
        <DeadlinesPanel items={deadlineItems} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label={t('stats.completed')} value={stats.completedCourses} accent="brand" />
        <StatCard icon={Clock} label={t('stats.hours')} value={stats.hours} accent="blue" />
        <StatCard icon={Flame} label={t('stats.streak')} value={stats.streak} accent="amber" />
        <StatCard icon={CheckCircle2} label={t('stats.lessonsDone')} value={stats.completedLessons} accent="emerald" />
      </div>

      {/* Recommended courses */}
      <section>
        <SectionTitle title={t('dash.recommendedCourses')} to="/courses" linkLabel={t('common.viewAll')} />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommendedCourses.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* Opportunities */}
      <section>
        <SectionTitle title={t('dash.opportunities')} to="/opportunities" linkLabel={t('common.viewAll')} />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommendedOpportunities.slice(0, 3).map((o) => (
            <OpportunityCard key={o.id} opp={o} />
          ))}
        </div>
      </section>
    </div>
  )
}
