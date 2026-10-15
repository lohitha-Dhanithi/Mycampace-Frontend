// src/modules/academics/AcademicConfigPage.jsx
import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Calendar,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { academicService } from '@/services/academicService'

export function AcademicConfigPage({ defaultTab }: { defaultTab?: string } = {}) {
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)

  // Quick add dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    admissionStatus: 'Open',
    status: 'Upcoming',
    isCurrent: false,
  })

  const loadData = async () => {
    setLoading(true)
    const ay = await academicService.getAcademicYears()
    setAcademicYears(ay)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await academicService.addAcademicYear({
      name: formData.name,
      startDate: formData.startDate || '2027-06-01',
      endDate: formData.endDate || '2028-04-30',
      status: formData.status,
      admissionStatus: formData.admissionStatus,
      isCurrent: formData.isCurrent,
    })
    setDialogOpen(false)
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      admissionStatus: 'Open',
      status: 'Upcoming',
      isCurrent: false,
    })
    loadData()
  }

  // Columns for Academic Years
  const yearColumns = [
    {
      header: 'Academic Year',
      accessor: 'name',
      sortable: true,
      className: 'whitespace-nowrap min-w-[200px]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-400">Institutional Session</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) => (
        <span className="text-slate-600 font-medium">
          {row.startDate ? new Date(row.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) => (
        <span className="text-slate-600 font-medium">
          {row.endDate ? new Date(row.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      header: 'Is Current',
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) =>
        row.isCurrent ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Current Active Session
          </span>
        ) : (
          <span className="text-slate-400 text-xs whitespace-nowrap pl-2">No</span>
        ),
    },
    {
      header: 'Admission Status',
      accessor: 'admissionStatus',
      className: 'whitespace-nowrap min-w-[150px]',
      cell: (row) => <StatusBadge status={row.admissionStatus} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      className: 'whitespace-nowrap min-w-[110px]',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Years"
        subtitle="Manage institutional academic sessions, admission intake windows, and operational statuses"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Academic Year
          </Button>
        }
      />

      <DataTable
        columns={yearColumns}
        data={academicYears}
        loading={loading}
        searchPlaceholder="Search academic year sessions..."
        searchKey="name"
      />

      {/* Add Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add Academic Year</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <DialogContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Academic Year Label</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. 2027–28"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Admission Status</label>
                <select
                  value={formData.admissionStatus}
                  onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                  className="w-full h-9 mt-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="Pre-registration">Pre-registration</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-9 mt-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isCurrentYear"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="isCurrentYear" className="text-xs font-medium text-slate-700 cursor-pointer">
                Set as Current Academic Session
              </label>
            </div>
          </DialogContent>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Academic Year
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
