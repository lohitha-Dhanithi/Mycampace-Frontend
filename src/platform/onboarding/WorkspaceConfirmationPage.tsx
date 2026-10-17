// src/platform/onboarding/WorkspaceConfirmationPage.tsx
// Step 5 of 5: review everything entered in the previous steps, then send it for verification.
// Access to the workspace is granted only after a superadmin approves (enforced by the backend).
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CheckCircle2, Eye, FileText, Layers, Loader2, Pencil, Send, ShieldCheck, TriangleAlert } from 'lucide-react'
import { usePlatformApi } from '@/services/onboardingService'
import { verificationService } from '@/services/verificationService'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchReview, submitApplication, verificationErrorCleared } from '@/store/slices/verificationSlice'
import { useAuth } from '@/store/AuthContext'
import type { RequirementItem } from '@/types/verification'
import { ActionDialog, CopyButton, DocumentPreviewModal, InlineError, ReviewBadge, formatBytes } from '@/platform/verification/shared'
import { ONBOARDING_REVIEW_PATH } from '@/platform/auth/landing'
import { OnboardingProgress } from './OnboardingChrome'

function Section({ title, icon, editTo, children }: { title: string; icon: React.ReactNode; editTo: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{icon}{title}</h3>
        <button
          type="button"
          onClick={() => navigate(editTo, { state: { returnTo: ONBOARDING_REVIEW_PATH } })}
          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-500"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      <div className="space-y-1 text-xs text-slate-600">{children}</div>
    </section>
  )
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <p><span className="text-slate-400">{label}: </span><span className="font-medium text-slate-900">{value || '—'}</span></p>
)

export function WorkspaceConfirmationPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const platform = usePlatformApi()
  const { logout } = useAuth()
  const { review, reviewLoad, submitting, error } = useAppSelector((s) => s.verification)
  const [agreed, setAgreed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [preview, setPreview] = useState<RequirementItem | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  // TEST MODE: second popup with Approve / Decline for the applicant themselves (only when the backend allows it).
  const [demoReview, setDemoReview] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewBusy, setReviewBusy] = useState<'approve' | 'decline' | null>(null)
  const [reviewError, setReviewError] = useState('')
  const [declinedEmail, setDeclinedEmail] = useState<boolean | null>(null)

  const demoDecide = async (kind: 'approve' | 'decline') => {
    setReviewBusy(kind)
    setReviewError('')
    try {
      const res = await verificationService.demoDecide(kind)
      if (kind === 'approve') {
        // Approved: end this session and go to sign-in; signing in again now opens the workspace.
        await logout()
        navigate('/auth', { replace: true })
      } else {
        setDeclinedEmail(res.emailSent)
      }
    } catch (e: any) {
      setReviewError(e?.message || 'Could not complete this action.')
    } finally {
      setReviewBusy(null)
    }
  }

  useEffect(() => {
    if (platform) dispatch(fetchReview())
    return () => { dispatch(verificationErrorCleared()) }
  }, [dispatch, platform])

  useEffect(() => {
    const st = review?.status.status
    if (st === 'Submitted' || st === 'Approved') navigate('/onboarding/verification-status', { replace: true })
  }, [review, navigate])

  const send = async () => {
    setConfirmOpen(false)
    const result = await dispatch(submitApplication())
    // Show the backend-issued Application ID before moving on to the status page.
    if (submitApplication.fulfilled.match(result)) {
      setSubmittedId(result.payload.applicationId ?? '')
      setDemoReview(!!result.payload.demoReview)
    }
    else dispatch(fetchReview()) // refresh what is missing
  }

  const org = review?.organization
  const uploaded = (review?.requirements ?? []).filter((r) => r.kind === 'upload' && r.document)
  const missing = review?.summary.missing ?? []
  const rejected = review?.summary.rejected ?? []
  const canSend = !!review?.summary.canSubmit && agreed && !submitting

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 sm:py-12">
      <div className="w-full max-w-3xl">
        <OnboardingProgress step={5} title="Review & Send for Verification" next="Verification by our team" />

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-xl shadow-slate-200/70 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Review your application</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please check the details you provided in every step. After you send it, our verification team reviews your organization and documents.
            You will be able to use MyCampace only after it is approved.
          </p>

          {!platform && <div className="mt-4"><InlineError message="This step needs the backend. Set NEXT_PUBLIC_USE_PLATFORM_API=true and restart the frontend." /></div>}
          {reviewLoad === 'failed' && !review && <div className="mt-4"><InlineError message={error?.message} /></div>}
          {reviewLoad === 'loading' && !review && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500" role="status"><Loader2 className="h-4 w-4 animate-spin" /> Loading your application…</div>
          )}

          {review && org && (
            <div className="mt-6 space-y-4">
              {review.status.status === 'Rejected' && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  <p className="font-bold">Previously declined</p><p className="mt-1">{review.status.note}</p>
                </div>
              )}

              <Section title="Organization" icon={<Building2 className="h-3.5 w-3.5" />} editTo="/onboarding/organization">
                <Field label="Name" value={org.name} />
                <Field label="Type" value={org.type} />
                <Field label="Address" value={[org.address, org.city, org.state, org.postalCode, org.country].filter(Boolean).join(', ')} />
                <Field label="GST Number" value={org.taxId} />
                <Field label="Primary contact" value={[org.primaryContact?.name, org.primaryContact?.email, org.primaryContact?.phone].filter(Boolean).join(' · ')} />
              </Section>

              <Section title={`Institutions (${review.institutions.length}) & campuses`} icon={<Building2 className="h-3.5 w-3.5" />} editTo="/onboarding/institutions">
                {review.institutions.map((i) => (
                  <div key={i.id} className="mb-2">
                    <p className="font-semibold text-slate-900">{i.name} <span className="font-normal text-slate-500">· {i.type}{i.affiliation ? ` · ${i.affiliation}` : ''}</span></p>
                    {i.campuses.map((c) => <p key={c.id} className="pl-3 text-slate-500">• {c.name} ({c.code}) — {c.city}{c.address ? `, ${c.address}` : ''}</p>)}
                  </div>
                ))}
              </Section>

              <Section title={`Products (${review.products.length})`} icon={<Layers className="h-3.5 w-3.5" />} editTo="/onboarding/products">
                <p className="flex flex-wrap gap-1.5">
                  {review.products.map((p) => <span key={p.productId} className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-blue-700">{p.productId}</span>)}
                </p>
              </Section>

              <Section title={`Documents (${uploaded.length} uploaded)`} icon={<FileText className="h-3.5 w-3.5" />} editTo="/onboarding/team">
                {uploaded.map((r) => (
                  <div key={`${r.key}-${r.campusId}`} className="flex items-center justify-between gap-2 border-b border-slate-200/70 py-1.5 last:border-0">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{r.label} {!r.required && <span className="font-normal text-slate-400">(optional)</span>}</p>
                      <p className="truncate text-slate-500">{r.document!.originalName} · {formatBytes(r.document!.sizeBytes)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {r.document!.reviewStatus === 'Rejected' && <ReviewBadge status="Rejected" />}
                      <button type="button" onClick={() => setPreview(r)} aria-label={`View ${r.label}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
                {!uploaded.length && <p className="text-slate-500">No documents uploaded yet.</p>}
              </Section>

              {(missing.length > 0 || rejected.length > 0) && (
                <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
                  <p className="flex items-center gap-1.5 font-bold"><TriangleAlert className="h-4 w-4" /> You can’t send this yet</p>
                  <ul className="mt-2 list-disc space-y-0.5 pl-5">
                    {missing.map((m) => <li key={`${m.key}-${m.campusId}`}>Missing required document: {m.label}</li>)}
                    {rejected.map((m) => <li key={`r-${m.key}-${m.campusId}`}>Rejected, please replace: {m.label}{m.note ? ` — ${m.note}` : ''}</li>)}
                  </ul>
                  <button type="button" onClick={() => navigate('/onboarding/team')} className="mt-3 font-semibold text-blue-700 underline">Go to document upload</button>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 p-3 text-xs text-slate-600">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300" />
                <span>I confirm the information and documents are accurate and that I am authorised to register this organization. I understand access to MyCampace is granted only after verification.</span>
              </label>

              {error && reviewLoad !== 'failed' && <InlineError message={error.message} />}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => navigate('/onboarding/team')} className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 sm:py-0">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to documents
            </button>
            <button
              type="button"
              disabled={!canSend}
              onClick={() => setConfirmOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold sm:w-auto text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>Send for Verification</span>
            </button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 sm:justify-end sm:text-right"><ShieldCheck className="h-3.5 w-3.5" /> Documents are stored privately and used only for verification.</p>
        </div>
      </div>

      <ActionDialog
        open={confirmOpen}
        title="Send for verification?"
        description="Once sent, your details and documents are locked while the verification team reviews them. You’ll see the decision on your status page."
        confirmLabel="Send for verification"
        busy={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={send}
      />

      {submittedId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="submitted-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></div>
            <h3 id="submitted-title" className="text-lg font-extrabold text-slate-900">Registration submitted</h3>
            <p className="mt-2 text-sm text-slate-500">Your organization registration has been received and is awaiting verification. Keep your Application ID for any follow-up.</p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application ID</p>
              <p className="mt-1 select-all font-mono text-xl font-bold tracking-wide text-slate-900">{submittedId || 'Unavailable'}</p>
              <p className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">Pending Verification</p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {submittedId && <CopyButton text={submittedId} label="Copy Application ID" className="justify-center" />}
              <button
                type="button"
                onClick={() => (demoReview ? setReviewOpen(true) : navigate('/onboarding/verification-status', { replace: true }))}
                className="h-9 rounded-lg bg-blue-600 px-5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-labelledby="demo-review-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <p className="mb-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">Test mode</p>
            <h3 id="demo-review-title" className="text-lg font-extrabold text-slate-900">
              {declinedEmail === null ? 'Review your registration' : 'Verification failed'}
            </h3>
            {declinedEmail === null ? (
              <>
                <p className="mt-2 text-sm text-slate-500">Approve takes you to the sign-in page, where you can sign in to the workspace; Decline sends a “verification failed” email to your registered email.
                  
                </p>
                {reviewError && <div className="mt-4"><InlineError message={reviewError} /></div>}
                <div className="mt-6 flex justify-center gap-2">
                  <button type="button" disabled={!!reviewBusy} onClick={() => demoDecide('approve')} className="flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50">
                    {reviewBusy === 'approve' && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Approve
                  </button>
                  <button type="button" disabled={!!reviewBusy} onClick={() => demoDecide('decline')} className="flex h-10 items-center gap-2 rounded-lg border border-rose-200 px-5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                    {reviewBusy === 'decline' && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Decline
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-500">
                  {declinedEmail
                    ? 'The application was declined and a “verification failed” email has been sent to your registered email.'
                    : 'The application was declined, but the email could not be sent. Check the SMTP settings in the backend .env.'}
                </p>
                <button type="button" onClick={() => navigate('/onboarding/verification-status', { replace: true })} className="mt-6 h-10 rounded-lg bg-blue-600 px-5 text-xs font-semibold text-white hover:bg-blue-500">
                  Go to status page
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {preview?.document && (
        <DocumentPreviewModal
          title={`${preview.label} — ${preview.document.originalName}`}
          mimeType={preview.document.mimeType}
          load={() => verificationService.documentBlob(preview.document!.id)}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}
