// src/modules/admissions/AdmissionsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdmissionsDashboard } from './components/AdmissionsDashboard'
import { LeadTable } from './components/LeadTable'
import { LeadPipeline } from './components/LeadPipeline'
import { EnquiryTable } from './components/EnquiryTable'
import { CounsellingTable } from './components/CounsellingTable'
import { ApplicationTable } from './components/ApplicationTable'
import { DocumentTable } from './components/DocumentTable'
import { FollowUpTable } from './components/FollowUpTable'
import { AdmissionsReports } from './components/AdmissionsReports'
import { Button } from '@/components/ui/button'
import {
  UserPlus,
  FileText,
  Calendar,
  Layers,
  List,
  CheckCircle,
  FileCheck,
  Plus,
} from 'lucide-react'
import { useTenantContext } from '@/store/TenantContext'
import { leadService } from './services/leadService'
import { enquiryService } from './services/enquiryService'
import { counsellingService } from './services/counsellingService'
import { applicationService } from './services/applicationService'
import { documentService } from './services/documentService'
import { followUpService } from './services/followUpService'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function AdmissionsPage({ defaultTab = 'dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  // Determine active tab from url or prop
  const getTabFromPath = () => {
    const p = location.pathname
    if (p.includes('/admissions/leads')) return 'leads'
    if (p.includes('/admissions/enquiries')) return 'enquiries'
    if (p.includes('/admissions/counselling')) return 'counselling'
    if (p.includes('/admissions/applications')) return 'applications'
    if (p.includes('/admissions/documents')) return 'documents'
    if (p.includes('/admissions/follow-ups')) return 'followups'
    if (p.includes('/admissions/reports')) return 'reports'
    return defaultTab || 'dashboard'
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath())
  const [leadsViewMode, setLeadsViewMode] = useState('table') // 'table' or 'pipeline'

  // Data states
  const [leads, setLeads] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [counselling, setCounselling] = useState([])
  const [applications, setApplications] = useState([])
  const [documents, setDocuments] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  // Quick follow-up scheduling dialog
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false)
  const [followUpTarget, setFollowUpTarget] = useState(null)
  const [followUpPurpose, setFollowUpPurpose] = useState('')
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const loadModuleData = async () => {
    setLoading(true)
    try {
      const filters = {
        campusId: selectedCampus?.id,
        academicYearId: selectedAcademicYear?.id,
      }
      const [lds, enqs, couns, apps, docs, fols] = await Promise.all([
        leadService.getLeads(filters),
        enquiryService.getEnquiries(filters),
        counsellingService.getCounsellingSessions(filters),
        applicationService.getApplications(filters),
        documentService.getAllDocuments(),
        followUpService.getFollowUps(),
      ])
      setLeads(lds)
      setEnquiries(enqs)
      setCounselling(couns)
      setApplications(apps)
      setDocuments(docs)
      setFollowUps(fols)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModuleData()
  }, [selectedCampus, selectedAcademicYear])

  useEffect(() => {
    setActiveTab(getTabFromPath())
  }, [location.pathname])

  const handleTabChange = (val) => {
    setActiveTab(val)
    if (val === 'dashboard') navigate('/admissions')
    else if (val === 'leads') navigate('/admissions/leads')
    else if (val === 'enquiries') navigate('/admissions/enquiries')
    else if (val === 'counselling') navigate('/admissions/counselling')
    else if (val === 'applications') navigate('/admissions/applications')
    else if (val === 'documents') navigate('/admissions/documents')
    else if (val === 'followups') navigate('/admissions/follow-ups')
    else if (val === 'reports') navigate('/admissions/reports')
  }

  // Stage advancement in leads pipeline
  const handleStageChange = async (leadId, nextStage) => {
    try {
      await leadService.updateLeadStage(leadId, nextStage)
      showToast(`Lead stage progressed to: ${nextStage}`)
      loadModuleData()
    } catch (err) {
      alert(err.message)
    }
  }

  // Convert lead to enquiry
  const handleConvertToEnquiry = async (leadId) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    const newEnq = await enquiryService.createEnquiry({
      leadId: lead.id,
      applicantName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      campusId: lead.campusId,
      campusName: lead.campusName,
      academicYearId: lead.academicYearId,
      academicYearName: lead.academicYearName,
      programId: lead.programId,
      programName: lead.programName,
      courseId: lead.courseId,
      courseName: lead.courseName,
      counsellorId: lead.counsellorId,
      counsellorName: lead.counsellorName,
      notes: lead.notes,
    })
    await leadService.convertLeadToEnquiry(leadId)
    showToast(`Lead converted to Enquiry ${newEnq.enquiryNumber}`)
    loadModuleData()
  }

  // Convert enquiry to application
  const handleConvertEnquiryToApplication = async (enquiryId) => {
    const enq = enquiries.find((e) => e.id === enquiryId)
    if (!enq) return
    const newApp = await applicationService.createApplication({
      enquiryId: enq.id,
      leadId: enq.leadId,
      personal: {
        firstName: enq.applicantName.split(' ')[0] || '',
        lastName: enq.applicantName.split(' ').slice(1).join(' ') || '',
        dob: '2009-01-01',
        gender: 'Male',
        nationality: 'Indian',
      },
      contact: {
        email: enq.email,
        mobile: enq.phone,
        address: 'Residential Campus Address',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
      },
      academicInterest: {
        campusId: enq.campusId,
        campusName: enq.campusName,
        academicYearId: enq.academicYearId,
        academicYearName: enq.academicYearName,
        programId: enq.programId,
        programName: enq.programName,
        courseId: enq.courseId,
        courseName: enq.courseName,
      },
      previousAcademic: {
        previousInstitution: 'Previous School Board',
        qualification: 'Class 10',
        passingYear: '2026',
        percentage: '90%',
      },
      guardian: {
        name: 'Parent / Guardian',
        relationship: 'Father',
        mobile: enq.phone,
        email: enq.email,
      },
      declaration: {
        confirmed: true,
        applicantSignature: enq.applicantName,
      },
    })
    await enquiryService.convertEnquiryToApplication(enquiryId)
    showToast(`Enquiry transformed to Application ${newApp.applicationNumber}`)
    loadModuleData()
  }

  // Complete counselling
  const handleCompleteCounselling = async (id, outcome, nextAction, notes) => {
    await counsellingService.completeCounselling(id, outcome, nextAction, notes)
    showToast('Counselling outcome recorded successfully.')
    loadModuleData()
  }

  // Document verification
  const handleVerifyDocument = async (id) => {
    await documentService.verifyDocument(id, 'Current Reviewer')
    showToast('Document marked as Verified.')
    loadModuleData()
  }

  const handleRejectDocument = async (id, reason) => {
    await documentService.rejectDocument(id, reason, 'Current Reviewer')
    showToast('Document marked as Rejected.')
    loadModuleData()
  }

  // Confirm admission
  const handleConfirmAdmission = async (app) => {
    await applicationService.convertToAdmission(app.id, {
      admissionNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      rollNumber: `ROLL-${Math.floor(10 + Math.random() * 90)}`,
      section: 'Section A',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionNotes: 'Direct admission approved by the Academic Admissions Board.',
    })
    showToast(`Admission confirmed for ${app.applicantName}`)
    loadModuleData()
  }

  // Quick schedule follow-up trigger
  const handleOpenScheduleFollowUp = (target) => {
    setFollowUpTarget(target)
    setFollowUpPurpose(`Follow up on enquiry/application requirements`)
    setFollowUpModalOpen(true)
  }

  const handleSaveQuickFollowUp = async (e) => {
    e.preventDefault()
    if (!followUpTarget) return
    await followUpService.createFollowUp({
      leadId: followUpTarget.leadId || followUpTarget.id,
      applicantName: followUpTarget.fullName || followUpTarget.applicantName,
      applicantContact: followUpTarget.phone || followUpTarget.applicantContact,
      assignedToId: 'usr-3',
      assignedToName: 'Ananya Sharma',
      followupDate: followUpDate,
      followupTime: '02:00 PM',
      type: 'Call',
      purpose: followUpPurpose,
      reminder: true,
    })
    setFollowUpModalOpen(false)
    showToast('Follow-up scheduled successfully.')
    loadModuleData()
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-5">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Admissions"
        description="Manage enquiries, applications and student admissions from one place."
      />

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
            <TabsTrigger value="dashboard">Admissions</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries ({enquiries.length})</TabsTrigger>
            <TabsTrigger value="counselling">Counselling ({counselling.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups ({followUps.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Contextual actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {activeTab === 'leads' && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200">
                <Button
                  size="sm"
                  variant={leadsViewMode === 'table' ? 'default' : 'ghost'}
                  onClick={() => setLeadsViewMode('table')}
                  className="h-7 text-xs px-2 gap-1"
                >
                  <List className="h-3 w-3" /> Table
                </Button>
                <Button
                  size="sm"
                  variant={leadsViewMode === 'pipeline' ? 'default' : 'ghost'}
                  onClick={() => setLeadsViewMode('pipeline')}
                  className="h-7 text-xs px-2 gap-1"
                >
                  <Layers className="h-3 w-3" /> Pipeline
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 1. DASHBOARD */}
        <TabsContent value="dashboard" className="pt-2">
          <AdmissionsDashboard />
        </TabsContent>

        {/* 2. LEADS */}
        <TabsContent value="leads" className="pt-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Prospective candidates interested in enrolling for the upcoming academic cycle.
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/admissions/leads/new')}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add New Lead
            </Button>
          </div>

          {leadsViewMode === 'table' ? (
            <LeadTable
              leads={leads}
              loading={loading}
              onScheduleFollowup={handleOpenScheduleFollowUp}
              onConvertToEnquiry={handleConvertToEnquiry}
            />
          ) : (
            <LeadPipeline leads={leads} onStageChange={handleStageChange} />
          )}
        </TabsContent>

        {/* 3. ENQUIRIES */}
        <TabsContent value="enquiries" className="pt-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Qualified applicant inquiries ready for academic counseling and formal application.
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/admissions/leads/new')}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Log Enquiry
            </Button>
          </div>

          <EnquiryTable
            enquiries={enquiries}
            loading={loading}
            onScheduleFollowup={handleOpenScheduleFollowUp}
            onConvertToApplication={handleConvertEnquiryToApplication}
          />
        </TabsContent>

        {/* 4. COUNSELLING */}
        <TabsContent value="counselling" className="pt-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Campus visits, video calls and 1-on-1 career counselling sessions.
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/admissions/counselling/new')}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Calendar className="h-3.5 w-3.5" /> Schedule Counselling
            </Button>
          </div>

          <CounsellingTable
            sessions={counselling}
            loading={loading}
            onCompleteSession={handleCompleteCounselling}
          />
        </TabsContent>

        {/* 5. APPLICATIONS */}
        <TabsContent value="applications" className="pt-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Official student applications submitted for review, decision, and admission confirmation.
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/admissions/applications/new')}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <FileText className="h-3.5 w-3.5" /> + Create Application
            </Button>
          </div>

          <ApplicationTable
            applications={applications}
            loading={loading}
            onConfirmAdmission={handleConfirmAdmission}
          />
        </TabsContent>

        {/* 6. DOCUMENTS */}
        <TabsContent value="documents" className="pt-2 space-y-4">
          <div className="text-xs text-slate-500">
            Institutional document repository for identity verification, certificates, and qualification marks.
          </div>
          <DocumentTable
            documents={documents}
            onVerify={handleVerifyDocument}
            onReject={handleRejectDocument}
            allowActions={true}
          />
        </TabsContent>

        {/* 7. FOLLOW-UPS */}
        <TabsContent value="followups" className="pt-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Upcoming, overdue and completed follow-up interactions across the admissions team.
            </div>
            <Button
              size="sm"
              onClick={() => handleOpenScheduleFollowUp(leads[0] || enquiries[0])}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> + Schedule Follow-up
            </Button>
          </div>

          <FollowUpTable
            followUps={followUps}
            loading={loading}
            onCompleteFollowUp={async (id, outcome, notes) => {
              await followUpService.completeFollowUp(id, outcome, notes)
              showToast('Follow-up resolved successfully.')
              loadModuleData()
            }}
          />
        </TabsContent>

        {/* 8. REPORTS */}
        <TabsContent value="reports" className="pt-2">
          <AdmissionsReports />
        </TabsContent>
      </Tabs>

      {/* Quick Follow-up Dialog */}
      <Dialog open={followUpModalOpen} onOpenChange={setFollowUpModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Schedule Follow-up</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveQuickFollowUp} className="space-y-3 text-xs">
            <p className="text-slate-600">
              Schedule follow-up for <strong>{followUpTarget?.fullName || followUpTarget?.applicantName}</strong>.
            </p>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Follow-up Date *</label>
              <Input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Purpose / Objective *</label>
              <Input
                required
                value={followUpPurpose}
                onChange={(e) => setFollowUpPurpose(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setFollowUpModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Follow-up
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
