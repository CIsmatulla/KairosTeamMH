// Tokenless heuristic assistant. Always available (no model, no network, no keys).
// Produces personalized guidance from the student's profile + the live catalog.
import { INTERESTS } from '../data/courses'
import { deadlineInfo } from './ui'

const labelFor = (key) => INTERESTS.find((i) => i.key === key)?.label || key

function rankByInterest(items, interests) {
  return [...items]
    .map((x) => ({ x, score: (x.tags || []).filter((t) => interests.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.x)
}

function topCourses(ctx, n = 3) {
  return rankByInterest(ctx.courses, ctx.user.interests || []).slice(0, n)
}

function topOpps(ctx, n = 3) {
  const ranked = rankByInterest(ctx.opportunities, ctx.user.interests || [])
  return ranked
    .slice(0, Math.max(n * 2, 6))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, n)
}

const GOAL_LINE = {
  university: 'поступление в сильный университет',
  olympiad: 'победы на олимпиадах',
  skills: 'прокачку реальных навыков',
  career: 'старт карьеры',
}

function roadmap(ctx) {
  const grade = Number(ctx.user.grade) || 10
  const goal = GOAL_LINE[ctx.user.goal] || 'твои цели'
  const ints = (ctx.user.interests || []).map(labelFor).join(', ') || 'твои интересы'
  const courses = topCourses(ctx, 2).map((c) => `«${c.title}»`).join(' и ')
  const opps = topOpps(ctx, 2).map((o) => `«${o.title}»`).join(' и ')
  const blocks = [
    `9 класс — фундамент: укрепи базу, попробуй разные направления (${ints}). Пройди ${courses || 'вводные курсы'}.`,
    `10 класс — специализация: углубляйся в выбранное направление, участвуй в олимпиадах и конкурсах вроде ${opps || 'профильных конкурсов'}.`,
    `11 класс — портфолио: стажировки, исследовательские проекты, подготовка к экзаменам/IELTS. Собери достижения для заявки.`,
    `12 класс / поступление: финальная подготовка, подача документов, мотивационные эссе.`,
  ]
  const from = Math.min(Math.max(grade - 9, 0), 3)
  const plan = blocks.slice(from).map((b, i) => `${i + 1}. ${b}`).join('\n')
  return `Вот твой персональный roadmap под ${goal} (с ${grade} класса):\n\n${plan}\n\nХочешь — построю подробный план по конкретному направлению.`
}

function recommendOpps(ctx) {
  const list = topOpps(ctx, 3)
  if (!list.length) return 'Пока не вижу подходящих возможностей в каталоге.'
  const lines = list.map((o) => {
    const { label, days } = deadlineInfo(o.deadline)
    return `• ${o.title} — ${o.organization}. Дедлайн ${label}${days >= 0 ? ` (${days} дн.)` : ''}.`
  })
  return `На основе твоих интересов (${(ctx.user.interests || []).map(labelFor).join(', ') || '—'}) советую:\n\n${lines.join('\n')}\n\nОткрой раздел «Возможности», чтобы сохранить понравившееся.`
}

function recommendCourses(ctx) {
  const list = topCourses(ctx, 3)
  if (!list.length) return 'В каталоге пока нет курсов.'
  const lines = list.map((c) => `• ${c.title} — ${c.level}, ${c.lessons?.length || 0} уроков.`)
  return `Курсы, которые подойдут именно тебе:\n\n${lines.join('\n')}\n\nНачни с первого — каждый урок занимает 8–15 минут.`
}

function deadlines(ctx) {
  const list = [...ctx.opportunities].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 4)
  const lines = list.map((o) => {
    const { label, days } = deadlineInfo(o.deadline)
    return `• ${label} — ${o.title}${days >= 0 ? ` (через ${days} дн.)` : ''}`
  })
  return `Ближайшие дедлайны:\n\n${lines.join('\n')}`
}

export function heuristicReply(message, ctx) {
  const m = (message || '').toLowerCase()
  const has = (...words) => words.some((w) => m.includes(w))

  if (has('roadmap', 'роадмап', 'план', 'куда', 'поступл', 'дорожн')) return roadmap(ctx)
  if (has('дедлайн', 'срок', 'когда')) return deadlines(ctx)
  if (has('курс', 'изуч', 'учить', 'предмет')) return recommendCourses(ctx)
  if (has('возможност', 'олимпиад', 'стипенд', 'стажир', 'конкурс', 'грант', 'совет', 'рекоменд', 'что выбрать')) return recommendOpps(ctx)
  if (has('привет', 'здравств', 'хай', 'hello', 'кто ты', 'что умеешь', 'помощь', 'help'))
    return `Привет, ${ctx.user.name || 'друг'}! Я Ментор ИИ. Могу:\n• порекомендовать курсы и возможности под твой профиль;\n• построить персональный roadmap;\n• показать ближайшие дедлайны;\n• объяснить тему простыми словами.\n\nЧто тебе сейчас интереснее?`

  // default — give a profile-based nudge
  return `Я Ментор ИИ и помогу с учёбой и возможностями. Вот что могу прямо сейчас:\n\n${recommendOpps(ctx)}\n\nСпроси про «roadmap», «курсы» или «дедлайны» — и я помогу подробнее.`
}
