// src/modules/lms/components/QuizBuilder.jsx
import React, { useState } from 'react'
import { Plus, Save, Trash2, CheckCircle2, HelpCircle, AlertCircle, X } from 'lucide-react'
import { QuizQuestion } from './QuizQuestion'
import { QUESTION_TYPES } from '../config/lmsConfig'

export function QuizBuilder({
  quiz,
  questions = [],
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  readOnly = false,
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const [formData, setFormData] = useState({
    type: 'multiple_choice',
    question: '',
    marks: 4,
    explanation: '',
    isRequired: true,
    options: [
      { id: 'opt-1', text: 'Option A', isCorrect: true },
      { id: 'opt-2', text: 'Option B', isCorrect: false },
      { id: 'opt-3', text: 'Option C', isCorrect: false },
      { id: 'opt-4', text: 'Option D', isCorrect: false },
    ],
    correctAnswers: '',
  })
  const [error, setError] = useState('')

  const handleOpenAdd = () => {
    setEditingQuestion(null)
    setFormData({
      type: 'multiple_choice',
      question: '',
      marks: 4,
      explanation: '',
      isRequired: true,
      options: [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false },
        { id: 'opt-4', text: '', isCorrect: false },
      ],
      correctAnswers: '',
    })
    setIsAdding(true)
    setError('')
  }

  const handleOpenEdit = (q) => {
    setEditingQuestion(q)
    setFormData({
      type: q.type || 'multiple_choice',
      question: q.question || '',
      marks: q.marks || 4,
      explanation: q.explanation || '',
      isRequired: q.isRequired !== undefined ? q.isRequired : true,
      options: q.options || [],
      correctAnswers: q.correctAnswers ? q.correctAnswers.join(', ') : '',
    })
    setIsAdding(true)
    setError('')
  }

  const handleTypeChange = (newType) => {
    let opts = []
    if (newType === 'true_false') {
      opts = [
        { id: 'opt-true', text: 'True', isCorrect: true },
        { id: 'opt-false', text: 'False', isCorrect: false },
      ]
    } else if (newType === 'multiple_choice' || newType === 'multiple_select') {
      opts = [
        { id: 'opt-1', text: 'Option A', isCorrect: true },
        { id: 'opt-2', text: 'Option B', isCorrect: false },
        { id: 'opt-3', text: 'Option C', isCorrect: false },
        { id: 'opt-4', text: 'Option D', isCorrect: false },
      ]
    }
    setFormData({ ...formData, type: newType, options: opts })
  }

  const handleOptionChange = (idx, field, val) => {
    const updated = [...formData.options]
    if (field === 'isCorrect' && formData.type === 'multiple_choice') {
      // Radio behavior for single choice
      updated.forEach((o, i) => {
        o.isCorrect = i === idx
      })
    } else {
      updated[idx][field] = val
    }
    setFormData({ ...formData, options: updated })
  }

  const handleAddOption = () => {
    const newId = `opt-${Date.now().toString().slice(-4)}`
    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: '', isCorrect: false }],
    })
  }

  const handleRemoveOption = (idx) => {
    if (formData.options.length <= 2) return
    const updated = formData.options.filter((_, i) => i !== idx)
    setFormData({ ...formData, options: updated })
  }

  const handleSaveQuestion = (e) => {
    e.preventDefault()
    if (!formData.question.trim()) {
      setError('Question prompt is required')
      return
    }

    if (formData.type === 'multiple_choice' || formData.type === 'multiple_select' || formData.type === 'true_false') {
      const hasCorrect = formData.options.some((o) => o.isCorrect)
      if (!hasCorrect) {
        setError('At least one option must be marked as correct')
        return
      }
      const hasEmptyText = formData.options.some((o) => !o.text.trim())
      if (hasEmptyText) {
        setError('All options must have non-empty text')
        return
      }
    }

    const payload = {
      type: formData.type,
      question: formData.question,
      marks: Number(formData.marks) || 4,
      explanation: formData.explanation,
      isRequired: formData.isRequired,
      options: formData.options,
      correctAnswers: formData.correctAnswers
        ? formData.correctAnswers.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    }

    if (editingQuestion) {
      onUpdateQuestion(quiz.id, editingQuestion.id, payload)
    } else {
      onAddQuestion(quiz.id, payload)
    }

    setIsAdding(false)
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.marks || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Assessment Questions & Scoring
          </h3>
          <p className="text-xs text-slate-500">
            {questions.length} Questions configured • Total Marks: <strong>{totalPoints} Points</strong>
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Question</span>
          </button>
        )}
      </div>

      {/* Add / Edit Question Modal/Form */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-900 text-base">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Marks / Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question Prompt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question text, theoretical problem, or statement..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Options Editor for Choice / True-False */}
              {(formData.type === 'multiple_choice' || formData.type === 'multiple_select' || formData.type === 'true_false') && (
                <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">
                      Answer Options (Select correct answer{formData.type === 'multiple_select' ? 's' : ''})
                    </span>
                    {formData.type !== 'true_false' && (
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  {formData.options.map((opt, idx) => (
                    <div key={opt.id || idx} className="flex items-center gap-2">
                      <input
                        type={formData.type === 'multiple_choice' || formData.type === 'true_false' ? 'radio' : 'checkbox'}
                        name="correct-option-group"
                        checked={opt.isCorrect}
                        onChange={(e) => handleOptionChange(idx, 'isCorrect', e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        title="Mark as correct"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        required
                      />
                      {formData.type !== 'true_false' && formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Short Answer keywords */}
              {formData.type === 'short_answer' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Accepted Correct Answers (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.correctAnswers}
                    onChange={(e) => setFormData({ ...formData, correctAnswers: e.target.value })}
                    placeholder="e.g. Volt meter, V m, V*m"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer Explanation / Solution Hint
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explanation shown to students after evaluation..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{editingQuestion ? 'Update Question' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions list */}
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <QuizQuestion
              key={q.id || idx}
              question={q}
              index={idx}
              onEdit={handleOpenEdit}
              onDelete={(qId) => onDeleteQuestion(quiz.id, qId)}
              readOnly={readOnly}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl">
          <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No questions added yet.</p>
          <p className="text-[11px] text-slate-400 mb-4">Click below to add multiple choice, true/false, or short answer questions.</p>
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Question</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
