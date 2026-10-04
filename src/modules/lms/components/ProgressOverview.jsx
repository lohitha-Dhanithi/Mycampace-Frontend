// src/modules/lms/components/ProgressOverview.jsx
import React from 'react'
import { Users, CheckCircle2, Clock, Award, BarChart3, TrendingUp } from 'lucide-react'

export function ProgressOverview({ stats }) {
  const s = stats || {
    totalStudents: 38,
    averageCompletion: 68,
    completedStudents: 5,
    inProgressStudents: 31,
    notStartedStudents: 2,
    averageAssessmentScore: 82.5,
    submissionRate: 91,
    quizParticipation: 88,
  }

  return (
    <div className="space-y-4">
      {/* 4 Primary KPI stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Enrolled Students</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{s.totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{s.completedStudents} completed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Avg Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{s.averageCompletion}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across all 3 learning modules
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Avg Assessment</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{s.averageAssessmentScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Assignments & diagnostic quizzes
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Submission Rate</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{s.submissionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            On-time problem set hand-ins
          </div>
        </div>
      </div>

      {/* Cohort Progress Distribution Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
          <span>Cohort Completion Distribution</span>
          <span className="text-slate-500 font-normal">
            {s.completedStudents} Completed • {s.inProgressStudents} In Progress • {s.notStartedStudents} Not Started
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(s.completedStudents / s.totalStudents) * 100}%` }}
            title="Completed"
          />
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${(s.inProgressStudents / s.totalStudents) * 100}%` }}
            title="In Progress"
          />
          <div
            className="bg-slate-300 h-full transition-all duration-500"
            style={{ width: `${(s.notStartedStudents / s.totalStudents) * 100}%` }}
            title="Not Started"
          />
        </div>
      </div>
    </div>
  )
}
