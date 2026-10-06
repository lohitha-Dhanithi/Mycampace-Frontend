// src/modules/academicConfiguration/DepartmentCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DepartmentForm } from './components/DepartmentForm'
import { departmentService } from './services/departmentService'

export function DepartmentCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await departmentService.createDepartment(data)
      setLoading(false)
      navigate('/academic-configuration/departments', {
        state: { toast: `Department "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create department')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/academic-configuration/departments')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Academic Department</h1>
          <p className="text-xs text-slate-500">
            Register academic faculty, designate department head (HOD), and set contact coordinates.
          </p>
        </div>
      </div>

      <DepartmentForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
