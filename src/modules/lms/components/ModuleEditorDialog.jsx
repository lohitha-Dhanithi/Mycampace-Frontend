// src/modules/lms/components/ModuleEditorDialog.jsx
import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'

export function ModuleEditorDialog({
  isOpen,
  onClose,
  onSubmit,
  module = null,
  courseId,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedDuration: '10 Hours',
    availabilityDate: new Date().toISOString().split('T')[0],
    completionRequirement: 'Complete all lessons and mandatory assessments',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name || '',
        description: module.description || '',
        estimatedDuration: module.estimatedDuration || '10 Hours',
        availabilityDate: module.availabilityDate || new Date().toISOString().split('T')[0],
        completionRequirement: module.completionRequirement || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        estimatedDuration: '10 Hours',
        availabilityDate: new Date().toISOString().split('T')[0],
        completionRequirement: 'Complete all lessons and mandatory assessments',
      })
    }
    setError('')
  }, [module, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Module title is required')
      return
    }
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {module ? 'Edit Module' : 'Create New Learning Module'}
            </h3>
            <p className="text-xs text-slate-500">
              Define the module chapter title, estimated duration, and completion terms.
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Module Name / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Module 01: Introduction to Mechanics"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Summary Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of concepts covered in this module..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="e.g. 14 Hours"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Availability Date
              </label>
              <input
                type="date"
                value={formData.availabilityDate}
                onChange={(e) => setFormData({ ...formData, availabilityDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Completion Requirement Note
            </label>
            <input
              type="text"
              value={formData.completionRequirement}
              onChange={(e) => setFormData({ ...formData, completionRequirement: e.target.value })}
              placeholder="e.g. Pass diagnostic quiz and complete 80% lessons"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{module ? 'Save Changes' : 'Create Module'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
