import { useState } from 'react'
import { GraduationCap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { cn } from '../lib/ui'

export default function Auth() {
  const { signIn, signUp, continueAsGuest } = useApp()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fn = mode === 'login' ? signIn(email, password) : signUp(email, password, name.trim() || 'Ученик')
    const { error: err } = await fn
    setLoading(false)
    // generic messages — avoid leaking which field was wrong (account enumeration)
    if (err) setError(mode === 'login' ? 'Неверный email или пароль.' : 'Не удалось зарегистрироваться — возможно, email уже занят или пароль слишком простой.')
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10 bg-navy-50 dark:bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-brand-gradient grid place-items-center shadow-lift">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-ink dark:text-white">
            Mentoria <span className="text-brand-500">Hub</span>
          </span>
        </div>

        <div className="card p-6 sm:p-8 shadow-soft animate-scale-in">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-6">
            {[
              { k: 'login', l: 'Вход' },
              { k: 'signup', l: 'Регистрация' },
            ].map((tb) => (
              <button
                key={tb.k}
                onClick={() => { setMode(tb.k); setError('') }}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  mode === tb.k ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-300 shadow-sm' : 'text-ink-muted hover:text-ink dark:hover:text-white',
                )}
              >
                {tb.l}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-bold text-ink dark:text-white">
            {mode === 'login' ? 'С возвращением!' : 'Создай аккаунт'}
          </h1>
          <p className="text-sm text-ink-muted mt-1 mb-5">
            {mode === 'login' ? 'Войди, чтобы продолжить обучение' : 'Прогресс и достижения сохранятся в облаке'}
          </p>

          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input className="input pl-10" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input type="email" required className="input pl-10" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type={showPw ? 'text' : 'password'}
                required
                minLength={8}
                className="input pl-10 pr-10"
                placeholder="Пароль (мин. 8 символов)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="text-xs text-ink-muted">или</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <button onClick={continueAsGuest} className="btn-secondary w-full">
            Продолжить как гость
          </button>
          <p className="text-xs text-ink-muted text-center mt-3">
            Гость может смотреть курсы и возможности; прогресс хранится только в этом браузере.
          </p>
        </div>
      </div>
    </div>
  )
}
