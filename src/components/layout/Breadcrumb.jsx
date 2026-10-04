// src/components/layout/Breadcrumb.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumb({ items }) {
  const location = useLocation()

  // Auto-generate breadcrumb if items are not manually passed
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = items || [
    { label: 'Home', path: '/dashboard' },
    ...pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`
      const formattedLabel = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
      return {
        label: formattedLabel,
        path: url,
        isCurrent: index === pathSegments.length - 1,
      }
    }),
  ]

  return (
    <nav className="flex items-center text-xs text-slate-500 overflow-x-auto whitespace-nowrap py-1">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-slate-900 transition-colors"
      >
        <Home className="h-3.5 w-3.5 mr-1 text-slate-400" />
      </Link>

      {breadcrumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center">
          <ChevronRight className="h-3 w-3 text-slate-300 mx-1.5 shrink-0" />
          {crumb.isCurrent || idx === breadcrumbs.length - 1 ? (
            <span className="font-semibold text-slate-900">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-slate-900 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
