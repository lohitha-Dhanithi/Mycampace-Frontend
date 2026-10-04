// src/components/forms/FormSection.jsx
import React from 'react'

export function FormSection({ title, description, children, className }) {
  return (
    <div className={`space-y-4 py-3 ${className || ''}`}>
      {(title || description) && (
        <div className="border-b border-slate-100 pb-2">
          {title && <h4 className="text-sm font-semibold text-slate-900">{title}</h4>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  )
}
