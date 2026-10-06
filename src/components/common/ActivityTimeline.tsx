// src/components/common/ActivityTimeline.jsx
import React from 'react'
import { Clock, CheckCircle2, User, FileText, AlertCircle, Building2 } from 'lucide-react'

export function ActivityTimeline({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-xs text-slate-500 italic py-4 text-center">
        No recent activity logged for this entity.
      </p>
    )
  }

  return (
    <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 ml-2">
      {items.map((item, idx) => {
        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Node Icon */}
            <span
              className={`absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full ring-4 ring-white flex items-center justify-center ${
                item.type === 'campus'
                  ? 'bg-blue-600'
                  : item.type === 'warning'
                  ? 'bg-amber-500'
                  : item.type === 'danger'
                  ? 'bg-red-500'
                  : 'bg-emerald-600'
              }`}
            />
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-semibold text-slate-900">{item.title}</h5>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              {item.user && (
                <span className="text-[11px] text-slate-400 block pt-0.5">
                  Logged by: <strong className="text-slate-700 font-medium">{item.user}</strong>
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
