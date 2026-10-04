// src/modules/institution/components/CampusActivity.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'

export function CampusActivity({ activities = [] }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-900">Campus Activity Log</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Chronological record of infrastructural updates, compliance checks and operational events
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <ActivityTimeline items={activities} />
      </CardContent>
    </Card>
  )
}
