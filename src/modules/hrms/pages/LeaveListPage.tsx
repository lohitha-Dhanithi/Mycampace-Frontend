import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService, leaveAwaitingLabel } from '../services/hrmsService'
import { EmptyState, StatusBadge } from '../components/ui'
import { formatDisplayDate } from '../config/hrmsConfig'
import type { LeaveRequest } from '../types'

export function LeaveListPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')

  useEffect(() => {
    setLoading(true)
    hrmsService.getLeaves(status).then((rows) => {
      setLeaves(rows)
      setLoading(false)
    })
  }, [status])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave requests"
        description="Each request follows the staff reporting chain, then HR gives the final decision."
        actions={
          <Link to="/app/hrms/leaves/new" className="inline-flex h-8 items-center rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-600 transition-colors">
            + New request
          </Link>
        }
      />

      <div className="w-52">
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="text-xs">
          <option value="all">All stages</option>
          <option>Pending Manager</option>
          <option>Pending HR</option>
          <option>Approved</option>
          <option>Rejected</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <LoadingState message="Loading leave requests..." />
        ) : leaves.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <EmptyState message="No leave requests at this stage." />
            {status !== 'all' && (
              <button
                type="button"
                onClick={() => setStatus('all')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Show all stages
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Leave</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">With</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/app/hrms/leaves/${leave.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">{leave.staffName}</Link>
                    <p className="text-[11px] text-slate-500">{leave.department}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{leave.type}<p className="text-[11px] text-slate-500">{leave.days} day(s)</p></td>
                  <td className="px-4 py-3 text-slate-600">{formatDisplayDate(leave.from)} – {formatDisplayDate(leave.to)}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{leaveAwaitingLabel(leave)}</td>
                  <td className="px-4 py-3"><StatusBadge value={leave.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
