// src/modules/academicConfiguration/SubjectEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubjectForm } from './components/SubjectForm'
import { subjectService } from './services/subjectService'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'

export function SubjectEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    subjectService.getSubjectById(id).then((data) => {
      if (!data) setError('Subject not found')
      else setSubject(data)
      setLoading(false)
    }).catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  const handleSave = async (data) => {
    setSaving(true)
    try {
      const updated = await subjectService.updateSubject(id, data)
      setSaving(false)
      navigate('/academic-configuration/subjects', {
        state: { toast: `Subject "${updated.name}" updated successfully.` },
      })
    } catch (err) {
      setSaving(false)
      alert(err.message || 'Failed to update subject')
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={() => navigate('/academic-configuration/subjects')} />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate('/academic-configuration/subjects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Subject</h1>
          <p className="text-xs text-slate-500">Modify subject details, credit hours, and departmental associations.</p>
        </div>
      </div>
      <SubjectForm mode="edit" initialData={subject} onSave={handleSave} loading={saving} />
    </div>
  )
}
