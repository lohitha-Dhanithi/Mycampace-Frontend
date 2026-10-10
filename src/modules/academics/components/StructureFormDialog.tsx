import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { academicService } from '../services/academicService'
import { classroomService } from '../services/classroomService'

export type StructureKind = 'program' | 'course' | 'class' | 'section' | 'subject'

const TITLES: Record<StructureKind, string> = {
  program: 'Add program',
  course: 'Add course',
  class: 'Add class',
  section: 'Add section',
  subject: 'Add subject',
}

const CAMPUSES = ['Hyderabad Main Campus', 'Bengaluru Campus', 'Chennai Campus']
const DEPARTMENTS = ['Science', 'Mathematics', 'Languages', 'Computer Science', 'Commerce', 'Humanities', 'General Academics']
const SUBJECT_TYPES = ['Theory', 'Theory + Practical', 'Practical', 'Language']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  )
}

export function StructureFormDialog({
  kind,
  open,
  onOpenChange,
  onCreated,
}: {
  kind: StructureKind
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [programs, setPrograms] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setError('')
    setForm({
      name: '',
      code: '',
      level: 'Secondary',
      duration: '1 Year',
      department: 'Science',
      credits: '4',
      weeklyHours: '5',
      type: 'Theory',
      campus: CAMPUSES[0],
      program: '',
      programId: '',
      classId: '',
      room: '',
      classTeacher: '',
      capacity: '40',
    })
    academicService.getAcademicPrograms().then((rows) => {
      setPrograms(rows)
      if (rows[0]) {
        setForm((current) => ({
          ...current,
          program: current.program || rows[0].name,
          programId: current.programId || rows[0].id,
        }))
      }
    })
    academicService.getAcademicClasses().then((rows) => {
      setClasses(rows)
      if (rows[0]) setForm((current) => ({ ...current, classId: current.classId || rows[0].id }))
    })
    academicService.getAcademicSections().then((rows) => {
      const rooms = classroomService.ensureClassrooms(rows.map((item) => item.room).filter(Boolean))
      setClassrooms(rooms)
      if (rooms[0]) setForm((current) => ({ ...current, room: current.room || rooms[0] }))
    })
  }, [open])

  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    if (kind === 'section' && !form.room) {
      setError('Choose a classroom for this section.')
      return
    }
    if (kind !== 'section' && !form.code.trim()) {
      setError('Code is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (kind === 'program') {
        await academicService.createAcademicProgram({
          name: form.name.trim(),
          code: form.code.trim(),
          level: form.level.trim(),
          duration: form.duration.trim(),
          department: form.department,
          coursesCount: 0,
          studentCount: 0,
        })
      } else if (kind === 'course') {
        await academicService.createAcademicCourse({
          name: form.name.trim(),
          code: form.code.trim(),
          department: form.department,
          credits: form.credits,
          programId: form.programId,
          classesCount: 0,
          subjectsCount: 0,
          studentsCount: 0,
        })
      } else if (kind === 'class') {
        await academicService.createAcademicClass({
          name: form.name.trim(),
          code: form.code.trim(),
          program: form.program,
          campus: form.campus,
          sectionsCount: 0,
          totalStudents: 0,
        })
      } else if (kind === 'section') {
        const selected = classes.find((item) => item.id === form.classId)
        if (!selected) throw new Error('Choose a class for this section.')
        const created = await academicService.createAcademicSection({
          name: form.name.trim(),
          classId: selected.id,
          className: selected.name,
          room: form.room.trim(),
          classTeacher: form.classTeacher.trim() || 'Faculty TBD',
          capacity: Number(form.capacity) || 40,
          currentStrength: 0,
        })
        await classroomService.assignHomeroom(created.id, form.room.trim())
      } else {
        await academicService.createAcademicSubject({
          name: form.name.trim(),
          code: form.code.trim(),
          department: form.department,
          type: form.type,
          credits: Number(form.credits) || 1,
          weeklyHours: Number(form.weeklyHours) || 1,
        })
      }
      onOpenChange(false)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={submit}>
        <DialogHeader>
          <DialogTitle>{TITLES[kind]}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <Field label="Name">
            <Input value={form.name || ''} onChange={(event) => set('name', event.target.value)} placeholder={kind === 'class' ? 'Class 6' : ''} />
          </Field>
          {kind !== 'section' && (
            <Field label="Code">
              <Input value={form.code || ''} onChange={(event) => set('code', event.target.value)} placeholder={kind === 'class' ? 'GR-06' : ''} />
            </Field>
          )}
          {kind === 'program' && (
            <>
              <Field label="Education level">
                <Input value={form.level || ''} onChange={(event) => set('level', event.target.value)} />
              </Field>
              <Field label="Duration">
                <Input value={form.duration || ''} onChange={(event) => set('duration', event.target.value)} />
              </Field>
            </>
          )}
          {(kind === 'program' || kind === 'course' || kind === 'subject') && (
            <Field label="Department">
              <Select value={form.department} onChange={(event) => set('department', event.target.value)}>
                {DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </Field>
          )}
          {kind === 'course' && (
            <Field label="Program">
              <Select value={form.programId} onChange={(event) => set('programId', event.target.value)}>
                {programs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Select>
            </Field>
          )}
          {kind === 'class' && (
            <>
              <Field label="Program">
                <Select value={form.program} onChange={(event) => set('program', event.target.value)}>
                  {programs.map((item) => <option key={item.id}>{item.name}</option>)}
                </Select>
              </Field>
              <Field label="Campus">
                <Select value={form.campus} onChange={(event) => set('campus', event.target.value)}>
                  {CAMPUSES.map((item) => <option key={item}>{item}</option>)}
                </Select>
              </Field>
            </>
          )}
          {kind === 'section' && (
            <>
              <Field label="Class">
                <Select value={form.classId} onChange={(event) => set('classId', event.target.value)}>
                  {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Select>
              </Field>
              <Field label="Classroom">
                <Select value={form.room} onChange={(event) => set('room', event.target.value)}>
                  {classrooms.map((item) => <option key={item}>{item}</option>)}
                </Select>
              </Field>
              <Field label="Class teacher">
                <Input value={form.classTeacher || ''} onChange={(event) => set('classTeacher', event.target.value)} />
              </Field>
              <Field label="Capacity">
                <Input type="number" min={1} value={form.capacity || ''} onChange={(event) => set('capacity', event.target.value)} />
              </Field>
            </>
          )}
          {kind === 'subject' && (
            <>
              <Field label="Type">
                <Select value={form.type} onChange={(event) => set('type', event.target.value)}>
                  {SUBJECT_TYPES.map((item) => <option key={item}>{item}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Credits">
                  <Input type="number" min={1} value={form.credits || ''} onChange={(event) => set('credits', event.target.value)} />
                </Field>
                <Field label="Weekly hours">
                  <Input type="number" min={1} value={form.weeklyHours || ''} onChange={(event) => set('weeklyHours', event.target.value)} />
                </Field>
              </div>
            </>
          )}
          {kind === 'course' && (
            <Field label="Credits">
              <Input type="number" min={1} value={form.credits || ''} onChange={(event) => set('credits', event.target.value)} />
            </Field>
          )}
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
