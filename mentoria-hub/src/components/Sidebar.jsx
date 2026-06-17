import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Dumbbell,
  Compass,
  Bookmark,
  User,
  Settings,
  LayoutDashboard,
  Flame,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/ui'
import { useApp } from '../store/AppContext'

const mainNav = [
  { to: '/', key: 'nav.home', icon: Home, end: true },
  { to: '/courses', key: 'nav.courses', icon: BookOpen },
  { to: '/assistant', key: 'nav.assistant', icon: Sparkles },
  { to: '/opportunities', key: 'nav.opportunities', icon: Compass },
  { to: '/bookmarks', key: 'nav.bookmarks', icon: Bookmark },
]

const accountNav = [
  { to: '/profile', key: 'nav.profile', icon: User },
  { to: '/settings', key: 'nav.settings', icon: Settings },
  { to: '/admin', key: 'nav.admin', icon: LayoutDashboard },
]

function linkClass({ isActive }) {
  return cn('nav-link', isActive && 'nav-link-active')
}

export default function Sidebar({ onNavigate }) {
  const { t, stats, canAdmin } = useApp()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-navy-900/60 backdrop-blur-xl px-4 py-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="h-9 w-9 rounded-xl bg-brand-gradient grid place-items-center shadow-lift">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-ink dark:text-white">
          Mentoria <span className="text-brand-500">Hub</span>
        </span>
      </NavLink>

      <nav className="flex flex-col gap-1">
        {mainNav.map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onNavigate}>
            <Icon className="h-5 w-5" strokeWidth={2} />
            {t(key)}
          </NavLink>
        ))}
      </nav>

      <div className="my-5 h-px bg-slate-200/80 dark:bg-white/5" />

      <nav className="flex flex-col gap-1">
        {accountNav.filter((i) => i.to !== '/admin' || canAdmin).map(({ to, key, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onNavigate}>
            <Icon className="h-5 w-5" strokeWidth={2} />
            {t(key)}
          </NavLink>
        ))}
      </nav>

      {/* Streak card */}
      <div className="mt-auto card p-4 bg-brand-gradient border-0 text-white shadow-lift">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-300 fill-amber-300" />
          <span className="font-bold text-lg">{stats.streak}</span>
          <span className="text-sm text-white/80">{t('stats.streak').toLowerCase()}</span>
        </div>
        <p className="text-xs text-white/80 mt-2 leading-relaxed">
          Продолжай в том же духе — ты на верном пути! 🔥
        </p>
      </div>
    </aside>
  )
}
