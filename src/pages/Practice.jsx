import { useMemo, useState } from 'react'
import { CheckCircle2, Circle, RotateCcw, Trophy, Dumbbell, ChevronRight } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { accent as getAccent, cn } from '../lib/ui'
import { CATEGORY_META } from '../data/courses'
import { PageHeader } from '../components/headers'
import ProgressBar from '../components/ProgressBar'

export default function Practice() {
  const { t, courses } = useApp()

  const questions = useMemo(() => {
    const all = []
    courses.forEach((c) => {
      (c.lessons || []).forEach((l) => {
        all.push({ ...l.quiz, category: c.category, course: c.title, lesson: l.title })
      })
    })
    return all
  }, [courses])

  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[idx]
  const meta = q ? CATEGORY_META[q.category] : null
  const a = getAccent(meta?.accent || 'brand')
  const isCorrect = checked && selected === q?.correct
  const progress = Math.round((idx / questions.length) * 100)

  const check = () => {
    setChecked(true)
    if (selected === q.correct) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1)
      setSelected(null)
      setChecked(false)
    } else {
      setFinished(true)
    }
  }
  const restart = () => {
    setIdx(0); setSelected(null); setChecked(false); setScore(0); setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div>
        <PageHeader title={t('nav.practice')} subtitle="Закрепляй знания через мини-тесты" />
        <div className="card p-8 text-center max-w-md mx-auto bg-brand-gradient border-0 text-white animate-scale-in">
          <Trophy className="h-16 w-16 mx-auto text-amber-300 fill-amber-300" />
          <h2 className="text-2xl font-bold mt-4">Тест завершён!</h2>
          <p className="text-5xl font-extrabold mt-4">{score}/{questions.length}</p>
          <p className="text-white/80 mt-2">Правильных ответов: {pct}%</p>
          <button onClick={restart} className="btn bg-white text-brand-700 px-6 py-3 mt-6 hover:bg-white/90">
            <RotateCcw className="h-4 w-4" /> Пройти заново
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('nav.practice')} subtitle="Закрепляй знания через мини-тесты" />

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-ink-muted dark:text-slate-400 inline-flex items-center gap-1.5">
            <Dumbbell className="h-4 w-4" /> Вопрос {idx + 1} из {questions.length}
          </span>
          <span className="font-semibold text-ink dark:text-white">Счёт: {score}</span>
        </div>
        <ProgressBar value={progress} className="mb-6" />

        <div className="card p-6 sm:p-8">
          <span className={cn('chip', a.chip)}>{meta?.label} · {q.course}</span>
          <p className="text-xl font-bold text-ink dark:text-white mt-4 mb-6">{q.q}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isSel = selected === i
              const showCorrect = checked && i === q.correct
              const showWrong = checked && isSel && i !== q.correct
              return (
                <button
                  key={i}
                  onClick={() => !checked && setSelected(i)}
                  disabled={checked}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border-2 transition-colors flex items-center gap-3 font-medium',
                    showCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                    showWrong && 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
                    !checked && isSel && 'border-brand-500 bg-brand-50 dark:bg-brand-500/10',
                    !checked && !isSel && 'border-slate-200 dark:border-white/10 hover:border-brand-300',
                    checked && !showCorrect && !showWrong && 'opacity-60 border-slate-200 dark:border-white/10',
                  )}
                >
                  <span className={cn(
                    'h-6 w-6 rounded-full grid place-items-center text-xs font-bold shrink-0 border-2',
                    showCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : showWrong ? 'border-red-500 bg-red-500 text-white' : isSel ? 'border-brand-500 text-brand-600' : 'border-slate-300 text-ink-muted',
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {checked && (
            <div className={cn(
              'mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-scale-in',
              isCorrect ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
            )}>
              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              {isCorrect ? t('learning.correct') : t('learning.wrong')}
            </div>
          )}

          <div className="mt-6">
            {!checked ? (
              <button onClick={check} disabled={selected === null} className="btn-primary w-full">
                {t('learning.check')}
              </button>
            ) : (
              <button onClick={next} className="btn-primary w-full">
                {idx < questions.length - 1 ? <>Следующий вопрос <ChevronRight className="h-4 w-4" /></> : 'Завершить тест'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
