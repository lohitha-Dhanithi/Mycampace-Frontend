import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { TimetableBoard } from '../components/TimetableBoard'

export function TimetablePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Timetable"
        description="Schedule Monday–Saturday periods, set the school day timings, and block a faculty member or room from being used twice."
      />
      <TimetableBoard />
    </div>
  )
}
