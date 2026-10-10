import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { Field } from '../components/ui'
import { CAMPUSES } from '../config/hrmsConfig'
import type { StaffDraft, StaffMember } from '../types'

const emptyDraft: StaffDraft = {
  fullName: '',
  category: 'Teaching',
  designation: '',
  department: 'Physics',
  campus: 'Hyderabad Main',
  email: '',
  phone: '',
  joiningDate: '2026-10-09',
  employmentStatus: 'Probation',
  reportingManager: 'Principal',
  qualification: '',
  experienceYears: 0,
}

export function StaffFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [draft, setDraft] = useState<StaffDraft>(emptyDraft)
  const [managers, setManagers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState(() => hrmsService.getCategories())
  const [departments, setDepartments] = useState(() => hrmsService.getDepartments())

  useEffect(() => {
    hrmsService.getStaff().then(setManagers)
    if (!id) return
    hrmsService.getStaffById(id).then((person) => {
      if (!person) {
        setError('Staff record was not found.')
      } else {
        const { employeeCode: _code, id: _id, ...rest } = person
        setDraft(rest)
      }
      setLoading(false)
    })
  }, [id])

  const set = (key: keyof StaffDraft, value: string | number) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.fullName.trim() || !draft.designation.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setError('Name, designation, email, and phone are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const saved = isEdit && id ? await hrmsService.updateStaff(id, draft) : await hrmsService.createStaff(draft)
      if (!saved) throw new Error('Could not save this staff record.')
      navigate(`/app/hrms/staff/${saved.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this staff record.')
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="Loading staff record..." />

  return (
    <div className="space-y-5">
      <PageHeader
        title={isEdit ? 'Edit staff profile' : 'Add staff'}
        description="Creates the personnel record, leave balances, service history, and an open appraisal for this cycle."
      />
      <form onSubmit={save} className="max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={draft.fullName} onChange={(event) => set('fullName', event.target.value)} />
          </Field>
          <ChoiceField
            label="Category"
            value={draft.category}
            options={categories}
            placeholder="New category"
            onChange={(value) => set('category', value)}
            onAdd={(name) => {
              const saved = hrmsService.addCategory(name)
              setCategories(hrmsService.getCategories())
              set('category', saved)
            }}
          />
          <Field label="Designation">
            <Input value={draft.designation} onChange={(event) => set('designation', event.target.value)} />
          </Field>
          <ChoiceField
            label="Department"
            value={draft.department}
            options={departments}
            placeholder="New department"
            onChange={(value) => set('department', value)}
            onAdd={(name) => {
              const saved = hrmsService.addDepartment(name)
              setDepartments(hrmsService.getDepartments())
              set('department', saved)
            }}
          />
          <Field label="Campus">
            <Select value={draft.campus} onChange={(event) => set('campus', event.target.value)}>
              {CAMPUSES.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </Field>
          <Field label="Employment status">
            <Select value={draft.employmentStatus} onChange={(event) => set('employmentStatus', event.target.value)}>
              <option>Active</option>
              <option>Probation</option>
              <option>On Leave</option>
              <option>Separated</option>
            </Select>
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(event) => set('email', event.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={draft.phone} onChange={(event) => set('phone', event.target.value)} />
          </Field>
          <Field label="Joining date">
            <Input type="date" value={draft.joiningDate} onChange={(event) => set('joiningDate', event.target.value)} />
          </Field>
          <Field label="Experience (years)">
            <Input type="number" min={0} value={draft.experienceYears} onChange={(event) => set('experienceYears', Number(event.target.value))} />
          </Field>
          <Field label="Qualification">
            <Input value={draft.qualification} onChange={(event) => set('qualification', event.target.value)} />
          </Field>
          <Field label="Reporting manager">
            <Select value={draft.reportingManager} onChange={(event) => set('reportingManager', event.target.value)}>
              <option>Principal</option>
              {managers.filter((person) => person.id !== id).map((person) => (
                <option key={person.id}>{person.fullName}</option>
              ))}
            </Select>
          </Field>
        </div>
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-indigo-600">
            {saving ? 'Saving...' : isEdit ? 'Save profile' : 'Create staff record'}
          </Button>
          <Link
            to={id ? `/app/hrms/staff/${id}` : '/app/hrms/staff'}
            className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function ChoiceField({
  label,
  value,
  options,
  placeholder,
  onChange,
  onAdd,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
  onAdd: (name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const choices = options.includes(value) || !value ? options : [value, ...options]

  const save = () => {
    if (!name.trim()) return
    onAdd(name)
    setName('')
    setOpen(false)
  }

  return (
    <Field label={label}>
      <div className="flex gap-2">
        <Select value={value} onChange={(event) => onChange(event.target.value)} className="flex-1">
          {choices.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="h-9 shrink-0 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Add
        </button>
      </div>
      {open && (
        <div className="mt-2 flex gap-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={placeholder}
            className="text-xs"
          />
          <button
            type="button"
            onClick={save}
            className="h-9 shrink-0 rounded-md bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      )}
    </Field>
  )
}
