import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { StatusBadge } from '../components/ui'
import { formatDisplayDate } from '../config/hrmsConfig'
import type { AppraisalReview, MetricField } from '../types'

const STAGE_FIELD: Record<string, MetricField | null> = {
  'Self Review': 'self',
  'HOD Review': 'hod',
  'Principal Review': 'principal',
  'HR Closed': null,
}

export function AppraisalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [review, setReview] = useState<AppraisalReview | null>(null)
  const [missing, setMissing] = useState(false)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => {
    if (!id) return
    hrmsService.getAppraisalById(id).then((result) => {
      if (!result) setMissing(true)
      else setReview(result)
    })
  }

  useEffect(() => {
    load()
  }, [id])

  if (missing) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold">Appraisal not found</p>
        <Button className="mt-4" onClick={() => navigate('/app/hrms/appraisals')}>Back to cycle</Button>
      </div>
    )
  }
  if (!review) return <LoadingState message="Loading appraisal..." />

  const field = STAGE_FIELD[review.stage]
  const nextLabel =
    review.stage === 'Self Review' ? 'Submit self review' : review.stage === 'HOD Review' ? 'Send to principal' : 'Close appraisal'

  const setScore = async (index: number, value: number) => {
    if (!id) return
    const updated = await hrmsService.updateAppraisalMetric(id, index, value)
    if (updated) setReview({ ...updated, metrics: updated.metrics.map((metric) => ({ ...metric })) })
  }

  const advance = async () => {
    if (!id) return
    setBusy(true)
    setError('')
    try {
      const updated = await hrmsService.advanceAppraisal(id, comment)
      setReview(structuredClone(updated))
      setComment('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not move this review.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/app/hrms/appraisals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to Faculty Appraisals
        </Link>
      </div>

      <PageHeader
        title={review.staffName}
        description={`${review.designation} · ${review.cycle}`}
        badge={<StatusBadge value={review.stage} />}
        actions={
          <Link to={`/app/hrms/staff/${review.staffId}`} className="text-xs font-semibold text-blue-600 hover:underline">
            Staff profile
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Self', review.selfScore],
          ['HOD', review.hodScore],
          ['Principal', review.principalScore],
          ['Final', review.finalScore],
        ].map(([label, score]) => (
          <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{score ?? '—'}</p>
          </div>
        ))}
      </div>

      {review.finalRating && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Cycle rating</span>
          <StatusBadge value={review.finalRating} />
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-900">Performance metrics</h2>
        <p className="mt-1 text-[11px] text-slate-500">Scores are out of 5. The stage score is the weighted average.</p>
        <div className="mt-4 space-y-4">
          {review.metrics.map((metric, index) => (
            <div key={metric.name} className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 md:grid-cols-[1fr_8rem_8rem_8rem]">
              <div>
                <p className="text-xs font-semibold text-slate-800">{metric.name}</p>
                <p className="text-[11px] text-slate-400">Weight {metric.weight}%</p>
              </div>
              {(['self', 'hod', 'principal'] as MetricField[]).map((key) => (
                <label key={key} className="text-[11px] text-slate-500">
                  {key}
                  <input
                    type="number"
                    min={1}
                    max={5}
                    disabled={field !== key}
                    value={metric[key] || ''}
                    onChange={(event) => setScore(index, Number(event.target.value))}
                    className="mt-1 h-8 w-full rounded-md border border-slate-300 px-2 text-xs text-slate-800 disabled:bg-slate-50"
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
        {field && (
          <div className="mt-4 space-y-3">
            <Textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Notes for the next reviewer." />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            <Button disabled={busy} onClick={advance} className="bg-slate-900 hover:bg-indigo-600">{busy ? 'Saving...' : nextLabel}</Button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-900">Review notes</h2>
        {review.comments.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">No comments yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {review.comments.map((note, index) => (
              <div key={`${note.stage}-${index}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{note.stage} · {formatDisplayDate(note.at)}</p>
                <p className="text-xs text-slate-700">{note.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
