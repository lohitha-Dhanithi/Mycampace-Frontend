// src/modules/lms/components/ModuleCard.jsx
import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Clock,
  BookOpen,
  ClipboardList,
  HelpCircle,
  GripVertical,
} from 'lucide-react'
import { LessonItem } from './LessonItem'

export function ModuleCard({
  module,
  lessons = [],
  completedLessonIds = [],
  activeLessonId,
  onSelectLesson,
  onAddLesson,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onDeleteLesson,
  readOnly = false,
  defaultExpanded = true,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const moduleLessons = lessons.filter((l) => l.moduleId === module.id)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Module Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Module {String(module.sequence).padStart(2, '0')}
              </span>
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {module.name}
              </h4>
            </div>

            {module.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {module.description}
              </p>
            )}

            {/* Metrics pills */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-slate-400" />
                {moduleLessons.length} {moduleLessons.length === 1 ? 'Lesson' : 'Lessons'}
              </span>
              {module.assignmentCount > 0 && (
                <span className="flex items-center gap-1">
                  <ClipboardList className="h-3 w-3 text-violet-500" />
                  {module.assignmentCount} Assignment
                </span>
              )}
              {module.quizCount > 0 && (
                <span className="flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-teal-500" />
                  {module.quizCount} Quiz
                </span>
              )}
              {module.estimatedDuration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {module.estimatedDuration}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!readOnly && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 shrink-0"
          >
            {onAddLesson && (
              <button
                type="button"
                onClick={() => onAddLesson(module.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add Lesson</span>
              </button>
            )}

            {onEditModule && (
              <button
                type="button"
                onClick={() => onEditModule(module)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Edit Module"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}

            {onDeleteModule && (
              <button
                type="button"
                onClick={() => onDeleteModule(module.id)}
                className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Module"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Lessons List */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 space-y-2">
          {moduleLessons.length > 0 ? (
            moduleLessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isCompleted={completedLessonIds.includes(lesson.id)}
                isActive={activeLessonId === lesson.id}
                onSelect={() => onSelectLesson && onSelectLesson(lesson)}
                onEdit={onEditLesson}
                onDelete={onDeleteLesson}
                readOnly={readOnly}
              />
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg bg-white">
              <p className="text-xs text-slate-500 mb-2">No lessons added to this module yet.</p>
              {!readOnly && onAddLesson && (
                <button
                  type="button"
                  onClick={() => onAddLesson(module.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Create First Lesson</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
