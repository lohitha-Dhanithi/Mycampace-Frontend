// src/modules/lms/pages/LMSReportsPage.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BarChart3,
  Download,
  Filter,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { lmsReportService } from '../services/lmsReportService'

export function LMSReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('type') || 'course-progress'
  const [activeTab, setActiveTab] = useState(currentTab)

  const [courseReports, setCourseReports] = useState([])
  const [studentReports, setStudentReports] = useState([])
  const [assessmentReports, setAssessmentReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  useEffect(() => {
    setSearchParams({ type: activeTab }, { replace: true })
  }, [activeTab])

  const loadReports = async () => {
    setLoading(true)
    try {
      const [crs, std, asg] = await Promise.all([
        lmsReportService.getCourseProgressReports(),
        lmsReportService.getStudentProgressReports(),
        lmsReportService.getAssessmentReports(),
      ])
      setCourseReports(crs)
      setStudentReports(std)
      setAssessmentReports(asg)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    alert(`Exporting ${activeTab.replace('-', ' ').toUpperCase()} Report to CSV spreadsheet...`)
  }

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Analytics & Auditing
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            LMS Academic Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor institutional syllabus pacing, student cohort completion, and assessment pass rates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'course-progress', label: 'Course Progress Report' },
          { id: 'student-progress', label: 'Student Progress Report' },
          { id: 'assessment', label: 'Assessment & Test Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report 1: Course Progress */}
      {activeTab === 'course-progress' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Institutional Course Progress Summary</h3>
            <span className="text-xs text-slate-500">{courseReports.length} Active Courses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Course Name & Code</th>
                  <th className="py-3 px-4">Cohort Mapping</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4 text-center">Enrolled</th>
                  <th className="py-3 px-4 text-center">Active</th>
                  <th className="py-3 px-4 w-36">Completion %</th>
                  <th className="py-3 px-4 text-center">Avg Score</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseReports.map((c) => (
                  <tr key={c.courseId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{c.courseName}</span>
                      <span className="font-mono text-[11px] text-blue-600">{c.courseCode}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.className} • {c.sectionName || 'All'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.instructorName}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{c.totalStudents}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-emerald-600">{c.activeStudents}</td>
                    <td className="py-3.5 px-4">
                      <CourseProgressBar progress={c.completionRate} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{c.averageScore}%</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: Student Progress */}
      {activeTab === 'student-progress' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Student Individual Pacing & Assessment Matrix</h3>
            <span className="text-xs text-slate-500">{studentReports.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4 w-36">Completion %</th>
                  <th className="py-3 px-4 text-center">Assignments</th>
                  <th className="py-3 px-4 text-center">Quizzes</th>
                  <th className="py-3 px-4 text-center">Avg Assessment</th>
                  <th className="py-3 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentReports.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{s.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{s.admissionNo}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.className} ({s.sectionName})</td>
                    <td className="py-3.5 px-4">
                      <CourseProgressBar progress={s.completionRate} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{s.assignmentsCompleted}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{s.quizzesCompleted}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{s.averageScore}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Assessment Report */}
      {activeTab === 'assessment' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Assessment Scores, Pass Rates & Outlier Analysis</h3>
            <span className="text-xs text-slate-500">{assessmentReports.length} Assessments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Assessment Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Submissions / Attempts</th>
                  <th className="py-3 px-4 text-center">Average Score</th>
                  <th className="py-3 px-4 text-center">Pass Rate</th>
                  <th className="py-3 px-4 text-center">Highest Score</th>
                  <th className="py-3 px-4 text-center">Lowest Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessmentReports.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{a.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        a.type === 'Quiz' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-violet-50 text-violet-700 border border-violet-200'
                      }`}>
                        {a.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{a.attempts}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800">{a.averageScore}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{a.passRate}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{a.highestScore}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{a.lowestScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
