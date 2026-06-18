import { useEffect, useRef } from 'react'
import { useApp } from '../store/AppContext'

const IDLE_LIMIT_MS = 30 * 60 * 1000 // pause counting after 30 min with no activity
const TICK_MS = 30 * 1000 // flush every 30s

// Counts ACTIVE study time on the page it's mounted in: it only accrues while the
// user has interacted within the last 30 minutes. Idle past that and the timer
// pauses until the next interaction.
export function useStudyTimer() {
  const { addStudySeconds } = useApp()
  const addRef = useRef(addStudySeconds)
  addRef.current = addStudySeconds // always call the freshest closure
  const lastActivity = useRef(Date.now())

  useEffect(() => {
    const bump = () => {
      lastActivity.current = Date.now()
    }
    const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart']
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }))

    const id = setInterval(() => {
      if (Date.now() - lastActivity.current < IDLE_LIMIT_MS) {
        addRef.current(TICK_MS / 1000)
      }
    }, TICK_MS)

    return () => {
      clearInterval(id)
      events.forEach((e) => window.removeEventListener(e, bump))
    }
  }, [])
}
