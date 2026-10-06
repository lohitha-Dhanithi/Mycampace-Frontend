// src/modules/academicConfiguration/ProgramCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgramForm } from './components/ProgramForm'
import { programService } from './services/programService'

export function ProgramCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await programService.createProgram(data)
      setLoading(false)
      navigate('/academic-configuration/programs', {
        state: { toast: `Program "${created.name}" created successfully.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create program')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/academic-configuration/programs')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Academic Program</h1>
          <p className="text-xs text-slate-500">
            Define degree specifications, departmental host, delivery mode, and credit structure.
          </p>
        </div>
      </div>

      <ProgramForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
