// src/modules/lms/components/QuizPlayer.jsx
import React, { useState, useEffect } from 'react'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Check,
  X,
  Award,
} from 'lucide-react'

export function QuizPlayer({
  quiz,
  onSubmitAttempt,
  onExit,
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState((quiz?.duration || 20) * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const questions = quiz?.questions || []
  const currentQ = questions[currentIdx]

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted, timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSelectOption = (qId, optId, isMulti = false) => {
    if (isSubmitted) return
    if (isMulti) {
      const current = answers[qId] || []
      const next = current.includes(optId)
        ? current.filter((id) => id !== optId)
        : [...current, optId]
      setAnswers({ ...answers, [qId]: next })
    } else {
      setAnswers({ ...answers, [qId]: optId })
    }
  }

  const handleTextChange = (qId, val) => {
    if (isSubmitted) return
    setAnswers({ ...answers, [qId]: val })
  }

  const handleAutoSubmit = async () => {
    if (isSubmitted) return
    handleSubmit()
  }

  const handleSubmit = async () => {
    setIsSubmitted(true)
    const studentData = {
      id: 'std-001',
      name: 'Aarav Sharma',
    }
    const attempt = await onSubmitAttempt(quiz.id, studentData, answers)
    setResult(attempt)
  }

  if (isSubmitted && result) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-3xl mx-auto my-6 text-center animate-in fade-in">
        <div
          className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${
            result.isPassed
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {result.isPassed ? (
            <Award className="h-10 w-10" />
          ) : (
            <AlertTriangle className="h-10 w-10" />
          )}
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-1">
          {result.isPassed ? 'Congratulations! Quiz Passed' : 'Assessment Completed'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          {quiz.name} • Attempt #{result.attemptNumber}
        </p>

        {/* Score Card */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-lg mx-auto mb-8 text-center">
          <div>
            <span className="block text-[11px] text-slate-400">Score</span>
            <span className="text-lg font-black text-slate-900">
              {result.score} / {result.totalMarks}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-400">Percentage</span>
            <span className={`text-lg font-black ${result.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.percentage}%
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-400">Passing Score</span>
            <span className="text-lg font-black text-slate-700">
              {quiz.passingScore}%
            </span>
          </div>
        </div>

        {/* Question Review Breakdown */}
        <div className="text-left space-y-4 mb-8">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Review Question Answers & Explanations
          </h4>
          {questions.map((q, i) => {
            const studentAns = answers[q.id]
            return (
              <div key={q.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Question {i + 1}: {q.question}
                  </span>
                  <span className="text-slate-500 font-semibold">{q.marks} pts</span>
                </div>
                {q.explanation && (
                  <p className="text-slate-600 text-[11px] bg-white p-2.5 rounded border border-slate-200">
                    <strong>Solution Note:</strong> {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          Return to Course
        </button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">This quiz does not have any active questions yet.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px]">
      {/* Top Bar with Timer */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Live Quiz Assessment
          </span>
          <h3 className="font-bold text-slate-900 text-base leading-tight">
            {quiz.name}
          </h3>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-mono text-sm font-bold text-slate-800">
          <Clock className={`h-4 w-4 ${timeLeft < 180 ? 'text-rose-500 animate-pulse' : 'text-blue-600'}`} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Body with Question and Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 flex-1">
        {/* Question Content Area */}
        <div className="lg:col-span-3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentQ.marks} Marks
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-6 leading-relaxed">
              {currentQ.question}
            </h4>

            {/* Multiple Choice / True-False */}
            {(currentQ.type === 'multiple_choice' || currentQ.type === 'true_false') && (
              <div className="space-y-2.5">
                {currentQ.options?.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-xs flex-1">{opt.text}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Multiple Select */}
            {currentQ.type === 'multiple_select' && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-400 mb-2">Select all choices that apply:</p>
                {currentQ.options?.map((opt) => {
                  const selectedArr = answers[currentQ.id] || []
                  const isSelected = selectedArr.includes(opt.id)
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id, true)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-xs flex-1">{opt.text}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Short Answer */}
            {currentQ.type === 'short_answer' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                  placeholder="Type your brief answer here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border ${
                currentIdx === 0
                  ? 'text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Question Navigator */}
        <div className="p-6 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Question Navigator
            </h4>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {questions.map((q, idx) => {
                const isAnswered =
                  answers[q.id] !== undefined &&
                  (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : String(answers[q.id]).trim() !== '')
                const isCurrent = currentIdx === idx

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${
                      isCurrent
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-600 text-white'
                        : isAnswered
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                    {isAnswered && !isCurrent && ' ✓'}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px] text-slate-500 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Answered (✓)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span>Not Attempted (—)</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Finish & Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
