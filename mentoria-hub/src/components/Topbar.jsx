import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, ChevronDown, User, Settings, LogOut, GraduationCap } from 'lucide-react'
import { cn } from '../lib/ui'
import { useApp } from '../store/AppContext'
import { LANGUAGES } from '../i18n/translations'

export default function Topbar() {
  const { t, theme, toggleTheme, lang, setLang, user, resetOnboarding, cloud, signOut } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const initials = (user.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl">
      {/* Mobile logo */}
      <Link to="/" className="lg:hidden flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-brand-gradient grid place-items-center">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-ink dark:text-white">Mentoria</span>
      </Link>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <input className="input pl-10" placeholder={t('common.search')} aria-label="search" />
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Language switcher */}
      <div className="hidden xs:flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-1">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors',
              lang === l.code
                ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-300 shadow-sm'
                : 'text-ink-muted hover:text-ink dark:hover:text-white',
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="btn-ghost h-10 w-10 !px-0" aria-label="toggle theme">
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Notifications */}
      <button className="btn-ghost h-10 w-10 !px-0 relative" aria-label="notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
      </button>

      {/* Avatar dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <div className="h-8 w-8 rounded-lg bg-brand-gradient grid place-items-center text-white text-xs font-bold">
            {initials}
          </div>
          <ChevronDown className="h-4 w-4 text-ink-muted hidden sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 card p-2 shadow-soft animate-scale-in origin-top-right z-50">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
              <p className="font-semibold text-sm text-ink dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-ink-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={() => {
                navigate('/profile')
                setMenuOpen(false)
              }}
              className="w-full nav-link"
            >
              <User className="h-4 w-4" /> {t('nav.profile')}
            </button>
            <button
              onClick={() => {
                navigate('/settings')
                setMenuOpen(false)
              }}
              className="w-full nav-link"
            >
              <Settings className="h-4 w-4" /> {t('nav.settings')}
            </button>
            {cloud ? (
              <button
                onClick={() => {
                  signOut()
                  setMenuOpen(false)
                  navigate('/')
                }}
                className="w-full nav-link text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Выйти
              </button>
            ) : (
              <button
                onClick={() => {
                  resetOnboarding()
                  setMenuOpen(false)
                  navigate('/')
                }}
                className="w-full nav-link text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Сбросить онбординг
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
