import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useApp } from './store/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Learning from './pages/Learning'
import Opportunities from './pages/Opportunities'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Assistant from './pages/Assistant'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Splash() {
  return (
    <div className="min-h-screen grid place-items-center bg-navy-50 dark:bg-navy-900">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-lift">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-ink-muted">Загрузка…</p>
      </div>
    </div>
  )
}

export default function App() {
  const { isSupabaseConfigured, bootstrapping, session, guest, onboarded, canAdmin } = useApp()

  if (bootstrapping) return <Splash />
  if (isSupabaseConfigured && !session && !guest) return <Auth />
  if (!onboarded) return <Onboarding />

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<Learning />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={canAdmin ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
