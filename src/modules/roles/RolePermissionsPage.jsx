// src/modules/roles/RolePermissionsPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Shield, ArrowLeft, Save, Copy, RotateCcw, CheckCircle2,
  Lock, AlertTriangle, Users, Building2, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { PermissionMatrix } from './components/PermissionMatrix'
import { roleService } from './services/roleService'

export function RolePermissionsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState(null)
  const [permissions, setPermissions] = useState({})
  const [initialPermissions, setInitialPermissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(location.state?.toast || '')
  const [hasChanges, setHasChanges] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  useEffect(() => {
    roleService.getRoleById(id).then((r) => {
      if (!r) {
        setError('Role not found')
        setLoading(false)
        return
      }
      setRole(r)
      const perms = r.permissions || {}
      setPermissions(perms)
      setInitialPermissions(JSON.parse(JSON.stringify(perms)))
      setLoading(false)
    }).catch((err) => {
      setError(err.message || 'Error loading role')
      setLoading(false)
    })
  }, [id])

  const handlePermissionsChange = (newPerms) => {
    setPermissions(newPerms)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (role?.isSystem) return
    setSaving(true)
    try {
      await roleService.updateRolePermissions(id, permissions)
      setInitialPermissions(JSON.parse(JSON.stringify(permissions)))
      setHasChanges(false)
      setSaving(false)
      showToast(`Permissions matrix for "${role.name}" updated successfully.`)
    } catch (err) {
      setSaving(false)
      alert(err.message || 'Failed to save permissions')
    }
  }

  const handleReset = () => {
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)))
    setHasChanges(false)
  }

  const handleDuplicate = async () => {
    try {
      const duplicated = await roleService.duplicateRole(id)
      navigate(`/roles/${duplicated.id}/permissions`, {
        state: { toast: `Role duplicated as "${duplicated.name}". You can now edit permissions.` },
      })
    } catch (err) {
      alert(err.message || 'Failed to duplicate role')
    }
  }

  if (loading) return <LoadingState />
  if (error || !role) return <ErrorState message={error || 'Role not found'} />

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0 mt-1"
            onClick={() => navigate('/roles')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{role.name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {role.code}
              </span>
              {role.isSystem ? (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
                  <Lock className="h-3 w-3 mr-1 inline" />
                  System Role
                </Badge>
              ) : (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                  Custom Role
                </Badge>
              )}
              <Badge variant="outline" className="text-xs text-slate-600">
                Scope: {role.scope}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {role.description || 'Configurable module authorization permissions matrix.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {role.isSystem ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="text-xs bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" />
              Duplicate to Edit
            </Button>
          ) : (
            <>
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs text-slate-600 hover:bg-slate-100"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Revert Changes
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`text-xs font-medium ${
                  hasChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
              </Button>
            </>
          )}

          <Link to={`/roles/${id}`}>
            <Button variant="outline" size="sm" className="text-xs text-slate-700">
              <Eye className="h-3.5 w-3.5 mr-1" />
              Role Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Permission Matrix */}
      <PermissionMatrix
        permissions={permissions}
        onChange={handlePermissionsChange}
        readOnly={role.isSystem}
        isSystemRole={role.isSystem}
        roleName={role.name}
      />
    </div>
  )
}
