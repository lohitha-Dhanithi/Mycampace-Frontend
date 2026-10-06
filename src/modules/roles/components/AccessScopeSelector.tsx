import React from 'react'
import { Building2, MapPin, Layers } from 'lucide-react'
import { Select } from '@/components/ui/select'

export const SCOPE_OPTIONS = [
  { value: 'Institution-wide', label: 'Institution-wide (All Campuses)', icon: Building2, desc: 'Full institutional scope across all campuses and departments' },
  { value: 'Campus-specific', label: 'Campus-specific', icon: MapPin, desc: 'Restricted to selected institutional campuses' },
  { value: 'Department-level', label: 'Department-level', icon: Layers, desc: 'Confined to a specific department or faculty unit' },
]

export const CAMPUS_OPTIONS = [
  'All Campuses',
  'Hyderabad Main Campus',
  'Bengaluru Tech Campus',
  'Mumbai City Campus',
  'Delhi North Campus',
]

export const DEPARTMENT_OPTIONS = [
  'All Departments',
  'Academics & Faculty',
  'Admissions & Enrollment',
  'Finance & Accounts',
  'Examination & Evaluation',
  'Human Resources (HR)',
  'Student Welfare & Affairs',
  'Information Technology (IT)',
  'Operations & Facilities',
]

export function AccessScopeSelector({
  scope = 'Institution-wide',
  campus = 'All Campuses',
  department = 'All Departments',
  onScopeChange,
  onCampusChange,
  onDepartmentChange,
  disabled = false,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Access Scope Boundary
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SCOPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = scope === opt.value
            return (
              <button
                type="button"
                key={opt.value}
                disabled={disabled}
                onClick={() => onScopeChange && onScopeChange(opt.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{opt.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {scope === 'Campus-specific' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Designated Campus <span className="text-rose-500">*</span>
          </label>
          <Select
            value={campus}
            onChange={(e) => onCampusChange && onCampusChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-white"
          >
            {CAMPUS_OPTIONS.filter((c) => c !== 'All Campuses').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <p className="text-[11px] text-slate-500">
            Users with this role will only have access to records and operations within this campus.
          </p>
        </div>
      )}

      {scope === 'Department-level' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Campus <span className="text-rose-500">*</span>
            </label>
            <Select
              value={campus}
              onChange={(e) => onCampusChange && onCampusChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-white"
            >
              {CAMPUS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Designated Department <span className="text-rose-500">*</span>
            </label>
            <Select
              value={department}
              onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
              disabled={disabled}
              className="w-full bg-white"
            >
              {DEPARTMENT_OPTIONS.filter((d) => d !== 'All Departments').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <p className="text-[11px] text-slate-500">
            Permission boundaries will strictly apply to records tagged to this department.
          </p>
        </div>
      )}
    </div>
  )
}
