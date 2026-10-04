// src/modules/institution/components/CampusSummary.jsx
import React from 'react'
import { Building, Edit, Power, ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export function CampusSummary({ campus, onToggleStatus }) {
  const navigate = useNavigate()
  if (!campus) return null

  const isDeactivating = campus.status === 'Active'

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/institution/campuses')}
        className="text-xs text-slate-500 hover:text-slate-800 -ml-2"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Campuses Directory
      </Button>

      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{campus.name}</h1>
                <StatusBadge status={campus.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono font-semibold text-blue-600">Code: {campus.code}</span>
                <span>•</span>
                <span>Type: {campus.type}</span>
                <span>•</span>
                <span>Established: {campus.createdDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9"
              onClick={() => navigate(`/institution/campuses/${campus.id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Campus
            </Button>
            <Button
              variant={isDeactivating ? 'outline' : 'default'}
              size="sm"
              className={`text-xs h-9 ${
                isDeactivating
                  ? 'border-red-200 text-red-700 hover:bg-red-50'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={onToggleStatus}
            >
              <Power className="h-3.5 w-3.5 mr-1.5" />
              {isDeactivating ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
