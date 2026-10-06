// src/modules/master-data/MasterDataPage.jsx
import React, { useState } from 'react'
import {
  Database,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Tag,
  HeartPulse,
  Flag,
  Globe2,
  FolderOpen,
  DollarSign,
  CalendarDays,
  Briefcase,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { MOCK_MASTER_DATA } from '@/services/mockData'

export function MasterDataPage() {
  const [dataStore, setDataStore] = useState(MOCK_MASTER_DATA)
  const [selectedKey, setSelectedKey] = useState('gender')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', sortOrder: 1, status: 'Active' })
  const [alert, setAlert] = useState('')

  const categories = [
    { key: 'gender', label: 'Gender', icon: Tag, count: dataStore.gender?.length || 0 },
    { key: 'bloodGroup', label: 'Blood Group', icon: HeartPulse, count: dataStore.bloodGroup?.length || 0 },
    { key: 'religion', label: 'Religion', icon: Globe2, count: dataStore.religion?.length || 0 },
    { key: 'category', label: 'Social Category / Caste', icon: Layers, count: dataStore.category?.length || 0 },
    { key: 'nationality', label: 'Nationality', icon: Flag, count: dataStore.nationality?.length || 0 },
    { key: 'admissionSource', label: 'Admission Sources', icon: FolderOpen, count: dataStore.admissionSource?.length || 0 },
    { key: 'documentTypes', label: 'Document Types', icon: FolderOpen, count: dataStore.documentTypes?.length || 0 },
    { key: 'feeTypes', label: 'Fee Heads / Types', icon: DollarSign, count: dataStore.feeTypes?.length || 0 },
    { key: 'leaveTypes', label: 'Leave Types', icon: CalendarDays, count: dataStore.leaveTypes?.length || 0 },
    { key: 'designations', label: 'Designations', icon: Briefcase, count: dataStore.designations?.length || 0 },
    { key: 'departments', label: 'Departments', icon: Layers, count: dataStore.departments?.length || 0 },
  ]

  const activeCategory = categories.find((c) => c.key === selectedKey) || categories[0]
  const currentItems = dataStore[selectedKey] || []

  const handleOpenAdd = () => {
    setEditingItem(null)
    setForm({
      name: '',
      code: '',
      sortOrder: currentItems.length + 1,
      status: 'Active',
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setForm({ ...item })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingItem) {
      setDataStore((prev) => ({
        ...prev,
        [selectedKey]: prev[selectedKey].map((it) => (it.id === editingItem.id ? { ...it, ...form } : it)),
      }))
      setAlert(`Updated item "${form.name}"`)
    } else {
      const newItem = {
        id: `md-${Date.now()}`,
        ...form,
      }
      setDataStore((prev) => ({
        ...prev,
        [selectedKey]: [newItem, ...prev[selectedKey]],
      }))
      setAlert(`Created new item "${form.name}" in ${activeCategory.label}`)
    }
    setModalOpen(false)
    setTimeout(() => setAlert(''), 3000)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this lookup entry?')) {
      setDataStore((prev) => ({
        ...prev,
        [selectedKey]: prev[selectedKey].filter((it) => it.id !== id),
      }))
      setAlert('Entry removed from master lookup.')
      setTimeout(() => setAlert(''), 3000)
    }
  }

  const columns = [
    {
      header: 'Code',
      accessor: 'code',
      sortable: true,
      cell: (r) => <span className="font-mono text-xs font-semibold text-slate-800">{r.code}</span>,
    },
    {
      header: 'Display Name / Value',
      accessor: 'name',
      sortable: true,
      cell: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
    },
    {
      header: 'Order Priority',
      accessor: 'sortOrder',
      sortable: true,
      cell: (r) => <span className="text-slate-500 font-mono text-xs">{r.sortOrder || 1}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
            onClick={() => handleOpenEdit(r)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
            onClick={() => handleDelete(r.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data & Taxonomy"
        subtitle="Manage standardized system lookup dictionaries, enumeration codes and classification values"
        actions={
          <Button size="sm" onClick={handleOpenAdd} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add {activeCategory.label} Value
          </Button>
        }
      />

      {alert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{alert}</span>
        </div>
      )}

      {/* 2-Column Layout: Left Category Index, Right Master Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Category Index */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200">
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
              Lookup Categories
            </div>
            <CardContent className="p-2 space-y-1">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = selectedKey === cat.key
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedKey(cat.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Master Data Table */}
        <div className="lg:col-span-3 space-y-3">
          <DataTable
            columns={columns}
            data={currentItems}
            searchPlaceholder={`Filter ${activeCategory.label}...`}
            searchKey="name"
          />
        </div>
      </div>

      {/* Add / Edit Value Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingItem ? `Edit ${activeCategory.label}` : `Add New ${activeCategory.label}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <DialogContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Display Value</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. A Positive (A+)"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">System Code</label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. A+"
                  className="h-9 text-xs mt-1 uppercase font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Display Order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>
          </DialogContent>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Value
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
