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

const TITLES: Record<StructureKind, { add: string; edit: string }> = {
  program: { add: 'Add Program', edit: 'Edit Program' },
  course: { add: 'Add Course', edit: 'Edit Course' },
  class: { add: 'Add Class / Academic Level', edit: 'Edit Class / Academic Level' },
  section: { add: 'Add Section', edit: 'Edit Section' },
  subject: { add: 'Add Subject', edit: 'Edit Subject' },
}

const CAMPUSES = ['Hyderabad Main Campus', 'Bengaluru Campus', 'Chennai Campus']
const DEPARTMENTS = ['Science', 'Mathematics', 'Languages', 'Computer Science', 'Commerce', 'Engineering', 'Humanities', 'General Academics']
const SUBJECT_TYPES = ['Theory', 'Theory + Practical', 'Practical', 'Language']

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}

export function StructureFormDialog({
  kind,
  open,
  initialData,
  onOpenChange,
  onCreated,
}: {
  kind: StructureKind
  open: boolean
  initialData?: any
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const [programs, setPrograms] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!open) return
    setError('')

    const isEdit = Boolean(initialData?.id)
    setForm({
      id: initialData?.id || '',
      name: initialData?.name || '',
      code: initialData?.code || '',
      level: initialData?.level || (kind === 'program' ? 'High School (Grades 11-12)' : 'Secondary'),
      description: initialData?.description || '',
      duration: initialData?.duration || '2 Years',
      durationYears: initialData?.durationYears || '2',
      department: initialData?.department || 'Science',
      credits: String(initialData?.credits ?? (kind === 'course' ? 4 : 4)),
      weeklyHours: String(initialData?.weeklyHours ?? 5),
      type: initialData?.type || 'Theory',
      campus: initialData?.campus || CAMPUSES[0],
      program: initialData?.program || '',
      programId: initialData?.programId || '',
      courseId: initialData?.courseId || '',
      classId: initialData?.classId || '',
      room: initialData?.room || '',
      classTeacher: initialData?.classTeacher || '',
      capacity: String(initialData?.capacity ?? 40),
      intakeCapacity: String(initialData?.intakeCapacity ?? 60),
      levelOrder: String(initialData?.levelOrder ?? 1),
      status: initialData?.status || 'Active',
      admissionAvailable: initialData?.admissionAvailable !== false,
    })

    Promise.all([
      academicService.getAcademicPrograms(),
      academicService.getAcademicCourses(),
      academicService.getAcademicClasses(),
      academicService.getAcademicSections(),
    ]).then(([progs, crss, clss, secs]) => {
      setPrograms(progs)
      setCourses(crss)
      setClasses(clss)

      const rooms = classroomService.ensureClassrooms(secs.map((item) => item.room).filter(Boolean))
      setClassrooms(rooms)

      setForm((current) => {
        const next = { ...current }
        if (!next.programId && progs[0]) {
          next.programId = progs[0].id
          next.program = progs[0].name
        }
        if (!next.courseId && crss[0]) {
          const match = crss.find((c) => c.programId === next.programId) || crss[0]
          next.courseId = match.id
        }
        if (!next.classId && clss[0]) {
          next.classId = clss[0].id
        }
        if (!next.room && rooms[0]) {
          next.room = rooms[0]
        }
        return next
      })
    })
  }, [open, initialData, kind])

  const set = (key: string, value: any) => setForm((current) => ({ ...current, [key]: value }))

  const isEdit = Boolean(initialData?.id)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name?.trim()) {
      setError('Name is required.')
      return
    }
    if (kind === 'section' && !form.room) {
      setError('Choose a classroom for this section.')
      return
    }
    if (kind !== 'section' && !form.code?.trim()) {
      setError('Code is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (kind === 'program') {
        const payload = {
          name: form.name.trim(),
          code: form.code.trim(),
          level: form.level?.trim() || 'K-12',
          duration: form.duration?.trim() || `${form.durationYears} Years`,
          durationYears: Number(form.durationYears) || 2,
          description: form.description?.trim(),
          intakeCapacity: Number(form.intakeCapacity) || 120,
          status: form.status,
        }
        if (isEdit) {
          await academicService.updateAcademicProgram(initialData.id, payload)
        } else {
          await academicService.createAcademicProgram(payload)
        }
      } else if (kind === 'course') {
        const payload = {
          name: form.name.trim(),
          code: form.code.trim(),
          department: form.department,
          programId: form.programId,
          duration: form.duration?.trim() || '2 Years',
          credits: Number(form.credits) || 4,
          intakeCapacity: Number(form.intakeCapacity) || 60,
          admissionAvailable: Boolean(form.admissionAvailable),
          status: form.status,
        }
        if (isEdit) {
          await academicService.updateAcademicCourse(initialData.id, payload)
        } else {
          await academicService.createAcademicCourse(payload)
        }
      } else if (kind === 'class') {
        const selectedProg = programs.find((p) => p.id === form.programId)
        const payload = {
          name: form.name.trim(),
          code: form.code.trim(),
          courseId: form.courseId,
          programId: form.programId,
          program: selectedProg?.name || form.program,
          campus: form.campus,
          levelOrder: Number(form.levelOrder) || 1,
          status: form.status,
        }
        if (isEdit) {
          await academicService.updateAcademicClass(initialData.id, payload)
        } else {
          await academicService.createAcademicClass(payload)
        }
      } else if (kind === 'section') {
        const selected = classes.find((item) => item.id === form.classId)
        if (!selected) throw new Error('Choose a class for this section.')
        const payload = {
          name: form.name.trim(),
          classId: selected.id,
          className: selected.name,
          courseId: selected.courseId,
          room: form.room?.trim() || 'TBD',
          classTeacher: form.classTeacher?.trim() || 'Faculty TBD',
          capacity: Number(form.capacity) || 40,
          status: form.status,
        }
        if (isEdit) {
          await academicService.updateAcademicSection(initialData.id, payload)
        } else {
          const created = await academicService.createAcademicSection(payload)
          if (form.room) {
            await classroomService.assignHomeroom(created.id, form.room.trim())
          }
        }
      } else {
        // Subject
        const payload = {
          name: form.name.trim(),
          code: form.code.trim(),
          department: form.department,
          type: form.type,
          credits: Number(form.credits) || 1,
          weeklyHours: Number(form.weeklyHours) || 1,
          status: form.status,
        }
        if (isEdit) {
          await academicService.updateAcademicSubject(initialData.id, payload)
        } else {
          await academicService.createAcademicSubject(payload)
        }
      }
      onOpenChange(false)
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  // Filter courses by selected program when configuring class
  const filteredCourses = form.programId
    ? courses.filter((c) => c.programId === form.programId)
    : courses

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={submit}>
        <DialogHeader>
          <DialogTitle>{isEdit ? TITLES[kind].edit : TITLES[kind].add}</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-h-[80vh] overflow-y-auto space-y-3.5 pr-2">
          <Field label="Name" required>
            <Input
              value={form.name || ''}
              onChange={(event) => set('name', event.target.value)}
              placeholder={
                kind === 'program'
                  ? 'e.g. Senior Secondary Education'
                  : kind === 'course'
                  ? 'e.g. Higher Secondary — Science Stream (PCM / PCB)'
                  : kind === 'class'
                  ? 'e.g. Class 11 or Semester 1'
                  : kind === 'section'
                  ? 'e.g. Section A'
                  : 'e.g. Physics (Theory & Lab)'
              }
              required
            />
          </Field>

          {kind !== 'section' && (
            <Field label="Unique Code" required>
              <Input
                value={form.code || ''}
                onChange={(event) => set('code', event.target.value)}
                placeholder={
                  kind === 'program'
                    ? 'PROG-SR-SEC'
                    : kind === 'course'
                    ? 'CRS-SCI-1112'
                    : kind === 'class'
                    ? 'GR-11'
                    : 'PHY-042'
                }
                required
              />
            </Field>
          )}

          {/* Program specific fields */}
          {kind === 'program' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Education Level">
                  <Input
                    value={form.level || ''}
                    onChange={(event) => set('level', event.target.value)}
                    placeholder="e.g. High School (Grades 11-12) or Higher Ed"
                  />
                </Field>
                <Field label="Duration (Years)">
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={form.durationYears || ''}
                    onChange={(event) => set('durationYears', event.target.value)}
                  />
                </Field>
              </div>
              <Field label="Intake Seat Limit">
                <Input
                  type="number"
                  min={1}
                  value={form.intakeCapacity || ''}
                  onChange={(event) => set('intakeCapacity', event.target.value)}
                />
              </Field>
              <Field label="Description">
                <Input
                  value={form.description || ''}
                  onChange={(event) => set('description', event.target.value)}
                  placeholder="Program overview and qualification pathway"
                />
              </Field>
            </>
          )}

          {/* Course specific fields */}
          {kind === 'course' && (
            <>
              <Field label="Parent Program" required>
                <Select
                  value={form.programId}
                  onChange={(event) => {
                    const selectedProg = programs.find((p) => p.id === event.target.value)
                    set('programId', event.target.value)
                    set('program', selectedProg?.name || '')
                  }}
                >
                  {programs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Department">
                  <Select value={form.department} onChange={(event) => set('department', event.target.value)}>
                    {DEPARTMENTS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Academic Credits">
                  <Input
                    type="number"
                    min={1}
                    value={form.credits || ''}
                    onChange={(event) => set('credits', event.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Intake Seat Limit">
                  <Input
                    type="number"
                    min={1}
                    value={form.intakeCapacity || ''}
                    onChange={(event) => set('intakeCapacity', event.target.value)}
                  />
                </Field>
                <Field label="Admissions Availability">
                  <Select
                    value={form.admissionAvailable ? 'Open' : 'Closed'}
                    onChange={(e) => set('admissionAvailable', e.target.value === 'Open')}
                  >
                    <option value="Open">Open for Admissions</option>
                    <option value="Closed">Admissions Closed</option>
                  </Select>
                </Field>
              </div>
            </>
          )}

          {/* Class specific fields */}
          {kind === 'class' && (
            <>
              <Field label="Parent Program" required>
                <Select
                  value={form.programId}
                  onChange={(event) => {
                    const pId = event.target.value
                    const p = programs.find((item) => item.id === pId)
                    set('programId', pId)
                    set('program', p?.name || '')
                    const matchingCourses = courses.filter((c) => c.programId === pId)
                    if (matchingCourses[0]) {
                      set('courseId', matchingCourses[0].id)
                    }
                  }}
                >
                  {programs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Parent Course Offering" required>
                <Select
                  value={form.courseId}
                  onChange={(event) => set('courseId', event.target.value)}
                >
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.code})
                      </option>
                    ))
                  ) : (
                    <option value="">No courses under selected program</option>
                  )}
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Campus">
                  <Select value={form.campus} onChange={(event) => set('campus', event.target.value)}>
                    {CAMPUSES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Level Order (Sort Order)">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={form.levelOrder || ''}
                    onChange={(event) => set('levelOrder', event.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Section specific fields */}
          {kind === 'section' && (
            <>
              <Field label="Parent Class / Academic Level" required>
                <Select value={form.classId} onChange={(event) => set('classId', event.target.value)}>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Assigned Classroom" required>
                  <Select value={form.room} onChange={(event) => set('room', event.target.value)}>
                    {classrooms.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Capacity">
                  <Input
                    type="number"
                    min={1}
                    value={form.capacity || ''}
                    onChange={(event) => set('capacity', event.target.value)}
                  />
                </Field>
              </div>

              <Field label="Class Teacher (Faculty)">
                <Input
                  value={form.classTeacher || ''}
                  onChange={(event) => set('classTeacher', event.target.value)}
                  placeholder="e.g. Pooja Iyer or Dr. Suresh Kumar"
                />
              </Field>
            </>
          )}

          {/* Subject specific fields */}
          {kind === 'subject' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Department">
                  <Select value={form.department} onChange={(event) => set('department', event.target.value)}>
                    {DEPARTMENTS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Subject Type">
                  <Select value={form.type} onChange={(event) => set('type', event.target.value)}>
                    {SUBJECT_TYPES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Credits">
                  <Input
                    type="number"
                    min={1}
                    value={form.credits || ''}
                    onChange={(event) => set('credits', event.target.value)}
                  />
                </Field>
                <Field label="Weekly Hours">
                  <Input
                    type="number"
                    min={1}
                    value={form.weeklyHours || ''}
                    onChange={(event) => set('weeklyHours', event.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Status field */}
          <Field label="Record Status">
            <Select value={form.status || 'Active'} onChange={(event) => set('status', event.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive (Deactivated)</option>
            </Select>
          </Field>

          {error && <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}
        </DialogContent>
        <DialogFooter className="pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? 'Saving...' : isEdit ? 'Update Record' : 'Save Record'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
