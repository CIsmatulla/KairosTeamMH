import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowRight, Check, Sparkles, Trophy, Rocket, Briefcase } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { cn } from '../lib/ui'
import { getIcon } from '../lib/icons'
import { INTERESTS } from '../data/courses'

const GRADES = ['8', '9', '10', '11']
const GOALS = [
  { key: 'university', label: 'Поступить в университет', icon: GraduationCap },
  { key: 'olympiad', label: 'Побеждать в олимпиадах', icon: Trophy },
  { key: 'skills', label: 'Получить новые навыки', icon: Rocket },
  { key: 'career', label: 'Построить карьеру', icon: Briefcase },
]

export default function Onboarding() {
  const { t, completeOnboarding, user } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(user.name || '')
  const [grade, setGrade] = useState(user.grade || '10')
  const [interests, setInterests] = useState(user.interests || [])
  const [goal, setGoal] = useState(user.goal || 'university')

  const toggleInterest = (key) =>
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const finish = () => {
    completeOnboarding({ name: name.trim() || 'Ученик', grade, interests, goal })
    navigate('/')
  }

  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? interests.length > 0 : true

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10 bg-navy-50 dark:bg-navy-900 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-brand-gradient grid place-items-center shadow-lift">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-ink dark:text-white">
            Mentoria <span className="text-brand-500">Hub</span>
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((s) => (
            <span key={s} className={cn('h-2 rounded-full transition-[width,background-color] duration-300', s === step ? 'w-8 bg-brand-500' : s < step ? 'w-2 bg-brand-300' : 'w-2 bg-slate-200 dark:bg-white/10')} />
          ))}
        </div>

        <div className="card p-6 sm:p-8 shadow-soft animate-scale-in">
          {/* Step 0: welcome + grade */}
          {step === 0 && (
            <div>
              <div className="inline-flex items-center gap-2 chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> {t('onb.welcome')}
              </div>
              <h1 className="text-2xl font-bold text-ink dark:text-white">{t('onb.intro')}</h1>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-ink-soft dark:text-slate-300">Как тебя зовут?</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input mt-2" placeholder="Твоё имя" autoFocus />
                </label>
                <div>
                  <span className="text-sm font-semibold text-ink-soft dark:text-slate-300">{t('onb.grade')}</span>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={cn('rounded-xl border-2 py-3 font-bold transition-colors', grade === g ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'border-slate-200 dark:border-white/10 text-ink dark:text-white hover:border-brand-300')}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: interests */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-ink dark:text-white">{t('onb.interests')}</h1>
              <p className="text-sm text-ink-muted mt-1">{t('onb.pickMany')}</p>
              <div className="grid grid-cols-2 gap-2.5 mt-6">
                {INTERESTS.map((i) => {
                  const active = interests.includes(i.key)
                  return (
                    <button
                      key={i.key}
                      onClick={() => toggleInterest(i.key)}
                      className={cn('rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors flex items-center justify-between gap-2', active ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-white/10 text-ink dark:text-white hover:border-brand-300')}
                    >
                      {i.label}
                      {active && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: goal */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-ink dark:text-white">{t('onb.goals')}</h1>
              <div className="space-y-2.5 mt-6">
                {GOALS.map((g) => {
                  const active = goal === g.key
                  const Icon = g.icon
                  return (
                    <button
                      key={g.key}
                      onClick={() => setGoal(g.key)}
                      className={cn('w-full rounded-xl border-2 px-4 py-3.5 text-left font-medium transition-colors flex items-center gap-3', active ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-slate-200 dark:border-white/10 text-ink dark:text-white hover:border-brand-300')}
                    >
                      <span className={cn('h-9 w-9 rounded-xl grid place-items-center shrink-0', active ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-ink-muted')}>
                        <Icon className="h-4 w-4" />
                      </span>
                      {g.label}
                      {active && <Check className="h-4 w-4 ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-secondary">Назад</button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="btn-primary flex-1">
                {t('onb.next')} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={finish} className="btn-primary flex-1">
                {t('onb.start')} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
