// src/modules/institution/components/InstitutionInformation.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'

export function InstitutionInformation({ institution }) {
  if (!institution) return null

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Basic Information</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Core regulatory and institutional identification metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Institution Name</span>
            <p className="font-semibold text-slate-900 text-sm">{institution.name}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Institution Code</span>
            <p className="font-mono font-semibold text-slate-800">{institution.code}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Institution Type</span>
            <p className="font-semibold text-slate-800">{institution.type}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Registration Number</span>
            <p className="font-mono text-slate-800 font-semibold">{institution.registrationNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Established Year</span>
            <p className="font-semibold text-slate-800">{institution.establishedYear}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Status</span>
            <StatusBadge status={institution.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
