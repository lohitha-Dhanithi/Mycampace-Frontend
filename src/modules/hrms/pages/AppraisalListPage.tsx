import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { EmptyState, StatusBadge } from '../components/ui'
import { APPRAISAL_CYCLE } from '../config/hrmsConfig'
import type { AppraisalReview } from '../types'

export function AppraisalListPage() {
  const [reviews, setReviews] = useState<AppraisalReview[]>([])
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState('all')

  useEffect(() => {
    setLoading(true)
    hrmsService.getAppraisals(stage).then((rows) => {
      setReviews(rows)
      setLoading(false)
    })
  }, [stage])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Faculty appraisal"
        description={`${APPRAISAL_CYCLE}. Each review moves from self assessment to HOD, principal, and HR close.`}
      />
      <div className="w-56">
        <Select value={stage} onChange={(event) => setStage(event.target.value)} className="text-xs">
          <option value="all">All stages</option>
          <option>Self Review</option>
          <option>HOD Review</option>
          <option>Principal Review</option>
          <option>HR Closed</option>
        </Select>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <LoadingState message="Loading appraisal cycle..." />
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <EmptyState message="No reviews at this stage." />
            {stage !== 'all' && (
              <button
                type="button"
                onClick={() => setStage('all')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Show all stages
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Scores</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/app/hrms/appraisals/${review.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">{review.staffName}</Link>
                    <p className="text-[11px] text-slate-500">{review.designation}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge value={review.stage} /></td>
                  <td className="px-4 py-3 text-slate-600">
                    Self {review.selfScore ?? '—'} · HOD {review.hodScore ?? '—'} · Principal {review.principalScore ?? '—'}
                  </td>
                  <td className="px-4 py-3">{review.finalRating ? <StatusBadge value={review.finalRating} /> : <span className="text-slate-400">In progress</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
