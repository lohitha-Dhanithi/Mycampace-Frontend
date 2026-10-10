export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface ScheduleEntry {
  id: string
  kind: 'period' | 'break'
  period?: number
  label: string
  start: string
  end: string
}

export const DEFAULT_SCHEDULE: ScheduleEntry[] = [
  { id: 'period-1', kind: 'period', period: 1, label: 'Period 1', start: '08:00', end: '08:45' },
  { id: 'period-2', kind: 'period', period: 2, label: 'Period 2', start: '08:45', end: '09:30' },
  { id: 'break-1', kind: 'break', label: 'Short break', start: '09:30', end: '09:45' },
  { id: 'period-3', kind: 'period', period: 3, label: 'Period 3', start: '09:45', end: '10:30' },
  { id: 'period-4', kind: 'period', period: 4, label: 'Period 4', start: '10:30', end: '11:15' },
  { id: 'break-2', kind: 'break', label: 'Short break', start: '11:15', end: '11:30' },
  { id: 'period-5', kind: 'period', period: 5, label: 'Period 5', start: '11:30', end: '12:15' },
  { id: 'period-6', kind: 'period', period: 6, label: 'Period 6', start: '12:15', end: '13:00' },
  { id: 'break-lunch', kind: 'break', label: 'Lunch', start: '13:00', end: '13:45' },
  { id: 'period-7', kind: 'period', period: 7, label: 'Period 7', start: '13:45', end: '14:30' },
  { id: 'period-8', kind: 'period', period: 8, label: 'Period 8', start: '14:30', end: '15:15' },
]

export const PERIODS = DEFAULT_SCHEDULE.filter((entry) => entry.kind === 'period').map((entry) => ({
  number: entry.period as number,
  start: entry.start,
  end: entry.end,
}))

export const EXTRA_ROOMS = ['Physics Lab', 'Chemistry Lab', 'Computer Lab']

export const SUBJECT_TONE: Record<string, string> = {
  'sub-phy': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'sub-chem': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'sub-math': 'bg-amber-50 text-amber-900 border-amber-200',
  'sub-bio': 'bg-teal-50 text-teal-800 border-teal-200',
  'sub-eng': 'bg-rose-50 text-rose-800 border-rose-200',
  'sub-cs': 'bg-sky-50 text-sky-800 border-sky-200',
}

export function entryLabel(entry: Pick<ScheduleEntry, 'kind' | 'period' | 'label'>) {
  if (entry.kind === 'break') return entry.label.trim() || 'Break'
  return entry.label.trim() || `Period ${entry.period}`
}
