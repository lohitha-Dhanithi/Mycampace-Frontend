// src/modules/lms/components/StudentProgressTable.jsx
import React, { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react'
import { CourseProgressBar } from './CourseProgressBar'

export function StudentProgressTable({ enrollments = [] }) {
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const filtered = enrollments.filter((e) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      e.studentName.toLowerCase().includes(q) ||
      e.studentAdmissionNo.toLowerCase().includes(q) ||
      e.sectionName.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enrolled student or ID..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {enrollments.length} enrolled students
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Student Profile</th>
              <th className="py-3 px-4">Cohort / Class</th>
              <th className="py-3 px-4 w-44">Course Progress</th>
              <th className="py-3 px-4 text-center">Lessons</th>
              <th className="py-3 px-4 text-center">Assignments</th>
              <th className="py-3 px-4 text-center">Avg Score</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((enr) => (
              <tr
                key={enr.id}
                onClick={() => setSelectedStudent(enr)}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {enr.studentName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {enr.studentName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {enr.studentAdmissionNo}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 font-medium">
                  {enr.className} • {enr.sectionName}
                </td>
                <td className="py-3 px-4">
                  <CourseProgressBar progress={enr.progressPercentage} size="sm" />
                </td>
                <td className="py-3 px-4 text-center font-semibold text-slate-700">
                  {enr.completedLessonsCount} / {enr.totalLessonsCount}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-slate-700">
                  {enr.assignmentsSubmitted} / 2
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">
                  {enr.averageScore ? `${enr.averageScore}%` : '—'}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {enr.lastActivity}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="p-1 rounded text-slate-400 hover:text-blue-600">
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Progress Detail Drawer Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  {selectedStudent.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {selectedStudent.studentName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedStudent.studentAdmissionNo} • {selectedStudent.className} ({selectedStudent.sectionName})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Progress Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Course Completion Rate</span>
                  <span className="text-blue-600 font-mono text-sm">{selectedStudent.progressPercentage}%</span>
                </div>
                <CourseProgressBar progress={selectedStudent.progressPercentage} showLabel={false} size="lg" />
              </div>

              {/* Learning Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Recent Learning Activity Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Completed Lesson 1.2 Electric Field Lines & Dipoles</p>
                      <span className="text-[11px] text-slate-400">Yesterday at 3:15 PM</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Submitted Problem Set 1: Gauss Law Computations</p>
                      <span className="text-[11px] text-slate-400">3 days ago • Score: 28/30</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Passed Diagnostic Quiz: Electric Charges (100%)</p>
                      <span className="text-[11px] text-slate-400">5 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
