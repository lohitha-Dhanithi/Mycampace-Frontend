// src/modules/roles/RoleEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { RoleForm } from './components/RoleForm'
import { roleService } from './services/roleService'

export function RoleEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    roleService.getRoleById(id).then((r) => {
      if (!r) {
        setError('Role not found')
      } else {
        setRole(r)
      }
      setLoading(false)
    }).catch((err) => {
      setError(err.message || 'Error loading role')
      setLoading(false)
    })
  }, [id])

  const handleSave = async (data) => {
    setSaving(true)
    try {
      await roleService.updateRole(id, data)
      setSaving(false)
      navigate(`/roles/${id}`, {
        state: { toast: `Role "${data.name}" updated successfully.` },
      })
    } catch (err) {
      setSaving(false)
      alert(err.message || 'Failed to update role')
    }
  }

  if (loading) return <LoadingState />
  if (error || !role) return <ErrorState message={error || 'Role not found'} />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate(`/roles/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Role: {role.name}</h1>
          <p className="text-xs text-slate-500">
            Update role metadata, administrative boundary, and scope constraints.
          </p>
        </div>
      </div>

      <RoleForm
        mode="edit"
        initialData={role}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  )
}
