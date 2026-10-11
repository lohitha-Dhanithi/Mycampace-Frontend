import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { LoadingState } from '@/components/common/LoadingState'
import { useAuth } from '@/store/AuthContext'
import { hrmsService, leaveAwaitingLabel } from '../services/hrmsService'
import { EmptyState, Field, KpiCard, Panel, StatusBadge } from '../components/ui'
import { ATTENDANCE_DATE, DOCUMENT_TYPES, formatDisplayDate, inclusiveDays, LEAVE_TYPES } from '../config/hrmsConfig'
import type { AttendanceRecord, LeaveBalance, LeaveRequest, LeaveType, StaffDocument, StaffMember } from '../types'

function useSelfStaff() {
  const { user } = useAuth()
  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    hrmsService.ensureSelfStaff(user).then((person) => {
      setStaff(person)
      setLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : 'Could not open your staff record.')
      setLoading(false)
    })
  }, [user])

  return { staff, loading, error }
}

function ApprovalInbox({ staffId }: { staffId: string }) {
  const [rows, setRows] = useState<LeaveRequest[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    hrmsService.getApprovalInbox(staffId).then((items) => {
      setRows(items)
      setLoaded(true)
    })
  }, [staffId])

  return (
    <Panel title="Waiting for my approval">
      {!loaded ? (
        <p className="text-xs text-slate-500">Loading requests assigned to you...</p>
      ) : rows.length === 0 ? (
        <EmptyState message="Nothing is waiting for your approval." />
      ) : (
        <div className="space-y-3">
          {rows.map((item) => (
            <Link key={item.id} to={`/app/hrms/me/leave/${item.id}`} className="flex items-center justify-between gap-3 text-xs">
              <span>
                <span className="block font-semibold text-slate-900">{item.staffName} · {item.type}</span>
                <span className="text-slate-500">{formatDisplayDate(item.from)} – {formatDisplayDate(item.to)} · {item.days} day(s)</span>
              </span>
              <StatusBadge value={item.status} />
            </Link>
          ))}
        </div>
      )}
    </Panel>
  )
}

export function MyPortalHome() {
  const { staff, loading, error } = useSelfStaff()
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [today, setToday] = useState<AttendanceRecord | null>(null)

  useEffect(() => {
    if (!staff) return
    Promise.all([
      hrmsService.getStaffProfile(staff.id),
      hrmsService.getLeaves(),
      hrmsService.getAttendance(),
    ]).then(([profile, leaveRows, attendance]) => {
      setBalances(profile?.balances || [])
      setLeaves(leaveRows.filter((item) => item.staffId === staff.id).slice(0, 4))
      setToday(attendance.records.find((item) => item.staffId === staff.id && item.date === ATTENDANCE_DATE) || null)
    })
  }, [staff])

  if (loading) return <LoadingState message="Opening your portal..." />
  if (error || !staff) return <p className="text-sm text-red-600">{error || 'Your staff record is unavailable.'}</p>

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Hello, ${staff.fullName}`}
        description={`${staff.designation} · ${staff.department} · ${staff.employeeCode}`}
        actions={
          <Link to="/app/hrms/me/leave/new">
            <Button size="sm" className="text-xs">Apply for leave</Button>
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Today" value={today?.status || 'Not marked'} hint={today ? `${today.shift} · In ${today.checkIn || '—'}` : ATTENDANCE_DATE} />
        <KpiCard label="Open requests" value={leaves.filter((item) => item.status.startsWith('Pending')).length} hint="Waiting on your manager or HR" />
        <KpiCard label="Leave remaining" value={balances.reduce((sum, item) => sum + Math.max(0, item.entitled - item.used), 0)} hint="Days across casual, sick, and earned leave" />
      </div>
      <ApprovalInbox staffId={staff.id} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Leave balance" action={<Link to="/app/hrms/me/leave" className="text-xs font-semibold text-blue-600">View requests</Link>}>
          <div className="space-y-2">
            {balances.map((item) => (
              <div key={item.type} className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{item.type}</span>
                <span className="font-semibold text-slate-900">{item.entitled - item.used} left · {item.used} used</span>
              </div>
            ))}
            {balances.length === 0 && <EmptyState message="No leave balance is set up yet." />}
          </div>
        </Panel>
        <Panel title="Recent leave" action={<Link to="/app/hrms/me/leave/new" className="text-xs font-semibold text-blue-600">Apply</Link>}>
          <div className="space-y-3">
            {leaves.map((item) => (
              <Link key={item.id} to={`/app/hrms/me/leave/${item.id}`} className="flex items-center justify-between gap-3 text-xs">
                <span>
                  <span className="block font-semibold text-slate-900">{item.type}</span>
                  <span className="text-slate-500">{formatDisplayDate(item.from)} – {formatDisplayDate(item.to)}</span>
                </span>
                <StatusBadge value={item.status} />
              </Link>
            ))}
            {leaves.length === 0 && <EmptyState message="You have not applied for leave yet." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function MyProfilePage() {
  const { staff, loading, error } = useSelfStaff()
  const [documents, setDocuments] = useState<StaffDocument[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState(DOCUMENT_TYPES[0])
  const [expiryDate, setExpiryDate] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!staff) return
    hrmsService.getStaffProfile(staff.id).then((profile) => setDocuments(profile?.documents || []))
  }, [staff])

  if (loading) return <LoadingState message="Loading your profile..." />
  if (error || !staff) return <p className="text-sm text-red-600">{error || 'Your staff record is unavailable.'}</p>

  const details = [
    ['Employee code', staff.employeeCode],
    ['Email', staff.email],
    ['Phone', staff.phone || '—'],
    ['Campus', staff.campus],
    ['Department', staff.department],
    ['Designation', staff.designation],
    ['Reporting manager', staff.reportingManager],
    ['Joined', formatDisplayDate(staff.joiningDate)],
    ['Status', staff.employmentStatus],
  ]

  const upload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setFormError('Document name is required.')
      return
    }
    const document = await hrmsService.addDocument(staff.id, { name: name.trim(), type, expiryDate })
    setDocuments((current) => [document, ...current])
    setName('')
    setExpiryDate('')
    setFormError('')
  }

  return (
    <div className="space-y-5">
      <PageHeader title="My profile" description="Your employment record and documents." badge={<StatusBadge value={staff.employmentStatus} />} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel title="Employment">
          <dl className="grid grid-cols-2 gap-3">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-xs font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Documents">
          <form onSubmit={upload} className="mb-4 grid gap-3 sm:grid-cols-2">
            <Field label="Name"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aadhaar card" /></Field>
            <Field label="Type">
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                {DOCUMENT_TYPES.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </Field>
            <Field label="Expiry"><Input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} /></Field>
            <div className="flex items-end"><Button type="submit" size="sm" className="text-xs">Upload</Button></div>
          </form>
          {formError && <p className="mb-3 text-xs font-medium text-red-600">{formError}</p>}
          <div className="space-y-2">
            {documents.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <span>
                  <span className="block font-semibold text-slate-900">{item.name}</span>
                  <span className="text-slate-500">{item.type} · {formatDisplayDate(item.uploadedOn)}</span>
                </span>
                <StatusBadge value={item.status} />
              </div>
            ))}
            {documents.length === 0 && <EmptyState message="No documents uploaded yet." />}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function MyLeavePage() {
  const { staff, loading } = useSelfStaff()
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])

  useEffect(() => {
    if (!staff) return
    hrmsService.getLeaves().then((rows) => setLeaves(rows.filter((item) => item.staffId === staff.id)))
  }, [staff])

  if (loading) return <LoadingState message="Loading your leave..." />

  return (
    <div className="space-y-5">
      <PageHeader
        title="My leave"
        description="Requests waiting on you, and the leave you have submitted."
        actions={<Link to="/app/hrms/me/leave/new"><Button size="sm" className="text-xs">Apply for leave</Button></Link>}
      />
      {staff && <ApprovalInbox staffId={staff.id} />}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {leaves.length === 0 ? <EmptyState message="You have not applied for leave yet." /> : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Type</th>
                <th className="px-4 py-2 font-semibold">Dates</th>
                <th className="px-4 py-2 font-semibold">Days</th>
                <th className="px-4 py-2 font-semibold">With</th>
                <th className="px-4 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3"><Link to={`/app/hrms/me/leave/${item.id}`} className="font-semibold text-slate-900 hover:text-blue-600">{item.type}</Link></td>
                  <td className="px-4 py-3 text-slate-600">{formatDisplayDate(item.from)} – {formatDisplayDate(item.to)}</td>
                  <td className="px-4 py-3">{item.days}</td>
                  <td className="px-4 py-3 text-slate-600">{leaveAwaitingLabel(item)}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function MyLeaveApplyPage() {
  const navigate = useNavigate()
  const { staff, loading } = useSelfStaff()
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [type, setType] = useState<LeaveType>('Casual Leave')
  const [from, setFrom] = useState('2026-10-20')
  const [to, setTo] = useState('2026-10-20')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [firstApprover, setFirstApprover] = useState('')
  const days = useMemo(() => inclusiveDays(from, to), [from, to])
  const balance = balances.find((item) => item.type === type)

  useEffect(() => {
    if (!staff) return
    hrmsService.getStaffProfile(staff.id).then((profile) => setBalances(profile?.balances || []))
    setFirstApprover(hrmsService.previewFirstApprover(staff.id)?.name || 'HR')
  }, [staff])

  if (loading || !staff) return <LoadingState message="Preparing your leave form..." />

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const leave = await hrmsService.createLeave({ staffId: staff.id, type, from, to, reason })
      navigate(`/app/hrms/me/leave/${leave.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the request.')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/app/hrms/me/leave"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to My Leave
        </Link>
      </div>

      <PageHeader title="Apply for leave" description={`${staff.fullName} · first approver is ${firstApprover || staff.reportingManager}. It then follows the reporting chain and ends with HR.`} />
      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <Field label="Leave type">
          <Select value={type} onChange={(event) => setType(event.target.value as LeaveType)}>
            {LEAVE_TYPES.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </Field>
        {balance && <p className="text-xs text-slate-500">{balance.entitled - balance.used} of {balance.entitled} {type} days remaining.</p>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="From"><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
          <Field label="To"><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></Field>
        </div>
        <p className="text-xs text-slate-500">{days} day(s)</p>
        <Field label="Reason"><Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} /></Field>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={saving} className="text-xs">{saving ? 'Submitting...' : 'Submit request'}</Button>
          <Button type="button" size="sm" variant="outline" className="text-xs" onClick={() => navigate('/app/hrms/me/leave')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}

export function MyLeaveDetailPage() {
  const { id } = useParams()
  const { staff, loading } = useSelfStaff()
  const [leave, setLeave] = useState<LeaveRequest | null>(null)
  const [missing, setMissing] = useState(false)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id || !staff) return
    hrmsService.getLeaveById(id).then((result) => {
      if (!result) {
        setMissing(true)
        return
      }
      const item = result.leave
      const involved = item.staffId === staff.id
        || item.currentApproverId === staff.id
        || item.timeline.some((entry) => entry.actor === staff.fullName)
      if (!involved) setMissing(true)
      else setLeave(item)
    })
  }, [id, staff])

  if (loading || (!leave && !missing)) return <LoadingState message="Loading your request..." />
  if (missing || !leave || !staff) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-slate-800">This leave request is not available in your portal.</p>
        <Link to="/app/hrms/me/leave" className="mt-3 inline-block text-xs font-semibold text-blue-600">Back to my leave</Link>
      </div>
    )
  }

  const canDecide = leave.status === 'Pending Manager' && leave.currentApproverId === staff.id && leave.staffId !== staff.id
  const mine = leave.staffId === staff.id

  const decide = async (action: 'approve' | 'reject') => {
    setBusy(true)
    setError('')
    try {
      const updated = await hrmsService.decideLeave(leave.id, action, comment, { staffId: staff.id })
      setLeave(structuredClone(updated))
      setComment('')
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
          to="/app/hrms/me/leave"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to My Leave
        </Link>
      </div>

      <PageHeader
        title={mine ? leave.type : `${leave.staffName} · ${leave.type}`}
        description={`${leave.days} day(s) · ${formatDisplayDate(leave.from)} to ${formatDisplayDate(leave.to)} · currently with ${leaveAwaitingLabel(leave)}`}
        badge={<StatusBadge value={leave.status} />}
      />
      <Panel title="Reason">
        <p className="text-sm text-slate-700">{leave.reason}</p>
        {!mine && <p className="mt-2 text-xs text-slate-500">{leave.staffName} · {leave.department}</p>}
      </Panel>
      <Panel title="Approval">
        <ol className="space-y-3">
          {leave.timeline.map((item, index) => (
            <li key={`${item.step}-${index}`} className="text-xs">
              <p className="font-semibold text-slate-900">{item.step} · {item.decision}</p>
              <p className="text-slate-500">{item.actor} · {formatDisplayDate(item.at)}</p>
              {item.comment && <p className="mt-0.5 text-slate-600">{item.comment}</p>}
            </li>
          ))}
        </ol>
        {canDecide && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <Textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Comment for the staff member and the next reviewer." />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" disabled={busy} onClick={() => decide('approve')} className="bg-emerald-600 text-xs hover:bg-emerald-700">Approve</Button>
              <Button size="sm" disabled={busy} variant="outline" className="text-xs" onClick={() => decide('reject')}>Reject</Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

export function MyAttendancePage() {
  const { staff, loading } = useSelfStaff()
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    if (!staff) return
    hrmsService.getAttendance().then((result) => {
      setRecords(result.records.filter((item) => item.staffId === staff.id))
    })
  }, [staff])

  if (loading) return <LoadingState message="Loading your attendance..." />

  return (
    <div className="space-y-5">
      <PageHeader title="My attendance" description="Days marked for you on the campus roster." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {records.length === 0 ? <EmptyState message="No attendance has been marked for you yet." /> : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Shift</th>
                <th className="px-4 py-2 font-semibold">Check in</th>
                <th className="px-4 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{formatDisplayDate(item.date)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.shift}</td>
                  <td className="px-4 py-3 text-slate-600">{item.checkIn || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
