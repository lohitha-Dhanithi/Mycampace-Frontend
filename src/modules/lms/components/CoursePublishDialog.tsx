// src/modules/lms/components/CoursePublishDialog.jsx
import React, { useState, useEffect } from 'react'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Rocket,
  ShieldAlert,
} from 'lucide-react'
import { lmsCourseService } from '../services/lmsCourseService'

export function CoursePublishDialog({
  isOpen,
  onClose,
  courseId,
  courseName,
  onPublishSuccess,
}) {
  const [readiness, setReadiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && courseId) {
      loadValidation()
    }
  }, [isOpen, courseId])

  const loadValidation = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await lmsCourseService.validateCoursePublishReadiness(courseId)
      setReadiness(data)
    } catch (err) {
      setError(err.message || 'Validation failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handlePublish = async () => {
    setPublishing(true)
    setError('')
    try {
      await lmsCourseService.publishCourse(courseId)
      if (onPublishSuccess) onPublishSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to publish course')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Course Readiness & Publishing
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">{courseName}</h4>
            <p className="text-xs text-slate-500">
              Verifying all institutional curriculum prerequisites before going live to students.
            </p>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
              Running readiness checks on modules, lessons, and academic mappings...
            </div>
          ) : readiness ? (
            <div className="space-y-4">
              {/* Passed Checks */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Readiness Criteria Checklist
                </span>
                {readiness.passedChecks.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {readiness.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Non-blocking Warnings ({readiness.warnings.length})</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-700 space-y-1 pl-1">
                    {readiness.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Critical Issues (Blockers) */}
              {readiness.criticalIssues.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>Critical Issues Found ({readiness.criticalIssues.length})</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-700 space-y-1 pl-1">
                    {readiness.criticalIssues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    Publishing is blocked until all critical issues are resolved.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || publishing || !readiness?.isReady}
              onClick={handlePublish}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg shadow-xs transition-all ${
                readiness?.isReady
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>{publishing ? 'Publishing...' : 'Publish Course'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
