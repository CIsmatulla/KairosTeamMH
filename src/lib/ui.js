// Small classnames helper
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

// Static accent class maps (Tailwind JIT-safe — no dynamic string building).
// Each accent provides ready-to-use class strings for light + dark mode.
export const ACCENTS = {
  brand: {
    chip: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    iconWrap: 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300',
    solid: 'bg-brand-500',
    bar: 'bg-brand-500',
    grad: 'from-brand-500 to-brand-400',
    ring: 'group-hover:ring-brand-300 dark:group-hover:ring-brand-500/40',
  },
  blue: {
    chip: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    iconWrap: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    solid: 'bg-blue-500',
    bar: 'bg-blue-500',
    grad: 'from-blue-500 to-blue-400',
    ring: 'group-hover:ring-blue-300 dark:group-hover:ring-blue-500/40',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    iconWrap: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    solid: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    grad: 'from-emerald-500 to-emerald-400',
    ring: 'group-hover:ring-emerald-300 dark:group-hover:ring-emerald-500/40',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    iconWrap: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    solid: 'bg-amber-500',
    bar: 'bg-amber-500',
    grad: 'from-amber-500 to-amber-400',
    ring: 'group-hover:ring-amber-300 dark:group-hover:ring-amber-500/40',
  },
  pink: {
    chip: 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
    iconWrap: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300',
    solid: 'bg-pink-500',
    bar: 'bg-pink-500',
    grad: 'from-pink-500 to-pink-400',
    ring: 'group-hover:ring-pink-300 dark:group-hover:ring-pink-500/40',
  },
  teal: {
    chip: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
    iconWrap: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
    solid: 'bg-teal-500',
    bar: 'bg-teal-500',
    grad: 'from-teal-500 to-teal-400',
    ring: 'group-hover:ring-teal-300 dark:group-hover:ring-teal-500/40',
  },
}

export function accent(key) {
  return ACCENTS[key] || ACCENTS.brand
}

// Format an ISO date to a localized short string and compute days remaining
// relative to the real current date, so the countdown updates every day.
export function deadlineInfo(iso, locale = 'ru-RU') {
  const date = new Date(iso)
  date.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((date - now) / 86400000)
  const label = date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  return { label, days }
}
