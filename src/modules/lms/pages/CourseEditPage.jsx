// src/modules/lms/pages/CourseEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { lmsCourseService } from '../services/lmsCourseService'
import { DIFFICULTY_LEVELS, ENROLLMENT_MODES } from '../config/lmsConfig'

export function CourseEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    shortDescription: '',
    description: '',
    duration: '',
    difficulty: 'Intermediate',
    enrollmentMode: 'Automatic',
    visibility: 'Enrolled Only',
    startDate: '',
    endDate: '',
    certificateEnabled: false,
    discussionEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    try {
      const crs = await lmsCourseService.getCourseById(id)
      if (!crs) {
        navigate('/lms/courses')
        return
      }
      setCourse(crs)
      setFormData({
        name: crs.name || '',
        courseCode: crs.courseCode || '',
        shortDescription: crs.shortDescription || '',
        description: crs.description || '',
        duration: crs.duration || '',
        difficulty: crs.difficulty || 'Intermediate',
        enrollmentMode: crs.enrollmentMode || 'Automatic',
        visibility: crs.visibility || 'Enrolled Only',
        startDate: crs.startDate || '',
        endDate: crs.endDate || '',
        certificateEnabled: !!crs.certificateEnabled,
        discussionEnabled: !!crs.discussionEnabled,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await lmsCourseService.updateCourse(id, formData)
      navigate(`/lms/courses/${id}`)
    } catch (err) {
      setError(err.message || 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !course) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading Course Data...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <LMSNavigation />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <Link
            to={`/lms/courses/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Course Profile</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Edit Course: {course.name}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
            <input
              type="text"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Link
            to={`/lms/courses/${id}`}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
