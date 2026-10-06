// src/modules/lms/components/LessonEditorDialog.jsx
import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle, Upload, Link, Video, FileText, File } from 'lucide-react'
import { CONTENT_TYPES } from '../config/lmsConfig'

export function LessonEditorDialog({
  isOpen,
  onClose,
  onSubmit,
  lesson = null,
  moduleId,
  courseId,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'Text',
    duration: '30 mins',
    isMandatory: true,
    completionRequirement: 'Review all learning material thoroughly',
    videoUrl: '',
    videoProvider: 'YouTube',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    contentBody: '',
    summaryNotes: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        contentType: lesson.contentType || 'Text',
        duration: lesson.duration || '30 mins',
        isMandatory: lesson.isMandatory !== undefined ? lesson.isMandatory : true,
        completionRequirement: lesson.completionRequirement || '',
        videoUrl: lesson.videoUrl || '',
        videoProvider: lesson.videoProvider || 'YouTube',
        fileUrl: lesson.fileUrl || '',
        fileName: lesson.fileName || '',
        fileSize: lesson.fileSize || '',
        contentBody: lesson.contentBody || '',
        summaryNotes: lesson.summaryNotes || '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        contentType: 'Text',
        duration: '30 mins',
        isMandatory: true,
        completionRequirement: 'Review all learning material thoroughly',
        videoUrl: '',
        videoProvider: 'YouTube',
        fileUrl: '',
        fileName: '',
        fileSize: '',
        contentBody: '',
        summaryNotes: '',
      })
    }
    setError('')
  }, [lesson, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Lesson title is required')
      return
    }
    onSubmit({
      ...formData,
      moduleId,
      courseId,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {lesson ? 'Edit Lesson Content' : 'Create New Lesson'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure learning content, media attachments, and completion criteria.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lesson Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 1.1 Introduction to Vectors"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Content Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 35 mins"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMandatory}
                  onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700">Mandatory Lesson</span>
              </label>
            </div>
          </div>

          {/* Conditional Media Config */}
          {formData.contentType === 'Video' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Video className="h-4 w-4 text-rose-500" />
                Video Source Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Video Stream URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Provider</label>
                  <select
                    value={formData.videoProvider}
                    onChange={(e) => setFormData({ ...formData, videoProvider: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Vimeo">Vimeo</option>
                    <option value="AWS S3 / CloudFront">AWS S3 / CloudFront</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {(formData.contentType === 'PDF' || formData.contentType === 'Document' || formData.contentType === 'Presentation') && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <File className="h-4 w-4 text-amber-500" />
                Document File Attachment
              </h4>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-white hover:bg-slate-50/50 cursor-pointer">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-blue-600">Click to upload document</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Supports PDF, DOCX, PPTX up to 50MB</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="File name (e.g. Lecture_Notes.pdf)"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value, fileUrl: '/documents/' + e.target.value })}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Size (e.g. 4.2 MB)"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {formData.contentType === 'Text' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Article / Markdown Content
              </label>
              <textarea
                rows={6}
                value={formData.contentBody}
                onChange={(e) => setFormData({ ...formData, contentBody: e.target.value })}
                placeholder="Write rich instructional article, formulas, and conceptual explanations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Key Takeaways / Lecture Notes
            </label>
            <textarea
              rows={3}
              value={formData.summaryNotes}
              onChange={(e) => setFormData({ ...formData, summaryNotes: e.target.value })}
              placeholder="Highlight bullet points, formulas, or key reminders for students..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{lesson ? 'Save Changes' : 'Create Lesson'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
