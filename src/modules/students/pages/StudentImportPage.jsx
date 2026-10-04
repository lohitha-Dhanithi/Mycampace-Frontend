// src/modules/students/pages/StudentImportPage.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StudentImport } from '../components/StudentImport'

export function StudentImportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Bulk Ingestion"
        description="Ingest prospective and admitted student cohorts from legacy databases or spreadsheets."
        breadcrumbs={[
          { label: 'Students', href: '/students' },
          { label: 'Import' },
        ]}
      />

      <StudentImport />
    </div>
  )
}
