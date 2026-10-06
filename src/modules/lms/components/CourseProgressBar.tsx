// src/modules/lms/components/CourseProgressBar.jsx
import React from 'react'

export function CourseProgressBar({ progress = 0, showLabel = true, size = 'md', className = '' }) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)))

  let barColor = 'bg-blue-600'
  let textColor = 'text-blue-700'
  if (clampedProgress >= 80) {
    barColor = 'bg-emerald-600'
    textColor = 'text-emerald-700'
  } else if (clampedProgress >= 40) {
    barColor = 'bg-blue-600'
    textColor = 'text-blue-700'
  } else if (clampedProgress > 0) {
    barColor = 'bg-amber-500'
    textColor = 'text-amber-700'
  } else {
    barColor = 'bg-slate-300'
    textColor = 'text-slate-500'
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-medium text-slate-600">Completion</span>
          <span className={`font-bold ${textColor}`}>{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
