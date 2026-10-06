// src/components/common/PageHeader.tsx
import React from 'react'

export interface PageHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: any;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, description, badge, actions, breadcrumbs, children }: PageHeaderProps) {
  const displaySubtitle = subtitle || description

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 mb-5 border-b border-slate-200/80 gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {displaySubtitle && <p className="text-xs text-slate-500 mt-1">{displaySubtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      {children}
    </div>
  )
}
