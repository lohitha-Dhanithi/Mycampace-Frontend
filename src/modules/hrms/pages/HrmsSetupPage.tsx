import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { hrmsService } from '../services/hrmsService'
import { Panel } from '../components/ui'

export function HrmsSetupPage() {
  const [categories, setCategories] = useState(() => hrmsService.getCategories())
  const [departments, setDepartments] = useState(() => hrmsService.getDepartments())
  const [categoryName, setCategoryName] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [error, setError] = useState('')

  const addCategory = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      hrmsService.addCategory(categoryName)
      setCategories(hrmsService.getCategories())
      setCategoryName('')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enter a category name.')
    }
  }

  const addDepartment = (event: React.FormEvent) => {
    event.preventDefault()
    try {
      hrmsService.addDepartment(departmentName)
      setDepartments(hrmsService.getDepartments())
      setDepartmentName('')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enter a department name.')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories & departments"
        description="These lists fill the Category and Department fields when you add or edit staff."
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={`Categories (${categories.length})`}>
          <form onSubmit={addCategory} className="mb-4 flex gap-2">
            <Input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="New category"
              className="text-xs"
            />
            <button type="submit" className="h-9 shrink-0 rounded-md bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-indigo-600">
              Add category
            </button>
          </form>
          <ul className="divide-y divide-slate-100">
            {categories.map((item) => (
              <li key={item} className="py-2 text-sm font-medium text-slate-800">{item}</li>
            ))}
          </ul>
        </Panel>
        <Panel title={`Departments (${departments.length})`}>
          <form onSubmit={addDepartment} className="mb-4 flex gap-2">
            <Input
              value={departmentName}
              onChange={(event) => setDepartmentName(event.target.value)}
              placeholder="New department"
              className="text-xs"
            />
            <button type="submit" className="h-9 shrink-0 rounded-md bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-indigo-600">
              Add department
            </button>
          </form>
          <ul className="divide-y divide-slate-100">
            {departments.map((item) => (
              <li key={item} className="py-2 text-sm font-medium text-slate-800">{item}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
