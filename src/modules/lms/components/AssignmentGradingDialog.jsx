// src/modules/lms/components/AssignmentGradingDialog.jsx
import React, { useState, useEffect } from 'react'
import {
  X,
  Award,
  CheckCircle2,
  FileText,
  RotateCcw,
  AlertCircle,
  Download,
  Clock,
  User,
} from 'lucide-react'

export function AssignmentGradingDialog({
  isOpen,
  onClose,
  submission,
  assignment,
  onSaveGrade,
  onReturnSubmission,
  onReopenSubmission,
}) {
  const [marks, setMarks] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (submission) {
      setMarks(submission.marks !== null ? String(submission.marks) : '')
      setFeedback(submission.feedback || '')
    }
    setError('')
  }, [submission, isOpen])

  if (!isOpen || !submission || !assignment) return null

  const handleGrade = async (e) => {
    e.preventDefault()
    const numericMarks = Number(marks)
    if (isNaN(numericMarks) || numericMarks < 0) {
      setError('Please enter a valid positive score')
      return
    }
    if (numericMarks > assignment.maxMarks) {
      setError(`Marks cannot exceed maximum possible marks (${assignment.maxMarks})`)
      return
    }

    setIsSaving(true)
    setError('')
    try {
      await onSaveGrade(submission.id, {
        marks: numericMarks,
        feedback,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save grade')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
              Evaluate Student Submission
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {submission.studentName} • {submission.studentAdmissionNo}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleGrade} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="block text-slate-400">Submitted At</span>
              <span className="font-semibold text-slate-800">
                {new Date(submission.submittedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Submission Status</span>
              <span className={`font-bold ${submission.isLate ? 'text-amber-600' : 'text-emerald-600'}`}>
                {submission.isLate ? 'Late Submission' : 'On Time'}
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Attempt</span>
              <span className="font-semibold text-slate-800">
                #{submission.attemptNumber || 1}
              </span>
            </div>
            <div>
              <span className="block text-slate-400">Max Score</span>
              <span className="font-bold text-slate-900">{assignment.maxMarks} Points</span>
            </div>
          </div>

          {/* Attached Document */}
          {submission.attachmentName && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {submission.attachmentName}
                  </span>
                  <span className="block text-[11px] text-slate-500">Solution Document Attachment</span>
                </div>
              </div>

              <a
                href={submission.attachmentUrl || '#'}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>
          )}

          {/* Written notes */}
          {submission.submissionText && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Written Response
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-sans">
                {submission.submissionText}
              </div>
            </div>
          )}

          {/* Rubric Criteria if any */}
          {assignment.rubric && assignment.rubric.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Grading Rubric Breakdown
              </h4>
              <div className="space-y-2">
                {assignment.rubric.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-200/60 last:border-0">
                    <span className="text-slate-700">{r.criterion}</span>
                    <span className="font-semibold text-slate-900">{r.maxPoints} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marks and Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Score Awarded <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={assignment.maxMarks}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder={`0 - ${assignment.maxMarks}`}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                  / {assignment.maxMarks}
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Evaluation Feedback & Guidance
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Constructive feedback, commendations, or specific improvements..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onReturnSubmission && onReturnSubmission(submission.id)
                  onClose()
                }}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                Return for Revision
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSaving ? 'Saving Grade...' : 'Save & Publish Grade'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
