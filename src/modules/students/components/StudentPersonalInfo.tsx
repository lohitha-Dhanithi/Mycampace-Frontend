// src/modules/students/components/StudentPersonalInfo.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentPersonalInfo({ student }) {
  const navigate = useNavigate()
  if (!student) return null

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/students/${student.id}/edit`)}
          className="text-xs gap-1.5"
        >
          <Edit className="h-3.5 w-3.5" /> Edit Profile Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Personal Details */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Basic Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">First Name</span>
              <div className="font-bold text-slate-900 mt-0.5">{student.personal?.firstName}</div>
            </div>
            <div>
              <span className="text-slate-400">Middle Name</span>
              <div className="font-bold text-slate-900 mt-0.5">{student.personal?.middleName || '—'}</div>
            </div>
            <div>
              <span className="text-slate-400">Last Name</span>
              <div className="font-bold text-slate-900 mt-0.5">{student.personal?.lastName}</div>
            </div>
            <div>
              <span className="text-slate-400">Preferred Name</span>
              <div className="font-bold text-slate-900 mt-0.5">{student.personal?.preferredName || '—'}</div>
            </div>
            <div>
              <span className="text-slate-400">Date of Birth</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.dob}</div>
            </div>
            <div>
              <span className="text-slate-400">Gender</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.gender}</div>
            </div>
            <div>
              <span className="text-slate-400">Blood Group</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.bloodGroup}</div>
            </div>
            <div>
              <span className="text-slate-400">Nationality</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.nationality}</div>
            </div>
          </CardContent>
        </Card>

        {/* Identification & Compliance */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Identification & Taxonomies</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">National ID / Aadhaar</span>
              <div className="font-mono font-semibold text-slate-800 mt-0.5">
                {student.personal?.aadhaarNumber || 'Verified in Vault'}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Category</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.category || 'General'}</div>
            </div>
            <div>
              <span className="text-slate-400">Religion / Belief</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student.personal?.religion || 'General'}</div>
            </div>
            <div>
              <span className="text-slate-400">Primary Language</span>
              <div className="font-semibold text-slate-800 mt-0.5">English / Hindi</div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Communication Contacts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Primary Mobile</span>
              <span className="font-semibold text-slate-800">{student.contact?.primaryMobile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Alternate Contact</span>
              <span className="font-semibold text-slate-800">{student.contact?.alternateMobile || 'None'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Primary Email</span>
              <span className="font-semibold text-slate-800">{student.contact?.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Institutional Email</span>
              <span className="font-semibold text-slate-800">{student.contact?.alternateEmail || 'campus.student@mycampace.edu.in'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Residential Address */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Permanent & Current Address</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Address Line 1</span>
              <span className="font-semibold text-slate-800 text-right">{student.address?.addressLine1}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Address Line 2</span>
              <span className="font-semibold text-slate-800 text-right">{student.address?.addressLine2 || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">City & State</span>
              <span className="font-semibold text-slate-800">{student.address?.city}, {student.address?.state}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Country & Postal Code</span>
              <span className="font-semibold text-slate-800">{student.address?.country} - {student.address?.postalCode}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
