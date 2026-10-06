// src/modules/roles/RoleCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleForm } from './components/RoleForm'
import { roleService } from './services/roleService'

export function RoleCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    try {
      const created = await roleService.createRole(data)
      setLoading(false)
      // Navigate to the permissions configuration for this role
      navigate(`/roles/${created.id}/permissions`, {
        state: { toast: `Role "${created.name}" created. You can now customize permissions in the matrix.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create role')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => navigate('/roles')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Role</h1>
          <p className="text-xs text-slate-500">
            Define role identity, operational boundaries, and seed baseline permissions.
          </p>
        </div>
      </div>

      <RoleForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
