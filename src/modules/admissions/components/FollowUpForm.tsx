// src/modules/admissions/components/FollowUpForm.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { userService } from '@/services/userService'
import { leadService } from '../services/leadService'
import { enquiryService } from '../services/enquiryService'
import { FOLLOWUP_TYPES } from '../config/admissionStatusConfig'
import { ArrowLeft, Calendar, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function FollowUpForm({ initialApplicant = null, onSubmit }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [candidates, setCandidates] = useState([])
  const [selectedCandidateId, setSelectedCandidateId] = useState('')

  const [formData, setFormData] = useState({
    leadId: initialApplicant?.id || '',
    applicantName: initialApplicant?.fullName || initialApplicant?.name || '',
    applicantContact: initialApplicant?.phone || '',
    assignedToId: '',
    assignedToName: '',
    followupDate: new Date().toISOString().split('T')[0],
    followupTime: '03:00 PM',
    type: 'Call',
    purpose: '',
    notes: '',
    reminder: true,
  })

  useEffect(() => {
    const loadResources = async () => {
      const [userList, leads, enquiries] = await Promise.all([
        userService.getUsers({ status: 'Active' }),
        leadService.getLeads(),
        enquiryService.getEnquiries(),
      ])

      setUsers(userList)

      const merged = [
        ...leads.map((l) => ({ id: l.id, name: l.fullName, phone: l.phone, type: 'Lead' })),
        ...enquiries.map((e) => ({ id: e.id, name: e.applicantName, phone: e.phone, type: 'Enquiry' })),
      ]
      setCandidates(merged)

      const defaultCandidate = initialApplicant || merged[0]
      if (defaultCandidate) {
        setSelectedCandidateId(defaultCandidate.id)
        setFormData((prev) => ({
          ...prev,
          leadId: defaultCandidate.id,
          applicantName: defaultCandidate.fullName || defaultCandidate.name,
          applicantContact: defaultCandidate.phone,
          assignedToId: userList[0]?.id || '',
          assignedToName: userList[0]?.name || '',
        }))
      }
    }
    loadResources()
  }, [initialApplicant])

  const handleCandidateChange = (id) => {
    setSelectedCandidateId(id)
    const cand = candidates.find((c) => c.id === id)
    if (cand) {
      setFormData((prev) => ({
        ...prev,
        leadId: cand.id,
        applicantName: cand.name,
        applicantContact: cand.phone,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/admissions/follow-ups')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Follow-ups
        </Button>
        <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Save className="h-3.5 w-3.5" /> Save Follow-up
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">Schedule Applicant Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Select Applicant *</label>
            <Select
              value={selectedCandidateId}
              onChange={(e) => handleCandidateChange(e.target.value)}
            >
              {candidates.map((c, i) => (
                <option key={`${c.id}-${i}`} value={c.id}>
                  [{c.type}] {c.name} — {c.phone}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Assigned Staff User *</label>
              <Select
                value={formData.assignedToId}
                onChange={(e) => {
                  const u = users.find((usr) => usr.id === e.target.value)
                  setFormData({
                    ...formData,
                    assignedToId: e.target.value,
                    assignedToName: u?.name || '',
                  })
                }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Follow-up Channel / Type *</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {FOLLOWUP_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Date *</label>
              <Input
                type="date"
                required
                value={formData.followupDate}
                onChange={(e) => setFormData({ ...formData, followupDate: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Time *</label>
              <Input
                type="text"
                required
                value={formData.followupTime}
                onChange={(e) => setFormData({ ...formData, followupTime: e.target.value })}
                placeholder="e.g. 02:30 PM"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Purpose of Follow-up *</label>
            <Input
              required
              placeholder="e.g. Inquire about submission of Class 10 term mark sheet"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Background Notes</label>
            <Textarea
              rows={3}
              placeholder="Any specific talking points, parental preferences or fee considerations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remCheck"
              checked={formData.reminder}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, reminder: !!checked })
              }
            />
            <label htmlFor="remCheck" className="font-medium text-slate-700 cursor-pointer">
              Send automatic notification reminder 1 hour prior to schedule
            </label>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
