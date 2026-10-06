// src/modules/academicConfiguration/ClassCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClassForm } from './components/ClassForm'
import { classService } from './services/classService'

export function ClassCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await classService.createClass(data)
      setLoading(false)
      navigate('/academic-configuration/classes', {
        state: { toast: `Class "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create class')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/academic-configuration/classes')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Cohort Class</h1>
          <p className="text-xs text-slate-500">
            Define institutional class linked to an academic year, program, and designated tutor.
          </p>
        </div>
      </div>

      <ClassForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
