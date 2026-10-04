// src/modules/academicConfiguration/AcademicYearCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AcademicYearForm } from './components/AcademicYearForm'
import { academicYearService } from './services/academicYearService'

export function AcademicYearCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await academicYearService.createAcademicYear(data)
      setLoading(false)
      navigate('/academic-configuration/academic-years', {
        state: { toast: `Academic Year "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create academic year')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/academic-configuration/academic-years')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Academic Year</h1>
          <p className="text-xs text-slate-500">
            Configure calendar term dates, operational boundaries, and admission intake defaults.
          </p>
        </div>
      </div>

      <AcademicYearForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
