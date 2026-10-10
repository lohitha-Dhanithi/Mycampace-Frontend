import React, { useEffect, useState } from 'react'
import { addMinutes, bellScheduleService } from '../services/bellScheduleService'
import type { ScheduleEntry } from '../config/timetableConfig'
import type { TimetableSlot } from '../services/timetableService'

export function PeriodTimingsEditor({
  schedule,
  slots,
  onSaved,
}: {
  schedule: ScheduleEntry[]
  slots: TimetableSlot[]
  onSaved: (schedule: ScheduleEntry[]) => void
}) {
  const [rows, setRows] = useState(schedule)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setRows(schedule)
  }, [schedule])

  const update = (id: string, patch: Partial<ScheduleEntry>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
    setNotice('')
  }

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction
    if (next < 0 || next >= rows.length) return
    const copy = [...rows]
    const [row] = copy.splice(index, 1)
    copy.splice(next, 0, row)
    setRows(copy)
    setNotice('')
  }

  const addPeriod = () => {
    const used = rows.filter((row) => row.kind === 'period').map((row) => row.period || 0)
    const period = Math.max(0, ...used) + 1
    const start = rows[rows.length - 1]?.end || '15:15'
    setRows([
      ...rows,
      { id: `period-${Date.now()}`, kind: 'period', period, label: `Period ${period}`, start, end: addMinutes(start, 45) },
    ])
    setNotice('')
    setError('')
  }

  const addBreak = () => {
    const start = rows[rows.length - 1]?.end || '09:30'
    setRows([
      ...rows,
      { id: `break-${Date.now()}`, kind: 'break', label: 'Break', start, end: addMinutes(start, 15) },
    ])
    setNotice('')
    setError('')
  }

  const remove = (row: ScheduleEntry) => {
    if (row.kind === 'period' && slots.some((slot) => slot.period === row.period)) {
      setError(`Period ${row.period} still has classes. Clear those cells before removing it.`)
      return
    }
    if (row.kind === 'period' && rows.filter((item) => item.kind === 'period').length === 1) {
      setError('Keep at least one class period.')
      return
    }
    setRows(rows.filter((item) => item.id !== row.id))
    setError('')
    setNotice('')
  }

  const save = () => {
    const result = bellScheduleService.saveSchedule(rows)
    if (result.error) {
      setError(result.error)
      setNotice('')
      return
    }
    setError('')
    setNotice('Period timings saved. Every class timetable uses these times.')
    onSaved(result.schedule)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">School day timings</h3>
          <p className="mt-0.5 text-[11px] text-slate-500">These times apply to every class and section. Breaks appear on the weekly grid and cannot hold a class.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addPeriod} className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700">Add period</button>
          <button type="button" onClick={addBreak} className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700">Add break</button>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((row, index) => (
          <div key={row.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[8rem_1fr_7rem_7rem_auto] sm:items-center">
            <span className={`inline-flex h-6 w-fit items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide ${row.kind === 'break' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
              {row.kind === 'break' ? 'Break' : `Period ${row.period}`}
            </span>
            <input
              value={row.label}
              onChange={(event) => update(row.id, { label: event.target.value })}
              className="h-9 rounded-lg border border-slate-200 px-2 text-xs text-slate-800"
              aria-label={row.kind === 'break' ? 'Break name' : `Period ${row.period} name`}
            />
            <input
              type="time"
              value={row.start}
              onChange={(event) => update(row.id, { start: event.target.value })}
              className="h-9 rounded-lg border border-slate-200 px-2 text-xs text-slate-800"
              aria-label={`${row.label} start`}
            />
            <input
              type="time"
              value={row.end}
              onChange={(event) => update(row.id, { end: event.target.value })}
              className="h-9 rounded-lg border border-slate-200 px-2 text-xs text-slate-800"
              aria-label={`${row.label} end`}
            />
            <div className="flex gap-1">
              <button type="button" onClick={() => move(index, -1)} className="h-8 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-600" aria-label={`Move ${row.label} up`}>Up</button>
              <button type="button" onClick={() => move(index, 1)} className="h-8 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-600" aria-label={`Move ${row.label} down`}>Down</button>
              <button type="button" onClick={() => remove(row)} className="h-8 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-red-600" aria-label={`Remove ${row.label}`}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          {notice && <p className="text-xs font-medium text-emerald-700">{notice}</p>}
        </div>
        <button type="button" onClick={save} className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-blue-600">Save timings</button>
      </div>
    </div>
  )
}
