// src/modules/institution/components/InstitutionContact.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, Phone, Globe, User } from 'lucide-react'

export function InstitutionContact({ institution }) {
  if (!institution) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Official Communication Endpoints */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Contact Information</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Official institutional helpdesk and public contact channels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Official Email</span>
              <a href={`mailto:${institution.email}`} className="font-semibold text-blue-600 hover:underline">
                {institution.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Phone Number</span>
              <span className="font-semibold text-slate-800 font-mono">{institution.phone}</span>
            </div>
          </div>

          {institution.alternatePhone && (
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Alternate Phone</span>
                <span className="font-semibold text-slate-800 font-mono">{institution.alternatePhone}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-slate-700">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Website Portal</span>
              <a
                href={institution.website}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 hover:underline truncate block"
              >
                {institution.website}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact Person */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Primary Contact</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Authorized institutional representative and executive officer
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <User className="h-4 w-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Name</span>
              <span className="font-bold text-slate-900 text-sm">
                {institution.primaryContact?.name || '—'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Designation</span>
            <span className="font-semibold text-slate-800">
              {institution.primaryContact?.designation || 'Director / Principal'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Direct Email</span>
            <a
              href={`mailto:${institution.primaryContact?.email}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {institution.primaryContact?.email || '—'}
            </a>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Direct Phone</span>
            <span className="font-semibold text-slate-800 font-mono">
              {institution.primaryContact?.phone || '—'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
