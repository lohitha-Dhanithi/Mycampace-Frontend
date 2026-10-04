// src/modules/lms/pages/CourseCreatePage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Settings,
  Sparkles,
  Layers,
  Save,
  AlertCircle,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { lmsCourseService } from '../services/lmsCourseService'
import { DIFFICULTY_LEVELS, ENROLLMENT_MODES } from '../config/lmsConfig'

export function CourseCreatePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Academic Mapping
  const [academicData, setAcademicData] = useState({
    academicYearId: 'ay-2026-27',
    academicYearName: '2026-2027',
    campusId: 'camp-1',
    campusName: 'Hyderabad Main Campus',
    programId: 'prog-1',
    programName: 'Senior Secondary (11th - 12th)',
    academicCourseId: 'crs-1',
    academicCourseName: 'Science Stream (PCM / PCB)',
    classId: 'cls-12',
    className: 'Class 12',
    sectionId: 'sec-12A',
    sectionName: 'Section A (PCM)',
    subjectId: 'sub-phy',
    subjectName: 'Physics (042)',
  })

  // Step 2: Course Details
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    courseCode: '',
    shortDescription: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    instructorId: 'usr-5',
    instructorName: 'Pooja Iyer',
    instructorEmail: 'pooja.iyer@abcschool.edu.in',
    duration: '45 Hours',
    difficulty: 'Intermediate',
    language: 'English',
    tags: 'Physics, Electromagnetism, Senior Secondary',
  })

  // Step 3: Course Settings
  const [courseSettings, setCourseSettings] = useState({
    enrollmentMode: 'Automatic',
    visibility: 'Enrolled Only',
    startDate: '2026-06-01',
    endDate: '2027-03-31',
    completionRequirement: 'All modules, problem sets, and diagnostic quizzes completed',
    certificateEnabled: true,
    discussionEnabled: true,
    assignmentEnabled: true,
    quizEnabled: true,
  })

  const handleNext = () => {
    setError('')
    if (currentStep === 1) {
      if (!academicData.academicYearId || !academicData.classId || !academicData.subjectId) {
        setError('Please select academic year, class, and subject mapping.')
        return
      }
      // Auto-suggest course code and name if empty
      if (!courseDetails.courseCode) {
        const subCode = academicData.subjectId.toUpperCase().replace('SUB-', '')
        const clsCode = academicData.classId.toUpperCase().replace('CLS-', '')
        setCourseDetails((prev) => ({
          ...prev,
          courseCode: `${subCode}-${clsCode}-2026`,
          name: prev.name || `${academicData.className} ${academicData.subjectName} Digital Course`,
        }))
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!courseDetails.name.trim() || !courseDetails.courseCode.trim()) {
        setError('Course name and code are required.')
        return
      }
      setCurrentStep(3)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const payload = {
        ...academicData,
        ...courseDetails,
        tags: courseDetails.tags.split(',').map((t) => t.trim()).filter(Boolean),
        ...courseSettings,
      }
      const newCourse = await lmsCourseService.createCourse(payload)
      navigate(`/lms/courses/${newCourse.id}`)
    } catch (err) {
      setError(err.message || 'Failed to create course')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <LMSNavigation />

      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <Link
            to="/lms/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Course Catalog</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create New LMS Course
          </h1>
        </div>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {[
          { step: 1, label: '1. Academic Mapping', desc: 'Syllabus & Cohort' },
          { step: 2, label: '2. Course Details', desc: 'Metadata & Instructor' },
          { step: 3, label: '3. Settings & Rules', desc: 'Enrollment & Visibility' },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              if (item.step < currentStep) setCurrentStep(item.step)
            }}
            className={`py-2 px-3 rounded-lg text-left transition-all ${
              currentStep === item.step
                ? 'bg-white shadow-xs border border-slate-200'
                : 'hover:bg-slate-200/60'
            }`}
          >
            <span className={`block text-xs font-bold ${currentStep === item.step ? 'text-blue-700' : 'text-slate-600'}`}>
              {item.label}
            </span>
            <span className="block text-[11px] text-slate-400">{item.desc}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8">
        {/* ======================================================== */}
        {/* STEP 1: ACADEMIC MAPPING                                 */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Step 1 — Academic Structure Mapping
              </h3>
              <p className="text-xs text-slate-500">
                Connect this digital learning course directly to configured academic entities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={academicData.academicYearId}
                  onChange={(e) => setAcademicData({ ...academicData, academicYearId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="ay-2026-27">Academic Year 2026-2027 (Current)</option>
                  <option value="ay-2025-26">Academic Year 2025-2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus <span className="text-rose-500">*</span>
                </label>
                <select
                  value={academicData.campusId}
                  onChange={(e) => setAcademicData({ ...academicData, campusId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="camp-1">Hyderabad Main Campus</option>
                  <option value="camp-2">Secunderabad Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Program <span className="text-rose-500">*</span>
                </label>
                <select
                  value={academicData.programId}
                  onChange={(e) => setAcademicData({ ...academicData, programId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="prog-1">Senior Secondary (11th - 12th)</option>
                  <option value="prog-2">Secondary Education (9th - 10th)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class & Cohort <span className="text-rose-500">*</span>
                </label>
                <select
                  value={academicData.classId}
                  onChange={(e) => {
                    const clsName = e.target.value === 'cls-12' ? 'Class 12' : 'Class 11'
                    setAcademicData({ ...academicData, classId: e.target.value, className: clsName })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="cls-12">Class 12</option>
                  <option value="cls-11">Class 11</option>
                  <option value="cls-10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class Section
                </label>
                <select
                  value={academicData.sectionId}
                  onChange={(e) => {
                    const secName = e.target.value === 'sec-12A' ? 'Section A (PCM)' : 'Section B (PCB)'
                    setAcademicData({ ...academicData, sectionId: e.target.value, sectionName: secName })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="sec-12A">Section A (PCM)</option>
                  <option value="sec-12B">Section B (PCB)</option>
                  <option value="all">All Sections (Shared Curriculum)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Curriculum Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={academicData.subjectId}
                  onChange={(e) => {
                    const subMap = {
                      'sub-phy': 'Physics (042)',
                      'sub-math': 'Mathematics (041)',
                      'sub-chem': 'Chemistry (043)',
                      'sub-cs': 'Computer Science (083)',
                    }
                    setAcademicData({
                      ...academicData,
                      subjectId: e.target.value,
                      subjectName: subMap[e.target.value] || 'Subject',
                    })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="sub-phy">Physics (042)</option>
                  <option value="sub-math">Mathematics (041)</option>
                  <option value="sub-chem">Chemistry (043)</option>
                  <option value="sub-cs">Computer Science (083)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <span>Continue to Course Details</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: COURSE DETAILS                                   */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Step 2 — Course Information & Lead Instructor
              </h3>
              <p className="text-xs text-slate-500">
                Provide student-facing descriptive information and assign educator ownership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseDetails.name}
                  onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
                  placeholder="e.g. Advanced Physics: Electromagnetism & Wave Optics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseDetails.courseCode}
                  onChange={(e) => setCourseDetails({ ...courseDetails, courseCode: e.target.value })}
                  placeholder="e.g. PHY-12A-2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description (Overview Card Summary)
              </label>
              <input
                type="text"
                value={courseDetails.shortDescription}
                onChange={(e) => setCourseDetails({ ...courseDetails, shortDescription: e.target.value })}
                placeholder="1-2 sentences summarizing topics covered..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Syllabus Description
              </label>
              <textarea
                rows={3}
                value={courseDetails.description}
                onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                placeholder="Comprehensive description of learning outcomes, lab prerequisites, and reference textbooks..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lead Instructor <span className="text-rose-500">*</span>
                </label>
                <select
                  value={courseDetails.instructorId}
                  onChange={(e) => {
                    const instMap = {
                      'usr-5': { name: 'Pooja Iyer', email: 'pooja.iyer@abcschool.edu.in' },
                      'usr-fac-2': { name: 'Dr. Suresh Kumar', email: 'suresh.k@abcschool.edu.in' },
                      'usr-fac-3': { name: 'Dr. Sunita Rao', email: 'sunita.rao@abcschool.edu.in' },
                      'usr-fac-4': { name: 'Dr. Rajesh Sen', email: 'rajesh.sen@abcschool.edu.in' },
                      'usr-fac-5': { name: 'Sneha Patel', email: 'sneha.patel@abcschool.edu.in' },
                    }
                    const info = instMap[e.target.value] || { name: 'Faculty', email: 'faculty@abcschool.edu.in' }
                    setCourseDetails({
                      ...courseDetails,
                      instructorId: e.target.value,
                      instructorName: info.name,
                      instructorEmail: info.email,
                    })
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="usr-5">Pooja Iyer (Physics)</option>
                  <option value="usr-fac-2">Dr. Suresh Kumar (Physics)</option>
                  <option value="usr-fac-3">Dr. Sunita Rao (Mathematics)</option>
                  <option value="usr-fac-4">Dr. Rajesh Sen (Chemistry)</option>
                  <option value="usr-fac-5">Sneha Patel (Computer Science)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={courseDetails.difficulty}
                  onChange={(e) => setCourseDetails({ ...courseDetails, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Total Hours
                </label>
                <input
                  type="text"
                  value={courseDetails.duration}
                  onChange={(e) => setCourseDetails({ ...courseDetails, duration: e.target.value })}
                  placeholder="e.g. 48 Hours"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Tags (Comma separated)
              </label>
              <input
                type="text"
                value={courseDetails.tags}
                onChange={(e) => setCourseDetails({ ...courseDetails, tags: e.target.value })}
                placeholder="Physics, CBSE, Board Prep, Electromagnetism"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <span>Continue to Settings</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: COURSE SETTINGS                                  */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Step 3 — Enrollment Modes & Activity Toggles
              </h3>
              <p className="text-xs text-slate-500">
                Configure student cohort enrollment, assessment permissions, and discussion settings.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Enrollment Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ENROLLMENT_MODES.map((mode) => (
                  <label
                    key={mode.value}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      courseSettings.enrollmentMode === mode.value
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{mode.label}</span>
                        <input
                          type="radio"
                          name="enrollmentMode"
                          checked={courseSettings.enrollmentMode === mode.value}
                          onChange={() => setCourseSettings({ ...courseSettings, enrollmentMode: mode.value })}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {mode.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={courseSettings.startDate}
                  onChange={(e) => setCourseSettings({ ...courseSettings, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={courseSettings.endDate}
                  onChange={(e) => setCourseSettings({ ...courseSettings, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                LMS Course Features
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseSettings.assignmentEnabled}
                    onChange={(e) => setCourseSettings({ ...courseSettings, assignmentEnabled: e.target.checked })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">Assignments Enabled</span>
                    <span className="block text-[10px] text-slate-400">Collect & grade student problem sets</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseSettings.quizEnabled}
                    onChange={(e) => setCourseSettings({ ...courseSettings, quizEnabled: e.target.checked })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">Quizzes Enabled</span>
                    <span className="block text-[10px] text-slate-400">Timed assessments & multiple choice</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseSettings.discussionEnabled}
                    onChange={(e) => setCourseSettings({ ...courseSettings, discussionEnabled: e.target.checked })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">Discussion Board</span>
                    <span className="block text-[10px] text-slate-400">Student Q&A threads with instructor</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseSettings.certificateEnabled}
                    onChange={(e) => setCourseSettings({ ...courseSettings, certificateEnabled: e.target.checked })}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-900">Completion Certificate</span>
                    <span className="block text-[10px] text-slate-400">Issue certificate on 100% completion</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating Course...' : 'Finalize & Create Course'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
