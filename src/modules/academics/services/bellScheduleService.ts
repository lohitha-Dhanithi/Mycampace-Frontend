import { DEFAULT_SCHEDULE, entryLabel, type ScheduleEntry } from '../config/timetableConfig'

const STORAGE_KEY = 'mycampace_bell_schedule'

function toMinutes(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

export function addMinutes(value: string, minutes: number) {
  const base = toMinutes(value) ?? 8 * 60
  const next = Math.min(base + minutes, 23 * 60 + 59)
  const hours = Math.floor(next / 60)
  const remainder = next % 60
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function validateSchedule(rows: ScheduleEntry[]) {
  if (!rows.some((row) => row.kind === 'period')) return 'Add at least one class period.'
  const seen = new Set<number>()
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    if (row.kind === 'break' && !row.label.trim()) return 'Name each break.'
    const start = toMinutes(row.start)
    const end = toMinutes(row.end)
    if (start == null || end == null) return `Enter a valid time for ${entryLabel(row)}.`
    if (end <= start) return `${entryLabel(row)} must end after it starts.`
    if (row.kind === 'period') {
      if (!row.period || seen.has(row.period)) return 'Each class period needs its own number.'
      seen.add(row.period)
    }
    if (index > 0) {
      const previousEnd = toMinutes(rows[index - 1].end)
      if (previousEnd != null && start < previousEnd) {
        return `${entryLabel(row)} overlaps ${entryLabel(rows[index - 1])}. Put earlier times above later ones.`
      }
    }
  }
  return ''
}

function readSchedule(): ScheduleEntry[] {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE.map((entry) => ({ ...entry }))
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = DEFAULT_SCHEDULE.map((entry) => ({ ...entry }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || validateSchedule(parsed)) return DEFAULT_SCHEDULE.map((entry) => ({ ...entry }))
    return parsed
  } catch {
    return DEFAULT_SCHEDULE.map((entry) => ({ ...entry }))
  }
}

export const bellScheduleService = {
  getSchedule() {
    return readSchedule()
  },

  saveSchedule(rows: ScheduleEntry[]) {
    const error = validateSchedule(rows)
    if (error) return { schedule: readSchedule(), error }
    const schedule = rows.map((row) => ({
      ...row,
      label: row.kind === 'break' ? row.label.trim() : row.label.trim() || `Period ${row.period}`,
    }))
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
    return { schedule, error: '' }
  },
}
