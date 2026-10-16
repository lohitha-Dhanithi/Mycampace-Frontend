import { DAYS, PERIODS } from '../config/timetableConfig'

const STORAGE_KEY = 'mycampace_timetable_v2'

export interface TimetableSlot {
  id: string
  sectionId: string
  sectionName: string
  classId: string
  className: string
  day: string
  period: number
  subjectId: string
  subjectName: string
  facultyId: string
  facultyName: string
  room: string
}

export interface TimetableDraft {
  id?: string
  sectionId: string
  sectionName: string
  classId: string
  className: string
  day: string
  period: number
  subjectId: string
  subjectName: string
  facultyId: string
  facultyName: string
  room: string
}

const TEACHERS = [
  { facultyId: 'usr-5', facultyName: 'Pooja Iyer', subjectId: 'sub-phy', subjectName: 'Physics (042)' },
  { facultyId: 'usr-fac-2', facultyName: 'Dr. Suresh Kumar', subjectId: 'sub-phy', subjectName: 'Physics (042)' },
  { facultyId: 'usr-fac-3', facultyName: 'Arvind Swamy', subjectId: 'sub-math', subjectName: 'Mathematics (041)' },
  { facultyId: 'usr-fac-4', facultyName: 'Kavita Chawla', subjectId: 'sub-chem', subjectName: 'Chemistry (043)' },
  { facultyId: 'usr-fac-5', facultyName: 'Manoj Pillai', subjectId: 'sub-bio', subjectName: 'Biology (044)' },
  { facultyId: 'usr-1', facultyName: 'Vikram Aditya', subjectId: 'sub-cs', subjectName: 'Computer Science (083)' },
]

function seedSlots(): TimetableSlot[] {
  const sections = [
    { sectionId: 'sec-12A', sectionName: 'Section A (PCM)', classId: 'cls-12', className: 'Class 12', room: 'Room 301, Block C' },
    { sectionId: 'sec-12B', sectionName: 'Section B (PCB)', classId: 'cls-12', className: 'Class 12', room: 'Room 302, Block C' },
    { sectionId: 'sec-11A', sectionName: 'Section A (PCM)', classId: 'cls-11', className: 'Class 11', room: 'Room 201, Block C' },
    { sectionId: 'sec-11B', sectionName: 'Section B (PCB)', classId: 'cls-11', className: 'Class 11', room: 'Room 202, Block C' },
    { sectionId: 'sec-10A', sectionName: 'Section A', classId: 'cls-10', className: 'Class 10', room: 'Room 105, Block B' },
    { sectionId: 'sec-10B', sectionName: 'Section B', classId: 'cls-10', className: 'Class 10', room: 'Room 106, Block B' },
    { sectionId: 'sec-cse-1a', sectionName: 'Section 1A', classId: 'cls-sem1-cse', className: 'Semester 1 (First Year)', room: 'Turing Hall, Tech Block' },
    { sectionId: 'sec-cse-1b', sectionName: 'Section 1B', classId: 'cls-sem1-cse', className: 'Semester 1 (First Year)', room: 'Babbage Hall, Tech Block' },
  ]
  const slots: TimetableSlot[] = []
  DAYS.forEach((day, dayIndex) => {
    PERIODS.slice(0, 5).forEach((period) => {
      sections.forEach((section, sectionIndex) => {
        const teacher = TEACHERS[(dayIndex + period.number + sectionIndex * 2) % TEACHERS.length]
        slots.push({
          id: `tt-${section.sectionId}-${day}-${period.number}`,
          ...section,
          day,
          period: period.number,
          subjectId: teacher.subjectId,
          subjectName: teacher.subjectName,
          facultyId: teacher.facultyId,
          facultyName: teacher.facultyName,
          room: section.room,
        })
      })
    })
  })
  return slots
}

function readSlots(): TimetableSlot[] {
  if (typeof window === 'undefined') return seedSlots()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = seedSlots()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedSlots()
  } catch {
    return seedSlots()
  }
}

function writeSlots(slots: TimetableSlot[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
}

export function slotConflicts(slots: TimetableSlot[], candidate: TimetableDraft, ignoreId?: string) {
  const messages: string[] = []
  slots.forEach((slot) => {
    if (slot.id === ignoreId) return
    if (slot.day !== candidate.day || slot.period !== candidate.period) return
    if (slot.sectionId === candidate.sectionId) return
    if (candidate.facultyId && slot.facultyId === candidate.facultyId) {
      messages.push(`${candidate.facultyName} is already teaching ${slot.subjectName} for ${slot.className} · ${slot.sectionName} in this period.`)
    }
    if (candidate.room && slot.room === candidate.room) {
      messages.push(`${candidate.room} is already booked for ${slot.className} · ${slot.sectionName} in this period.`)
    }
  })
  return messages
}

export function storedConflicts(slots: TimetableSlot[]) {
  const messages: string[] = []
  slots.forEach((slot, index) => {
    slots.slice(index + 1).forEach((other) => {
      if (slot.day !== other.day || slot.period !== other.period || slot.sectionId === other.sectionId) return
      if (slot.facultyId === other.facultyId) {
        messages.push(`${slot.facultyName} is double-booked on ${slot.day} period ${slot.period}: ${slot.className} ${slot.sectionName} and ${other.className} ${other.sectionName}.`)
      }
      if (slot.room && slot.room === other.room) {
        messages.push(`${slot.room} is double-booked on ${slot.day} period ${slot.period}.`)
      }
    })
  })
  return messages
}

export const timetableService = {
  async getSlots() {
    return readSlots()
  },

  async saveSlot(draft: TimetableDraft) {
    const slots = readSlots()
    const existing = slots.find(
      (slot) => slot.sectionId === draft.sectionId && slot.day === draft.day && slot.period === draft.period,
    )
    const id = draft.id || existing?.id
    const conflicts = slotConflicts(slots, draft, id)
    if (conflicts.length) return { slot: null, conflicts }
    const slot: TimetableSlot = {
      id: id || `tt-${Date.now()}`,
      sectionId: draft.sectionId,
      sectionName: draft.sectionName,
      classId: draft.classId,
      className: draft.className,
      day: draft.day,
      period: draft.period,
      subjectId: draft.subjectId,
      subjectName: draft.subjectName,
      facultyId: draft.facultyId,
      facultyName: draft.facultyName,
      room: draft.room.trim(),
    }
    const next = existing
      ? slots.map((item) => (item.id === slot.id ? slot : item))
      : [slot, ...slots]
    writeSlots(next)
    return { slot, conflicts: [] as string[] }
  },

  async deleteSlot(id: string) {
    writeSlots(readSlots().filter((slot) => slot.id !== id))
  },
}
