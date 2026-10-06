// src/modules/students/components/StudentActivity.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export function StudentActivity({ activities = [] }) {
  const sampleActivities = activities.length > 0 ? activities : [
    {
      id: 'act-1',
      activity: 'Student Enrolled into SIS',
      user: 'Deepak Varma (Admissions Registrar)',
      date: '2026-09-29 02:30 PM',
      details: 'Student master created from Admitted Application.',
    },
    {
      id: 'act-2',
      activity: 'Class & Section Assigned',
      user: 'Academic Office',
      date: '2026-09-29 03:00 PM',
      details: 'Allocated to Class 11 Section A (PCM) with Roll No 11-PCM-014.',
    },
    {
      id: 'act-3',
      activity: 'Documents Verified',
      user: 'Deepak Varma',
      date: '2026-09-27 10:15 AM',
      details: 'All mandatory qualification and ID proof documents authenticated.',
    },
    {
      id: 'act-4',
      activity: 'Guardian Accounts Linked',
      user: 'System Admin',
      date: '2026-09-29 03:15 PM',
      details: 'Parent linked as primary guardian with student portal access.',
    },
  ]

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-xs font-bold uppercase text-slate-700">Chronological Audit & Activity Stream</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {sampleActivities.map((act) => (
            <div key={act.id} className="relative group">
              <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-200" />
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{act.activity}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {act.date}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{act.details}</p>
                <div className="text-[10px] text-slate-400">Recorded by: {act.user}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
