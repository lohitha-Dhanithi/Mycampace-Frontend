// src/modules/lms/pages/AssignmentSubmissionsPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Edit2,
  RotateCcw,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { AssignmentGradingDialog } from '../components/AssignmentGradingDialog'
import { lmsAssignmentService } from '../services/lmsAssignmentService'
import { lmsSubmissionService } from '../services/lmsSubmissionService'

export function AssignmentSubmissionsPage() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Grading Modal
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [asg, subs] = await Promise.all([
        lmsAssignmentService.getAssignmentById(id),
        lmsSubmissionService.getSubmissions(id),
      ])
      setAssignment(asg)
      setSubmissions(subs)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGrade = async (subId, gradeData) => {
    await lmsSubmissionService.gradeAssignment(subId, gradeData)
    loadData()
  }

  const handleReturn = async (subId) => {
    await lmsSubmissionService.returnSubmission(subId, 'Returned for corrections.')
    loadData()
  }

  const filtered = submissions.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.studentAdmissionNo.toLowerCase().includes(q)
    )
  })

  if (loading || !assignment) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading assignment submissions...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <Link
            to="/lms/assignments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assignments</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
              Grading Portal
            </span>
            <span className="text-xs text-slate-500">Max Score: {assignment.maxMarks} Points</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {assignment.title}
          </h1>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="block text-xs font-semibold text-slate-500">Total Submissions</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{submissions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="block text-xs font-semibold text-slate-500">Graded</span>
          <span className="text-xl font-bold text-emerald-600 mt-0.5 block">
            {submissions.filter((s) => s.status === 'Graded').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="block text-xs font-semibold text-slate-500">Pending Evaluation</span>
          <span className="text-xl font-bold text-amber-600 mt-0.5 block">
            {submissions.filter((s) => s.status !== 'Graded').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="block text-xs font-semibold text-slate-500">Average Score</span>
          <span className="text-xl font-bold text-purple-600 mt-0.5 block">27.0 / 30</span>
        </div>
      </div>

      {/* Submissions DataTable */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or admission number..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filtered.length} submissions found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Marks</th>
                <th className="py-3 px-4">Graded By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                    <span className="font-mono text-[11px] text-slate-400">{sub.studentAdmissionNo}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{new Date(sub.submittedAt).toLocaleDateString()}</div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sub.isLate
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {sub.marks !== null ? `${sub.marks} / ${sub.maxMarks}` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {sub.graderName || 'Not Graded'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                    >
                      {sub.status === 'Graded' ? 'Review & Update' : 'Grade Submission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Dialog */}
      {selectedSubmission && (
        <AssignmentGradingDialog
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
          assignment={assignment}
          onSaveGrade={handleSaveGrade}
          onReturnSubmission={handleReturn}
        />
      )}
    </div>
  )
}
