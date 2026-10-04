// src/modules/lms/components/QuizQuestion.jsx
import React from 'react'
import { Check, Edit2, Trash2, HelpCircle } from 'lucide-react'

export function QuizQuestion({
  question,
  index,
  onEdit,
  onDelete,
  readOnly = false,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
            Q{index + 1}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {question.type?.replace('_', ' ')}
          </span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {question.marks || 4} Marks
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(question)}
                className="p-1 text-slate-400 hover:text-blue-600 rounded"
                title="Edit Question"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(question.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                title="Delete Question"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 mb-3 leading-snug">
        {question.question}
      </h4>

      {/* Answer Options */}
      {question.options && question.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {question.options.map((opt) => (
            <div
              key={opt.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
                opt.isCorrect
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-medium'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700'
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  opt.isCorrect
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'border border-slate-300'
                }`}
              >
                {opt.isCorrect && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <span className="truncate">{opt.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Short Answer keywords preview */}
      {question.correctAnswers && question.correctAnswers.length > 0 && (
        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
          <strong>Accepted correct answers: </strong>
          <span className="font-mono text-emerald-700">
            {question.correctAnswers.join(', ')}
          </span>
        </div>
      )}

      {/* Explanation */}
      {question.explanation && (
        <div className="text-[11px] text-slate-500 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100 flex items-start gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong>Explanation:</strong> {question.explanation}
          </span>
        </div>
      )}
    </div>
  )
}
