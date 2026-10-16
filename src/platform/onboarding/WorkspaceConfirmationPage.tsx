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
import type { RequirementItem } from '@/types/verification'
import { ActionDialog, DocumentPreviewModal, InlineError, ReviewBadge, formatBytes } from '@/platform/verification/shared'

function Section({ title, icon, editTo, children }: { title: string; icon: React.ReactNode; editTo: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{icon}{title}</h3>
        <button type="button" onClick={() => navigate(editTo)} className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-500">
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
  const { review, reviewLoad, submitting, error } = useAppSelector((s) => s.verification)
  const [agreed, setAgreed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [preview, setPreview] = useState<RequirementItem | null>(null)

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
    if (submitApplication.fulfilled.match(result)) navigate('/onboarding/verification-status', { replace: true })
    else dispatch(fetchReview()) // refresh what is missing
  }

  const org = review?.organization
  const uploaded = (review?.requirements ?? []).filter((r) => r.kind === 'upload' && r.document)
  const missing = review?.summary.missing ?? []
  const rejected = review?.summary.rejected ?? []
  const canSend = !!review?.summary.canSubmit && agreed && !submitting

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-12 text-slate-800 sm:px-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 5 of 5: Review &amp; Send for Verification</span>
            <span className="text-xs font-medium text-slate-500">Final step</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full w-full rounded-full bg-blue-600" /></div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
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
                <Field label="Legal name" value={org.legalName} />
                <Field label="Type" value={org.type} />
                <Field label="Address" value={[org.address, org.city, org.state, org.postalCode, org.country].filter(Boolean).join(', ')} />
                <Field label="Tax ID" value={org.taxId} />
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
                <span>I confirm the information and documents are accurate and that I am authorised to register this institution. I understand access to MyCampace is granted only after verification.</span>
              </label>

              {error && reviewLoad !== 'failed' && <InlineError message={error.message} />}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
            <button type="button" onClick={() => navigate('/onboarding/team')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to documents
            </button>
            <button
              type="button"
              disabled={!canSend}
              onClick={() => setConfirmOpen(true)}
              className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>Send for Verification</span>
            </button>
          </div>
          <p className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Documents are stored privately and used only for verification.</p>
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
