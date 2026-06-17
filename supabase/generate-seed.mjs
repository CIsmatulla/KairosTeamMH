// Generates supabase/seed.sql from the app's seed data (idempotent upserts).
// Run: node supabase/generate-seed.mjs
import { courses } from '../src/data/courses.js'
import { opportunities } from '../src/data/opportunities.js'
import { writeFileSync } from 'node:fs'

const q = (s) => (s === null || s === undefined ? 'null' : `'${String(s).replace(/'/g, "''")}'`)
const arr = (a) => `ARRAY[${(a || []).map((x) => `'${String(x).replace(/'/g, "''")}'`).join(',')}]::text[]`
const jsonb = (o) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`

const lines = []

for (const c of courses) {
  lines.push(
    `insert into public.courses (id,category,title,level,language,students,rating,hours,tags,description) ` +
      `values (${q(c.id)},${q(c.category)},${q(c.title)},${q(c.level)},${q(c.language)},${c.students || 0},${c.rating || 5.0},${c.hours || 0},${arr(c.tags)},${q(c.description)}) ` +
      `on conflict (id) do update set category=excluded.category,title=excluded.title,level=excluded.level,language=excluded.language,students=excluded.students,rating=excluded.rating,hours=excluded.hours,tags=excluded.tags,description=excluded.description;`,
  )
  ;(c.lessons || []).forEach((l, idx) => {
    lines.push(
      `insert into public.lessons (course_id,id,position,title,duration,points,quiz) ` +
        `values (${q(c.id)},${q(l.id)},${idx},${q(l.title)},${q(l.duration)},${arr(l.points)},${jsonb(l.quiz)}) ` +
        `on conflict (course_id,id) do update set position=excluded.position,title=excluded.title,duration=excluded.duration,points=excluded.points,quiz=excluded.quiz;`,
    )
  })
}

for (const o of opportunities) {
  lines.push(
    `insert into public.opportunities (id,title,organization,category,format,grades,eligibility,description,tags,deadline,link) ` +
      `values (${q(o.id)},${q(o.title)},${q(o.organization)},${q(o.category)},${q(o.format)},${q(o.grades)},${q(o.eligibility)},${q(o.description)},${arr(o.tags)},${q(o.deadline)},${q(o.link)}) ` +
      `on conflict (id) do update set title=excluded.title,organization=excluded.organization,category=excluded.category,format=excluded.format,grades=excluded.grades,eligibility=excluded.eligibility,description=excluded.description,tags=excluded.tags,deadline=excluded.deadline,link=excluded.link;`,
  )
}

writeFileSync(new URL('./seed.sql', import.meta.url), lines.join('\n') + '\n')
console.log(`Generated ${lines.length} upsert statements -> supabase/seed.sql`)
