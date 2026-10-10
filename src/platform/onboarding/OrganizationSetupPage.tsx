// src/platform/onboarding/OrganizationSetupPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Globe, ArrowRight, Check } from 'lucide-react'
import { organizationService } from '@/services/organizationService'
import { useAuth } from '@/store/AuthContext'
import { INDIAN_LOCATIONS, INDIAN_STATES } from '@/platform/onboarding/indianLocations'

const DRAFT_KEY = 'mycampace_onboarding_org_draft'

export function OrganizationSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // Fall through to a blank form for a new organization.
      }
    }
    return {
      name: '',
      legalName: '',
      type: 'School',
      country: 'India',
      state: '',
      city: '',
      address: '',
      postalCode: '',
      taxId: '',
      primaryContactName: user?.name || '',
      primaryContactEmail: user?.email || '',
      primaryContactPhone: '',
      primaryContactDesignation: 'Organization Admin',
    }
  })

  const institutionTypes = [
    'School',
    'College',
    'University',
    'Coaching Institute',
    'Training Institute',
    'Other',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const code = formData.name
      .trim()
      .split(/\s+/)
      .map((word) => word[0] || '')
      .join('')
      .slice(0, 6)
      .toUpperCase() || 'ORG'
    const emailDomain = formData.primaryContactEmail.split('@')[1]
    organizationService.updateOrganization({
      name: formData.name.trim(),
      legalName: formData.legalName.trim(),
      type: formData.type,
      code,
      country: formData.country.trim(),
      state: formData.state.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      taxId: formData.taxId.trim(),
      ...(emailDomain ? { domains: [emailDomain] } : {}),
      branding: {
        primaryColor: '#2563eb',
        accentColor: '#4f46e5',
        themeMode: 'light',
        customSubdomain: `${code.toLowerCase()}.mycampace.com`,
      },
      primaryContact: {
        name: formData.primaryContactName.trim(),
        email: formData.primaryContactEmail.trim(),
        phone: formData.primaryContactPhone.trim(),
        designation: 'Organization Admin',
      },
    })
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    navigate('/onboarding/institutions')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Onboarding Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Step 1 of 5: Organization Setup
            </span>
            <span className="text-xs text-slate-500 font-medium">Next: Institutions & Campuses</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-1/5 rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tell us about your institution
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the legal organization that will own this workspace. Institutions and campuses are collected on the next step.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Institution / Organization Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heritage Education Trust"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Legal / Trust Name *
              </label>
              <input
                type="text"
                required
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Registered legal name"
                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Institution Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {institutionTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`h-11 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span>{type}</span>
                    {formData.type === type && <Check className="h-4 w-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Country *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State / Province *
                </label>
                <select
                  required
                  value={INDIAN_STATES.includes(formData.state) ? formData.state : ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City *
                </label>
                <select
                  required
                  value={(INDIAN_LOCATIONS[formData.state] || []).includes(formData.city) ? formData.city : ''}
                  disabled={!formData.state}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">{formData.state ? 'Select city' : 'Select a state first'}</option>
                  {(INDIAN_LOCATIONS[formData.state] || []).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registered Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street, area, landmark"
                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="500032"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">GST / Tax ID *</label>
                <input
                  type="text"
                  required
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="GSTIN"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Primary Institutional Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Contact Person Name *"
                  value={formData.primaryContactName}
                  onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Official Email *"
                  value={formData.primaryContactEmail}
                  onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Official Phone *"
                  value={formData.primaryContactPhone}
                  onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <input
                  type="text"
                  readOnly
                  aria-readonly="true"
                  value="Organization Admin"
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 sm:col-span-3 cursor-default focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="h-12 px-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                <span>Continue to Institutions</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
