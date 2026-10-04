// src/modules/lms/pages/GlobalQuizzesPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle,
  Search,
  Clock,
  Award,
  ChevronRight,
  Play,
  Users,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { lmsQuizService } from '../services/lmsQuizService'

export function GlobalQuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    setLoading(true)
    try {
      const data = await lmsQuizService.getAllQuizzes()
      setQuizzes(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = quizzes.filter((q) => {
    if (!search) return true
    return (
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
            Institutional Assessments
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Quizzes & Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Timed assessments, multiple choice question banks, and student attempt histories.
          </p>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  {quiz.status}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  {quiz.duration} mins
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-1.5 hover:text-blue-600 transition-colors">
                {quiz.name}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                {quiz.description}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2 py-2 mb-4 border-t border-b border-slate-100 text-center">
                <div>
                  <span className="block text-[10px] text-slate-400">Questions</span>
                  <span className="text-xs font-bold text-slate-800">{quiz.totalQuestions || 5}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Max Marks</span>
                  <span className="text-xs font-bold text-slate-800">{quiz.totalMarks || 20}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Pass Rate</span>
                  <span className="text-xs font-bold text-emerald-600">{quiz.passingScore}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to={`/lms/quizzes/${quiz.id}/attempts`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>View Attempts & Test Player</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
