import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LoadingState } from '@/components/common/LoadingState'
import { useAuth } from '@/store/AuthContext'
import { hrmsService, leaveAwaitingLabel } from '../services/hrmsService'
import { StatusBadge } from '../components/ui'
import { formatDisplayDate } from '../config/hrmsConfig'
import type { LeaveBalance, LeaveRequest } from '../types'

export function LeaveDetailPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [leave, setLeave] = useState<LeaveRequest | null>(null)
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [missing, setMissing] = useState(false)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => {
    if (!id) return
    hrmsService.getLeaveById(id).then((result) => {
      if (!result) setMissing(true)
      else {
        setLeave(result.leave)
        setBalances(result.balances)
      }
    })
  }

  useEffect(() => {
    load()
  }, [id])

  if (missing) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold">Leave request not found</p>
        <Button className="mt-4" onClick={() => navigate('/app/hrms/leaves')}>Back to leave desk</Button>
      </div>
    )
  }
  if (!leave) return <LoadingState message="Loading leave request..." />

  const hrStep = leave.status === 'Pending HR'
  const balance = balances.find((item) => item.type === leave.type)
  const awaiting = leaveAwaitingLabel(leave)

  const decide = async (action: 'approve' | 'reject') => {
    if (!id) return
    setBusy(true)
    setError('')
    try {
      const updated = await hrmsService.decideLeave(id, action, comment, {
        asHr: true,
        actorName: user?.name || 'HR Administrator',
      })
      setLeave(structuredClone(updated))
      setComment('')
      const refreshed = await hrmsService.getLeaveById(id)
      if (refreshed) setBalances(refreshed.balances)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this request.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/app/hrms/leaves"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to Leave Requests
        </Link>
      </div>

      <PageHeader
        title={`${leave.staffName} · ${leave.type}`}
        description={`${leave.days} day(s) · ${formatDisplayDate(leave.from)} to ${formatDisplayDate(leave.to)}`}
        badge={<StatusBadge value={leave.status} />}
        actions={
          <Link to={`/app/hrms/staff/${leave.staffId}`} className="text-xs font-semibold text-blue-600 hover:underline">
            View staff profile
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900">Approval workflow</h2>
          {(leave.status === 'Pending Manager' || leave.status === 'Pending HR') && (
            <p className="mt-2 text-xs text-slate-600">
              Currently with <span className="font-semibold text-slate-900">{awaiting}</span>
            </p>
          )}
          <ol className="mt-4 space-y-4">
            {leave.timeline.map((entry, index) => (
              <li key={`${entry.step}-${index}`} className="flex gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${entry.decision === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <div>
                  <p className="text-xs font-semibold text-slate-900">{entry.step} · {entry.decision}</p>
                  <p className="text-[11px] text-slate-500">{entry.actor} on {formatDisplayDate(entry.at)}. {entry.comment}</p>
                </div>
              </li>
            ))}
            {(leave.status === 'Pending Manager' || leave.status === 'Pending HR') && (
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">{awaiting} · waiting</p>
                  <p className="text-[11px] text-slate-400">
                    {hrStep ? 'HR can give the final decision.' : 'The reporting manager decides this step from My Portal.'}
                  </p>
                </div>
              </li>
            )}
          </ol>

          {hrStep && (
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <Textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Comment for the staff member." />
              {error && <p className="text-xs font-medium text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button disabled={busy} onClick={() => decide('approve')} className="bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                <Button disabled={busy} variant="outline" onClick={() => decide('reject')}>Reject</Button>
              </div>
            </div>
          )}
          {leave.status === 'Pending Manager' && (
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
              This request is with {leave.currentApproverName}. HR can decide after that reporting chain has approved.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs">
            <h2 className="text-sm font-bold text-slate-900">Request</h2>
            <p className="mt-3 text-slate-600">{leave.reason}</p>
            <p className="mt-3 text-slate-500">Applied {formatDisplayDate(leave.appliedOn)} · {leave.department}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs">
            <h2 className="text-sm font-bold text-slate-900">Balance</h2>
            {balance ? (
              <p className="mt-3 text-slate-600">
                {balance.entitled - balance.used} {leave.type} day(s) remaining out of {balance.entitled}. This request uses {leave.days}.
              </p>
            ) : (
              <p className="mt-3 text-slate-500">{leave.type} is not deducted from a quota.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
