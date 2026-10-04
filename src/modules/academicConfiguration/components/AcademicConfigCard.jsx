// src/modules/academicConfiguration/components/AcademicConfigCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AcademicConfigCard({
  title,
  description,
  path,
  icon: Icon,
  badgeText,
  statusText = 'Configured',
  statusVariant = 'success',
  highlight = null,
}) {
  return (
    <Link
      to={path}
      className="group block p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-xs hover:shadow-md relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              {badgeText && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {(statusText || highlight) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{statusText}</span>
          </div>
          {highlight && (
            <span className="font-medium text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {highlight}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
