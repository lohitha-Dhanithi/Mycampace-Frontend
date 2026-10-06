// src/modules/institution/components/InstitutionAddress.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export function InstitutionAddress({ institution }) {
  if (!institution) return null

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Headquarters Address</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Official registered physical premises and municipal jurisdiction
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="col-span-2">
            <span className="text-slate-400 block text-[11px] mb-0.5">Address Line 1</span>
            <p className="font-semibold text-slate-800">{institution.addressLine1 || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Address Line 2</span>
            <p className="font-semibold text-slate-800">{institution.addressLine2 || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">City</span>
            <p className="font-semibold text-slate-800">{institution.city || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">State / Province</span>
            <p className="font-semibold text-slate-800">{institution.state || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Country</span>
            <p className="font-semibold text-slate-800">{institution.country || '—'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Postal / Pincode</span>
            <p className="font-mono font-semibold text-slate-800">{institution.pincode || '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
