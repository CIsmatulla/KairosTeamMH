import { Sun, Moon, Languages, Trash2, RefreshCw, Globe } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { cn } from '../lib/ui'
import { LANGUAGES } from '../i18n/translations'
import { PageHeader } from '../components/headers'

export default function Settings() {
  const { t, theme, setTheme, lang, setLang, resetOnboarding } = useApp()

  const clearData = () => {
    localStorage.removeItem('mentoria_state_v1')
    window.location.href = '/'
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title={t('nav.settings')} subtitle="Настрой платформу под себя" />

      <div className="space-y-6">
        {/* Appearance */}
        <div className="card p-6">
          <h2 className="font-bold text-ink dark:text-white mb-4">Внешний вид</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={cn('rounded-2xl border-2 p-4 text-left transition-colors', theme === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-white/10 hover:border-brand-300')}
            >
              <Sun className="h-6 w-6 text-amber-500" />
              <p className="font-semibold text-ink dark:text-white mt-2">Светлая тема</p>
              <p className="text-xs text-ink-muted mt-0.5">Яркий и чистый интерфейс</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn('rounded-2xl border-2 p-4 text-left transition-colors', theme === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-white/10 hover:border-brand-300')}
            >
              <Moon className="h-6 w-6 text-brand-400" />
              <p className="font-semibold text-ink dark:text-white mt-2">Тёмная тема</p>
              <p className="text-xs text-ink-muted mt-0.5">Комфортно для глаз вечером</p>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="card p-6">
          <h2 className="font-bold text-ink dark:text-white mb-1 inline-flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-500" /> Язык интерфейса
          </h2>
          <p className="text-sm text-ink-muted mb-4">Платформа доступна на трёх языках</p>
          <div className="grid grid-cols-3 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn('rounded-2xl border-2 p-3 text-center transition-colors', lang === l.code ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-white/10 hover:border-brand-300')}
              >
                <p className="font-bold text-ink dark:text-white">{l.label}</p>
                <p className="text-xs text-ink-muted mt-0.5">{l.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="card p-6">
          <h2 className="font-bold text-ink dark:text-white mb-4">Данные</h2>
          <div className="space-y-3">
            <button onClick={() => { resetOnboarding(); window.location.href = '/' }} className="btn-secondary w-full justify-start">
              <RefreshCw className="h-4 w-4" /> Пройти онбординг заново
            </button>
            <button onClick={clearData} className="btn w-full justify-start px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" /> Сбросить весь прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
