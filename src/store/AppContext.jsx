import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { courses as seedCourses } from '../data/courses'
import { opportunities as seedOpportunities } from '../data/opportunities'
import { translate } from '../i18n/translations'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AppContext = createContext(null)
const STORAGE_KEY = 'mentoria_state_v1'

// Device-level prefs + local/guest data. Cloud users keep their data in Supabase instead.
const defaultState = {
  theme: 'light',
  lang: 'ru',
  guest: false,
  onboarded: false,
  user: { name: 'Алибек', email: 'student@mentoria.kz', grade: '10', interests: ['stem', 'programming'], goal: 'university' },
  progress: { 'c-math': ['l1'] },
  saved: ['o1', 'o4'],
  streak: 7,
  studySeconds: 0,
  customCourses: [],
  customOpportunities: [],
  removedIds: [],
  notes: {},
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return defaultState
  }
}

function mapCourse(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    level: row.level,
    language: row.language,
    students: row.students ?? 0,
    rating: Number(row.rating ?? 5),
    hours: row.hours ?? 0,
    tags: row.tags || [],
    description: row.description || '',
    lessons: (row.lessons || [])
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((l) => ({ id: l.id, title: l.title, duration: l.duration, points: l.points || [], quiz: l.quiz })),
  }
}

const profileToUser = (p) =>
  p ? { name: p.name || 'Ученик', email: p.email || '', grade: p.grade || '10', interests: p.interests || [], goal: p.goal || 'university' } : null

export function AppProvider({ children }) {
  const [local, setLocal] = useState(loadState)

  // Cloud state
  const [session, setSession] = useState(null)
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured)
  const [profile, setProfile] = useState(null)
  const [cloudCourses, setCloudCourses] = useState(null)
  const [cloudOpps, setCloudOpps] = useState(null)
  const [cloudSaved, setCloudSaved] = useState([])
  const [cloudProgress, setCloudProgress] = useState({})
  const [cloudNotes, setCloudNotes] = useState({})
  const [userDataLoaded, setUserDataLoaded] = useState(!isSupabaseConfigured)

  const persist = useCallback((next) => {
    setLocal(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore quota */
    }
  }, [])

  const patchLocal = useCallback(
    (partial) => setLocal((prev) => {
      const next = { ...prev, ...(typeof partial === 'function' ? partial(prev) : partial) }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    }),
    [],
  )

  // theme
  useEffect(() => {
    const root = document.documentElement
    if (local.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [local.theme])

  // auth bootstrap
  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null)
      setAuthChecked(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // catalog (public read for everyone when configured)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let alive = true
    ;(async () => {
      const { data: cs } = await supabase
        .from('courses')
        .select('*, lessons(id,position,title,duration,points,quiz)')
        .order('created_at', { ascending: true })
      const { data: os } = await supabase.from('opportunities').select('*').order('deadline', { ascending: true })
      if (!alive) return
      if (cs) setCloudCourses(cs.map(mapCourse))
      if (os) setCloudOpps(os)
    })()
    return () => {
      alive = false
    }
  }, [])

  // user-scoped data when logged in
  const loadUserData = useCallback(async (uid) => {
    const [{ data: p }, { data: sv }, { data: pr }, { data: nt }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', uid),
      supabase.from('lesson_progress').select('course_id,lesson_id').eq('user_id', uid),
      supabase.from('course_notes').select('*').eq('user_id', uid).order('created_at', { ascending: true }),
    ])
    setProfile(p || null)
    setCloudSaved((sv || []).map((r) => r.opportunity_id))
    const pmap = {}
    ;(pr || []).forEach((r) => {
      pmap[r.course_id] = pmap[r.course_id] || []
      pmap[r.course_id].push(r.lesson_id)
    })
    setCloudProgress(pmap)
    const nmap = {}
    ;(nt || []).forEach((r) => {
      nmap[r.course_id] = nmap[r.course_id] || []
      nmap[r.course_id].push(r)
    })
    setCloudNotes(nmap)
    setUserDataLoaded(true)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    if (session?.user) {
      setUserDataLoaded(false)
      loadUserData(session.user.id)
    } else {
      setProfile(null)
      setCloudSaved([])
      setCloudProgress({})
      setCloudNotes({})
      setUserDataLoaded(true)
    }
  }, [session, loadUserData])

  // ---------- mode + derived data ----------
  const cloud = isSupabaseConfigured && Boolean(session?.user)
  const uid = session?.user?.id

  const courses = useMemo(() => {
    if (isSupabaseConfigured) return cloudCourses ?? seedCourses
    return [...local.customCourses, ...seedCourses].filter((c) => !local.removedIds.includes(c.id))
  }, [cloudCourses, local.customCourses, local.removedIds])

  const opportunities = useMemo(() => {
    if (isSupabaseConfigured) return cloudOpps ?? seedOpportunities
    return [...local.customOpportunities, ...seedOpportunities].filter((o) => !local.removedIds.includes(o.id))
  }, [cloudOpps, local.customOpportunities, local.removedIds])

  const user = cloud ? profileToUser(profile) || local.user : local.user
  const saved = cloud ? cloudSaved : local.saved
  const progress = cloud ? cloudProgress : local.progress
  const studySeconds = cloud ? profile?.study_seconds ?? 0 : local.studySeconds
  const streak = cloud ? profile?.streak ?? 0 : local.streak
  const isAdmin = cloud && profile?.role === 'admin'
  const onboarded = cloud ? Boolean(profile && (profile.interests?.length > 0)) : local.onboarded

  const stats = useMemo(() => {
    const completedLessons = Object.values(progress).reduce((s, a) => s + a.length, 0)
    const completedCourses = courses.filter((c) => c.lessons?.length && (progress[c.id]?.length || 0) >= c.lessons.length).length
    const hours = studySeconds > 0 ? Math.round((studySeconds / 3600) * 10) / 10 : 0
    return { completedLessons, completedCourses, hours, savedCount: saved.length, streak }
  }, [progress, saved, streak, studySeconds, courses])

  const recommendedCourses = useMemo(() => {
    const interests = user?.interests || []
    return [...courses]
      .map((c) => ({ c, score: (c.tags || []).filter((t) => interests.includes(t)).length }))
      .sort((a, b) => b.score - a.score || b.c.rating - a.c.rating)
      .map((x) => x.c)
  }, [courses, user])

  const recommendedOpportunities = useMemo(() => {
    const interests = user?.interests || []
    return [...opportunities]
      .map((o) => ({ o, score: (o.tags || []).filter((t) => interests.includes(t)).length }))
      .sort((a, b) => b.score - a.score || new Date(a.o.deadline) - new Date(b.o.deadline))
      .map((x) => x.o)
  }, [opportunities, user])

  // ---------- helpers ----------
  const t = useCallback((key) => translate(local.lang, key), [local.lang])
  const sbWrite = (promise) => {
    if (promise?.then) promise.then(({ error } = {}) => { if (error && import.meta.env.DEV) console.error('[supabase]', error.message) })
  }
  const PROFILE_FIELDS = ['name', 'email', 'grade', 'interests', 'goal']

  // ---------- actions ----------
  const toggleSaved = (id) => {
    if (cloud) {
      const has = cloudSaved.includes(id)
      setCloudSaved((p) => (has ? p.filter((x) => x !== id) : [...p, id]))
      sbWrite(
        has
          ? supabase.from('saved_opportunities').delete().match({ user_id: uid, opportunity_id: id })
          : supabase.from('saved_opportunities').insert({ user_id: uid, opportunity_id: id }),
      )
    } else {
      patchLocal((p) => ({ saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id] }))
    }
  }

  const toggleLesson = (courseId, lessonId) => {
    if (cloud) {
      const done = (cloudProgress[courseId] || []).includes(lessonId)
      setCloudProgress((p) => {
        const cur = p[courseId] || []
        return { ...p, [courseId]: done ? cur.filter((x) => x !== lessonId) : [...cur, lessonId] }
      })
      sbWrite(
        done
          ? supabase.from('lesson_progress').delete().match({ user_id: uid, course_id: courseId, lesson_id: lessonId })
          : supabase.from('lesson_progress').insert({ user_id: uid, course_id: courseId, lesson_id: lessonId }),
      )
    } else {
      patchLocal((p) => {
        const cur = p.progress[courseId] || []
        const next = cur.includes(lessonId) ? cur.filter((x) => x !== lessonId) : [...cur, lessonId]
        return { progress: { ...p.progress, [courseId]: next } }
      })
    }
  }

  const enroll = (courseId) => {
    if (cloud) setCloudProgress((p) => (p[courseId] ? p : { ...p, [courseId]: [] }))
    else patchLocal((p) => ({ progress: p.progress[courseId] ? p.progress : { ...p.progress, [courseId]: [] } }))
  }

  const addStudySeconds = (rawSec) => {
    const sec = Math.min(Math.max(Math.round(rawSec) || 0, 0), 120) // clamp: at most one tick worth
    if (sec <= 0) return
    if (cloud) {
      const total = (profile?.study_seconds ?? 0) + sec
      setProfile((p) => (p ? { ...p, study_seconds: total } : p))
      sbWrite(supabase.from('profiles').update({ study_seconds: total }).eq('id', uid))
    } else {
      patchLocal((p) => ({ studySeconds: (p.studySeconds || 0) + sec }))
    }
  }

  const updateUser = (u) => {
    // allowlist: never let a caller (e.g. DevTools) write role or other columns
    const safe = Object.fromEntries(Object.entries(u || {}).filter(([k]) => PROFILE_FIELDS.includes(k)))
    if (cloud) {
      setProfile((p) => ({ ...p, ...safe }))
      sbWrite(supabase.from('profiles').update(safe).eq('id', uid))
    } else {
      patchLocal((p) => ({ user: { ...p.user, ...safe } }))
    }
  }

  const completeOnboarding = (data) => {
    if (cloud) {
      const upd = { name: data.name, grade: data.grade, interests: data.interests, goal: data.goal }
      setProfile((p) => ({ ...p, ...upd }))
      sbWrite(supabase.from('profiles').update(upd).eq('id', uid))
    } else {
      patchLocal((p) => ({ onboarded: true, user: { ...p.user, ...data } }))
    }
  }

  const resetOnboarding = () => {
    if (cloud) {
      setProfile((p) => ({ ...p, interests: [] }))
      sbWrite(supabase.from('profiles').update({ interests: [] }).eq('id', uid))
    } else {
      patchLocal({ onboarded: false })
    }
  }

  // notes / personal practice
  const notesForCourse = (courseId) => (cloud ? cloudNotes[courseId] || [] : local.notes?.[courseId] || [])
  const addNote = async (courseId, note) => {
    if (cloud) {
      const { data } = await supabase
        .from('course_notes')
        .insert({ user_id: uid, course_id: courseId, kind: note.kind, content: note.content, answer: note.answer || null })
        .select()
        .single()
      if (data) setCloudNotes((p) => ({ ...p, [courseId]: [...(p[courseId] || []), data] }))
    } else {
      const row = { id: `n-${Date.now()}`, course_id: courseId, ...note, created_at: new Date().toISOString() }
      patchLocal((p) => ({ notes: { ...p.notes, [courseId]: [...(p.notes?.[courseId] || []), row] } }))
    }
  }
  const deleteNote = (courseId, id) => {
    if (cloud) {
      setCloudNotes((p) => ({ ...p, [courseId]: (p[courseId] || []).filter((n) => n.id !== id) }))
      sbWrite(supabase.from('course_notes').delete().match({ id, user_id: uid }))
    } else {
      patchLocal((p) => ({ notes: { ...p.notes, [courseId]: (p.notes?.[courseId] || []).filter((n) => n.id !== id) } }))
    }
  }

  // admin CRUD
  const addCourse = (course) => {
    if (cloud) {
      const { lessons = [], ...row } = course
      setCloudCourses((p) => [course, ...(p || [])])
      ;(async () => {
        const { error } = await supabase.from('courses').insert(row)
        if (error) { if (import.meta.env.DEV) console.error('[supabase] addCourse', error.message); return }
        if (lessons.length) {
          await supabase
            .from('lessons')
            .insert(lessons.map((l, i) => ({ course_id: course.id, id: l.id, position: i, title: l.title, duration: l.duration, points: l.points, quiz: l.quiz })))
        }
      })()
    } else {
      patchLocal((p) => ({ customCourses: [course, ...p.customCourses] }))
    }
  }
  const deleteCourse = (id) => {
    if (cloud) {
      setCloudCourses((p) => (p || []).filter((c) => c.id !== id))
      sbWrite(supabase.from('courses').delete().eq('id', id))
    } else {
      patchLocal((p) => ({ customCourses: p.customCourses.filter((c) => c.id !== id), removedIds: [...p.removedIds, id] }))
    }
  }
  const addOpportunity = (opp) => {
    if (cloud) {
      setCloudOpps((p) => [opp, ...(p || [])])
      sbWrite(supabase.from('opportunities').insert(opp))
    } else {
      patchLocal((p) => ({ customOpportunities: [opp, ...p.customOpportunities] }))
    }
  }
  const deleteOpportunity = (id) => {
    if (cloud) {
      setCloudOpps((p) => (p || []).filter((o) => o.id !== id))
      sbWrite(supabase.from('opportunities').delete().eq('id', id))
    } else {
      patchLocal((p) => ({ customOpportunities: p.customOpportunities.filter((o) => o.id !== id), removedIds: [...p.removedIds, id] }))
    }
  }

  // auth
  const signUp = async (email, password, name) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    return { error }
  }
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    patchLocal({ guest: false })
  }
  const continueAsGuest = () => patchLocal({ guest: true })
  const exitGuest = () => patchLocal({ guest: false })

  const value = {
    // config / auth
    isSupabaseConfigured,
    session,
    authChecked,
    bootstrapping: isSupabaseConfigured && (!authChecked || (Boolean(session?.user) && !userDataLoaded)),
    guest: local.guest,
    isAdmin,
    // cloud: only real admins; local-only build: single-user sandbox, admin allowed for the demo
    canAdmin: isSupabaseConfigured ? isAdmin : true,
    cloud,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
    exitGuest,
    // prefs
    theme: local.theme,
    lang: local.lang,
    toggleTheme: () => patchLocal((p) => ({ theme: p.theme === 'dark' ? 'light' : 'dark' })),
    setTheme: (theme) => patchLocal({ theme }),
    setLang: (lang) => patchLocal({ lang }),
    t,
    // data
    courses,
    opportunities,
    user,
    saved,
    progress,
    streak,
    studySeconds,
    stats,
    recommendedCourses,
    recommendedOpportunities,
    onboarded,
    // actions
    updateUser,
    completeOnboarding,
    resetOnboarding,
    isSaved: (id) => saved.includes(id),
    toggleSaved,
    isLessonDone: (courseId, lessonId) => (progress[courseId] || []).includes(lessonId),
    toggleLesson,
    courseProgress: (course) => {
      if (!course?.lessons?.length) return 0
      return Math.round(((progress[course.id]?.length || 0) / course.lessons.length) * 100)
    },
    isEnrolled: (courseId) => Boolean(progress[courseId]),
    enroll,
    addStudySeconds,
    notesForCourse,
    addNote,
    deleteNote,
    addCourse,
    deleteCourse,
    addOpportunity,
    deleteOpportunity,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
