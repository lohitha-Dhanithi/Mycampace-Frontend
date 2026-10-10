import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService, leaveAwaitingLabel } from '../services/hrmsService'
import { EmptyState, KpiCard, Panel, StatusBadge } from '../components/ui'
import { formatDisplayDate } from '../config/hrmsConfig'
import type { HrmsDashboard } from '../types'

export function HrmsDashboardPage() {
  const [data, setData] = useState<HrmsDashboard | null>(null)

  useEffect(() => {
    hrmsService.getDashboard().then(setData)
  }, [])

  if (!data) return <LoadingState message="Loading HRMS workspace..." />

  const attendanceRate = data.attendanceTotal
    ? Math.round((data.presentToday / data.attendanceTotal) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Finance & Administration</p>
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">HRMS</h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              Unified personnel management for teaching and non-teaching staff. Track certifications, service history, leaves, and the annual appraisal cycle.
            </p>
          </div>
          <Link
            to="/app/hrms/staff/new"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-indigo-600"
          >
            + Add staff
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active staff" value={data.totalStaff} hint={`${data.teaching} teaching · ${data.nonTeaching} non-teaching`} />
        <KpiCard label="Leave approvals" value={data.pendingLeaves} hint="Waiting on manager or HR" />
        <KpiCard label="Appraisal cycle" value={`${data.appraisalsClosed}/${data.appraisalsClosed + data.appraisalsOpen}`} hint={`${data.appraisalsOpen} reviews still open`} />
        <KpiCard label="Attendance today" value={`${attendanceRate}%`} hint={`${data.presentToday} of ${data.attendanceTotal} marked in`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel
            title="Leave approval queue"
            action={
              <Link to="/app/hrms/leaves" className="text-[11px] font-semibold text-blue-600 hover:underline">
                Open leave desk
              </Link>
            }
          >
            {data.leaveQueue.length === 0 ? (
              <EmptyState message="No leave requests are waiting for a decision." />
            ) : (
              <div className="divide-y divide-slate-100">
                {data.leaveQueue.map((leave) => (
                  <Link key={leave.id} to={`/app/hrms/leaves/${leave.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{leave.staffName}</p>
                      <p className="text-[11px] text-slate-500">
                        {leave.type} · {formatDisplayDate(leave.from)} – {formatDisplayDate(leave.to)} · {leave.days} day(s) · with {leaveAwaitingLabel(leave)}
                      </p>
                    </div>
                    <StatusBadge value={leave.status} />
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="Vault & certifications">
            {data.expiringItems.length === 0 ? (
              <EmptyState message="No documents or certifications need attention." />
            ) : (
              <div className="space-y-3">
                {data.expiringItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-500">{item.owner} · {item.detail}</p>
                    </div>
                    <StatusBadge value={item.kind} />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Headcount by department"
          action={
            <Link to="/app/hrms/staff" className="text-[11px] font-semibold text-blue-600 hover:underline">
              Staff directory
            </Link>
          }
        >
          <div className="space-y-2.5">
            {data.departmentCounts.map((row) => (
              <div key={row.name} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3 text-xs">
                <span className="text-slate-600">{row.name}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(row.count / data.totalStaff) * 100}%` }} />
                </div>
                <span className="text-right font-semibold text-slate-800">{row.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Annual appraisal ratings"
          action={
            <Link to="/app/hrms/appraisals" className="text-[11px] font-semibold text-blue-600 hover:underline">
              Open cycle
            </Link>
          }
        >
          {data.ratingCounts.length === 0 ? (
            <EmptyState message="Ratings appear after HR closes a review." />
          ) : (
            <div className="space-y-3">
              {data.ratingCounts.map((row) => (
                <div key={row.rating} className="flex items-center justify-between">
                  <StatusBadge value={row.rating} />
                  <span className="text-sm font-bold text-slate-900">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
