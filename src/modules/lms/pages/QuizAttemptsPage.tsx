// src/modules/lms/pages/QuizAttemptsPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Play,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { QuizPlayer } from '../components/QuizPlayer'
import { lmsQuizService } from '../services/lmsQuizService'

export function QuizAttemptsPage() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [qz, atts] = await Promise.all([
        lmsQuizService.getQuizById(id),
        lmsQuizService.getQuizAttempts(id),
      ])
      setQuiz(qz)
      setAttempts(atts)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !quiz) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading quiz attempt records...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <Link
            to="/lms/quizzes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Quizzes</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Quiz Evaluation
            </span>
            <span className="text-xs text-slate-500">Duration: {quiz.duration} mins • Passing: {quiz.passingScore}%</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {quiz.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all ${
            isPlaying
              ? 'bg-slate-800 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{isPlaying ? 'Close Quiz Simulator' : 'Test Quiz Player (Student Simulation)'}</span>
        </button>
      </div>

      {/* Live Quiz Player Simulation */}
      {isPlaying ? (
        <div className="animate-in fade-in">
          <QuizPlayer
            quiz={quiz}
            onSubmitAttempt={async (qId, sData, ans) => {
              const res = await lmsQuizService.submitQuizAttempt(qId, sData, ans)
              loadData()
              return res
            }}
            onExit={() => setIsPlaying(false)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Attempts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Recorded Student Attempts ({attempts.length})</h3>
              <span className="text-xs text-slate-500">Automatically graded upon submission</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 text-center">Attempt</th>
                    <th className="py-3 px-4">Started At</th>
                    <th className="py-3 px-4">Completed At</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {att.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        #{att.attemptNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(att.startedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(att.completedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {att.score} / {att.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span className={att.isPassed ? 'text-emerald-600' : 'text-rose-600'}>
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            att.isPassed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
