import { Link } from 'react-router-dom'
import { Star, Users, PlayCircle, BookOpen } from 'lucide-react'
import { accent as getAccent, cn } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { CATEGORY_META } from '../data/courses'
import { useApp } from '../store/AppContext'
import ProgressBar from './ProgressBar'

export default function CourseCard({ course }) {
  const { courseProgress, t } = useApp()
  const meta = CATEGORY_META[course.category] || { label: course.category, icon: 'Sparkles', accent: 'brand' }
  const a = getAccent(meta.accent)
  const Icon = getIcon(meta.icon)
  const progress = courseProgress(course)

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group card card-hover overflow-hidden flex flex-col ring-1 ring-transparent"
    >
      {/* Thumbnail / illustration banner */}
      <div className={cn('relative h-28 bg-gradient-to-br grid place-items-center overflow-hidden', a.grad)}>
        <Icon className="h-12 w-12 text-white/90" strokeWidth={1.5} />
        <Icon className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" strokeWidth={1} />
        <span className="absolute top-3 left-3 chip bg-white/85 text-ink backdrop-blur-sm">
          {course.level}
        </span>
        <span className="absolute top-3 right-3 chip bg-black/20 text-white backdrop-blur-sm uppercase">
          {course.language}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className={cn('chip self-start mb-2', a.chip)}>{meta.label}</span>
        <h3 className="font-semibold text-ink dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-ink-muted dark:text-slate-400 mt-1.5 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-ink-muted dark:text-slate-400 mt-4">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            {course.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course.students.toLocaleString('ru-RU')}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons?.length || 0} {t('common.lessons')}
          </span>
        </div>

        {progress > 0 ? (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-ink-muted dark:text-slate-400">Прогресс</span>
              <span className="font-semibold text-ink dark:text-white">{progress}%</span>
            </div>
            <ProgressBar value={progress} accent={meta.accent} />
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300">
            <PlayCircle className="h-4 w-4" />
            {t('common.enroll')}
          </div>
        )}
      </div>
    </Link>
  )
}
