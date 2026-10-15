// src/modules/admissions/AdmissionsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AdmissionsDashboard } from './components/AdmissionsDashboard'
import { LeadTable } from './components/LeadTable'
import { LeadPipeline } from './components/LeadPipeline'
import { EnquiryTable } from './components/EnquiryTable'
import { CounsellingTable } from './components/CounsellingTable'
import { ApplicationTable } from './components/ApplicationTable'
import { DocumentTable } from './components/DocumentTable'
import { StudentDocumentVerificationWorkspace } from './components/StudentDocumentVerificationWorkspace'
import { FollowUpTable } from './components/FollowUpTable'
import { AdmissionsReports } from './components/AdmissionsReports'
import { AdmissionsFeeTrackingTable } from './components/AdmissionsFeeTrackingTable'
import { Button } from '@/components/ui/button'
import {
  UserPlus,
  FileText,
  Calendar,
  Layers,
  List,
  CheckCircle,
  Plus,
  CreditCard,
  ShieldCheck,
  BarChart3,
  ExternalLink,
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

export function AdmissionsPage({ defaultTab = 'dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  // Determine active view from URL path or prop
  const getTabFromPath = () => {
    const p = location.pathname
    if (p.includes('/admissions/leads')) return 'leads'
    if (p.includes('/admissions/enquiries')) return 'enquiries'
    if (p.includes('/admissions/counselling')) return 'counselling'
    if (p.includes('/admissions/applications')) return 'applications'
    if (p.includes('/admissions/fees') || p.includes('/admissions/fee-collection')) return 'fees'
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
  }, [location.pathname, defaultTab])

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

      {/* 1. ADMISSIONS ANALYTICS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <PageHeader
            title="Admissions Analytics"
            subtitle="Executive overview of student intake metrics, recruitment funnel conversions, and source intelligence."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Funnel
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/admissions/reports')}
                  className="gap-1.5 text-xs h-8 border-slate-200 hover:bg-slate-50"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-slate-500" /> View Detailed Reports
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/app/admissions/applications')}
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                >
                  <FileText className="h-3.5 w-3.5" /> Manage Applications
                </Button>
              </div>
            }
          />
          <AdmissionsDashboard />
        </div>
      )}

      {/* 2. LEADS MANAGEMENT */}
      {activeTab === 'leads' && (
        <div className="space-y-5">
          <PageHeader
            title="Leads Pipeline"
            subtitle="Prospective candidates interested in enrolling for the upcoming academic cycle."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {leads.length} Leads
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <Button
                    size="sm"
                    variant={leadsViewMode === 'table' ? 'default' : 'ghost'}
                    onClick={() => setLeadsViewMode('table')}
                    className="h-7 text-xs px-2.5 gap-1 shadow-none"
                  >
                    <List className="h-3 w-3" /> Table
                  </Button>
                  <Button
                    size="sm"
                    variant={leadsViewMode === 'pipeline' ? 'default' : 'ghost'}
                    onClick={() => setLeadsViewMode('pipeline')}
                    className="h-7 text-xs px-2.5 gap-1 shadow-none"
                  >
                    <Layers className="h-3 w-3" /> Pipeline
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/app/admissions/leads/new')}
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Add New Lead
                </Button>
              </div>
            }
          />

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
        </div>
      )}

      {/* 3. ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-5">
          <PageHeader
            title="Student Enquiries"
            subtitle="Qualified applicant queries ready for academic counseling, campus visits, and formal applications."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                {enquiries.length} Enquiries
              </span>
            }
            actions={
              <Button
                size="sm"
                onClick={() => navigate('/app/admissions/leads/new')}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" /> Log Enquiry
              </Button>
            }
          />

          <EnquiryTable
            enquiries={enquiries}
            loading={loading}
            onScheduleFollowup={handleOpenScheduleFollowUp}
            onConvertToApplication={handleConvertEnquiryToApplication}
          />
        </div>
      )}

      {/* 4. COUNSELLING */}
      {activeTab === 'counselling' && (
        <div className="space-y-5">
          <PageHeader
            title="Counselling Sessions"
            subtitle="Manage 1-on-1 career guidance sessions, campus visit evaluations, and counsellor allocations."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {counselling.length} Sessions
              </span>
            }
            actions={
              <Button
                size="sm"
                onClick={() => navigate('/app/admissions/counselling/new')}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
              >
                <Calendar className="h-3.5 w-3.5" /> Schedule Counselling
              </Button>
            }
          />

          <CounsellingTable
            sessions={counselling}
            loading={loading}
            onCompleteSession={handleCompleteCounselling}
          />
        </div>
      )}

      {/* 5. APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          <PageHeader
            title="Student Applications"
            subtitle="Review formal candidate applications, evaluate verification documents, track fee clearance, and confirm admissions."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {applications.length} Applications
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/admissions/fees')}
                  className="gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs h-8"
                >
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Fee Tracking
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/app/admissions/applications/new')}
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                >
                  <FileText className="h-3.5 w-3.5" /> New Application
                </Button>
              </div>
            }
          />

          <ApplicationTable
            applications={applications}
            loading={loading}
            onConfirmAdmission={handleConfirmAdmission}
            onDataRefresh={loadModuleData}
          />
        </div>
      )}

      {/* 6. FEE CLEARANCE (FINANCE VIEW STATE) */}
      {activeTab === 'fees' && (
        <div className="space-y-5">
          <PageHeader
            title="Candidate Fee Clearance"
            subtitle="Real-time view state of candidate payment clearance and pending dues synchronized from Fee Management."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Finance View State
              </span>
            }
            actions={
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/app/finance/student-fees')}
                className="gap-1.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs h-8"
              >
                <CreditCard className="h-3.5 w-3.5 text-indigo-600" /> Open Fee Management Module
                <ExternalLink className="h-3 w-3 ml-0.5 text-indigo-400" />
              </Button>
            }
          />

          <AdmissionsFeeTrackingTable
            applications={applications}
            loading={loading}
            onDataRefresh={loadModuleData}
          />
        </div>
      )}

      {/* 7. DOCUMENTS & VERIFICATION (STUDENT-SPECIFIC DOSSIER) */}
      {activeTab === 'documents' && (
        <div className="space-y-5">
          <PageHeader
            title="Student Document Verification"
            subtitle="Student-specific credential verification workspace. Audit mandatory certificates, request parent clarifications, and satisfy admission gate conditions."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Student-Specific Dossier
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/admissions/applications')}
                  className="text-xs gap-1.5 h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" /> View All Applications
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/app/admissions/fees')}
                  className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 shadow-xs"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-300" /> Check Fee Clearance
                </Button>
              </div>
            }
          />

          <StudentDocumentVerificationWorkspace
            applications={applications}
            initialSelectedApplicationId={
              new URLSearchParams(location.search).get('appId') ||
              new URLSearchParams(location.search).get('studentId') ||
              undefined
            }
            onDataRefresh={loadModuleData}
          />
        </div>
      )}

      {/* 8. FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="space-y-5">
          <PageHeader
            title="Admissions Follow-ups"
            subtitle="Upcoming, overdue, and completed counselling reminders and prospect communications."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {followUps.length} Scheduled
              </span>
            }
            actions={
              <Button
                size="sm"
                onClick={() => handleOpenScheduleFollowUp(leads[0] || enquiries[0])}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5" /> Schedule Follow-up
              </Button>
            }
          />

          <FollowUpTable
            followUps={followUps}
            loading={loading}
            onCompleteFollowUp={async (id, outcome, notes) => {
              await followUpService.completeFollowUp(id, outcome, notes)
              showToast('Follow-up resolved successfully.')
              loadModuleData()
            }}
          />
        </div>
      )}

      {/* 9. REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          <PageHeader
            title="Admissions Reports & Conversion Intelligence"
            subtitle="Detailed enrollment breakdown by program, counselor performance metrics, and funnel drop-off analysis."
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Analytics
              </span>
            }
            actions={
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/app/admissions')}
                className="text-xs gap-1.5 h-8 border-slate-200 hover:bg-slate-50"
              >
                <BarChart3 className="h-3.5 w-3.5 text-slate-500" /> Back to Live Analytics
              </Button>
            }
          />
          <AdmissionsReports />
        </div>
      )}

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
