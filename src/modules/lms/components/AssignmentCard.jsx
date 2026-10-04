// src/modules/lms/components/AssignmentCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Award,
  Users,
  CheckCircle,
  Clock,
  FileText,
  UploadCloud,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'

export function AssignmentCard({
  assignment,
  isStudentView = false,
  mySubmission = null,
  onSubmitClick,
  onGradeClick,
  onDelete,
}) {
  const isPastDue = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false
  const formattedDate = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No Due Date'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded">
            {assignment.submissionType || 'File Upload'}
          </span>

          {isStudentView && mySubmission ? (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                mySubmission.status === 'Graded'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <CheckCircle className="h-3 w-3" />
              {mySubmission.status} {mySubmission.marks !== null && `(${mySubmission.marks}/${assignment.maxMarks})`}
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                isPastDue
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Calendar className="h-3 w-3" />
              Due: {formattedDate}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-1.5 hover:text-blue-600 transition-colors">
          {assignment.title}
        </h4>

        {/* Instructions preview */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
          {assignment.instructions}
        </p>
      </div>

      <div>
        {/* Metrics Grid */}
        {!isStudentView ? (
          <div className="grid grid-cols-3 gap-2 py-2 mb-4 border-t border-b border-slate-100 text-center">
            <div>
              <span className="block text-[10px] text-slate-400">Submitted</span>
              <span className="text-xs font-bold text-slate-800">
                {assignment.submissionCount || 0}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Graded</span>
              <span className="text-xs font-bold text-emerald-600">
                {assignment.gradedCount || 0}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Max Marks</span>
              <span className="text-xs font-bold text-slate-800">{assignment.maxMarks}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs py-2 mb-3 border-t border-slate-100 text-slate-600">
            <span>Maximum Marks: <strong className="text-slate-900">{assignment.maxMarks}</strong></span>
            <span>Attempts: <strong className="text-slate-900">{assignment.allowedAttempts || 1}</strong></span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-1">
          {isStudentView ? (
            <button
              type="button"
              onClick={() => onSubmitClick && onSubmitClick(assignment)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{mySubmission ? 'View / Resubmit' : 'Submit Assignment'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link
                to={`/lms/assignments/${assignment.id}/submissions`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Review Submissions ({assignment.submissionCount || 0})</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
