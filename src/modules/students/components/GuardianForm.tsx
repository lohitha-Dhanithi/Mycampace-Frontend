// src/modules/students/components/GuardianForm.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function GuardianForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    relationship: initialData?.relationship || 'Father',
    mobile: initialData?.mobile || '',
    alternateMobile: initialData?.alternateMobile || '',
    email: initialData?.email || '',
    occupation: initialData?.occupation || '',
    address: initialData?.address || '',
    isPrimary: initialData?.isPrimary || false,
    isEmergencyContact: initialData?.isEmergencyContact ?? true,
    portalAccess: initialData?.portalAccess ?? true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1 sm:col-span-2">
          <label className="font-semibold text-slate-700">Full Name *</label>
          <Input
            required
            placeholder="e.g. Rajesh Patel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Relationship *</label>
          <Select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          >
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Legal Guardian">Legal Guardian</option>
            <option value="Grandparent">Grandparent</option>
            <option value="Sibling">Adult Sibling</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Mobile Phone *</label>
          <Input
            required
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Alternate Phone</label>
          <Input
            type="tel"
            value={formData.alternateMobile}
            onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="font-semibold text-slate-700">Occupation / Employer</label>
          <Input
            placeholder="e.g. Director, Patel Agro Tech"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="font-semibold text-slate-700">Residential Address</label>
          <Input
            placeholder="Address (leave blank if same as student residence)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPrim"
            checked={formData.isPrimary}
            onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: !!checked })}
          />
          <label htmlFor="isPrim" className="font-medium text-slate-800 cursor-pointer">
            Set as Primary Guardian (Official Billing & Academic Communication Contact)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isEmerg"
            checked={formData.isEmergencyContact}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isEmergencyContact: !!checked })
            }
          />
          <label htmlFor="isEmerg" className="font-medium text-slate-800 cursor-pointer">
            Emergency Contact (Contact in case of medical or campus urgency)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPortal"
            checked={formData.portalAccess}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, portalAccess: !!checked })
            }
          />
          <label htmlFor="isPortal" className="font-medium text-slate-800 cursor-pointer">
            Enable Parent Portal Account Access
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Guardian Details
        </Button>
      </div>
    </form>
  )
}
