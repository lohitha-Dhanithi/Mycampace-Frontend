// src/platform/superadmin/VerificationQueuePage.tsx
// Superadmin queue of institution applications. Role is enforced by the backend (SuperAdmin only).
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Eye, Loader2, LogOut, Search, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { decideApplication, fetchQueue, filtersChanged, noticeDismissed } from '@/store/slices/superadminVerificationSlice'
import type { QueueItem, VerificationStatus } from '@/types/verification'
import { ActionDialog, InlineError, NoticeBanner, VerificationBadge, formatDateTime } from '@/platform/verification/shared'

const TABS: { value: VerificationStatus | ''; label: string }[] = [
  { value: 'Submitted', label: 'Awaiting review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Declined' },
  { value: '', label: 'All' },
]

export function VerificationQueuePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, logout } = useAuth()
  const { queue, filters, error, acting, notice } = useAppSelector((s) => s.superadminVerification)
  const [search, setSearch] = useState(filters.search)
  const [target, setTarget] = useState<{ item: QueueItem; kind: 'approve' | 'reject' } | null>(null)
  const [reason, setReason] = useState('')

  const closeDialog = () => {
    setTarget(null)
    setReason('')
  }

  const decide = async () => {
    if (!target) return
    const { item, kind } = target
    const base = { orgId: item.id, from: 'queue' as const, round: item.round, label: item.name }
    await dispatch(decideApplication(kind === 'approve' ? { ...base, kind } : { ...base, kind, reason: reason.trim() }))
    closeDialog() // success shows a banner; a failure (e.g. documents not yet accepted) shows the error banner
  }

  useEffect(() => {
    dispatch(fetchQueue())
  }, [dispatch, filters])

  // Debounce typing so we don't query on every keystroke.
  useEffect(() => {
    if (search === filters.search) return
    const t = setTimeout(() => dispatch(filtersChanged({ search })), 350)
    return () => clearTimeout(t)
  }, [search, filters.search, dispatch])

  const pages = Math.max(1, Math.ceil(queue.total / filters.pageSize))
  const countFor = (v: VerificationStatus | '') => (v === '' ? undefined : queue.counts[v])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><ShieldCheck className="h-5 w-5 text-blue-600" /> MyCampace · Institution Verification</div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{user?.email}</span>
            <button type="button" onClick={async () => { await logout(); navigate('/auth', { replace: true }) }} className="flex items-center gap-1 font-semibold hover:text-slate-800"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {TABS.map((t) => {
              const active = filters.status === t.value
              const n = countFor(t.value)
              return (
                <button
                  key={t.label}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => dispatch(filtersChanged({ status: t.value }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {t.label}{n !== undefined ? ` (${n})` : ''}
                </button>
              )
            })}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or Application ID"
              aria-label="Search name or Application ID"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-72"
            />
          </div>
        </div>

        {notice && <NoticeBanner tone={notice.tone} message={notice.message} onDismiss={() => dispatch(noticeDismissed())} />}
        {error && (
          <div className="mb-4">
            <InlineError message={error.status === 422 ? `${error.message} Open the application to review its documents.` : error.message} />
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Application ID</th>
                <th className="px-4 py-3 font-bold">Institution</th>
                <th className="px-4 py-3 font-bold">Administrator</th>
                <th className="px-4 py-3 font-bold">Registered email</th>
                <th className="px-4 py-3 font-bold">Submitted</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.load === 'loading' && !queue.items.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500"><Loader2 className="mx-auto h-4 w-4 animate-spin" /></td></tr>
              )}
              {queue.load !== 'loading' && !queue.items.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No applications found.</td></tr>
              )}
              {queue.items.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">{a.applicationId ?? '—'}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{a.name}</p>
                    <p className="text-slate-500">{a.type} · {a.city}, {a.state}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{a.admin?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{a.admin?.email ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(a.submittedAt)}{a.round > 1 && <span className="ml-1 rounded bg-slate-100 px-1 text-[10px] text-slate-500">round {a.round}</span>}</td>
                  <td className="px-4 py-3"><VerificationBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => navigate(`/superadmin/verifications/${a.id}`)} className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      {a.status === 'Submitted' && (
                        <>
                          <button type="button" disabled={acting} onClick={() => setTarget({ item: a, kind: 'approve' })} className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">Approve</button>
                          <button type="button" disabled={acting} onClick={() => setTarget({ item: a, kind: 'reject' })} className="h-8 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">Decline</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{queue.total} application{queue.total === 1 ? '' : 's'}</span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous page" disabled={filters.page <= 1} onClick={() => dispatch(filtersChanged({ page: filters.page - 1 }))} className="rounded-lg border border-slate-200 bg-white p-1.5 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <span>Page {filters.page} of {pages}</span>
            <button type="button" aria-label="Next page" disabled={filters.page >= pages} onClick={() => dispatch(filtersChanged({ page: filters.page + 1 }))} className="rounded-lg border border-slate-200 bg-white p-1.5 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </main>

      <ActionDialog
        open={target?.kind === 'approve'}
        title="Approve this institution?"
        description={`${target?.item.name} (${target?.item.applicationId ?? 'no ID'}) will be able to sign in and use MyCampace, and a confirmation email will be sent to ${target?.item.admin?.email ?? 'the registered email'}.`}
        confirmLabel="Yes, approve"
        tone="success"
        busy={acting}
        onCancel={closeDialog}
        onConfirm={decide}
      />

      <ActionDialog
        open={target?.kind === 'reject'}
        title="Decline this application?"
        description={`${target?.item.name} (${target?.item.applicationId ?? 'no ID'}) stays blocked. Your reason is saved and emailed to ${target?.item.admin?.email ?? 'the registered email'}.`}
        confirmLabel="Decline application"
        tone="danger"
        busy={acting}
        confirmDisabled={reason.trim().length < 10}
        onCancel={closeDialog}
        onConfirm={decide}
      >
        <label className="text-xs font-semibold text-slate-700" htmlFor="queue-reject-reason">Reason for declining (required, min. 10 characters)</label>
        <textarea id="queue-reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={1000} required className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </ActionDialog>
    </div>
  )
}
