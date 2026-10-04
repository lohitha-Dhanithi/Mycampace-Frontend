// src/modules/institution/components/InstitutionHeader.jsx
import React from 'react'
import { Edit, Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function InstitutionHeader({ title = 'Institution', description, actions }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 mb-5 border-b border-slate-200/80 gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Building2 className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {description || 'Manage institution information, branding, campuses and organizational configuration.'}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {actions ? (
          actions
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={() => navigate('/institution/edit')}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Institution
            </Button>
            <Button
              size="sm"
              className="text-xs h-9"
              onClick={() => navigate('/institution/campuses/new')}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Campus
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
