import React, { useEffect, useMemo, useState } from 'react'
import { Search, Check } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { EmptyState, StatusBadge } from '../components/ui'
import { ATTENDANCE_DATE, formatDisplayDate } from '../config/hrmsConfig'
import type { AttendanceRecord, AttendanceStatus, Shift } from '../types'

export function AttendancePage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [savedId, setSavedId] = useState<string | null>(null)

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
    setSavedId(id)
    setTimeout(() => {
      setSavedId((curr) => (curr === id ? null : curr))
    }, 2000)
  }

  const filteredRecords = useMemo(() => {
    return records.filter((row) => {
      const matchSearch =
        !search.trim() ||
        row.staffName.toLowerCase().includes(search.toLowerCase()) ||
        row.department.toLowerCase().includes(search.toLowerCase())
      const matchShift = shiftFilter === 'all' || row.shift === shiftFilter
      const matchStatus = statusFilter === 'all' || row.status === statusFilter
      return matchSearch && matchShift && matchStatus
    })
  }, [records, search, shiftFilter, statusFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Shifts & attendance"
        description={`Campus roster for ${formatDisplayDate(ATTENDANCE_DATE)}. Mark the day before payroll picks it up.`}
      />

      <div className="grid gap-3 md:grid-cols-3">
        {shifts.map((shift) => (
          <div key={shift.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <p className="text-sm font-bold text-slate-900">{shift.name}</p>
            <p className="mt-1 text-xs text-slate-500">{shift.start} – {shift.end}</p>
            <p className="mt-2 text-[11px] font-semibold text-indigo-700">{shift.campus} · {shift.assigned} assigned</p>
          </div>
        ))}
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_12rem_12rem]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff name or department..."
            className="pl-9 text-xs"
          />
        </div>
        <Select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className="text-xs">
          <option value="all">All Shifts</option>
          {shifts.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs">
          <option value="all">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
          <option value="On Leave">On Leave</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        {loading ? (
          <LoadingState message="Loading attendance..." />
        ) : filteredRecords.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <EmptyState message="No attendance records match your filter criteria." />
            {(search || shiftFilter !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setShiftFilter('all')
                  setStatusFilter('all')
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Reset attendance filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Shift</th>
                <th className="px-4 py-3 font-semibold">Check in</th>
                <th className="px-4 py-3 font-semibold">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.staffName}</p>
                    <p className="text-[11px] text-slate-500">{row.department}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.shift}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{row.checkIn || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge value={row.status} />
                      <div className="w-32">
                        <Select
                          value={row.status}
                          onChange={(event) => mark(row.id, event.target.value as AttendanceStatus)}
                          className="h-8 text-[11px]"
                        >
                          <option>Present</option>
                          <option>Late</option>
                          <option>Absent</option>
                          <option>On Leave</option>
                        </Select>
                      </div>
                      {savedId === row.id && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 animate-in fade-in">
                          <Check className="h-3 w-3" /> Saved
                        </span>
                      )}
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
