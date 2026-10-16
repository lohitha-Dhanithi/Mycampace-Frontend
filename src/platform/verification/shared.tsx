// src/platform/verification/shared.tsx
// Small presentational pieces shared by the applicant flow and the superadmin panel.
import React, { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, CheckCircle2, Clock, Copy, Loader2, X, XCircle } from 'lucide-react'
import type { DocumentReviewStatus, VerificationStatus } from '@/types/verification'

export function formatBytes(n: number) {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(n % (1024 * 1024) === 0 ? 0 : 1)} MB`
  if (n >= 1024) return `${Math.round(n / 1024)} KB`
  return `${n} B`
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const BADGE = 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide'

export function RequiredBadge({ required }: { required: boolean }) {
  return required ? (
    <span className={`${BADGE} border-rose-200 bg-rose-50 text-rose-700`}>Required</span>
  ) : (
    <span className={`${BADGE} border-slate-200 bg-slate-50 text-slate-500`}>Optional</span>
  )
}

export function ReviewBadge({ status }: { status: DocumentReviewStatus }) {
  if (status === 'Accepted')
    return (
      <span className={`${BADGE} border-emerald-200 bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 className="h-3 w-3" /> Accepted
      </span>
    )
  if (status === 'Rejected')
    return (
      <span className={`${BADGE} border-rose-200 bg-rose-50 text-rose-700`}>
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    )
  return (
    <span className={`${BADGE} border-amber-200 bg-amber-50 text-amber-700`}>
      <Clock className="h-3 w-3" /> Awaiting review
    </span>
  )
}

const STATUS_STYLE: Record<VerificationStatus, { label: string; cls: string }> = {
  Draft: { label: 'Not submitted', cls: 'border-slate-200 bg-slate-50 text-slate-600' },
  Submitted: { label: 'Awaiting verification', cls: 'border-amber-200 bg-amber-50 text-amber-700' },
  Approved: { label: 'Approved', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  Rejected: { label: 'Declined', cls: 'border-rose-200 bg-rose-50 text-rose-700' },
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const s = STATUS_STYLE[status]
  return <span className={`${BADGE} ${s.cls}`}>{s.label}</span>
}

export function InlineError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/** Copies text to the clipboard and briefly confirms. Falls back to a hidden textarea on non-secure origins. */
export function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button type="button" onClick={copy} className={`inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 ${className}`}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export function NoticeBanner({ tone, message, onDismiss }: { tone: 'success' | 'warning'; message: string; onDismiss: () => void }) {
  const cls = tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-300 bg-amber-50 text-amber-900'
  return (
    <div role="status" className={`mb-4 flex items-start justify-between gap-3 rounded-xl border px-3 py-2 text-xs ${cls}`}>
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0 rounded p-0.5 hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
    </div>
  )
}

/** Opens a private file through the authenticated API (never a public URL) in a sandboxed viewer. */
export function DocumentPreviewModal({
  title,
  mimeType,
  load,
  onClose,
}: {
  title: string
  mimeType: string
  load: () => Promise<Blob>
  onClose: () => void
}) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const loadRef = useRef(load)

  useEffect(() => {
    let revoked: string | null = null
    let active = true
    loadRef
      .current()
      .then((blob) => {
        if (!active) return
        revoked = URL.createObjectURL(blob)
        setUrl(revoked)
      })
      .catch((e) => active && setError(e?.message || 'Could not open this document.'))
    return () => {
      active = false
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="truncate text-sm font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close preview" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-100">
          {error ? (
            <div className="p-6"><InlineError message={error} /></div>
          ) : !url ? (
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          ) : mimeType.startsWith('image/') ? (
            <img src={url} alt={title} className="max-h-full max-w-full object-contain" />
          ) : (
            <iframe src={url} title={title} className="h-full w-full border-0" sandbox="" />
          )}
        </div>
      </div>
    </div>
  )
}

/** Confirmation modal for consequential actions (submit, approve, decline). */
export function ActionDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'primary',
  busy,
  confirmDisabled,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  tone?: 'primary' | 'success' | 'danger'
  busy?: boolean
  confirmDisabled?: boolean
  onConfirm: () => void
  onCancel: () => void
  children?: React.ReactNode
}) {
  if (!open) return null
  const toneCls = { primary: 'bg-blue-600 hover:bg-blue-500', success: 'bg-emerald-600 hover:bg-emerald-500', danger: 'bg-rose-600 hover:bg-rose-500' }[tone]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || confirmDisabled}
            className={`flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold text-white disabled:opacity-50 ${toneCls}`}
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
