// src/modules/lms/components/AssignmentSubmissionDialog.jsx
import React, { useState } from 'react'
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Calendar,
  AlertCircle,
  File,
  Download,
} from 'lucide-react'

export function AssignmentSubmissionDialog({
  isOpen,
  onClose,
  assignment,
  existingSubmission = null,
  onSubmit,
}) {
  const [submissionText, setSubmissionText] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !assignment) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!submissionText.trim() && !attachmentName.trim()) {
      setError('Please provide a written response or attach a solution file.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      await onSubmit({
        assignmentId: assignment.id,
        courseId: assignment.courseId,
        studentId: 'std-001',
        studentName: 'Aarav Sharma',
        studentAdmissionNo: 'ADM-2026-001',
        submissionText,
        attachmentName: attachmentName || 'Student_Assignment_Submission.pdf',
        attachmentUrl: '/submissions/' + (attachmentName || 'submission.pdf'),
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wide">
              Assignment Submission
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {assignment.title}
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

        <div className="p-6 space-y-5">
          {/* Assignment instructions reminder */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Instructions
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {assignment.instructions}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <span>Maximum Marks: <strong className="text-slate-900">{assignment.maxMarks}</strong></span>
              <span>Due: <strong className="text-slate-900">{new Date(assignment.dueDate).toLocaleDateString()}</strong></span>
              <span>Submission Type: <strong className="text-slate-900">{assignment.submissionType}</strong></span>
            </div>
          </div>

          {/* If previously graded */}
          {existingSubmission && existingSubmission.status === 'Graded' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Your Submission is Graded!
                </span>
                <span className="font-bold text-sm text-emerald-900">
                  {existingSubmission.marks} / {existingSubmission.maxMarks} Marks
                </span>
              </div>
              {existingSubmission.feedback && (
                <div className="text-xs text-emerald-800 mt-2 bg-white/70 p-3 rounded-lg border border-emerald-200/60">
                  <strong>Instructor Feedback:</strong> {existingSubmission.feedback}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Solution File (PDF, DOCX, ZIP)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-blue-600 block">
                  Click to select solution file
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Upload file up to 25 MB
                </span>
                <input
                  type="text"
                  placeholder="Or enter simulated filename (e.g. Aarav_Sharma_GaussSolutions.pdf)"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="mt-3 w-full max-w-sm px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-center mx-auto block"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Online Text Response / Student Notes
              </label>
              <textarea
                rows={4}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your explanation or brief description of the attached solution..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
