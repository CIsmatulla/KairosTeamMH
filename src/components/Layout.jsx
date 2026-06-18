import { Outlet, NavLink } from 'react-router-dom'
import { Home, BookOpen, Compass, Bookmark, User } from 'lucide-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { cn } from '../lib/ui'

const mobileNav = [
  { to: '/', icon: Home, label: 'Главная', end: true },
  { to: '/courses', icon: BookOpen, label: 'Курсы' },
  { to: '/opportunities', icon: Compass, label: 'Возможности' },
  { to: '/bookmarks', icon: Bookmark, label: 'Избранное' },
  { to: '/profile', icon: User, label: 'Профиль' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-[1280px] w-full mx-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 grid grid-cols-5 border-t border-slate-200/80 dark:border-white/5 bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl">
        {mobileNav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-600 dark:text-brand-300' : 'text-ink-muted dark:text-slate-500',
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
