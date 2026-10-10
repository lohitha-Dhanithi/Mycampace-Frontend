import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { StatusBadge } from '../components/ui'
import { ATTENDANCE_DATE, formatDisplayDate } from '../config/hrmsConfig'
import type { AttendanceRecord, AttendanceStatus, Shift } from '../types'

export function AttendancePage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hrmsService.getAttendance().then((result) => {
      setShifts(result.shifts)
      setRecords(result.records)
      setLoading(false)
    })
  }, [])

  const mark = async (id: string, status: AttendanceStatus) => {
    const updated = await hrmsService.updateAttendance(id, status)
    if (!updated) return
    setRecords((current) => current.map((row) => (row.id === id ? { ...row, ...updated } : row)))
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Shifts & attendance"
        description={`Campus roster for ${formatDisplayDate(ATTENDANCE_DATE)}. Mark the day before payroll picks it up.`}
      />

      <div className="grid gap-3 md:grid-cols-3">
        {shifts.map((shift) => (
          <div key={shift.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-900">{shift.name}</p>
            <p className="mt-1 text-xs text-slate-500">{shift.start} – {shift.end}</p>
            <p className="mt-2 text-[11px] font-semibold text-indigo-700">{shift.campus} · {shift.assigned} assigned</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <LoadingState message="Loading attendance..." />
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Shift</th>
                <th className="px-4 py-3 font-semibold">Check in</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.staffName}</p>
                    <p className="text-[11px] text-slate-500">{row.department}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.shift}</td>
                  <td className="px-4 py-3 text-slate-600">{row.checkIn || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge value={row.status} />
                      <div className="w-32">
                        <Select value={row.status} onChange={(event) => mark(row.id, event.target.value as AttendanceStatus)} className="h-8 text-[11px]">
                          <option>Present</option>
                          <option>Late</option>
                          <option>Absent</option>
                          <option>On Leave</option>
                        </Select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
