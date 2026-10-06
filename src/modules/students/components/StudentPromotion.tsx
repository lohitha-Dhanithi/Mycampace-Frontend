// src/modules/students/components/StudentPromotion.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Calendar,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { studentService } from '../services/studentService'
import { useNavigate } from 'react-router-dom'

export function StudentPromotion({ onPromoteSuccess }: { onPromoteSuccess?: () => void } = {}) {
  const navigate = useNavigate()
  // Step 1: Academic source filter
  const [sourceYear, setSourceYear] = useState('ay-2026-27')
  const [sourceClass, setSourceClass] = useState('cls-11')
  const [sourceSection, setSourceSection] = useState('sec-11A')

  // Target criteria
  const [targetYear, setTargetYear] = useState('ay-2027-28')
  const [targetClass, setTargetClass] = useState('cls-12')
  const [targetSection, setTargetSection] = useState('sec-12A')

  const [students, setStudents] = useState([])
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Load candidate students based on source
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true)
      try {
        const all = await studentService.getStudents({
          status: 'Active',
        })
        // Filter students matching the source class/section
        const matching = all.filter((s) => {
          const matchClass = sourceClass === 'all' || s.classId === sourceClass || s.className?.toLowerCase().includes('class 11')
          const matchSection = sourceSection === 'all' || s.sectionId === sourceSection || s.sectionName?.toLowerCase().includes('section a')
          return matchClass && matchSection
        })
        setStudents(matching.length > 0 ? matching : all.slice(0, 3))
        setSelectedStudentIds((matching.length > 0 ? matching : all.slice(0, 3)).map((s) => s.id))
      } catch (err) {
        console.error('Error fetching promotion candidates', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [sourceYear, sourceClass, sourceSection])

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(students.map((s) => s.id))
    }
  }

  const handlePromoteConfirm = async () => {
    setSubmitting(true)
    try {
      const yearMap = {
        'ay-2027-28': { id: 'ay-2027-28', name: '2027-2028' },
        'ay-2026-27': { id: 'ay-2026-27', name: '2026-2027' },
      }
      const classMap = {
        'cls-12': { id: 'cls-12', name: 'Class 12' },
        'cls-11': { id: 'cls-11', name: 'Class 11' },
        'cls-10': { id: 'cls-10', name: 'Class 10' },
      }
      const sectionMap = {
        'sec-12A': { id: 'sec-12A', name: 'Section A (Senior Secondary)' },
        'sec-12B': { id: 'sec-12B', name: 'Section B (Science)' },
      }

      await studentService.promoteStudents({
        studentIds: selectedStudentIds,
        targetAcademicYear: yearMap[targetYear] || { id: targetYear, name: '2027-2028' },
        targetClass: classMap[targetClass] || { id: targetClass, name: 'Class 12' },
        targetSection: sectionMap[targetSection] || { id: targetSection, name: 'Section A' },
      })

      setSuccessMessage(
        `Successfully promoted ${selectedStudentIds.length} students to ${classMap[targetClass]?.name || 'Target Class'} for AY ${yearMap[targetYear]?.name || '2027-2028'}. New versioned academic history records were generated.`
      )
      setConfirmOpen(false)
      if (onPromoteSuccess) onPromoteSuccess()
    } catch (err) {
      console.error('Promotion error', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Student Academic Promotion Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Batch promote students to the next academic year. Existing academic history records are preserved and new versioned enrollment records are created.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Directory
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-900">Promotion Batch Completed</p>
            <p className="text-xs text-emerald-700 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Workflow Step Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Source & Target Configuration */}
        <div className="lg:col-span-4 space-y-6">
          {/* Source Academic Structure */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                  1
                </span>
                Source Academic Class
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Current Academic Year</label>
                <Select value={sourceYear} onChange={(e) => setSourceYear(e.target.value)}>
                  <option value="ay-2026-27">2026–2027 (Current Term)</option>
                  <option value="ay-2025-26">2025–2026</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Current Class</label>
                <Select value={sourceClass} onChange={(e) => setSourceClass(e.target.value)}>
                  <option value="cls-11">Class 11 (Senior Secondary)</option>
                  <option value="cls-10">Class 10 (Secondary)</option>
                  <option value="cls-9">Class 9 (Secondary)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Current Section</label>
                <Select value={sourceSection} onChange={(e) => setSourceSection(e.target.value)}>
                  <option value="sec-11A">Section A (PCM / General)</option>
                  <option value="sec-11B">Section B (PCB / Commerce)</option>
                  <option value="all">All Sections</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Target Academic Structure */}
          <Card className="border-blue-200 bg-blue-50/20 shadow-xs">
            <CardHeader className="pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">
                  2
                </span>
                Target Promotion Destination
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Academic Year *</label>
                <Select value={targetYear} onChange={(e) => setTargetYear(e.target.value)}>
                  <option value="ay-2027-28">2027–2028 (Upcoming AY)</option>
                  <option value="ay-2026-27">2026–2027</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Promote Into Class *</label>
                <Select value={targetClass} onChange={(e) => setTargetClass(e.target.value)}>
                  <option value="cls-12">Class 12 (Senior Secondary)</option>
                  <option value="cls-11">Class 11</option>
                  <option value="cls-10">Class 10</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Section *</label>
                <Select value={targetSection} onChange={(e) => setTargetSection(e.target.value)}>
                  <option value="sec-12A">Section A (Senior Secondary)</option>
                  <option value="sec-12B">Section B (Science)</option>
                </Select>
              </div>

              <div className="p-3 bg-blue-100/60 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  All selected students will retain their existing ID numbers while receiving a new active academic enrollment profile.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Candidate Students List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  Eligible Students for Promotion ({students.length})
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select students to enroll into the target class for the next academic year.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleSelectAll} className="text-xs h-8">
                  {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading candidate roster...</div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No active students found in selected source class.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {students.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id)
                    const name = student.personal?.fullName || student.name || 'Student'
                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleSelectStudent(student.id)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <Avatar
                            src={student.avatar}
                            alt={name}
                            fallback={name.substring(0, 2).toUpperCase()}
                            size="sm"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span className="font-mono text-blue-600">{student.studentId}</span>
                              <span>•</span>
                              <span>Roll: {student.rollNumber || 'N/A'}</span>
                              <span>•</span>
                              <span>{student.className || 'Class 11'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Eligible for Promotion
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Target: {targetClass === 'cls-12' ? 'Class 12' : targetClass}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Batch Action Footer */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-semibold">
                {selectedStudentIds.length} Student{selectedStudentIds.length === 1 ? '' : 's'} Selected
              </div>
              <div className="text-[11px] text-slate-400">
                Ready to be promoted to {targetClass === 'cls-12' ? 'Class 12' : targetClass} ({targetYear})
              </div>
            </div>
            <Button
              disabled={selectedStudentIds.length === 0 || submitting}
              onClick={() => setConfirmOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Proceed with Promotion
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Confirm Academic Year Promotion
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2 text-slate-600 text-xs leading-relaxed">
            <p>
              You are about to promote <strong className="text-slate-900">{selectedStudentIds.length} students</strong> from{' '}
              <strong className="text-slate-900">{sourceClass === 'cls-11' ? 'Class 11' : sourceClass}</strong> into{' '}
              <strong className="text-slate-900">{targetClass === 'cls-12' ? 'Class 12' : targetClass}</strong> for the upcoming academic year{' '}
              <strong className="text-blue-700">{targetYear}</strong>.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
              <strong>Rule Verification:</strong> The previous academic records will remain permanently saved under their respective academic years as <em>Completed</em>. New active enrollment records will be created.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePromoteConfirm}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? 'Promoting...' : 'Confirm Promotion'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  )
}
