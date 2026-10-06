// src/modules/academicConfiguration/SubjectCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubjectForm } from './components/SubjectForm'
import { subjectService } from './services/subjectService'

export function SubjectCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await subjectService.createSubject(data)
      setLoading(false)
      navigate('/academic-configuration/subjects', {
        state: { toast: `Subject "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create subject')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate('/academic-configuration/subjects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Subject</h1>
          <p className="text-xs text-slate-500">Define a new subject module, assign credits, and link to a department and course.</p>
        </div>
      </div>
      <SubjectForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
