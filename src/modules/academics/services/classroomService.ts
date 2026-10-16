const STORAGE_KEY = 'mycampace_classrooms_v2'

export const DEFAULT_CLASSROOMS = [
  'Room 301, Block C',
  'Room 302, Block C',
  'Room 201, Block C',
  'Room 202, Block C',
  'Room 105, Block B',
  'Room 106, Block B',
  'Turing Hall, Tech Block',
  'Babbage Hall, Tech Block',
  'Physics Lab',
  'Chemistry Lab',
  'Biology Lab',
  'Computer Lab 1',
  'Computer Lab 2',
  'Seminar Hall A',
  'Language Lab',
]

function readClassrooms() {
  if (typeof window === 'undefined') return [...DEFAULT_CLASSROOMS]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLASSROOMS))
      return [...DEFAULT_CLASSROOMS]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim()) : [...DEFAULT_CLASSROOMS]
  } catch {
    return [...DEFAULT_CLASSROOMS]
  }
}

function writeClassrooms(rooms: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export const classroomService = {
  getClassrooms() {
    return readClassrooms()
  },

  addClassroom(name: string) {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Enter a classroom name.')
    const rooms = readClassrooms()
    if (rooms.some((room) => room.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('That classroom is already in the list.')
    }
    const next = [...rooms, trimmed]
    writeClassrooms(next)
    return next
  },

  removeClassroom(name: string) {
    const next = readClassrooms().filter((room) => room !== name)
    writeClassrooms(next)
    return next
  },

  ensureClassrooms(names: string[]) {
    const rooms = readClassrooms()
    const next = [...rooms]
    names.forEach((name) => {
      const trimmed = String(name || '').trim()
      if (trimmed && !next.some((room) => room.toLowerCase() === trimmed.toLowerCase())) next.push(trimmed)
    })
    if (next.length !== rooms.length) writeClassrooms(next)
    return next
  },

  async assignHomeroom(sectionId: string, room: string) {
    const { academicService } = await import('./academicService')
    const sections = await academicService.getAcademicSections()
    await Promise.all(
      sections.map((section) => {
        if (sectionId && section.id === sectionId) {
          return section.room === room ? null : academicService.updateAcademicSection(section.id, { room })
        }
        if (room && section.room === room) {
          return academicService.updateAcademicSection(section.id, { room: '' })
        }
        return null
      }),
    )
    return academicService.getAcademicSections()
  },
}
