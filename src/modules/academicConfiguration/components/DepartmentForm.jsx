// src/modules/academicConfiguration/components/DepartmentForm.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Mail, Phone, User, Check, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

export function DepartmentForm({
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
    head: initialData?.head || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    status: initialData?.status || 'Active',
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Department name is required'
    if (!formData.code.trim()) errs.code = 'Department code is required (e.g. CSE)'
    if (!formData.head.trim()) errs.head = 'Department head is required'
    if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
      errs.contactEmail = 'Valid contact email is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Department Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      code:
                        mode === 'create' && !prev.codeManual
                          ? name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 8)
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. Department of Computer Science & Engineering"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                      codeManual: true,
                    }))
                    if (errors.code) setErrors((prev) => ({ ...prev, code: null }))
                  }}
                  placeholder="e.g. CSE"
                  className={`font-mono text-xs ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Research Focus
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Disciplinary boundaries, faculty research centers and labs..."
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Head (HOD) <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.head}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, head: e.target.value }))
                    if (errors.head) setErrors((prev) => ({ ...prev, head: null }))
                  }}
                  placeholder="e.g. Dr. Ramesh Sharma"
                  className={errors.head ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.head && <p className="text-[11px] text-rose-500 mt-1">{errors.head}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                    if (errors.contactEmail) setErrors((prev) => ({ ...prev, contactEmail: null }))
                  }}
                  placeholder="head.cse@mycampace.edu"
                  className={errors.contactEmail ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.contactEmail && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white text-xs max-w-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Department Summary
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Department Name</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Code</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold inline-block">
                  {formData.code || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Head of Department</span>
                <span className="text-slate-800">{formData.head || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Department' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/departments')}
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
