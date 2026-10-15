// src/modules/admissions/pages/LeadDetailPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LeadProfile } from '../components/LeadProfile'
import { CloseLeadModal } from '../components/CloseLeadModal'
import { ScheduleFollowUpModal } from '../components/ScheduleFollowUpModal'
import { leadService } from '../services/leadService'
import { followUpService } from '../services/followUpService'
import { documentService } from '../services/documentService'
import { applicationService } from '../services/applicationService'
import { LoadingState } from '@/components/common/LoadingState'

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<any>(null)
  const [followups, setFollowups] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)

  const loadLead = async () => {
    if (!id) return
    setLoading(true)
    try {
      const l = await leadService.getLeadById(id)
      if (l) {
        setLead(l)
        const [fols, docs] = await Promise.all([
          followUpService.getFollowUps({ search: l.fullName }),
          documentService.getAllDocuments({ search: l.fullName }),
        ])
        setFollowups(fols)
        setDocuments(docs)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLead()
  }, [id])

  // Convert lead to application
  const handleConvertToApplication = async (targetLead: any) => {
    if (!targetLead) return
    const newApp = await applicationService.createApplication({
      leadId: targetLead.id,
      personal: {
        firstName: targetLead.firstName || targetLead.fullName.split(' ')[0] || '',
        lastName: targetLead.lastName || targetLead.fullName.split(' ').slice(1).join(' ') || '',
        dob: targetLead.dob || '2009-01-01',
        gender: targetLead.gender || 'Male',
        nationality: 'Indian',
      },
      contact: {
        email: targetLead.email,
        mobile: targetLead.phone,
        address: 'Residential Campus Address',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
      },
      academicInterest: {
        campusId: targetLead.campusId || 'camp-1',
        campusName: targetLead.campusName || 'Hyderabad Main Campus',
        academicYearId: targetLead.academicYearId || 'ay-2026',
        academicYearName: targetLead.academicYearName || '2026–27',
        programId: targetLead.programId || 'prog-1',
        programName: targetLead.programName || 'Senior Secondary Education',
        courseId: targetLead.courseId || 'crs-1',
        courseName: targetLead.courseName || 'Science Stream (PCM / PCB)',
      },
      guardian: {
        name: 'Parent / Guardian',
        relationship: 'Father',
        contact: targetLead.phone,
      },
    })
    await leadService.convertLeadToApplication(targetLead.id, newApp.id)
    navigate('/app/admissions/applications', {
      state: {
        conversionNotification: {
          applicationId: newApp.id,
          applicationNumber: newApp.applicationNumber,
          applicantName: targetLead.fullName || `${targetLead.firstName} ${targetLead.lastName}`,
          leadNumber: targetLead.leadNumber,
        },
      },
    })
  }

  // Close lead as lost
  const handleConfirmClose = async (leadId: string, closureData: any) => {
    await leadService.closeLead(leadId, closureData)
    loadLead()
  }

  // Reopen closed lead
  const handleReopenLead = async (targetLead: any) => {
    await leadService.reopenLead(targetLead.id, 'Candidate re-engaged via admissions desk')
    loadLead()
  }

  // Save follow-up
  const handleSaveFollowUp = async (followUpData: any) => {
    await followUpService.createFollowUp(followUpData)
    if (id) {
      await leadService.updateLead(id, {
        nextFollowup: followUpData.followupDate,
      })
    }
    loadLead()
  }

  if (loading) {
    return <LoadingState message="Loading candidate profile..." />
  }

  if (!lead) {
    return (
      <div className="p-8 text-center text-slate-500">
        Lead not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LeadProfile
        lead={lead}
        followups={followups}
        documents={documents}
        onConvertToApplication={handleConvertToApplication}
        onScheduleFollowup={() => setScheduleModalOpen(true)}
        onCloseLead={() => setCloseModalOpen(true)}
        onReopenLead={handleReopenLead}
      />

      {/* Close Lead Modal */}
      <CloseLeadModal
        open={closeModalOpen}
        onOpenChange={setCloseModalOpen}
        lead={lead}
        onConfirmClose={handleConfirmClose}
      />

      {/* Schedule Follow-up Modal */}
      <ScheduleFollowUpModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        targetProspect={lead}
        onSaveFollowUp={handleSaveFollowUp}
      />
    </div>
  )
}
