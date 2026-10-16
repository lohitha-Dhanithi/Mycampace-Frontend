// src/platform/onboarding/DocumentUploadPage.tsx
// Step 4 of 5: upload verification documents. What is required/optional, the allowed formats and the
// size limits all come from the backend (GET /verification/requirements); the server re-validates every upload.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Eye, FileText, Info, Loader2, Lock, RefreshCw, ShieldCheck, Trash2, UploadCloud,
} from 'lucide-react'
import { usePlatformApi } from '@/services/onboardingService'
import { verificationService } from '@/services/verificationService'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectSplitRequirements } from '@/store/selectors'
import {
  fetchRequirements, removeDocument, uploadDocument, uploadDismissed, verificationErrorCleared,
} from '@/store/slices/verificationSlice'
import { slotKey, type RequirementItem } from '@/types/verification'
import {
  ActionDialog, DocumentPreviewModal, InlineError, RequiredBadge, ReviewBadge, formatBytes, formatDateTime,
} from '@/platform/verification/shared'

const MIME_BY_EXT: Record<string, string> = { PDF: '.pdf', JPG: '.jpg,.jpeg', PNG: '.png' }

function DocumentRow({
  item,
  locked,
  onPreview,
  onRemove,
}: {
  item: RequirementItem
  locked: boolean
  onPreview: (item: RequirementItem) => void
  onRemove: (item: RequirementItem) => void
}) {
  const dispatch = useAppDispatch()
  const slot = useAppSelector((s) => s.verification.uploads[slotKey(item.key, item.campusId)])
  const inputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')
  const [dragging, setDragging] = useState(false)

  const accept = item.formats.map((f) => MIME_BY_EXT[f]).join(',')
  const uploading = slot?.status === 'uploading'
  const doc = item.document
  const rejected = doc?.reviewStatus === 'Rejected'

  const pick = (file?: File | null) => {
    if (!file) return
    setLocalError('')
    dispatch(uploadDismissed(slotKey(item.key, item.campusId)))
    // Friendly early checks only. The server re-checks size, real file signature and allowed type.
    if (file.size > item.maxBytes) {
      setLocalError(`This file is ${formatBytes(file.size)}. The limit for this document is ${formatBytes(item.maxBytes)}.`)
      return
    }
    const ext = file.name.split('.').pop()?.toUpperCase().replace('JPEG', 'JPG') ?? ''
    if (!item.formats.includes(ext)) {
      setLocalError(`Unsupported file type. Allowed: ${item.formats.join(', ')}.`)
      return
    }
    dispatch(uploadDocument({ file, item }))
  }

  // Data-only item (contact details & email) — captured in Step 1, not uploaded.
  if (item.kind === 'data') {
    return (
      <li className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">#{item.number}</span>
          <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
          <RequiredBadge required={item.required} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
        <p className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${item.done ? 'text-emerald-700' : 'text-rose-600'}`}>
          {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
          {item.done ? 'Contact details captured' : 'Add the organization contact email in Step 1'}
        </p>
      </li>
    )
  }

  return (
    <li className={`rounded-xl border bg-white p-4 transition-colors ${rejected ? 'border-rose-300' : doc ? 'border-emerald-200' : 'border-slate-200'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">#{item.number}</span>
            <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
            <RequiredBadge required={item.required} />
          </div>
          <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          <p className="mt-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">{item.formats.join(', ')}</span> · max {formatBytes(item.maxBytes)}
            <span className="mx-1.5 text-slate-300">|</span>
            <span className={item.required ? 'text-rose-600' : ''}>{item.requirementReason}</span>
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">{item.group}</p>
        </div>

        {doc && !uploading && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => onPreview(item)} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              <Eye className="h-3.5 w-3.5" /> View
            </button>
            {!locked && (
              <>
                <button type="button" onClick={() => inputRef.current?.click()} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <RefreshCw className="h-3.5 w-3.5" /> Replace
                </button>
                <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item.label}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Uploaded file summary */}
      {doc && !uploading && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="max-w-[16rem] truncate font-medium text-slate-800">{doc.originalName}</span>
            <span className="text-slate-400">{formatBytes(doc.sizeBytes)} · {formatDateTime(doc.uploadedAt)}</span>
            <ReviewBadge status={doc.reviewStatus} />
          </div>
          {rejected && (
            <p className="mt-2 text-xs text-rose-700"><span className="font-semibold">Reviewer: </span>{doc.reviewNote || 'Rejected. Please upload a corrected file.'}</p>
          )}
        </div>
      )}

      {/* Upload zone */}
      {(!doc || uploading) && !locked && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]) }}
          className={`mt-3 rounded-lg border-2 border-dashed p-3 text-center ${dragging ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200 bg-slate-50/50'}`}
        >
          {uploading ? (
            <div role="status" aria-live="polite">
              <div className="mb-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading… {slot.progress}%
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${slot.progress}%` }} />
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-500">
              <UploadCloud className="h-4 w-4" />
              Choose file or drag it here
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        aria-label={`Upload ${item.label}`}
        onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }}
      />

      <div className="mt-2 space-y-1">
        {localError && <InlineError message={localError} />}
        {slot?.status === 'failed' && <InlineError message={slot.error} />}
      </div>
    </li>
  )
}

export function DocumentUploadPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { requirements, requirementsLoad, error } = useAppSelector((s) => s.verification)
  const { required, optional } = useAppSelector(selectSplitRequirements)
  const [onlyMissing, setOnlyMissing] = useState(false)
  const [preview, setPreview] = useState<RequirementItem | null>(null)
  const [toRemove, setToRemove] = useState<RequirementItem | null>(null)
  const platform = usePlatformApi()

  useEffect(() => {
    if (platform) dispatch(fetchRequirements())
    return () => { dispatch(verificationErrorCleared()) }
  }, [dispatch, platform])

  const status = requirements?.status
  const summary = requirements?.summary
  // After submission the documents are locked; the status page is the right place to be.
  useEffect(() => {
    if (status && (status.status === 'Submitted' || status.status === 'Approved')) {
      navigate('/onboarding/verification-status', { replace: true })
    }
  }, [status, navigate])

  const locked = !!status && !status.editable
  const pct = summary && summary.requiredTotal ? Math.round((summary.requiredDone / summary.requiredTotal) * 100) : 0
  const remaining = summary ? summary.requiredTotal - summary.requiredDone : 0
  const show = (list: RequirementItem[]) => (onlyMissing ? list.filter((i) => !i.done) : list)
  const requiredShown = useMemo(() => show(required), [required, onlyMissing]) // eslint-disable-line react-hooks/exhaustive-deps
  const optionalShown = useMemo(() => show(optional), [optional, onlyMissing]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderList = (list: RequirementItem[]) => (
    <ul className="space-y-3">
      {list.map((item) => (
        <DocumentRow key={`${item.key}-${item.campusId ?? ''}`} item={item} locked={locked} onPreview={setPreview} onRemove={setToRemove} />
      ))}
    </ul>
  )

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-12 text-slate-800 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* Stepper */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4 of 5: Upload Documents</span>
            <span className="text-xs font-medium text-slate-500">Next: Review &amp; Send for Verification</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-4/5 rounded-full bg-blue-600 transition-all duration-300" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Upload Documents for Your Organization</h1>
            <p className="mt-2 text-sm text-slate-500">
              These documents are used by our verification team to approve your organization. Files are stored privately and are visible only to you and the verification team.
            </p>
          </div>

          {!platform && (
            <InlineError message="Document upload needs the backend. Set NEXT_PUBLIC_USE_PLATFORM_API=true and restart the frontend." />
          )}
          {requirementsLoad === 'failed' && !requirements && <InlineError message={error?.message} />}
          {requirementsLoad === 'loading' && !requirements && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500" role="status"><Loader2 className="h-4 w-4 animate-spin" /> Loading your checklist…</div>
          )}

          {requirements && summary && (
            <>
              {locked && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <Lock className="h-3.5 w-3.5" /> Documents are locked while your application is under review.
                </div>
              )}
              {status?.status === 'Rejected' && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  <p className="font-bold">Your application was declined</p>
                  <p className="mt-1">{status.note}</p>
                  <p className="mt-1 text-rose-600">Fix the points above, replace any rejected documents, then send it for verification again.</p>
                </div>
              )}

              {/* Progress */}
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-800">
                    {summary.requiredDone} of {summary.requiredTotal} required documents ready
                  </span>
                  <span className="text-slate-500">{summary.optionalDone} of {summary.optionalTotal} optional uploaded</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Required documents progress">
                  <div className={`h-full rounded-full transition-all ${remaining === 0 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5" /> PDF, JPG or PNG · each document shows its own size limit</p>
                  <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-slate-600">
                    <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} className="h-3.5 w-3.5 rounded border-slate-300" />
                    Show only what is still needed
                  </label>
                </div>
              </div>

              {error && requirementsLoad !== 'failed' && <div className="mb-4"><InlineError message={error.message} /></div>}

              <section aria-labelledby="req-h" className="mb-8">
                <h2 id="req-h" className="mb-3 text-xs font-bold uppercase tracking-wider text-rose-700">Required documents ({required.length})</h2>
                {requiredShown.length ? renderList(requiredShown) : <p className="rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-700">All required documents are in place.</p>}
              </section>

              <section aria-labelledby="opt-h">
                <h2 id="opt-h" className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Optional documents ({optional.length})</h2>
                <p className="mb-3 text-xs text-slate-500">Upload these if they apply to your institution. They can speed up verification.</p>
                {optionalShown.length ? renderList(optionalShown) : <p className="text-xs text-slate-500">Nothing further to show.</p>}
              </section>
            </>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
            <button type="button" onClick={() => navigate('/onboarding/products')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <div className="flex items-center gap-3">
              {remaining > 0 && <span className="text-[11px] text-slate-500">{remaining} required {remaining === 1 ? 'document' : 'documents'} remaining</span>}
              <button
                type="button"
                disabled={!summary || remaining > 0 || (summary?.rejected.length ?? 0) > 0}
                onClick={() => navigate('/onboarding/products/confirmation')}
                className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <span>Save &amp; Review Application</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {preview?.document && (
        <DocumentPreviewModal
          title={`${preview.label} — ${preview.document.originalName}`}
          mimeType={preview.document.mimeType}
          load={() => verificationService.documentBlob(preview.document!.id)}
          onClose={() => setPreview(null)}
        />
      )}

      <ActionDialog
        open={!!toRemove}
        title="Remove this document?"
        description={toRemove ? `“${toRemove.document?.originalName}” will be deleted. You can upload another file afterwards.` : ''}
        confirmLabel="Remove"
        tone="danger"
        onCancel={() => setToRemove(null)}
        onConfirm={() => {
          if (toRemove?.document) dispatch(removeDocument(toRemove.document.id))
          setToRemove(null)
        }}
      />
    </div>
  )
}
