// src/platform/onboarding/OrganizationSetupPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Globe, MapPin, User, ArrowRight, Check } from 'lucide-react'
import { organizationService } from '@/services/organizationService'

export function OrganizationSetupPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: 'Apex Global Education Foundation',
    type: 'College',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    primaryContactName: 'Dr. Radhakrishnan Murthy',
    primaryContactEmail: 'chancellor@apexeducation.org',
    primaryContactPhone: '+91 98480 12345',
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
    organizationService.updateOrganization({
      name: formData.name,
      type: formData.type,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      primaryContact: {
        name: formData.primaryContactName,
        email: formData.primaryContactEmail,
        phone: formData.primaryContactPhone,
      },
    })
    navigate('/onboarding/products')
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Onboarding Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
              Step 1 of 4: Organization Setup
            </span>
            <span className="text-xs text-slate-400 font-medium">Next: Choose Products</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-1/4 rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tell us about your institution
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Set up your primary institutional entity. You can configure multiple campuses, programs and affiliated schools later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institution / Organization Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Global Academy / Heritage University"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-700 bg-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{type}</span>
                    {formData.type === type && <Check className="h-4 w-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Country *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  State / Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Telangana"
                  className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad"
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Primary Institutional Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Contact Person Name"
                  value={formData.primaryContactName}
                  onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Official Email"
                  value={formData.primaryContactEmail}
                  onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Official Phone"
                  value={formData.primaryContactPhone}
                  onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                  className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="h-12 px-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Continue to Product Selection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
