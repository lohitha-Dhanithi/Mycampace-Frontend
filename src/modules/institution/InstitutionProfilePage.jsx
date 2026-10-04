// src/modules/institution/InstitutionProfilePage.jsx
import React, { useState, useEffect } from 'react'
import { Building2, Save, CheckCircle2, Globe, Mail, Phone, MapPin, Shield, Upload } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { FormSection } from '@/components/forms/FormSection'
import { FileUpload } from '@/components/forms/FileUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { institutionService } from '@/services/institutionService'
import { useTenantContext } from '@/store/TenantContext'

export function InstitutionProfilePage() {
  const { selectedInstitution, setSelectedInstitution } = useTenantContext()
  const [formData, setFormData] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (selectedInstitution) {
      setFormData({ ...selectedInstitution })
    }
  }, [selectedInstitution])

  if (!formData) return null

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      primaryContact: {
        ...prev.primaryContact,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const updated = await institutionService.updateInstitution(formData.id, formData)
    setSelectedInstitution(updated)
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Profile"
        subtitle="Manage legal registration, regulatory affiliation, headquarters and official communications"
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            ID: {formData.code}
          </span>
        }
        actions={
          <Button
            type="submit"
            form="institution-form"
            size="sm"
            disabled={isSaving}
            className="text-xs"
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile'}
            <Save className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        }
      />

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Institution profile details updated successfully and propagated across campuses.</span>
        </div>
      )}

      <form id="institution-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Core Identity & Logo */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardContent className="p-5 space-y-4">
                <FormSection title="Official Branding" description="Institution crest / emblem">
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <img
                      src={formData.logo}
                      alt={formData.name}
                      className="h-20 w-20 rounded-xl object-contain bg-white p-2 border border-slate-200 shadow-xs mb-3"
                    />
                    <FileUpload
                      hint="Upload PNG/SVG with transparent background"
                      accept=".png,.svg,.jpg"
                      onFileSelected={(file) => {
                        handleChange('logo', URL.createObjectURL(file))
                      }}
                    />
                  </div>
                </FormSection>

                <FormSection title="Regulatory Affiliation">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700">Affiliation & Board</label>
                      <Input
                        value={formData.affiliation || ''}
                        onChange={(e) => handleChange('affiliation', e.target.value)}
                        className="h-9 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700">Registration Number</label>
                      <Input
                        value={formData.registrationNumber || ''}
                        onChange={(e) => handleChange('registrationNumber', e.target.value)}
                        className="h-9 text-xs mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700">Established Year</label>
                      <Input
                        type="number"
                        value={formData.establishedYear || ''}
                        onChange={(e) => handleChange('establishedYear', Number(e.target.value))}
                        className="h-9 text-xs mt-1"
                      />
                    </div>
                  </div>
                </FormSection>
              </CardContent>
            </Card>
          </div>

          {/* Right Two Columns: Institution Data & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200">
              <CardContent className="p-5 space-y-6">
                <FormSection
                  title="Basic Institutional Information"
                  description="General parameters visible on transcripts and government submissions"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Institution Name</label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Institution Type</label>
                      <Select
                        value={formData.type || ''}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="h-9 text-xs mt-1"
                      >
                        <option value="K-12 School">K-12 School</option>
                        <option value="Higher Education / University">Higher Education / University</option>
                        <option value="Polytechnic / Vocational">Polytechnic / Vocational</option>
                        <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Institution Code</label>
                      <Input
                        value={formData.code || ''}
                        onChange={(e) => handleChange('code', e.target.value)}
                        className="h-9 text-xs mt-1 uppercase"
                        required
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Official Communication & Web Presence"
                  description="Primary administrative endpoints for institutional queries"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Official Email</label>
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Phone Hotline</label>
                      <Input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Website URL</label>
                      <Input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="h-9 text-xs mt-1"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Registered Headquarters Location"
                  description="Physical address used on regulatory and legal documentation"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="text-xs font-semibold text-slate-700">Street Address</label>
                      <Input
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">City</label>
                      <Input
                        value={formData.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">State / Province</label>
                      <Input
                        value={formData.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Country</label>
                      <Input
                        value={formData.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Primary Executive Contact"
                  description="Head of Institution / Director designated for accreditation"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Contact Person Name</label>
                      <Input
                        value={formData.primaryContact?.name || ''}
                        onChange={(e) => handleContactChange('name', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Designation</label>
                      <Input
                        value={formData.primaryContact?.designation || ''}
                        onChange={(e) => handleContactChange('designation', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Direct Phone</label>
                      <Input
                        value={formData.primaryContact?.phone || ''}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="h-9 text-xs mt-1"
                        required
                      />
                    </div>
                  </div>
                </FormSection>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
