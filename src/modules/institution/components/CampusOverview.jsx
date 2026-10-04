// src/modules/institution/components/CampusOverview.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, MapPin, Phone, Mail, Globe, User, Clock, Calendar } from 'lucide-react'

export function CampusOverview({ campus }) {
  if (!campus) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. General & Operational Information */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Campus Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Official Branch Name</span>
              <p className="font-semibold text-slate-800">{campus.name}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Branch Code</span>
              <p className="font-mono font-semibold text-slate-800">{campus.code}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Campus Classification</span>
              <p className="font-semibold text-slate-800">{campus.type}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Commission Date</span>
              <p className="font-semibold text-slate-800">{campus.createdDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Campus Head */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Campus Head / Principal</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Leadership In-Charge</span>
              <p className="font-bold text-slate-900 text-sm">{campus.head?.name || '—'}</p>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Official Email</span>
            <a href={`mailto:${campus.head?.email}`} className="font-semibold text-blue-600 hover:underline">
              {campus.head?.email || '—'}
            </a>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Direct Phone</span>
            <p className="font-mono font-semibold text-slate-800">{campus.head?.phone || '—'}</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Address & Geographical Location */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Physical Address</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-800">{campus.addressLine1}</p>
              {campus.addressLine2 && <p className="text-slate-500">{campus.addressLine2}</p>}
              <p className="text-slate-600 mt-1 font-semibold">
                {campus.city}, {campus.state}, {campus.country} - {campus.pincode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Operating Schedule & Contact */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-900">Operating Schedule & Contacts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Daily Operating Hours</span>
              <p className="font-semibold text-slate-800">
                {campus.operatingInfo?.openingTime} – {campus.operatingInfo?.closingTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Working Days</span>
              <p className="font-semibold text-slate-800">{campus.operatingInfo?.workingDays}</p>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Campus Desk</span>
              <span className="font-mono text-slate-800 font-semibold">{campus.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Public Website</span>
              <a href={campus.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                Portal Link →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
