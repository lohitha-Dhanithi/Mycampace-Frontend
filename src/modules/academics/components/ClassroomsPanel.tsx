import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { academicService } from '../services/academicService'
import { classroomService } from '../services/classroomService'
import { timetableService, type TimetableSlot } from '../services/timetableService'
import { LoadingState } from '@/components/common/LoadingState'

interface SectionOption {
  id: string
  name: string
  className?: string
  room?: string
}

export function ClassroomsPanel({
  open: openProp,
  onOpenChange,
  onUpdated,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUpdated?: (sections: SectionOption[], classrooms: string[]) => void
}) {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<SectionOption[]>([])
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [classrooms, setClassrooms] = useState<string[]>([])
  const [internalOpen, setInternalOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  useEffect(() => {
    Promise.all([
      academicService.getAcademicSections(),
      timetableService.getSlots(),
    ]).then(([sectionRows, slotRows]) => {
      const nextClassrooms = classroomService.ensureClassrooms(sectionRows.map((item) => item.room).filter(Boolean))
      setSections(sectionRows)
      setSlots(slotRows)
      setClassrooms(nextClassrooms)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!open) return
    setRoomName('')
    setError('')
    setSaving(false)
  }, [open])

  const rooms = Array.from(new Set([
    ...sections.map((item) => item.room).filter(Boolean),
    ...classrooms,
    ...slots.map((slot) => slot.room),
  ])) as string[]
  const sectionRooms = new Set(sections.map((item) => item.room).filter(Boolean))

  const publish = (nextSections: SectionOption[], nextClassrooms: string[]) => {
    onUpdated?.(nextSections, nextClassrooms)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const name = roomName.trim()
    if (!name) {
      setError('Name is required.')
      return
    }
    if (rooms.some((item) => item.toLowerCase() === name.toLowerCase())) {
      setError('That classroom is already in the list.')
      return
    }
    setSaving(true)
    try {
      const next = classroomService.addClassroom(name)
      setClassrooms(next)
      setNotice(`${name} added. It is available on the classroom matrix and when assigning a period.`)
      publish(sections, next)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enter a classroom name.')
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="Loading classrooms..." />

  return (
    <>
      {openProp === undefined && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add classroom
          </Button>
        </div>
      )}
      {notice && <p className="text-xs font-medium text-emerald-700">{notice}</p>}
      {error && !open && <p className="text-xs font-medium text-red-600">{error}</p>}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {rooms.map((item) => {
            const homeroom = sections.find((sectionRow) => sectionRow.room === item)
            const canRemove = classrooms.includes(item) && !sectionRooms.has(item) && !slots.some((slot) => slot.room === item)
            return (
              <div key={item} className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_16rem_auto] sm:items-center">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{homeroom ? `${homeroom.className} · ${homeroom.name}` : 'No homeroom section'}</p>
                </div>
                <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Homeroom section
                  <select
                    value={homeroom?.id || ''}
                    onChange={async (event) => {
                      try {
                        const next = await classroomService.assignHomeroom(event.target.value, item)
                        setSections(next)
                        setError('')
                        const attached = next.find((sectionRow) => sectionRow.id === event.target.value)
                        setNotice(attached ? `${attached.className} · ${attached.name} now uses ${item}.` : `${item} has no homeroom section.`)
                        publish(next, classrooms)
                      } catch (err) {
                        setNotice('')
                        setError(err instanceof Error ? err.message : 'Could not attach this section.')
                      }
                    }}
                    className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-1 text-[11px] font-medium normal-case tracking-normal text-slate-700"
                  >
                    <option value="">None</option>
                    {sections.map((sectionRow) => (
                      <option key={sectionRow.id} value={sectionRow.id}>
                        {sectionRow.className} · {sectionRow.name}
                      </option>
                    ))}
                  </select>
                </label>
                {canRemove ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = classroomService.removeClassroom(item)
                      setClassrooms(next)
                      setNotice(`${item} removed.`)
                      publish(sections, next)
                    }}
                    className="h-8 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-red-600"
                  >
                    Remove
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">{sectionRooms.has(item) ? 'Homeroom' : 'In use'}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add classroom</DialogTitle>
          </DialogHeader>
          <DialogContent className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Classroom</span>
              <Input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                placeholder="Room 401, Block D"
                autoFocus
              />
            </label>
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          </DialogContent>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
