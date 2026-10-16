// src/platform/superadmin/VerificationDetailPage.tsx
// Superadmin review of one application: details, every document (preview / accept / reject), approve or decline.
// Approval rules are enforced by the backend; the button state here only mirrors them for convenience.
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Eye, FileText, Loader2, RefreshCw, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { superadminVerificationService } from '@/services/verificationService'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { decideApplication, openApplication, reviewClosed, reviewDocument, reviewErrorCleared } from '@/store/slices/superadminVerificationSlice'
import type { RequirementItem } from '@/types/verification'
import { ActionDialog, DocumentPreviewModal, InlineError, RequiredBadge, ReviewBadge, VerificationBadge, formatBytes, formatDateTime } from '@/platform/verification/shared'

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <p className="text-xs"><span className="text-slate-400">{label}: </span><span className="font-medium text-slate-900">{value || '—'}</span></p>
)

export function VerificationDetailPage() {
  const { organizationId = '' } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { current: app, currentLoad, acting, conflict, error } = useAppSelector((s) => s.superadminVerification)

  const [preview, setPreview] = useState<RequirementItem | null>(null)
  const [rejectingDoc, setRejectingDoc] = useState<RequirementItem | null>(null)
  const [docNote, setDocNote] = useState('')
  const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    dispatch(openApplication(organizationId))
    return () => { dispatch(reviewClosed()) }
  }, [dispatch, organizationId])

  const status = app?.status.status
  const reviewable = status === 'Submitted'
  const uploads = (app?.requirements ?? []).filter((r) => r.kind === 'upload')
  const requiredUploads = uploads.filter((r) => r.required)
  const requiredNotAccepted = requiredUploads.filter((r) => r.document?.reviewStatus !== 'Accepted')
  const anyRejected = uploads.some((r) => r.document?.reviewStatus === 'Rejected')
  const canApprove = reviewable && requiredNotAccepted.length === 0 && !anyRejected && (app?.summary.missing.length ?? 1) === 0

  const decide = async (kind: 'approve' | 'reject') => {
    const res = await dispatch(decideApplication(kind === 'approve' ? { orgId: organizationId, kind } : { orgId: organizationId, kind, reason: reason.trim() }))
    if (decideApplication.fulfilled.match(res)) { setConfirm(null); setReason('') }
    else setConfirm(null) // the error banner explains (e.g. conflict)
  }

  const row = (r: RequirementItem) => {
    const d = r.document
    return (
      <li key={`${r.key}-${r.campusId}`} className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">#{r.number}</span>
              <p className="text-xs font-semibold text-slate-900">{r.label}</p>
              <RequiredBadge required={r.required} />
            </div>
            {d ? (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><FileText className="h-3.5 w-3.5" /> {d.originalName} · {formatBytes(d.sizeBytes)} · {formatDateTime(d.uploadedAt)} <ReviewBadge status={d.reviewStatus} /></p>
            ) : (
              <p className={`mt-1 text-[11px] ${r.required ? 'font-semibold text-rose-600' : 'text-slate-400'}`}>{r.required ? 'Required document not uploaded' : 'Not provided'}</p>
            )}
            {d?.reviewNote && <p className="mt-1 text-[11px] text-slate-600">Note: {d.reviewNote}</p>}
          </div>
          {d && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" onClick={() => setPreview(r)} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /> View</button>
              {reviewable && (
                <>
                  <button type="button" disabled={d.reviewStatus === 'Accepted'} onClick={() => dispatch(reviewDocument({ orgId: organizationId, docId: d.id, decision: 'Accepted' }))} className="flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"><Check className="h-3.5 w-3.5" /> Accept</button>
                  <button type="button" disabled={d.reviewStatus === 'Rejected'} onClick={() => { setRejectingDoc(r); setDocNote('') }} className="flex h-8 items-center gap-1 rounded-lg border border-rose-200 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"><X className="h-3.5 w-3.5" /> Reject</button>
                </>
              )}
            </div>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <button type="button" onClick={() => navigate('/superadmin/verifications')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to queue</button>
          {status && <VerificationBadge status={status} />}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {currentLoad === 'loading' && !app && <div className="flex justify-center py-20" role="status"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>}
        {currentLoad === 'failed' && !app && <InlineError message={error?.message} />}

        {app && (
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{app.organization.name}</h1>
                <p className="mt-1 text-xs text-slate-500">Submission round {app.status.round} · submitted {formatDateTime(app.status.submittedAt)}</p>
              </div>

              {conflict && (
                <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                  <span>{error?.message}</span>
                  <button type="button" onClick={() => { dispatch(reviewErrorCleared()); dispatch(openApplication(organizationId)) }} className="flex items-center gap-1 font-bold text-blue-700"><RefreshCw className="h-3.5 w-3.5" /> Reload</button>
                </div>
              )}
              {!conflict && error && <InlineError message={error.message} />}

              {status === 'Rejected' && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><span className="font-bold">Declined: </span>{app.status.note}</div>}
              {status === 'Approved' && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800"><span className="font-bold">Approved </span>{formatDateTime(app.status.reviewedAt)}</div>}

              <section>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-700">Required documents ({requiredUploads.length})</h2>
                <ul className="space-y-2">{app.requirements.filter((r) => r.required && r.kind === 'upload').map(row)}</ul>
              </section>
              <section>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Optional documents</h2>
                <ul className="space-y-2">{app.requirements.filter((r) => !r.required && r.kind === 'upload').map(row)}</ul>
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Organization</h3>
                <div className="space-y-1">
                  <Field label="Legal name" value={app.organization.legalName} />
                  <Field label="Type" value={app.organization.type} />
                  <Field label="Address" value={[app.organization.address, app.organization.city, app.organization.state, app.organization.postalCode].filter(Boolean).join(', ')} />
                  <Field label="Tax ID" value={app.organization.taxId} />
                  <Field label="Contact" value={[app.organization.primaryContact?.name, app.organization.primaryContact?.email].filter(Boolean).join(' · ')} />
                </div>
                <h3 className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Administrator</h3>
                <Field label="Name" value={app.admin?.name} />
                <Field label="Email" value={app.admin?.email} />
                <Field label="Mobile" value={app.admin?.mobile} />
                <h3 className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Institutions &amp; campuses</h3>
                {app.institutions.map((i) => (
                  <div key={i.id} className="mb-1.5 text-xs">
                    <p className="font-semibold text-slate-900">{i.name} <span className="font-normal text-slate-500">· {i.type}{i.affiliation ? ` · ${i.affiliation}` : ''}</span></p>
                    {i.campuses.map((c) => <p key={c.id} className="pl-2 text-slate-500">• {c.name} — {c.city}</p>)}
                  </div>
                ))}
                <h3 className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Products</h3>
                <p className="flex flex-wrap gap-1">{app.products.map((p) => <span key={p.productId} className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-blue-700">{p.productId}</span>)}</p>
              </div>

              {reviewable && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Decision</h3>
                  {!canApprove && (
                    <p className="mt-2 text-[11px] text-amber-700">
                      {anyRejected ? 'A document is rejected — decline the application or wait for a replacement.' : `Accept all ${requiredUploads.length} required documents to enable approval (${requiredNotAccepted.length} left).`}
                    </p>
                  )}
                  <button type="button" disabled={!canApprove || acting} onClick={() => setConfirm('approve')} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"><ThumbsUp className="h-4 w-4" /> Approve institution</button>
                  <button type="button" disabled={acting} onClick={() => setConfirm('reject')} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40"><ThumbsDown className="h-4 w-4" /> Decline</button>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>

      {preview?.document && (
        <DocumentPreviewModal
          title={`${preview.label} — ${preview.document.originalName}`}
          mimeType={preview.document.mimeType}
          load={() => superadminVerificationService.documentBlob(organizationId, preview.document!.id)}
          onClose={() => setPreview(null)}
        />
      )}

      <ActionDialog
        open={!!rejectingDoc}
        title="Reject this document"
        description={rejectingDoc?.label}
        confirmLabel="Reject document"
        tone="danger"
        confirmDisabled={!docNote.trim()}
        onCancel={() => setRejectingDoc(null)}
        onConfirm={() => {
          if (rejectingDoc?.document) dispatch(reviewDocument({ orgId: organizationId, docId: rejectingDoc.document.id, decision: 'Rejected', note: docNote.trim() }))
          setRejectingDoc(null)
        }}
      >
        <label className="text-xs font-semibold text-slate-700" htmlFor="doc-note">Reason (shown to the applicant)</label>
        <textarea id="doc-note" value={docNote} onChange={(e) => setDocNote(e.target.value)} rows={3} maxLength={1000} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </ActionDialog>

      <ActionDialog
        open={confirm === 'approve'}
        title="Approve this institution?"
        description={`${app?.organization.name} will be able to sign in and use MyCampace immediately. This cannot be undone from this screen.`}
        confirmLabel="Yes, approve"
        tone="success"
        busy={acting}
        onCancel={() => setConfirm(null)}
        onConfirm={() => decide('approve')}
      />

      <ActionDialog
        open={confirm === 'reject'}
        title="Decline this application?"
        description="The administrator will see your reason and can correct the problems and resubmit."
        confirmLabel="Decline application"
        tone="danger"
        busy={acting}
        confirmDisabled={reason.trim().length < 10}
        onCancel={() => setConfirm(null)}
        onConfirm={() => decide('reject')}
      >
        <label className="text-xs font-semibold text-slate-700" htmlFor="reject-reason">Reason (min. 10 characters)</label>
        <textarea id="reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={1000} className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </ActionDialog>
    </div>
  )
}
