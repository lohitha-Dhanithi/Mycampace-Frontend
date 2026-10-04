// src/modules/lms/components/CourseContentTree.jsx
import React from 'react'
import { ModuleCard } from './ModuleCard'
import { Plus } from 'lucide-react'

export function CourseContentTree({
  modules = [],
  lessons = [],
  completedLessonIds = [],
  activeLessonId,
  onSelectLesson,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  readOnly = false,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Curriculum & Learning Modules</h3>
          <p className="text-xs text-slate-500">
            Structured learning path organized into chapters, video lectures, and assessments.
          </p>
        </div>

        {!readOnly && onAddModule && (
          <button
            type="button"
            onClick={onAddModule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Module</span>
          </button>
        )}
      </div>

      {modules.length > 0 ? (
        <div className="space-y-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              lessons={lessons}
              completedLessonIds={completedLessonIds}
              activeLessonId={activeLessonId}
              onSelectLesson={onSelectLesson}
              onAddLesson={onAddLesson}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              readOnly={readOnly}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 mb-1">No learning content has been added yet.</p>
          <p className="text-xs text-slate-400 mb-4">Create your first module to start building this course curriculum.</p>
          {!readOnly && onAddModule && (
            <button
              type="button"
              onClick={onAddModule}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Module 01</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
