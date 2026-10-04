// src/modules/students/pages/StudentPromotionsPage.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StudentPromotion } from '../components/StudentPromotion'

export function StudentPromotionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Academic Promotions"
        description="Advance student cohorts across academic years with versioned enrollment preservation."
        breadcrumbs={[
          { label: 'Students', href: '/students' },
          { label: 'Promotions' },
        ]}
      />

      <StudentPromotion />
    </div>
  )
}
