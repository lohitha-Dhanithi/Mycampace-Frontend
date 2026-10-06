// src/platform/organization/GlobalOrganizationPage.jsx
import React, { useState } from 'react'
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Shield,
  Palette,
  Calendar,
  Layers,
  Check,
  Save,
  ExternalLink,
} from 'lucide-react'
import { organizationService } from '@/services/organizationService'

export function GlobalOrganizationPage() {
  const [org, setOrg] = useState(organizationService.getOrganization())
  const [activeTab, setActiveTab] = useState('profile')
  const [savedMessage, setSavedMessage] = useState('')

  const institutions = organizationService.getInstitutions()
  const campuses = organizationService.getCampuses()

  const handleSave = (e) => {
    e.preventDefault()
    organizationService.updateOrganization(org)
    setSavedMessage('Organization settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
          <Building2 className="h-4 w-4" />
          <span>Platform Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Global Organization Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Centralized institutional identity, campuses, branding, and academic context consumed across all MyCampace products.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'profile', label: 'Organization Profile' },
          { id: 'institutions', label: 'Institutions & Campuses' },
          { id: 'branding', label: 'Branding & Domains' },
          { id: 'academic', label: 'Academic Context' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Organization / Trust Legal Name
              </label>
              <input
                type="text"
                value={org.legalName || org.name}
                onChange={(e) => setOrg({ ...org, legalName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Organization Code
              </label>
              <input
                type="text"
                value={org.code}
                onChange={(e) => setOrg({ ...org, code: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Contact Person
              </label>
              <input
                type="text"
                value={org.primaryContact?.name || ''}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    primaryContact: { ...org.primaryContact, name: e.target.value },
                  })
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Contact Email
              </label>
              <input
                type="email"
                value={org.primaryContact?.email || ''}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    primaryContact: { ...org.primaryContact, email: e.target.value },
                  })
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registered Physical Address
              </label>
              <input
                type="text"
                value={org.address || ''}
                onChange={(e) => setOrg({ ...org, address: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Organization Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Institutions & Campuses */}
      {activeTab === 'institutions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Registered Educational Institutions ({institutions.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <div key={inst.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{inst.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inst.affiliation} • {inst.type} • Affiliation: {inst.registrationNumber}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {inst.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Active Campuses ({campuses.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campuses.map((camp) => (
                <div key={camp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-800">{camp.name}</h4>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {camp.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{camp.address}, {camp.city}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Institutional Subdomain & Domains</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configured domains are automatically recognized across Academics, LMS, and Finance portals.
            </p>
            <div className="space-y-2">
              {org.domains.map((dom, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-mono text-slate-700">{dom}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified SSL
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Custom Subdomain</h3>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                readOnly
                value={org.branding?.customSubdomain || 'apex.mycampace.com'}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-mono w-full"
              />
              <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Academic Context */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Global Academic Session</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set the active academic year that feeds into Admissions, SIS, Timetables, and Fee Billing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Year</label>
                <input
                  type="text"
                  readOnly
                  value="2026-27 (Active Term 1)"
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliated Boards</label>
                <input
                  type="text"
                  readOnly
                  value="CBSE, JNTU / AICTE, Cambridge CAIE"
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
