// src/modules/admissions/AdmissionsCRMPage.jsx
import React, { useState, useEffect } from 'react'
import {
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  UserCheck,
  ChevronRight,
  Filter,
  Plus,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { admissionService } from '@/services/admissionService'
import { useTenantContext } from '@/store/TenantContext'

export function AdmissionsCRMPage() {
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  const [pipeline, setPipeline] = useState([])
  const [activeStageFilter, setActiveStageFilter] = useState('all')
  const [leads, setLeads] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialogs
  const [addLeadOpen, setAddLeadOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [newLeadForm, setNewLeadForm] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    applyingFor: 'Class 11 (PCM)',
    source: 'Official Website Portal',
    notes: '',
  })
  const [bannerAlert, setBannerAlert] = useState('')

  const loadAll = async () => {
    setLoading(true)
    const [pipe, lds, apps] = await Promise.all([
      admissionService.getPipeline(),
      admissionService.getLeads({ stage: activeStageFilter }),
      admissionService.getApplications({ stage: activeStageFilter }),
    ])
    setPipeline(pipe)
    setLeads(lds)
    setApplications(apps)
    setLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, [activeStageFilter])

  const handleCreateLead = async (e) => {
    e.preventDefault()
    await admissionService.createLead({
      ...newLeadForm,
      campus: selectedCampus?.name || 'Hyderabad Main Campus',
      counsellor: 'Ananya Sharma',
    })
    setAddLeadOpen(false)
    setBannerAlert(`Enquiry ${newLeadForm.studentName} logged successfully.`)
    loadAll()
    setTimeout(() => setBannerAlert(''), 4000)
  }

  const handleAdvanceStage = async (appId, nextStage) => {
    await admissionService.updateApplicationStage(appId, nextStage)
    setSelectedApp((prev) => (prev ? { ...prev, stage: nextStage } : null))
    setBannerAlert(`Application moved to stage: ${nextStage}`)
    loadAll()
    setTimeout(() => setBannerAlert(''), 3000)
  }

  const handleEnrollStudent = async (appId) => {
    await admissionService.enrollStudentFromApplication(appId, '11-A (Allocated)')
    setSelectedApp(null)
    setBannerAlert(`Student enrollment finalized! Student ID generated & section allocated.`)
    loadAll()
    setTimeout(() => setBannerAlert(''), 4000)
  }

  // Columns for Leads / Enquiries
  const leadColumns = [
    {
      header: 'Enquiry ID / Student',
      accessor: 'studentName',
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.studentName}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.leadNumber}</span>
        </div>
      ),
    },
    {
      header: 'Applying For',
      accessor: 'applyingFor',
      sortable: true,
      cell: (r) => <span className="font-medium text-xs text-blue-700">{r.applyingFor}</span>,
    },
    {
      header: 'Parent Contact',
      accessor: 'parentName',
      cell: (r) => (
        <div className="text-xs">
          <span className="text-slate-800 font-medium block">{r.parentName}</span>
          <span className="text-[11px] text-slate-400">{r.phone}</span>
        </div>
      ),
    },
    {
      header: 'Lead Source',
      accessor: 'source',
      cell: (r) => <span className="text-xs text-slate-600">{r.source}</span>,
    },
    {
      header: 'Current Stage',
      accessor: 'stage',
      sortable: true,
      cell: (r) => <StatusBadge status={r.stage} />,
    },
    {
      header: 'Counsellor',
      accessor: 'counsellor',
      cell: (r) => <span className="text-xs text-slate-700">{r.counsellor}</span>,
    },
    {
      header: 'Actions',
      cell: (r) => (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => setSelectedLead(r)}
        >
          View Details
        </Button>
      ),
    },
  ]

  // Columns for Formal Applications
  const appColumns = [
    {
      header: 'Application ID / Applicant',
      accessor: 'studentName',
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-semibold text-slate-900 block">{r.studentName}</span>
          <span className="text-[11px] text-slate-400 font-mono">{r.applicationNumber}</span>
        </div>
      ),
    },
    {
      header: 'Target Class',
      accessor: 'applyingClass',
      sortable: true,
      cell: (r) => <span className="font-medium text-xs text-blue-700">{r.applyingClass}</span>,
    },
    {
      header: 'Entrance Score',
      accessor: 'testScore',
      sortable: true,
      cell: (r) => (
        <span className="font-semibold text-xs text-slate-800">{r.testScore}</span>
      ),
    },
    {
      header: 'Documents',
      cell: (r) =>
        r.documentsVerified ? (
          <span className="inline-flex items-center text-emerald-700 text-xs font-semibold gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
          </span>
        ) : (
          <span className="text-amber-600 text-xs font-medium">Pending Review</span>
        ),
    },
    {
      header: 'Stage Status',
      accessor: 'stage',
      sortable: true,
      cell: (r) => <StatusBadge status={r.stage} />,
    },
    {
      header: 'Actions',
      cell: (r) => (
        <Button
          variant="default"
          size="sm"
          className="text-xs h-8"
          onClick={() => setSelectedApp(r)}
        >
          Review & Action
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions CRM & Enrollment"
        subtitle={`End-to-end recruitment lifecycle from initial enquiry to counselling, review, offer approval and formal enrollment for AY ${selectedAcademicYear?.name}`}
        actions={
          <Button size="sm" onClick={() => setAddLeadOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Log New Enquiry
          </Button>
        }
      />

      {bannerAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{bannerAlert}</span>
        </div>
      )}

      {/* Admissions Pipeline Visualization */}
      <Card className="border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Admissions Pipeline Flow
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Click any stage to filter records
          </span>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pipeline.map((stage, idx) => {
              const isSelected = activeStageFilter.toUpperCase() === stage.id
              return (
                <button
                  key={stage.id}
                  onClick={() =>
                    setActiveStageFilter(isSelected ? 'all' : stage.id.toLowerCase())
                  }
                  className={`p-3 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{stage.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">{stage.count}</div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {stage.description}
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs: Enquiries / Formal Applications */}
      <Tabs defaultValue="applications" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="applications">
              Formal Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="leads">
              Leads & Enquiries ({leads.length})
            </TabsTrigger>
          </TabsList>
          {activeStageFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600"
              onClick={() => setActiveStageFilter('all')}
            >
              Clear Stage Filter
            </Button>
          )}
        </div>

        <TabsContent value="applications">
          <DataTable
            columns={appColumns}
            data={applications}
            loading={loading}
            searchPlaceholder="Search applicants by name or application #..."
            searchKey="studentName"
          />
        </TabsContent>

        <TabsContent value="leads">
          <DataTable
            columns={leadColumns}
            data={leads}
            loading={loading}
            searchPlaceholder="Search leads by student, parent or enquiry ID..."
            searchKey="studentName"
          />
        </TabsContent>
      </Tabs>

      {/* Log New Enquiry Modal */}
      <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <DialogHeader>
          <DialogTitle>Log Prospective Student Enquiry</DialogTitle>
          <DialogDescription>
            Record student name, parent contact and target academic grade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateLead}>
          <DialogContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Student Name</label>
                <Input
                  value={newLeadForm.studentName}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, studentName: e.target.value })
                  }
                  placeholder="e.g. Rohan Mehra"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Applying For</label>
                <Select
                  value={newLeadForm.applyingFor}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, applyingFor: e.target.value })
                  }
                  className="h-9 text-xs mt-1"
                >
                  <option value="Class 11 (PCM)">Class 11 (PCM)</option>
                  <option value="Class 11 (Commerce)">Class 11 (Commerce)</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 1">Class 1</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Parent / Guardian Name</label>
                <Input
                  value={newLeadForm.parentName}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, parentName: e.target.value })
                  }
                  placeholder="e.g. Sanjay Mehra"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                <Input
                  type="tel"
                  value={newLeadForm.phone}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, phone: e.target.value })
                  }
                  placeholder="+91 98000 00000"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <Input
                type="email"
                value={newLeadForm.email}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, email: e.target.value })
                }
                placeholder="parent@domain.com"
                className="h-9 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Counsellor Brief / Notes</label>
              <textarea
                value={newLeadForm.notes}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, notes: e.target.value })
                }
                rows={3}
                placeholder="Parent queries, transport requirements, curriculum interest..."
                className="w-full text-xs p-2 rounded-md border border-slate-300 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddLeadOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Lead Record
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Application Review & Enrollment Action Drawer/Modal */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Application Review & Approval</DialogTitle>
              <StatusBadge status={selectedApp.stage} />
            </div>
            <DialogDescription>
              {selectedApp.applicationNumber} • {selectedApp.applyingClass}
            </DialogDescription>
          </DialogHeader>

          <DialogContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="text-slate-500">Applicant:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedApp.studentName}</p>
                <p className="text-[11px] text-slate-400">Parent: {selectedApp.parentName}</p>
              </div>
              <div>
                <span className="text-slate-500">Entrance Test & Evaluation:</span>
                <p className="font-bold text-blue-600 text-sm">{selectedApp.testScore}</p>
                <p className="text-[11px] text-slate-600">{selectedApp.interviewResult}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Documents Verification:</span>
                <span className="font-semibold text-emerald-600">
                  {selectedApp.documentsVerified ? 'All Clear (TC, Marksheet, Aadhaar)' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Annual Fee Allotted:</span>
                <span className="font-semibold text-slate-800">{selectedApp.feeAllotted}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Assigned Counsellor:</span>
                <span className="font-semibold text-slate-800">{selectedApp.counsellor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Allocated Section:</span>
                <span className="font-semibold text-blue-700">{selectedApp.allocatedSection}</span>
              </div>
            </div>

            {/* Pipeline Stage Movement Controls */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/80 space-y-2">
              <span className="font-semibold text-blue-900 block">Admissions Lifecycle Workflow</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.stage !== 'Approved' && selectedApp.stage !== 'Enrolled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-white"
                    onClick={() => handleAdvanceStage(selectedApp.id, 'Approved')}
                  >
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Issue Admission Offer
                  </Button>
                )}
                {selectedApp.stage !== 'Enrolled' && (
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleEnrollStudent(selectedApp.id)}
                  >
                    <GraduationCap className="h-3.5 w-3.5 mr-1" /> Finalize Enrollment & Generate Student ID
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>

          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSelectedApp(null)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Enquiry Profile</DialogTitle>
              <StatusBadge status={selectedLead.stage} />
            </div>
            <DialogDescription>
              {selectedLead.leadNumber} • Logged on {selectedLead.createdDate}
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <h4 className="font-bold text-slate-900 text-sm">{selectedLead.studentName}</h4>
              <p className="text-blue-600 font-medium">Interested in: {selectedLead.applyingFor}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <UserCheck className="h-4 w-4 text-slate-400" />
                <span>Parent: <strong>{selectedLead.parentName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{selectedLead.email}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-100 rounded border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Counsellor Observations:</span>
              <p className="text-slate-600 italic leading-relaxed">{selectedLead.notes}</p>
            </div>
          </DialogContent>
          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedLead(null)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  )
}
