import { Link } from 'react-router-dom'
import { Bookmark, BookOpen, Compass } from 'lucide-react'
import { useApp } from '../store/AppContext'
import CourseCard from '../components/CourseCard'
import OpportunityCard from '../components/OpportunityCard'
import { PageHeader, SectionTitle } from '../components/headers'

export default function Bookmarks() {
  const { t, courses, opportunities, saved, isEnrolled } = useApp()
  const myCourses = courses.filter((c) => isEnrolled(c.id))
  const mySaved = opportunities.filter((o) => saved.includes(o.id))

  const empty = myCourses.length === 0 && mySaved.length === 0

  return (
    <div className="space-y-8">
      <PageHeader title={t('nav.bookmarks')} subtitle="Твои курсы и сохранённые возможности" />

      {empty && (
        <div className="text-center py-16 text-ink-muted dark:text-slate-400">
          <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-semibold text-ink dark:text-white">Здесь пока пусто</p>
          <p className="text-sm mt-1 mb-5">Начни курс или сохрани возможность, чтобы вернуться к ним позже</p>
          <div className="flex gap-3 justify-center">
            <Link to="/courses" className="btn-primary">К курсам</Link>
            <Link to="/opportunities" className="btn-secondary">К возможностям</Link>
          </div>
        </div>
      )}

      {myCourses.length > 0 && (
        <section>
          <SectionTitle title={`${t('nav.courses')} в процессе`} to="/courses" linkLabel={t('common.viewAll')} />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {myCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}

      {mySaved.length > 0 && (
        <section>
          <SectionTitle title="Сохранённые возможности" to="/opportunities" linkLabel={t('common.viewAll')} />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {mySaved.map((o) => (
              <OpportunityCard key={o.id} opp={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
