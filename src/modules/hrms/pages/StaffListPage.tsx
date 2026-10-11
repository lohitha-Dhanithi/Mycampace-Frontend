import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { EmptyState, StatusBadge } from '../components/ui'
import { CAMPUSES } from '../config/hrmsConfig'
import type { StaffMember } from '../types'

export function StaffListPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [campus, setCampus] = useState('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    setCategories(hrmsService.getCategories())
  }, [])

  useEffect(() => {
    setLoading(true)
    hrmsService.getStaff({ search, category, status, campus }).then((rows) => {
      setStaff(rows)
      setLoading(false)
    })
  }, [search, category, status, campus])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Staff directory"
        description="Teaching and non-teaching personnel records, with the document vault on each profile."
        actions={
          <Link
            to="/app/hrms/staff/new"
            className="inline-flex h-8 items-center rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-600 transition-colors"
          >
            + Add staff
          </Link>
        }
      />

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_10rem_10rem_11rem]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, code, designation" className="pl-9 text-xs" />
        </div>
        <Select value={category} onChange={(event) => setCategory(event.target.value)} className="text-xs">
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="text-xs">
          <option value="all">All statuses</option>
          <option value="Active">Active</option>
          <option value="Probation">Probation</option>
          <option value="On Leave">On Leave</option>
          <option value="Separated">Separated</option>
        </Select>
        <Select value={campus} onChange={(event) => setCampus(event.target.value)} className="text-xs">
          <option value="all">All campuses</option>
          {CAMPUSES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <LoadingState message="Loading staff records..." />
        ) : staff.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <EmptyState message="No staff match these filters." />
            {(search || category !== 'all' || status !== 'all' || campus !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                  setStatus('all')
                  setCampus('all')
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Campus</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/app/hrms/staff/${person.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">
                      {person.fullName}
                    </Link>
                    <p className="text-[11px] text-slate-500">{person.employeeCode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800">{person.designation}</p>
                    <p className="text-[11px] text-slate-500">{person.department} · {person.category}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{person.campus}</td>
                  <td className="px-4 py-3"><StatusBadge value={person.employmentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
