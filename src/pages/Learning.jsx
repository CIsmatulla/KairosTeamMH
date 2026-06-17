import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Play, CheckCircle2, Circle, ChevronLeft, ChevronRight, Lightbulb, Trophy, ArrowLeft,
  HelpCircle, GraduationCap, Dumbbell, NotebookPen, Sigma, MessageCircleQuestion, Plus, Trash2, RotateCcw,
} from 'lucide-react'
import { useApp } from '../store/AppContext'
import { accent as getAccent, cn } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { CATEGORY_META } from '../data/courses'
import { useStudyTimer } from '../hooks/useStudyTimer'
import ProgressBar from '../components/ProgressBar'

const TABS = [
  { key: 'learn', label: 'Обучение', icon: GraduationCap },
  { key: 'test', label: 'Проверка знаний', icon: Dumbbell },
  { key: 'practice', label: 'Моя практика', icon: NotebookPen },
]

const NOTE_KINDS = [
  { key: 'formula', label: 'Формула', icon: Sigma },
  { key: 'note', label: 'Заметка', icon: NotebookPen },
  { key: 'question', label: 'Свой вопрос', icon: MessageCircleQuestion },
]

/* ---------- shared quiz option button ---------- */
function Option({ i, text, selected, checked, correct }) {
  const showCorrect = checked && correct
  const showWrong = checked && selected && !correct
  return (
    <span
      className={cn(
        'w-full text-left px-4 py-3 rounded-xl border-2 flex items-center gap-3 font-medium',
        showCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        showWrong && 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
        !checked && selected && 'border-brand-500 bg-brand-50 dark:bg-brand-500/10',
        !checked && !selected && 'border-slate-200 dark:border-white/10',
        checked && !showCorrect && !showWrong && 'border-slate-200 dark:border-white/10 opacity-60',
      )}
    >
      <span className={cn('h-6 w-6 rounded-full grid place-items-center text-xs font-bold shrink-0 border-2',
        showCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : showWrong ? 'border-red-500 bg-red-500 text-white' : selected ? 'border-brand-500 text-brand-600' : 'border-slate-300 text-ink-muted')}>
        {String.fromCharCode(65 + i)}
      </span>
      {text}
    </span>
  )
}

/* ---------- knowledge check (whole course, no progress impact) ---------- */
function CourseTest({ course, accentKey, t }) {
  const questions = (course.lessons || []).map((l) => ({ ...l.quiz, lesson: l.title }))
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  if (!questions.length) return <div className="card p-6 text-ink-muted">В этом курсе пока нет вопросов.</div>
  const q = questions[idx]
  const isCorrect = checked && sel === q.correct

  if (done) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto bg-brand-gradient border-0 text-white animate-scale-in">
        <Trophy className="h-14 w-14 mx-auto text-amber-300 fill-amber-300" />
        <h3 className="text-xl font-bold mt-3">Готово!</h3>
        <p className="text-4xl font-extrabold mt-3">{score}/{questions.length}</p>
        <p className="text-white/80 mt-1">Это самопроверка — на прогресс курса не влияет</p>
        <button onClick={() => { setIdx(0); setSel(null); setChecked(false); setScore(0); setDone(false) }} className="btn bg-white text-brand-700 px-6 py-3 mt-5 hover:bg-white/90">
          <RotateCcw className="h-4 w-4" /> Ещё раз
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-ink-muted dark:text-slate-400">Вопрос {idx + 1} из {questions.length}</span>
        <span className="font-semibold text-ink dark:text-white">Счёт: {score}</span>
      </div>
      <ProgressBar value={Math.round((idx / questions.length) * 100)} accent={accentKey} className="mb-5" />
      <div className="card p-6">
        <p className="text-xs text-ink-muted mb-2">Самопроверка · не влияет на прогресс</p>
        <p className="text-lg font-bold text-ink dark:text-white mb-4">{q.q}</p>
        <div className="space-y-2.5">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => !checked && setSel(i)} disabled={checked} className="block w-full">
              <Option i={i} text={opt} selected={sel === i} checked={checked} correct={i === q.correct} />
            </button>
          ))}
        </div>
        {checked && (
          <div className={cn('mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2', isCorrect ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300')}>
            {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            {isCorrect ? t('learning.correct') : t('learning.wrong')}
          </div>
        )}
        <div className="mt-5">
          {!checked ? (
            <button onClick={() => { setChecked(true); if (sel === q.correct) setScore((s) => s + 1) }} disabled={sel === null} className="btn-primary w-full">
              {t('learning.check')}
            </button>
          ) : (
            <button onClick={() => { if (idx < questions.length - 1) { setIdx(idx + 1); setSel(null); setChecked(false) } else setDone(true) }} className="btn-primary w-full">
              {idx < questions.length - 1 ? <>Следующий <ChevronRight className="h-4 w-4" /></> : 'Завершить'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- personal practice notes ---------- */
function PracticeNotes({ course }) {
  const { notesForCourse, addNote, deleteNote } = useApp()
  const notes = notesForCourse(course.id)
  const [kind, setKind] = useState('formula')
  const [content, setContent] = useState('')
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setBusy(true)
    await addNote(course.id, { kind, content: content.trim(), answer: answer.trim() || null })
    setContent(''); setAnswer(''); setBusy(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="card p-6 h-fit">
        <h3 className="font-bold text-ink dark:text-white mb-1">Добавить в практику</h3>
        <p className="text-sm text-ink-muted mb-4">Сохраняй формулы, заметки или придумывай свои вопросы для повторения.</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {NOTE_KINDS.map((k) => {
            const Icon = k.icon
            return (
              <button type="button" key={k.key} onClick={() => setKind(k.key)}
                className={cn('rounded-xl border-2 py-2.5 text-xs font-semibold flex flex-col items-center gap-1 transition-colors', kind === k.key ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-white/10 text-ink-muted hover:border-brand-300')}>
                <Icon className="h-4 w-4" />
                {k.label}
              </button>
            )
          })}
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input min-h-[90px] resize-y" placeholder={kind === 'formula' ? 'Напр. E = mc²' : kind === 'question' ? 'Твой вопрос' : 'Текст заметки'} />
        {kind === 'question' && (
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="input min-h-[60px] resize-y mt-2" placeholder="Ответ (необязательно)" />
        )}
        <button type="submit" disabled={busy || !content.trim()} className="btn-primary w-full mt-3">
          <Plus className="h-4 w-4" /> Добавить
        </button>
      </form>

      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="card p-6 text-center text-ink-muted">
            <NotebookPen className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Пока пусто. Добавь первую формулу или вопрос.</p>
          </div>
        )}
        {notes.map((n) => {
          const meta = NOTE_KINDS.find((k) => k.key === n.kind) || NOTE_KINDS[1]
          const Icon = meta.icon
          return (
            <div key={n.id} className="card p-4 flex items-start gap-3">
              <span className="h-8 w-8 rounded-lg grid place-items-center shrink-0 bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-muted">{meta.label}</p>
                <p className="text-ink dark:text-white whitespace-pre-wrap break-words">{n.content}</p>
                {n.answer && <p className="text-sm text-ink-muted mt-1 whitespace-pre-wrap break-words">Ответ: {n.answer}</p>}
              </div>
              <button onClick={() => deleteNote(course.id, n.id)} className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 !px-2" aria-label="Удалить">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Learning() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { courses, t, isLessonDone, toggleLesson, courseProgress, enroll } = useApp()
  useStudyTimer()
  const course = courses.find((c) => c.id === id)

  const [tab, setTab] = useState('learn')
  const [activeIdx, setActiveIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (course) enroll(course.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => {
    setSelected(null)
    setChecked(false)
  }, [activeIdx])

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-ink dark:text-white">Курс не найден</p>
        <Link to="/courses" className="btn-primary mt-4 inline-flex">К каталогу</Link>
      </div>
    )
  }

  const meta = CATEGORY_META[course.category] || { label: course.category, icon: 'Sparkles', accent: 'brand' }
  const a = getAccent(meta.accent)
  const Icon = getIcon(meta.icon)
  const lessons = course.lessons || []
  const lesson = lessons[activeIdx] || lessons[0]
  const progress = courseProgress(course)
  const done = lesson && isLessonDone(course.id, lesson.id)
  const isCorrect = checked && lesson && selected === lesson.quiz.correct
  const courseComplete = progress === 100

  const completeLesson = () => {
    if (lesson && !done) toggleLesson(course.id, lesson.id)
    if (activeIdx < lessons.length - 1) setActiveIdx((i) => i + 1)
  }

  return (
    <div>
      <button onClick={() => navigate('/courses')} className="btn-ghost text-sm mb-4 -ml-2">
        <ArrowLeft className="h-4 w-4" /> {t('courses.title')}
      </button>

      {/* Course header + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn('h-11 w-11 rounded-2xl grid place-items-center shrink-0', a.iconWrap)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-ink dark:text-white truncate">{course.title}</h1>
            <p className="text-xs text-ink-muted">{meta.label} · {lessons.length} {t('common.lessons')} · {course.hours} ч</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-6 w-fit">
        {TABS.map(({ key, label, icon: TabIcon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors', tab === key ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-ink-muted hover:text-ink dark:hover:text-white')}>
            <TabIcon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'test' && <CourseTest course={course} accentKey={meta.accent} t={t} />}
      {tab === 'practice' && <PracticeNotes course={course} />}

      {tab === 'learn' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={cn('relative aspect-video rounded-3xl overflow-hidden grid place-items-center bg-gradient-to-br shadow-soft', a.grad)}>
              <Icon className="absolute right-6 bottom-6 h-32 w-32 text-white/10" strokeWidth={1} />
              <button className="relative h-20 w-20 rounded-full bg-white/90 grid place-items-center shadow-2xl hover:scale-105 transition-transform">
                <Play className="h-8 w-8 text-brand-600 fill-brand-600 ml-1" />
              </button>
              <span className="absolute bottom-4 left-4 chip bg-black/30 text-white backdrop-blur-sm">{lesson?.duration}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-ink-muted dark:text-slate-400">
                <span className={cn('chip', a.chip)}>{meta.label}</span>
                <span>Урок {activeIdx + 1} из {lessons.length}</span>
              </div>
              <h2 className="text-2xl font-bold text-ink dark:text-white mt-3">{lesson?.title}</h2>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold text-ink dark:text-white">{t('learning.keyPoints')}</h2>
              </div>
              <ul className="space-y-3">
                {(lesson?.points || []).map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={cn('h-6 w-6 rounded-lg grid place-items-center text-xs font-bold shrink-0 mt-0.5', a.iconWrap)}>{i + 1}</span>
                    <span className="text-ink-soft dark:text-slate-300">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lesson?.quiz && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-brand-500" />
                  <h2 className="font-bold text-ink dark:text-white">{t('learning.quiz')}</h2>
                </div>
                <p className="font-medium text-ink dark:text-white mb-4">{lesson.quiz.q}</p>
                <div className="space-y-2.5">
                  {lesson.quiz.options.map((opt, i) => (
                    <button key={i} onClick={() => !checked && setSelected(i)} disabled={checked} className="block w-full">
                      <Option i={i} text={opt} selected={selected === i} checked={checked} correct={i === lesson.quiz.correct} />
                    </button>
                  ))}
                </div>
                {checked && (
                  <div className={cn('mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-scale-in', isCorrect ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300')}>
                    {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    {isCorrect ? t('learning.correct') : t('learning.wrong')}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mt-5">
                  {!checked ? (
                    <button onClick={() => setChecked(true)} disabled={selected === null} className="btn-primary">{t('learning.check')}</button>
                  ) : (
                    <button onClick={() => { setChecked(false); setSelected(null) }} className="btn-secondary">Ещё раз</button>
                  )}
                  <button onClick={completeLesson} className={done ? 'btn-secondary' : 'btn-primary'}>
                    {done ? <><CheckCircle2 className="h-4 w-4" /> {t('learning.completed')}</> : t('learning.complete')}
                  </button>
                </div>
              </div>
            )}

            {courseComplete && (
              <div className="card p-6 bg-brand-gradient border-0 text-white text-center animate-scale-in">
                <Trophy className="h-12 w-12 mx-auto text-amber-300 fill-amber-300" />
                <h3 className="text-xl font-bold mt-3">Поздравляем! 🎉</h3>
                <p className="text-white/80 mt-1">Ты завершил курс «{course.title}» и получил сертификат</p>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setActiveIdx((i) => Math.max(0, i - 1))} disabled={activeIdx === 0} className="btn-secondary">
                <ChevronLeft className="h-4 w-4" /> {t('learning.prev')}
              </button>
              <button onClick={() => setActiveIdx((i) => Math.min(lessons.length - 1, i + 1))} disabled={activeIdx === lessons.length - 1} className="btn-secondary">
                {t('learning.next')} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-5 lg:sticky lg:top-20">
              <div className="flex items-center gap-3 mb-1">
                <ProgressBar value={progress} accent={meta.accent} className="flex-1" />
                <span className="text-sm font-semibold text-ink dark:text-white">{progress}%</span>
              </div>
              <p className="text-xs text-ink-muted mb-4">Прогресс курса</p>
              <div className="space-y-1.5">
                {lessons.map((ls, i) => {
                  const lessonDone = isLessonDone(course.id, ls.id)
                  const active = i === activeIdx
                  return (
                    <button key={ls.id} onClick={() => setActiveIdx(i)}
                      className={cn('w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-colors', active ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5')}>
                      {lessonDone ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Circle className={cn('h-5 w-5 shrink-0', active ? 'text-brand-500' : 'text-slate-300 dark:text-slate-600')} />}
                      <div className="min-w-0">
                        <p className={cn('text-sm font-medium truncate', active ? 'text-brand-700 dark:text-brand-300' : 'text-ink dark:text-white')}>{ls.title}</p>
                        <p className="text-xs text-ink-muted">{ls.duration}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
