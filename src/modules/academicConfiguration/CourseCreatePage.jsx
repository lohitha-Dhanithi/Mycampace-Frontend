// src/modules/academicConfiguration/CourseCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseForm } from './components/CourseForm'
import { courseService } from './services/courseService'

export function CourseCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await courseService.createCourse(data)
      setLoading(false)
      navigate('/academic-configuration/courses', {
        state: { toast: `Course "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create course')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/academic-configuration/courses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Academic Course</h1>
          <p className="text-xs text-slate-500">
            Define syllabus module, department allocation, program alignment, and credit value.
          </p>
        </div>
      </div>

      <CourseForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
