// src/platform/onboarding/VerificationStatusPage.tsx
// Restricted applicant page: shows the verification decision. This is the only place an unapproved
// administrator can land after sign-in; ERP APIs stay blocked by the backend until approval.
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, Loader2, LogOut, PartyPopper, RefreshCw, XCircle } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchRequirements } from '@/store/slices/verificationSlice'
import { refreshProfileThunk } from '@/store/slices/authSlice'
import { CopyButton, InlineError, formatDateTime } from '@/platform/verification/shared'

const POLL_MS = 30_000

export function VerificationStatusPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, logout } = useAuth()
  const { requirements, requirementsLoad, error } = useAppSelector((s) => s.verification)
  const status = requirements?.status
  const [entering, setEntering] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    await dispatch(fetchRequirements())
    setRefreshing(false)
  }

  useEffect(() => {
    dispatch(fetchRequirements())
  }, [dispatch])

  // While waiting for a decision, re-check quietly.
  useEffect(() => {
    if (status?.status !== 'Submitted') return
    const t = setInterval(() => dispatch(fetchRequirements()), POLL_MS)
    return () => clearInterval(t)
  }, [status?.status, dispatch])

  const enterWorkspace = async () => {
    setEntering(true)
    // Re-read the profile: the server now reports accessLevel INSTITUTION_ADMIN.
    await dispatch(refreshProfileThunk())
    navigate('/app', { replace: true })
  }

  const signOut = async () => {
    await logout()
    navigate('/auth', { replace: true })
  }

  const rejectedDocs = requirements?.summary.rejected ?? []

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-6 text-slate-800 sm:py-12">
      <div className="w-full max-w-xl">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>{user?.email}</span>
          <button type="button" onClick={signOut} className="flex items-center gap-1 font-semibold hover:text-slate-800"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/70" aria-live="polite">
          {!status && requirementsLoad !== 'failed' && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500" role="status"><Loader2 className="h-4 w-4 animate-spin" /> Checking your application…</div>
          )}
          {!status && requirementsLoad === 'failed' && <InlineError message={error?.message} />}

          {status?.status === 'Submitted' && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 text-amber-600"><Clock className="h-8 w-8" /></div>
              <h1 className="text-2xl font-extrabold text-slate-900">Your application is under review</h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Our verification team is checking your organization details and documents. You can use MyCampace as soon as it is approved. This page updates automatically.
              </p>
              <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-left text-xs">
                <div className="col-span-2 flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-3">
                  <div><dt className="text-slate-400">Application ID</dt><dd className="mt-0.5 select-all font-mono font-semibold text-slate-900">{status.applicationId ?? '—'}</dd></div>
                  {status.applicationId && <CopyButton text={status.applicationId} label="Copy" />}
                </div>
                <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-400">Submitted</dt><dd className="mt-0.5 font-semibold text-slate-900">{formatDateTime(status.submittedAt)}</dd></div>
                <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-400">Status</dt><dd className="mt-0.5 font-semibold text-amber-700">Awaiting verification</dd></div>
              </dl>
              <button type="button" onClick={refresh} disabled={refreshing} className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh status
              </button>
            </>
          )}

          {status?.status === 'Approved' && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50 text-emerald-600"><PartyPopper className="h-8 w-8" /></div>
              <h1 className="text-2xl font-extrabold text-slate-900">Your institution is approved</h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Verification is complete{status.reviewedAt ? ` (${formatDateTime(status.reviewedAt)})` : ''}. Your MyCampace workspace is ready.</p>
              {status.note && <p className="mx-auto mt-3 max-w-md rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">{status.note}</p>}
              <button type="button" onClick={enterWorkspace} disabled={entering} className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-8 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-60">
                {entering ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Enter your workspace
              </button>
            </>
          )}

          {status?.status === 'Rejected' && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 text-rose-600"><XCircle className="h-8 w-8" /></div>
              <h1 className="text-2xl font-extrabold text-slate-900">Your application was declined</h1>
              <div className="mx-auto mt-4 max-w-md rounded-xl border border-rose-200 bg-rose-50 p-4 text-left text-sm text-rose-800">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Reason from the verification team</p>
                <p className="mt-1">{status.note || 'No reason was provided.'}</p>
                {rejectedDocs.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
                    {rejectedDocs.map((d) => <li key={`${d.key}-${d.campusId}`}><span className="font-semibold">{d.label}</span>{d.note ? ` — ${d.note}` : ''}</li>)}
                  </ul>
                )}
              </div>
              <p className="mx-auto mt-3 max-w-md text-xs text-slate-500">You can correct the points above, replace the documents and send the application again.</p>
              <button type="button" onClick={() => navigate('/onboarding/team')} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500">
                Fix documents &amp; resubmit
              </button>
            </>
          )}

          {status?.status === 'Draft' && (
            <>
              <h1 className="text-2xl font-extrabold text-slate-900">Your application isn’t submitted yet</h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Finish the onboarding steps and send it for verification.</p>
              <button type="button" onClick={() => navigate('/onboarding/team')} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500">Continue onboarding</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
