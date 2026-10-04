// src/modules/academicConfiguration/components/AcademicConfigurationHeader.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { useTenantContext } from '@/store/TenantContext'

export function AcademicConfigurationHeader({
  title = 'Academic Configuration',
  subtitle = 'Configure the academic structure and operational rules for your institution.',
  actions = null,
}) {
  const { selectedInstitution, selectedCampus, selectedAcademicYear } = useTenantContext()

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={title} subtitle={subtitle} actions={actions} />
      </div>

      {/* Institutional Context Strip */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200/80 w-fit">
        <span className="font-semibold text-slate-700">Scope:</span>
        <span>{selectedInstitution?.name || 'MyCampace Main'}</span>
        <span className="text-slate-300">•</span>
        <span>{selectedCampus?.name || 'All Campuses'}</span>
        <span className="text-slate-300">•</span>
        <span className="font-bold text-blue-700">
          Active Session: {selectedAcademicYear?.name || '2026–2027'}
        </span>
      </div>
    </div>
  )
}
