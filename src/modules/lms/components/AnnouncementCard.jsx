// src/modules/lms/components/AnnouncementCard.jsx
import React from 'react'
import { Bell, Calendar, User, Trash2, AlertCircle } from 'lucide-react'
import { ANNOUNCEMENT_PRIORITIES } from '../config/lmsConfig'

export function AnnouncementCard({
  announcement,
  onDelete,
  readOnly = false,
}) {
  const priorityConfig = ANNOUNCEMENT_PRIORITIES.find((p) => p.value === announcement.priority) || {
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  }

  const formattedDate = announcement.publishedDate
    ? new Date(announcement.publishedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${priorityConfig.color}`}>
            <Bell className="h-3 w-3" />
            {announcement.priority || 'Normal'}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        {!readOnly && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(announcement.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
            title="Delete Announcement"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h4 className="font-bold text-sm text-slate-900 mb-2 leading-snug">
        {announcement.title}
      </h4>

      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-4 font-sans">
        {announcement.message}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">{announcement.authorName}</span>
          <span className="text-slate-400">({announcement.authorRole || 'Instructor'})</span>
        </div>
        <span className="text-slate-400">Audience: {announcement.audience || 'All Enrolled Students'}</span>
      </div>
    </div>
  )
}
