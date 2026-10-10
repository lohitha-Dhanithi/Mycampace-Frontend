import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { hrmsService } from '../services/hrmsService'
import { Field } from '../components/ui'
import { inclusiveDays, LEAVE_TYPES } from '../config/hrmsConfig'
import type { LeaveBalance, LeaveType, StaffMember } from '../types'

export function LeaveFormPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [staffId, setStaffId] = useState(params.get('staffId') || '')
  const [type, setType] = useState<LeaveType>('Casual Leave')
  const [from, setFrom] = useState('2026-10-13')
  const [to, setTo] = useState('2026-10-13')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [firstApprover, setFirstApprover] = useState('')

  useEffect(() => {
    hrmsService.getStaff().then((rows) => {
      setStaff(rows)
      if (!staffId && rows[0]) setStaffId(rows[0].id)
    })
  }, [])

  useEffect(() => {
    if (!staffId) return
    hrmsService.getStaffProfile(staffId).then((profile) => setBalances(profile?.balances || []))
    const next = hrmsService.previewFirstApprover(staffId)
    setFirstApprover(next?.name || 'HR')
  }, [staffId])

  const days = useMemo(() => inclusiveDays(from, to), [from, to])
  const balance = balances.find((item) => item.type === type)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const leave = await hrmsService.createLeave({ staffId, type, from, to, reason })
      navigate(`/app/hrms/leaves/${leave.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the request.')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="New leave request"
        description="The request is assigned to the staff member's reporting manager, then moves up that chain until HR."
      />
      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <Field label="Staff">
          <Select value={staffId} onChange={(event) => setStaffId(event.target.value)}>
            {staff.map((person) => (
              <option key={person.id} value={person.id}>{person.fullName} · {person.department}</option>
            ))}
          </Select>
        </Field>
        {firstApprover && <p className="text-xs text-slate-500">First approver: {firstApprover}</p>}
        <Field label="Leave type">
          <Select value={type} onChange={(event) => setType(event.target.value as LeaveType)}>
            {LEAVE_TYPES.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </Field>
        {balance && (
          <p className="text-xs text-slate-500">
            Balance: {balance.entitled - balance.used} of {balance.entitled} {type} days remaining.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="From"><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
          <Field label="To"><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></Field>
        </div>
        <p className="text-xs font-semibold text-slate-700">{days > 0 ? `${days} day(s)` : 'End date must be on or after the start date.'}</p>
        <Field label="Reason">
          <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} placeholder="Why this leave is needed, and who is covering the work." />
        </Field>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-indigo-600">
            {saving ? 'Submitting...' : 'Submit for approval'}
          </Button>
          <Link to="/app/hrms/leaves" className="inline-flex h-9 items-center rounded-md border border-slate-200 px-4 text-sm text-slate-700 hover:bg-slate-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
