// src/modules/institution/CampusManagementPage.jsx
import React, { useState, useEffect } from 'react'
import {
  MapPin,
  Plus,
  Edit,
  Eye,
  Trash2,
  Users,
  Building,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { institutionService } from '@/services/institutionService'
import { useTenantContext } from '@/store/TenantContext'

export function CampusManagementPage() {
  const { selectedInstitution } = useTenantContext()
  const [campuses, setCampuses] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedCampus, setSelectedCampus] = useState(null)

  // Form state
  const [campusForm, setCampusForm] = useState({
    name: '',
    code: '',
    type: 'Urban Campus',
    headOfCampus: '',
    email: '',
    phone: '',
    capacity: 2000,
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'Active',
  })

  const loadCampuses = async () => {
    setLoading(true)
    const data = await institutionService.getCampuses(selectedInstitution?.id)
    setCampuses(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCampuses()
  }, [selectedInstitution])

  const handleOpenAdd = () => {
    setCampusForm({
      name: '',
      code: '',
      type: 'Urban Campus',
      headOfCampus: '',
      email: '',
      phone: '',
      capacity: 2000,
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: 'Active',
    })
    setAddModalOpen(true)
  }

  const handleOpenEdit = (campus) => {
    setSelectedCampus(campus)
    setCampusForm({ ...campus })
    setEditModalOpen(true)
  }

  const handleOpenView = (campus) => {
    setSelectedCampus(campus)
    setViewModalOpen(true)
  }

  const handleSaveAdd = async (e) => {
    e.preventDefault()
    await institutionService.addCampus({
      ...campusForm,
      institutionId: selectedInstitution?.id,
    })
    setAddModalOpen(false)
    loadCampuses()
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!selectedCampus) return
    await institutionService.updateCampus(selectedCampus.id, campusForm)
    setEditModalOpen(false)
    loadCampuses()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate or remove this campus record?')) {
      await institutionService.deleteCampus(id)
      loadCampuses()
    }
  }

  const columns = [
    {
      header: 'Campus Details',
      accessor: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-500 font-mono">Code: {row.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'city',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <span className="text-slate-800 font-medium">{row.city}, {row.state}</span>
          <p className="text-[11px] text-slate-400 truncate max-w-xs">{row.address}</p>
        </div>
      ),
    },
    {
      header: 'Campus Head',
      accessor: 'headOfCampus',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800">{row.headOfCampus}</span>
          <span className="text-[11px] text-slate-400 block">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Enrollment / Capacity',
      accessor: 'capacity',
      sortable: true,
      cell: (row) => {
        const pct = Math.round(((row.currentStudents || 0) / (row.capacity || 1)) * 100)
        return (
          <div className="text-xs space-y-1">
            <div className="flex justify-between text-[11px] text-slate-600">
              <span className="font-semibold">{row.currentStudents || 0} students</span>
              <span className="text-slate-400">{pct}% capacity</span>
            </div>
            <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div style={{ width: `${Math.min(100, pct)}%` }} className="h-full bg-blue-600" />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
            onClick={() => handleOpenView(row)}
            title="View Campus"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
            onClick={() => handleOpenEdit(row)}
            title="Edit Campus"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
            onClick={() => handleDelete(row.id)}
            title="Remove Campus"
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
        title="Campus Management"
        subtitle={`Configure regional campuses, physical infrastructure, capacity and operational head for ${selectedInstitution?.name}`}
        actions={
          <Button size="sm" onClick={handleOpenAdd} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Campus
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={campuses}
        loading={loading}
        searchPlaceholder="Search campuses by name, city or head..."
        searchKey="name"
      />

      {/* Add / Edit Campus Modal */}
      <Dialog
        open={addModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAddModalOpen(false)
            setEditModalOpen(false)
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{editModalOpen ? 'Edit Campus Parameters' : 'Add New Institutional Campus'}</DialogTitle>
          <DialogDescription>
            Enter location, administrator in charge, and student enrollment quota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={editModalOpen ? handleSaveEdit : handleSaveAdd}>
          <DialogContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Campus Name</label>
                <Input
                  value={campusForm.name}
                  onChange={(e) => setCampusForm({ ...campusForm, name: e.target.value })}
                  placeholder="e.g. Hyderabad Main Campus"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Campus Code</label>
                <Input
                  value={campusForm.code}
                  onChange={(e) => setCampusForm({ ...campusForm, code: e.target.value })}
                  placeholder="e.g. HYD-MAIN"
                  className="h-9 text-xs mt-1 uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Campus Type</label>
                <Select
                  value={campusForm.type}
                  onChange={(e) => setCampusForm({ ...campusForm, type: e.target.value })}
                  className="h-9 text-xs mt-1"
                >
                  <option value="Urban Campus">Urban Campus</option>
                  <option value="Suburban Campus">Suburban Campus</option>
                  <option value="Day-cum-Boarding">Day-cum-Boarding</option>
                  <option value="Residential Campus">Residential Campus</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Capacity (Seats)</label>
                <Input
                  type="number"
                  value={campusForm.capacity}
                  onChange={(e) => setCampusForm({ ...campusForm, capacity: Number(e.target.value) })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Head of Campus</label>
                <Input
                  value={campusForm.headOfCampus}
                  onChange={(e) => setCampusForm({ ...campusForm, headOfCampus: e.target.value })}
                  placeholder="Dr. / Col. Name"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Campus Email</label>
                <Input
                  type="email"
                  value={campusForm.email}
                  onChange={(e) => setCampusForm({ ...campusForm, email: e.target.value })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Physical Address</label>
              <Input
                value={campusForm.address}
                onChange={(e) => setCampusForm({ ...campusForm, address: e.target.value })}
                className="h-9 text-xs mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">City</label>
                <Input
                  value={campusForm.city}
                  onChange={(e) => setCampusForm({ ...campusForm, city: e.target.value })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">State</label>
                <Input
                  value={campusForm.state}
                  onChange={(e) => setCampusForm({ ...campusForm, state: e.target.value })}
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Status</label>
                <Select
                  value={campusForm.status}
                  onChange={(e) => setCampusForm({ ...campusForm, status: e.target.value })}
                  className="h-9 text-xs mt-1"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAddModalOpen(false)
                setEditModalOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editModalOpen ? 'Save Updates' : 'Create Campus'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* View Campus Details Modal */}
      {selectedCampus && (
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedCampus.name}</DialogTitle>
              <StatusBadge status={selectedCampus.status} />
            </div>
            <DialogDescription>Code: {selectedCampus.code} • {selectedCampus.type}</DialogDescription>
          </DialogHeader>
          <DialogContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="text-slate-500">Student Capacity:</span>
                <p className="font-bold text-slate-800 text-sm">{selectedCampus.capacity.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Enrolled Strength:</span>
                <p className="font-bold text-blue-600 text-sm">{selectedCampus.currentStudents?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{selectedCampus.address}, {selectedCampus.city}, {selectedCampus.state} - {selectedCampus.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{selectedCampus.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{selectedCampus.phone}</span>
              </div>
            </div>
          </DialogContent>
          <DialogFooter>
            <Button size="sm" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  )
}
