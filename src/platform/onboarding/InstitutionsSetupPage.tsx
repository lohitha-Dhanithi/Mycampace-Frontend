import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, ArrowRight, Plus, Trash2 } from 'lucide-react'
import { organizationService } from '@/services/organizationService'
import { onboardingService, usePlatformApi } from '@/services/onboardingService'

const INSTITUTION_TYPES = [
  'K-12 School',
  'Higher Education / University',
  'Coaching Institute',
  'Training Institute',
]

const emptyInstitution = {
  name: '',
  type: 'K-12 School',
  affiliation: '',
  registrationNumber: '',
  email: '',
  phone: '',
  city: '',
  state: '',
}

const emptyCampus = {
  institutionId: '',
  name: '',
  code: '',
  address: '',
  city: '',
  state: '',
  headOfCampus: '',
  phone: '',
}

export function InstitutionsSetupPage() {
  const navigate = useNavigate()
  const org = organizationService.getOrganization()
  const [institutions, setInstitutions] = useState(() =>
    organizationService.hasCustomDirectory() ? organizationService.getInstitutions() : [],
  )
  const [campuses, setCampuses] = useState(() =>
    organizationService.hasCustomDirectory() ? organizationService.getCampuses() : [],
  )
  const [institutionForm, setInstitutionForm] = useState({
    ...emptyInstitution,
    city: org.city || '',
    state: org.state || '',
    email: org.primaryContact?.email || '',
  })
  const [campusForm, setCampusForm] = useState({
    ...emptyCampus,
    city: org.city || '',
    state: org.state || '',
  })
  const [error, setError] = useState('')

  const addInstitution = (e) => {
    e.preventDefault()
    setError('')
    const institution = {
      id: `inst-${Date.now()}`,
      organizationId: org.id || 'org-new',
      name: institutionForm.name.trim(),
      code: institutionForm.name
        .trim()
        .split(/\s+/)
        .map((word) => word[0] || '')
        .join('')
        .slice(0, 8)
        .toUpperCase(),
      type: institutionForm.type,
      registrationNumber: institutionForm.registrationNumber.trim(),
      affiliation: institutionForm.affiliation.trim(),
      email: institutionForm.email.trim(),
      phone: institutionForm.phone.trim(),
      address: org.address || '',
      city: institutionForm.city.trim() || org.city || '',
      state: institutionForm.state.trim() || org.state || '',
      country: org.country || 'India',
      pincode: org.postalCode || '',
      primaryContact: org.primaryContact,
      status: 'Active',
    }
    const next = [...institutions, institution]
    setInstitutions(next)
    setCampusForm((current) => ({
      ...current,
      institutionId: current.institutionId || institution.id,
    }))
    setInstitutionForm({
      ...emptyInstitution,
      city: org.city || '',
      state: org.state || '',
      email: org.primaryContact?.email || '',
    })
  }

  const addCampus = (e) => {
    e.preventDefault()
    setError('')
    if (!campusForm.institutionId) {
      setError('Add an institution before adding a campus.')
      return
    }
    const campus = {
      id: `camp-${Date.now()}`,
      institutionId: campusForm.institutionId,
      name: campusForm.name.trim(),
      code: campusForm.code.trim().toUpperCase(),
      type: 'Urban Campus',
      address: campusForm.address.trim(),
      city: campusForm.city.trim(),
      state: campusForm.state.trim() || org.state || '',
      pincode: org.postalCode || '',
      headOfCampus: campusForm.headOfCampus.trim(),
      phone: campusForm.phone.trim(),
      email: org.primaryContact?.email || '',
      status: 'Active',
    }
    setCampuses([...campuses, campus])
    setCampusForm({
      ...emptyCampus,
      institutionId: campusForm.institutionId,
      city: org.city || '',
      state: org.state || '',
    })
  }

  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (institutions.length === 0 || campuses.length === 0) {
      setError('Add at least one institution and one campus to continue.')
      return
    }
    setSaving(true)
    setError('')
    try {
      organizationService.saveInstitutions(institutions)
      organizationService.saveCampuses(campuses)
      if (usePlatformApi()) {
        await onboardingService.saveInstitutions(institutions, campuses)
      }
      navigate('/onboarding/products')
    } catch (err) {
      setError(err.message || 'Could not save institutions and campuses.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              Step 2 of 5: Institutions & Campuses
            </span>
            <span className="text-xs text-slate-500 font-medium">Next: Choose Products</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/5 rounded-full" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/70 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Register institutions and campuses
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              These records appear on Organization → Institutions & Campuses. Add every school or college in {org.name || 'your organization'}, then add at least one campus for each location you operate.
            </p>
          </div>

          <form onSubmit={addInstitution} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Institution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                required
                value={institutionForm.name}
                onChange={(e) => setInstitutionForm({ ...institutionForm, name: e.target.value })}
                placeholder="Institution name *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:col-span-2"
              />
              <select
                value={institutionForm.type}
                onChange={(e) => setInstitutionForm({ ...institutionForm, type: e.target.value })}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {INSTITUTION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                required
                value={institutionForm.affiliation}
                onChange={(e) => setInstitutionForm({ ...institutionForm, affiliation: e.target.value })}
                placeholder="Board / affiliation *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={institutionForm.registrationNumber}
                onChange={(e) => setInstitutionForm({ ...institutionForm, registrationNumber: e.target.value })}
                placeholder="Registration number *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="email"
                required
                value={institutionForm.email}
                onChange={(e) => setInstitutionForm({ ...institutionForm, email: e.target.value })}
                placeholder="Official email *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={institutionForm.phone}
                onChange={(e) => setInstitutionForm({ ...institutionForm, phone: e.target.value })}
                placeholder="Phone *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={institutionForm.city}
                onChange={(e) => setInstitutionForm({ ...institutionForm, city: e.target.value })}
                placeholder="City *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add institution
            </button>
          </form>

          {institutions.length > 0 && (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {institutions.map((inst) => (
                <div key={inst.id} className="p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{inst.name}</p>
                    <p className="text-[11px] text-slate-500">{inst.affiliation} · {inst.registrationNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInstitutions(institutions.filter((item) => item.id !== inst.id))
                      setCampuses(campuses.filter((item) => item.institutionId !== inst.id))
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addCampus} className="space-y-4 pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Campus
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                required
                value={campusForm.institutionId}
                onChange={(e) => setCampusForm({ ...campusForm, institutionId: e.target.value })}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:col-span-2"
              >
                <option value="">Select institution *</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
              <input
                required
                value={campusForm.name}
                onChange={(e) => setCampusForm({ ...campusForm, name: e.target.value })}
                placeholder="Campus name *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={campusForm.code}
                onChange={(e) => setCampusForm({ ...campusForm, code: e.target.value })}
                placeholder="Campus code *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={campusForm.address}
                onChange={(e) => setCampusForm({ ...campusForm, address: e.target.value })}
                placeholder="Street address *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:col-span-2"
              />
              <input
                required
                value={campusForm.city}
                onChange={(e) => setCampusForm({ ...campusForm, city: e.target.value })}
                placeholder="City *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                required
                value={campusForm.headOfCampus}
                onChange={(e) => setCampusForm({ ...campusForm, headOfCampus: e.target.value })}
                placeholder="Head of campus *"
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add campus
            </button>
          </form>

          {campuses.length > 0 && (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {campuses.map((campus) => (
                <div key={campus.id} className="p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{campus.name} · {campus.code}</p>
                    <p className="text-[11px] text-slate-500">{campus.address}, {campus.city}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCampuses(campuses.filter((item) => item.id !== campus.id))}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/onboarding/organization')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="h-12 px-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20"
            >
              <span>Continue to Product Selection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
