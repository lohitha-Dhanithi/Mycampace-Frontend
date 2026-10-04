// src/modules/institution/components/InstitutionSummary.jsx
import React from 'react'
import {
  School,
  Hash,
  FileCheck2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

export function InstitutionSummary({ institution, campusesCount = 3 }) {
  if (!institution) return null

  const items = [
    { label: 'Institution Name', value: institution.name, icon: School, highlight: true },
    { label: 'Institution Type', value: institution.type, icon: School },
    { label: 'Institution Code', value: institution.code, icon: Hash, mono: true },
    { label: 'Registration #', value: institution.registrationNumber, icon: FileCheck2, mono: true },
    { label: 'Official Email', value: institution.email, icon: Mail, truncate: true },
    { label: 'Phone Hotline', value: institution.phone, icon: Phone },
    {
      label: 'Website',
      value: institution.website,
      icon: Globe,
      isLink: true,
      truncate: true,
    },
    { label: 'Campuses', value: `${campusesCount} Registered`, icon: MapPin },
    { label: 'Academic Year', value: `AY ${institution.currentAcademicYear || '2026–27'}`, icon: Calendar },
    {
      label: 'Status',
      value: <StatusBadge status={institution.status} />,
      icon: CheckCircle,
      isCustom: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((it, idx) => {
        const Icon = it.icon
        return (
          <Card key={idx} className="border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                  {it.label}
                </span>
              </div>
              <div className="pt-0.5">
                {it.isCustom ? (
                  it.value
                ) : it.isLink ? (
                  <a
                    href={it.value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline block truncate"
                  >
                    {it.value?.replace('https://', '')}
                  </a>
                ) : (
                  <p
                    className={`text-xs font-semibold ${
                      it.highlight ? 'text-slate-900 font-bold' : 'text-slate-800'
                    } ${it.mono ? 'font-mono' : ''} ${it.truncate ? 'truncate' : ''}`}
                  >
                    {it.value || '—'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
