// src/modules/students/components/StudentAttendanceSummary.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarCheck, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentAttendanceSummary({ attendanceSummary, recentRecords = [] }) {
  const navigate = useNavigate()
  const summary = attendanceSummary || {
    attendancePercentage: 96.4,
    presentDays: 79,
    absentDays: 2,
    lateDays: 1,
    totalWorkingDays: 82,
  }

  const sampleRecent = recentRecords.length > 0 ? recentRecords : [
    { date: '2026-10-02', status: 'Present', session: 'Full Day Classroom Session' },
    { date: '2026-10-01', status: 'Present', session: 'Full Day Classroom Session' },
    { date: '2026-09-30', status: 'Present', session: 'Full Day Classroom Session' },
    { date: '2026-09-29', status: 'Late', session: 'Late Arrival (08:45 AM)' },
    { date: '2026-09-26', status: 'Present', session: 'Full Day Classroom Session' },
    { date: '2026-09-25', status: 'Absent', session: 'Unexcused Absence' },
  ]

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Attendance %</span>
            <div className="text-2xl font-extrabold text-emerald-700">{summary.attendancePercentage}%</div>
            <div className="text-[10px] text-slate-400">Current Semester Aggregated</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Present Days</span>
            <div className="text-2xl font-extrabold text-slate-800">{summary.presentDays}</div>
            <div className="text-[10px] text-slate-400">Out of {summary.totalWorkingDays} instructional days</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Absent Days</span>
            <div className="text-2xl font-extrabold text-red-600">{summary.absentDays}</div>
            <div className="text-[10px] text-slate-400">Unexcused missed hours</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Late Arrivals</span>
            <div className="text-2xl font-extrabold text-amber-600">{summary.lateDays}</div>
            <div className="text-[10px] text-slate-400">Recorded entry beyond bell</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Log */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Recent Attendance Logs</CardTitle>
            <p className="text-[11px] text-slate-500">Classroom roll calls and biometric scanner logs</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/academics/attendance')}
            className="text-xs h-7 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View Attendance Details <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
            {sampleRecent.map((r, i) => (
              <div key={i} className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-slate-800">{r.date}</span>
                  <span className="text-slate-500">{r.session}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.status === 'Present'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : r.status === 'Absent'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
