// src/modules/roles/components/RoleForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Check, ArrowLeft, Sparkles, Building2, MapPin,
  Layers, Lock, AlertCircle, Info, Sliders, CheckCircle2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AccessScopeSelector } from './AccessScopeSelector'
import { ROLE_TEMPLATES, getEmptyPermissions } from '../data/permissionConfig'

export function RoleForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    scope: initialData?.scope || 'Institution-wide',
    campus: initialData?.campus || 'All Campuses',
    department: initialData?.department || 'All Departments',
    status: initialData?.status || 'Active',
    templateName: 'None',
  })

  const [errors, setErrors] = useState<Record<string, any>>({})
  const [templatePermissions, setTemplatePermissions] = useState(
    initialData?.permissions || null
  )
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false)

  // Auto-generate code from name in create mode
  const handleNameChange = (name) => {
    setFormData((prev) => {
      const updated = { ...prev, name }
      if (mode === 'create' && !isCodeManuallyEdited) {
        updated.code = name
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .slice(0, 30)
      }
      return updated
    })
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: null }))
    }
  }

  // Handle template selection
  const handleTemplateChange = (templateName) => {
    if (templateName === 'None') {
      setFormData((prev) => ({ ...prev, templateName: 'None' }))
      setTemplatePermissions(null)
      return
    }

    const tpl = ROLE_TEMPLATES[templateName]
    if (tpl) {
      setFormData((prev) => ({
        ...prev,
        templateName,
        // Optionally suggest description if empty
        description: prev.description || `Pre-configured role based on standard ${templateName} responsibilities.`,
      }))
      setTemplatePermissions(tpl)
    }
  }

  const validate = () => {
    const newErrors: Record<string, any> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Role name must be at least 3 characters'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Role code is required'
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Role code must contain only uppercase letters, numbers, and underscores'
    }

    if (formData.scope === 'Campus-specific' && (!formData.campus || formData.campus === 'All Campuses')) {
      newErrors.campus = 'Please select a specific campus for this scope'
    }

    if (formData.scope === 'Department-level' && (!formData.department || formData.department === 'All Departments')) {
      newErrors.department = 'Please select a specific department'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...formData,
      templatePermissions: templatePermissions || initialData?.permissions || getEmptyPermissions(),
    }

    onSave(payload)
  }

  // Compute template permission count for preview
  const templateCount: number = templatePermissions
    ? Object.values(templatePermissions).reduce<number>(
        (acc: number, mod: any) => acc + Object.values(mod || {}).filter(Boolean).length,
        0
      )
    : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Identity */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Role Identity & Basics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Title / Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Dean of Academics, Librarian"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name ? (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Clear descriptive title representing the administrative responsibility.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  System Role Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => {
                    setIsCodeManuallyEdited(true)
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''),
                    }))
                    if (errors.code) setErrors((prev) => ({ ...prev, code: null }))
                  }}
                  placeholder="e.g. DEAN_ACAD"
                  className={`font-mono text-xs uppercase ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code ? (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Unique uppercase identifier used in backend RBAC token claims.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Administrative Purpose
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Explain the administrative scope, authorities, and accountability for this role..."
                className="text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Visible to administrators when assigning roles to users.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white"
                >
                  <option value="Active">Active (Assignable to users)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </Select>
              </div>

              {mode === 'create' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start from Template
                  </label>
                  <Select
                    value={formData.templateName}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full bg-white font-medium"
                  >
                    <option value="None">Start from Blank Matrix (No permissions)</option>
                    {Object.keys(ROLE_TEMPLATES).map((tplName) => (
                      <option key={tplName} value={tplName}>
                        Template: {tplName}
                      </option>
                    ))}
                  </Select>
                  {formData.templateName !== 'None' && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Applies {templateCount} baseline permissions from {formData.templateName}.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Scope Boundaries */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Organizational Scope & Boundaries</h2>
            </div>

            <AccessScopeSelector
              scope={formData.scope}
              campus={formData.campus}
              department={formData.department}
              onScopeChange={(scope) => setFormData((prev) => ({ ...prev, scope }))}
              onCampusChange={(campus) => setFormData((prev) => ({ ...prev, campus }))}
              onDepartmentChange={(department) => setFormData((prev) => ({ ...prev, department }))}
            />

            {(errors.campus || errors.department) && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.campus || errors.department}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary & Tips */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Role Specification Preview
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
              <div>
                <span className="text-[11px] text-slate-500 block">Role Title</span>
                <span className="text-sm font-bold text-slate-900">
                  {formData.name || 'Untitled Role'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Identifier Code</span>
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                  {formData.code || 'ROLE_CODE'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Assigned Scope</span>
                <span className="text-xs font-semibold text-slate-800">
                  {formData.scope}
                </span>
                {formData.scope === 'Campus-specific' && (
                  <p className="text-[11px] text-slate-500">Campus: {formData.campus}</p>
                )}
                {formData.scope === 'Department-level' && (
                  <p className="text-[11px] text-slate-500">
                    {formData.campus} · {formData.department}
                  </p>
                )}
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Status</span>
                <Badge
                  className={
                    formData.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }
                >
                  {formData.status}
                </Badge>
              </div>

              {formData.templateName !== 'None' && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Permissions Seeded</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {templateCount} permissions from {formData.templateName}
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  After creating this role, you can fine-tune module-by-module permissions in the{' '}
                  <strong>Permission Matrix</strong> screen.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Role changes will automatically apply to all assigned users upon their next session
                  validation.
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving Role...' : mode === 'create' ? 'Create Role & Proceed' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/roles')}
              className="w-full text-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
