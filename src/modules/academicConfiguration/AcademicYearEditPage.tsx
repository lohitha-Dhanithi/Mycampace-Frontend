// src/modules/academicConfiguration/AcademicYearEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { AcademicYearForm } from './components/AcademicYearForm'
import { academicYearService } from './services/academicYearService'

export function AcademicYearEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [academicYear, setAcademicYear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    academicYearService.getAcademicYearById(id).then((ay) => {
      if (!ay) {
        setError('Academic year not found')
      } else {
        setAcademicYear(ay)
      }
      setLoading(false)
    }).catch((err) => {
      setError(err.message || 'Error loading academic year')
      setLoading(false)
    })
  }, [id])

  const handleSave = async (data) => {
    setSaving(true)
    try {
      await academicYearService.updateAcademicYear(id, data)
      setSaving(false)
      navigate(`/academic-configuration/academic-years/${id}`, {
        state: { toast: `Academic Year "${data.name}" updated successfully.` },
      })
    } catch (err) {
      setSaving(false)
      alert(err.message || 'Failed to update academic year')
    }
  }

  if (loading) return <LoadingState />
  if (error || !academicYear) return <ErrorState message={error || 'Academic year not found'} />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate(`/academic-configuration/academic-years/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Academic Year: {academicYear.name}</h1>
          <p className="text-xs text-slate-500">
            Modify term schedules, operational designation, and admission eligibility.
          </p>
        </div>
      </div>

      <AcademicYearForm
        mode="edit"
        initialData={academicYear}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  )
}
