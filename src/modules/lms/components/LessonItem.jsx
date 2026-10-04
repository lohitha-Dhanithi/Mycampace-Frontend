// src/modules/lms/components/LessonItem.jsx
import React from 'react'
import {
  FileText,
  Video,
  File,
  FileCode,
  Presentation,
  Image,
  ExternalLink,
  ClipboardList,
  HelpCircle,
  Clock,
  CheckCircle2,
  Circle,
  MoreVertical,
  Play,
  Edit2,
  Trash2,
} from 'lucide-react'

export function LessonItem({
  lesson,
  isCompleted = false,
  onSelect,
  onEdit,
  onDelete,
  readOnly = false,
  showActions = true,
  isActive = false,
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Video className="h-4 w-4 text-rose-500" />
      case 'PDF':
        return <File className="h-4 w-4 text-amber-500" />
      case 'Document':
        return <FileCode className="h-4 w-4 text-indigo-500" />
      case 'Presentation':
        return <Presentation className="h-4 w-4 text-orange-500" />
      case 'Image':
        return <Image className="h-4 w-4 text-emerald-500" />
      case 'External Link':
        return <ExternalLink className="h-4 w-4 text-cyan-500" />
      case 'Assignment':
        return <ClipboardList className="h-4 w-4 text-violet-500" />
      case 'Quiz':
        return <HelpCircle className="h-4 w-4 text-teal-500" />
      case 'Text':
      default:
        return <FileText className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
        isActive
          ? 'bg-blue-50/80 border-blue-200 text-blue-900 shadow-xs'
          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Status Indicator */}
        <div className="shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="h-4 w-4 text-slate-300" />
          )}
        </div>

        {/* Content Type Icon */}
        <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
          {getIcon(lesson.contentType)}
        </div>

        {/* Lesson Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {lesson.title}
            </span>
            {lesson.isMandatory && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                Required
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration || '20 mins'}
            </span>
            <span>•</span>
            <span className="capitalize">{lesson.contentType || 'Article'}</span>
          </div>
        </div>
      </div>

      {/* Trailing Actions */}
      {showActions && !readOnly && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(lesson)
              }}
              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              title="Edit Lesson"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(lesson.id)
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Delete Lesson"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
