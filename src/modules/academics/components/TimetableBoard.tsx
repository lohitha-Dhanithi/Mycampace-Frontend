import React, { useEffect, useMemo, useState } from 'react'
import { academicService } from '../services/academicService'
import { storedConflicts, timetableService, type TimetableSlot } from '../services/timetableService'
import { DAYS, SUBJECT_TONE, type ScheduleEntry } from '../config/timetableConfig'
import { bellScheduleService } from '../services/bellScheduleService'
import { classroomService } from '../services/classroomService'
import { PeriodTimingsEditor } from './PeriodTimingsEditor'
import { ClassroomsPanel } from './ClassroomsPanel'
import { LoadingState } from '@/components/common/LoadingState'

interface SectionOption {
  id: string
  name: string
  classId?: string
  className?: string
  room?: string
}

interface SubjectOption {
  id: string
  name: string
}

interface FacultyOption {
  facultyId: string
  facultyName: string
}

export function TimetableBoard({
  classId,
  sectionId,
}: {
  classId?: string
  sectionId?: string
}) {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<SectionOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [faculty, setFaculty] = useState<FacultyOption[]>([])
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState(sectionId || '')
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [classrooms, setClassrooms] = useState<string[]>([])
  const [view, setView] = useState<'schedule' | 'rooms' | 'classrooms' | 'faculty' | 'timings'>('schedule')
  const [roomDay, setRoomDay] = useState('Monday')
  const [facultyId, setFacultyId] = useState('')
  const [editing, setEditing] = useState<{ day: string; period: number; slot?: TimetableSlot } | null>(null)
  const [subjectId, setSubjectId] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState('')
  const [room, setRoom] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = async () => {
    const [sectionRows, subjectRows, assignmentRows, slotRows] = await Promise.all([
      academicService.getAcademicSections(),
      academicService.getAcademicSubjects(),
      academicService.getFacultyAssignments(),
      timetableService.getSlots(),
    ])
    const facultyRows = new Map<string, string>()
    assignmentRows.forEach((item) => {
      if (item.facultyId && item.facultyName) facultyRows.set(item.facultyId, item.facultyName)
    })
    slotRows.forEach((item) => {
      if (item.facultyId && item.facultyName) facultyRows.set(item.facultyId, item.facultyName)
    })
    setSections(sectionRows)
    setSubjects(subjectRows)
    setFaculty(Array.from(facultyRows, ([id, name]) => ({ facultyId: id, facultyName: name })))
    setSlots(slotRows)
    setSchedule(bellScheduleService.getSchedule())
    setClassrooms(classroomService.ensureClassrooms(sectionRows.map((item) => item.room).filter(Boolean)))
    setFacultyId((current) => current || assignmentRows[0]?.facultyId || '')
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const visibleSections = useMemo(() => {
    if (sectionId) return sections.filter((item) => item.id === sectionId)
    if (classId) return sections.filter((item) => item.classId === classId)
    return sections
  }, [sections, classId, sectionId])

  useEffect(() => {
    if (!visibleSections.length) return
    const stillVisible = visibleSections.some((item) => item.id === selectedSectionId)
    if (!stillVisible) setSelectedSectionId(sectionId || visibleSections[0].id)
  }, [visibleSections, selectedSectionId, sectionId])

  const periods = schedule.filter((entry) => entry.kind === 'period' && entry.period)
  const section = visibleSections.find((item) => item.id === selectedSectionId) || visibleSections[0]
  const sectionSlots = slots.filter((slot) => slot.sectionId === section?.id)
  const rooms = Array.from(new Set([
    ...sections.map((item) => item.room).filter(Boolean),
    ...classrooms,
    ...slots.map((slot) => slot.room),
  ])) as string[]
  const clashes = storedConflicts(slots)

  const openCell = (day: string, period: number) => {
    const slot = sectionSlots.find((item) => item.day === day && item.period === period)
    setEditing({ day, period, slot })
    setSubjectId(slot?.subjectId || subjects[0]?.id || '')
    setSelectedFacultyId(slot?.facultyId || faculty[0]?.facultyId || '')
    setRoom(slot?.room || section?.room || rooms[0] || '')
    setError('')
    setNotice('')
  }

  const save = async () => {
    if (!section) return
    const subject = subjects.find((item) => item.id === subjectId)
    const teacher = faculty.find((item) => item.facultyId === selectedFacultyId)
    if (!editing || !subject || !teacher || !room.trim()) {
      setError('Subject, faculty, and room are required.')
      return
    }
    const result = await timetableService.saveSlot({
      id: editing.slot?.id,
      sectionId: section.id,
      sectionName: section.name,
      classId: section.classId || classId || '',
      className: section.className || '',
      day: editing.day,
      period: editing.period,
      subjectId: subject.id,
      subjectName: subject.name,
      facultyId: teacher.facultyId,
      facultyName: teacher.facultyName,
      room: room.trim(),
    })
    if (result.conflicts.length) {
      setError(result.conflicts.join(' '))
      return
    }
    setSlots(await timetableService.getSlots())
    setEditing(null)
    setNotice(`${editing.day} period ${editing.period} saved for ${section.name}.`)
  }

  const clear = async () => {
    if (!editing?.slot) {
      setEditing(null)
      return
    }
    await timetableService.deleteSlot(editing.slot.id)
    setSlots(await timetableService.getSlots())
    setEditing(null)
    setNotice('Period cleared.')
  }

  if (loading) return <LoadingState message="Loading timetable..." />
  if (!section) {
    return <p className="text-sm text-slate-500">Add a section before building a timetable.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ['schedule', 'Weekly schedule'],
            ['rooms', 'Classroom matrix'],
            ['classrooms', 'Classrooms'],
            ['faculty', 'Faculty load'],
            ['timings', 'Period timings'],
          ] as const).map(([item, label]) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`h-8 rounded-lg px-3 text-xs font-semibold ${view === item ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
        {view === 'schedule' && !sectionId && (
          <label className="text-xs font-semibold text-slate-600">
            Section
            <select
              value={section.id}
              onChange={(event) => {
                setSelectedSectionId(event.target.value)
                setEditing(null)
              }}
              className="mt-1 block h-9 min-w-56 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-800"
            >
              {visibleSections.map((item) => (
                <option key={item.id} value={item.id}>{item.className} · {item.name}{item.room ? ` · ${item.room}` : ''}</option>
              ))}
            </select>
          </label>
        )}
        {view === 'rooms' && (
          <label className="text-xs font-semibold text-slate-600">
            Day
            <select value={roomDay} onChange={(event) => setRoomDay(event.target.value)} className="mt-1 block h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs">
              {DAYS.map((day) => <option key={day}>{day}</option>)}
            </select>
          </label>
        )}
        {view === 'faculty' && (
          <label className="text-xs font-semibold text-slate-600">
            Faculty
            <select value={facultyId} onChange={(event) => setFacultyId(event.target.value)} className="mt-1 block h-9 min-w-48 rounded-lg border border-slate-200 bg-white px-2 text-xs">
              {faculty.map((item) => <option key={item.facultyId} value={item.facultyId}>{item.facultyName}</option>)}
            </select>
          </label>
        )}
      </div>

      {notice && <p className="text-xs font-medium text-emerald-700">{notice}</p>}
      {clashes.length > 0 && view !== 'schedule' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {clashes.slice(0, 3).map((message) => <p key={message}>{message}</p>)}
        </div>
      )}

      {view === 'schedule' && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[860px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-semibold">Period</th>
                  {DAYS.map((day) => <th key={day} className="px-2 py-2 font-semibold">{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry) => entry.kind === 'break' ? (
                  <tr key={entry.id} className="border-b border-slate-100 bg-amber-50/60">
                    <td colSpan={7} className="px-3 py-1.5 text-center text-[11px] font-semibold text-amber-800">
                      {entry.label} · {entry.start}–{entry.end}
                    </td>
                  </tr>
                ) : (
                  <tr key={entry.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs font-bold text-slate-800">{entry.period}</p>
                      <p className="text-[10px] text-slate-400">{entry.start}–{entry.end}</p>
                    </td>
                    {DAYS.map((day) => {
                      const slot = sectionSlots.find((item) => item.day === day && item.period === entry.period)
                      const active = editing?.day === day && editing.period === entry.period
                      return (
                        <td key={day} className="p-1.5 align-top">
                          <button
                            type="button"
                            onClick={() => openCell(day, entry.period as number)}
                            className={`min-h-16 w-full rounded-lg border px-2 py-1.5 text-left ${slot ? SUBJECT_TONE[slot.subjectId] || 'bg-slate-50 text-slate-800 border-slate-200' : 'border-dashed border-slate-200 text-slate-400 hover:border-slate-300'} ${active ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            {slot ? (
                              <>
                                <p className="text-[11px] font-bold leading-tight">{slot.subjectName}</p>
                                <p className="mt-0.5 text-[10px]">{slot.facultyName}</p>
                                <p className="text-[10px] opacity-70">{slot.room}</p>
                              </>
                            ) : (
                              <span className="text-[10px]">Add period</span>
                            )}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editing && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">
                {section.className} · {section.name} · {editing.day} · Period {editing.period}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">{periods.find((item) => item.period === editing.period)?.start}–{periods.find((item) => item.period === editing.period)?.end}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="text-[11px] font-semibold text-slate-600">
                  Subject
                  <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-xs">
                    {subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </label>
                <label className="text-[11px] font-semibold text-slate-600">
                  Faculty
                  <select value={selectedFacultyId} onChange={(event) => setSelectedFacultyId(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-xs">
                    {faculty.map((item) => <option key={item.facultyId} value={item.facultyId}>{item.facultyName}</option>)}
                  </select>
                </label>
                <label className="text-[11px] font-semibold text-slate-600">
                  Room
                  <select value={room} onChange={(event) => setRoom(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-xs">
                    {room && !rooms.includes(room) && <option value={room}>{room}</option>}
                    {rooms.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={save} className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-blue-600">Save period</button>
                <button type="button" onClick={clear} className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600">Clear</button>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'classrooms' && (
        <ClassroomsPanel
          onUpdated={(nextSections, nextClassrooms) => {
            setSections(nextSections)
            setClassrooms(nextClassrooms)
          }}
        />
      )}

      {view === 'rooms' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-[860px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">Room</th>
                {periods.map((period) => <th key={period.id} className="px-2 py-2 font-semibold">P{period.period}<span className="mt-0.5 block font-normal normal-case tracking-normal text-slate-400">{period.start}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {rooms.map((item) => (
                <tr key={item} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-xs font-semibold text-slate-800">
                    <p>{item}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      {sections.find((sectionRow) => sectionRow.room === item)?.name || 'No homeroom'}
                    </p>
                  </td>
                  {periods.map((period) => {
                    const bookings = slots.filter((slot) => slot.room === item && slot.day === roomDay && slot.period === period.period)
                    return (
                      <td key={period.id} className="p-1.5 align-top">
                        {bookings.length === 0 ? (
                          <span className="text-[10px] text-slate-300">Free</span>
                        ) : (
                          bookings.map((slot) => (
                            <div key={slot.id} className={`mb-1 rounded-md border px-1.5 py-1 text-[10px] ${bookings.length > 1 ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                              <p className="font-semibold">{slot.className}</p>
                              <p>{slot.sectionName}</p>
                              <p>{slot.subjectName}</p>
                            </div>
                          ))
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'faculty' && (
        <FacultyWeek slots={slots.filter((slot) => slot.facultyId === facultyId)} periods={periods} />
      )}

      {view === 'timings' && (
        <PeriodTimingsEditor schedule={schedule} slots={slots} onSaved={setSchedule} />
      )}
    </div>
  )
}

function FacultyWeek({ slots, periods }: { slots: TimetableSlot[]; periods: ScheduleEntry[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{slots.length} periods assigned this week.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[860px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 text-left font-semibold">Period</th>
              {DAYS.map((day) => <th key={day} className="px-2 py-2 text-left font-semibold">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className="border-b border-slate-100">
                <td className="px-3 py-2 text-xs font-bold text-slate-800">
                  {period.period}
                  <p className="text-[10px] font-normal text-slate-400">{period.start}–{period.end}</p>
                </td>
                {DAYS.map((day) => {
                  const matches = slots.filter((slot) => slot.day === day && slot.period === period.period)
                  return (
                    <td key={day} className="p-1.5 align-top">
                      {matches.map((slot) => (
                        <div key={slot.id} className={`rounded-md border px-1.5 py-1 text-[10px] ${matches.length > 1 ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <p className="font-semibold">{slot.subjectName}</p>
                          <p>{slot.className} · {slot.sectionName}</p>
                          <p>{slot.room}</p>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
