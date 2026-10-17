// src/platform/onboarding/InstitutionsSetupPage.tsx
// Step 2 of 5: institutions and their campuses (POST /onboarding/institutions).
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, MapPin, Pencil, Plus, Trash2, X } from 'lucide-react'
import { organizationService } from '@/services/organizationService'
import { onboardingService, usePlatformApi } from '@/services/onboardingService'
import { useAuth } from '@/store/AuthContext'
import { FormAlert, FormField, fieldInputClass } from '@/platform/FormField'
import {
  describeApiError,
  focusFirstError,
  hasErrors,
  validateCode,
  validateEmail,
  validateIndianPhone,
  validatePersonName,
  validateRequiredText,
  type FieldErrors,
} from '@/platform/validation'
import {
  OnboardingProgress,
  PrimaryButton,
  StepLoading,
  useOnboardingReturnTo,
  useRefreshProfile,
  useSavedApplication,
} from './OnboardingChrome'

const INSTITUTION_TYPES = ['K-12 School', 'Higher Education / University', 'Coaching Institute', 'Training Institute']

interface InstitutionForm {
  name: string
  type: string
  affiliation: string
  registrationNumber: string
  email: string
  phone: string
  city: string
  state: string
}
type InstitutionField = keyof InstitutionForm

interface CampusForm {
  institutionId: string
  name: string
  code: string
  address: string
  city: string
  state: string
  headOfCampus: string
  phone: string
}
type CampusField = keyof CampusForm

const emptyInstitution: InstitutionForm = {
  name: '',
  type: 'K-12 School',
  affiliation: '',
  registrationNumber: '',
  email: '',
  phone: '',
  city: '',
  state: '',
}

const emptyCampus: CampusForm = {
  institutionId: '',
  name: '',
  code: '',
  address: '',
  city: '',
  state: '',
  headOfCampus: '',
  phone: '',
}

const sameText = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Initials of the name, made unique among existing codes: campuses are linked to institutions by this code. */
function uniqueInstitutionCode(name: string, taken: string[]) {
  const base =
    name
      .trim()
      .split(/\s+/)
      .map((word) => word.replace(/[^A-Za-z0-9]/g, '')[0] || '')
      .join('')
      .slice(0, 8)
      .toUpperCase() || 'INST'
  const used = new Set(taken.map((c) => c.toUpperCase()))
  if (!used.has(base)) return base
  let n = 2
  while (used.has(`${base}${n}`)) n++
  return `${base}${n}`
}

export function InstitutionsSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const platform = usePlatformApi()
  const refreshProfile = useRefreshProfile()
  const { returnTo, editingFromReview } = useOnboardingReturnTo()
  const saved = useSavedApplication(platform)
  // Platform mode: the browser's demo directory may belong to someone else, so only the server copy is used.
  const org = platform ? null : organizationService.getOrganization()

  const [institutions, setInstitutions] = useState<any[]>(() =>
    !platform && organizationService.hasCustomDirectory() ? organizationService.getInstitutions() : [],
  )
  const [campuses, setCampuses] = useState<any[]>(() =>
    !platform && organizationService.hasCustomDirectory() ? organizationService.getCampuses() : [],
  )
  const defaults = {
    city: org?.city || '',
    state: org?.state || '',
    email: org?.primaryContact?.email || '',
  }
  const [institutionForm, setInstitutionForm] = useState<InstitutionForm>({ ...emptyInstitution, ...defaults })
  const [campusForm, setCampusForm] = useState<CampusForm>({ ...emptyCampus, city: defaults.city, state: defaults.state })
  const [instTouched, setInstTouched] = useState<Partial<Record<InstitutionField, boolean>>>({})
  const [instSubmitted, setInstSubmitted] = useState(false)
  const [campusTouched, setCampusTouched] = useState<Partial<Record<CampusField, boolean>>>({})
  const [campusSubmitted, setCampusSubmitted] = useState(false)
  const [editingInstitutionId, setEditingInstitutionId] = useState<string | null>(null)
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inFlight = useRef(false)

  // Prefill from what the server already holds for this organization.
  useEffect(() => {
    const pack = saved.data
    if (!pack) return
    const serverOrg = pack.organization
    const orgDefaults = {
      city: serverOrg.city && serverOrg.city !== 'TBD' ? serverOrg.city : '',
      state: serverOrg.state && serverOrg.state !== 'TBD' ? serverOrg.state : '',
      email: serverOrg.primaryContact?.email || user?.email || '',
    }
    setInstitutionForm((f) => ({ ...f, city: f.city || orgDefaults.city, state: f.state || orgDefaults.state, email: f.email || orgDefaults.email }))
    setCampusForm((f) => ({ ...f, city: f.city || orgDefaults.city, state: f.state || orgDefaults.state }))
    if (!pack.institutions.length) return
    setInstitutions(
      pack.institutions.map((inst) => ({
        id: inst.id,
        name: inst.name,
        code: inst.code,
        type: inst.type,
        affiliation: inst.affiliation || '',
        registrationNumber: '',
        email: inst.email || '',
        phone: inst.phone || '',
        city: orgDefaults.city,
        state: orgDefaults.state,
        country: serverOrg.country || 'India',
        status: 'Active',
      })),
    )
    setCampuses(
      pack.institutions.flatMap((inst) =>
        inst.campuses.map((c) => ({
          id: c.id,
          institutionId: inst.id,
          name: c.name,
          code: c.code,
          type: 'Urban Campus',
          address: c.address || '',
          city: c.city,
          state: orgDefaults.state,
          headOfCampus: '',
          status: 'Active',
        })),
      ),
    )
    setCampusForm((f) => ({ ...f, institutionId: f.institutionId || pack.institutions[0].id }))
  }, [saved.data]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Institution form ----------------------------------------------------------------------
  const instErrors: FieldErrors<InstitutionField> = {
    name:
      validateRequiredText(institutionForm.name, 'Institution name', { min: 3, max: 150 }) ||
      (institutions.some((i) => i.id !== editingInstitutionId && sameText(i.name, institutionForm.name))
        ? 'This institution has already been added.'
        : ''),
    type: INSTITUTION_TYPES.includes(institutionForm.type) ? '' : 'Select an institution type.',
    affiliation: validateRequiredText(institutionForm.affiliation, 'Board / affiliation', { min: 2, max: 100 }),
    registrationNumber:
      validateRequiredText(institutionForm.registrationNumber, 'Registration number', { min: 3, max: 50 }) ||
      (/^[A-Za-z0-9][A-Za-z0-9/ .-]*$/.test(institutionForm.registrationNumber.trim())
        ? ''
        : 'Registration number can only contain letters, numbers, spaces, / . and -.'),
    email: validateEmail(institutionForm.email, 'Official email'),
    phone: validateIndianPhone(institutionForm.phone),
    city: validateRequiredText(institutionForm.city, 'City', { min: 2, max: 60 }),
  }
  const instShown = (f: InstitutionField) => (instSubmitted || instTouched[f] ? instErrors[f] : '')
  const instTouch = (f: InstitutionField) => () => setInstTouched((t) => (t[f] ? t : { ...t, [f]: true }))
  const setInst = (patch: Partial<InstitutionForm>) => setInstitutionForm((f) => ({ ...f, ...patch }))

  const resetInstitutionForm = () => {
    setInstitutionForm((f) => ({ ...emptyInstitution, city: f.city, state: f.state, email: f.email }))
    setEditingInstitutionId(null)
    setInstSubmitted(false)
    setInstTouched({})
  }

  const startEditInstitution = (inst: (typeof institutions)[number]) => {
    setEditingCampusId(null)
    setCampusForm((f) => ({ ...emptyCampus, institutionId: f.institutionId, city: f.city, state: f.state }))
    setCampusSubmitted(false)
    setCampusTouched({})
    setEditingInstitutionId(inst.id)
    setInstitutionForm({
      name: inst.name,
      type: inst.type,
      affiliation: inst.affiliation || '',
      registrationNumber: inst.registrationNumber || '',
      email: inst.email || '',
      phone: inst.phone || '',
      city: inst.city || '',
      state: inst.state || '',
    })
    setInstSubmitted(false)
    setInstTouched({})
    document.getElementById('inst-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    requestAnimationFrame(() => document.getElementById('inst-name')?.focus())
  }

  const addInstitution = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInstSubmitted(true)
    if (hasErrors(instErrors)) {
      focusFirstError(instErrors, (f) => `inst-${f}`)
      return
    }
    const payload = {
      name: institutionForm.name.trim(),
      type: institutionForm.type,
      registrationNumber: institutionForm.registrationNumber.trim(),
      affiliation: institutionForm.affiliation.trim(),
      email: institutionForm.email.trim().toLowerCase(),
      phone: institutionForm.phone.trim(),
      address: org?.address || '',
      city: institutionForm.city.trim(),
      state: institutionForm.state.trim() || defaults.state,
      country: org?.country || 'India',
      pincode: org?.postalCode || '',
      primaryContact: org?.primaryContact,
      status: 'Active',
    }

    if (editingInstitutionId) {
      setInstitutions((list) =>
        list.map((item) => (item.id === editingInstitutionId ? { ...item, ...payload } : item)),
      )
      resetInstitutionForm()
      return
    }

    const institution = {
      id: `inst-${Date.now()}`,
      organizationId: org?.id || 'org-new',
      code: uniqueInstitutionCode(institutionForm.name, institutions.map((i) => i.code)),
      ...payload,
    }
    setInstitutions((list) => [...list, institution])
    setCampusForm((current) => ({ ...current, institutionId: current.institutionId || institution.id }))
    resetInstitutionForm()
  }

  // ---- Campus form ---------------------------------------------------------------------------
  const campusErrors: FieldErrors<CampusField> = {
    institutionId: institutions.some((i) => i.id === campusForm.institutionId) ? '' : 'Select the institution this campus belongs to.',
    name:
      validateRequiredText(campusForm.name, 'Campus name', { min: 2, max: 150 }) ||
      (campuses.some(
        (c) =>
          c.institutionId === campusForm.institutionId &&
          c.id !== editingCampusId &&
          sameText(c.name, campusForm.name),
      )
        ? 'This institution already has a campus with this name.'
        : ''),
    code:
      validateCode(campusForm.code, 'Campus code') ||
      (campuses.some((c) => c.id !== editingCampusId && sameText(c.code, campusForm.code))
        ? 'This campus code is already in use. Codes must be unique.'
        : ''),
    address: validateRequiredText(campusForm.address, 'Street address', { min: 5, max: 250 }),
    city: validateRequiredText(campusForm.city, 'City', { min: 2, max: 60 }),
    headOfCampus: validatePersonName(campusForm.headOfCampus, 'Head of campus'),
  }
  const campusShown = (f: CampusField) => (campusSubmitted || campusTouched[f] ? campusErrors[f] : '')
  const campusTouch = (f: CampusField) => () => setCampusTouched((t) => (t[f] ? t : { ...t, [f]: true }))
  const setCampus = (patch: Partial<CampusForm>) => setCampusForm((f) => ({ ...f, ...patch }))

  const resetCampusForm = () => {
    setCampusForm((f) => ({ ...emptyCampus, institutionId: f.institutionId, city: f.city, state: f.state }))
    setEditingCampusId(null)
    setCampusSubmitted(false)
    setCampusTouched({})
  }

  const startEditCampus = (campus: (typeof campuses)[number]) => {
    setEditingInstitutionId(null)
    setInstitutionForm((f) => ({ ...emptyInstitution, city: f.city, state: f.state, email: f.email }))
    setInstSubmitted(false)
    setInstTouched({})
    setEditingCampusId(campus.id)
    setCampusForm({
      institutionId: campus.institutionId,
      name: campus.name,
      code: campus.code,
      address: campus.address || '',
      city: campus.city || '',
      state: campus.state || '',
      headOfCampus: campus.headOfCampus || '',
      phone: campus.phone || '',
    })
    setCampusSubmitted(false)
    setCampusTouched({})
    document.getElementById('campus-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    requestAnimationFrame(() => document.getElementById('campus-name')?.focus())
  }

  const addCampus = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCampusSubmitted(true)
    if (hasErrors(campusErrors)) {
      focusFirstError(campusErrors, (f) => `campus-${f}`)
      return
    }
    const payload = {
      institutionId: campusForm.institutionId,
      name: campusForm.name.trim(),
      code: campusForm.code.trim().toUpperCase(),
      type: 'Urban Campus',
      address: campusForm.address.trim(),
      city: campusForm.city.trim(),
      state: campusForm.state.trim() || defaults.state,
      pincode: org?.postalCode || '',
      headOfCampus: campusForm.headOfCampus.trim(),
      phone: campusForm.phone.trim(),
      email: org?.primaryContact?.email || '',
      status: 'Active',
    }

    if (editingCampusId) {
      setCampuses((list) => list.map((item) => (item.id === editingCampusId ? { ...item, ...payload } : item)))
      resetCampusForm()
      return
    }

    const campus = {
      id: `camp-${Date.now()}`,
      ...payload,
    }
    setCampuses((list) => [...list, campus])
    resetCampusForm()
  }

  const removeInstitution = (id: string) => {
    const remaining = institutions.filter((item) => item.id !== id)
    setInstitutions(remaining)
    setCampuses((list) => list.filter((item) => item.institutionId !== id))
    setCampusForm((f) => (f.institutionId === id ? { ...f, institutionId: remaining[0]?.id || '' } : f))
    if (editingInstitutionId === id) resetInstitutionForm()
    if (editingCampusId && !remaining.some((i) => i.id === campusForm.institutionId)) resetCampusForm()
  }

  // ---- Continue ------------------------------------------------------------------------------
  const handleContinue = async () => {
    if (inFlight.current) return
    setError('')
    if (institutions.length === 0) {
      setError('Add at least one institution to continue.')
      document.getElementById('inst-name')?.focus()
      return
    }
    const withoutCampus = institutions.filter((i) => !campuses.some((c) => c.institutionId === i.id))
    if (withoutCampus.length) {
      setError(`Add at least one campus for: ${withoutCampus.map((i) => i.name).join(', ')}.`)
      document.getElementById('campus-name')?.focus()
      return
    }
    if (
      institutionForm.name.trim() ||
      campusForm.name.trim() ||
      campusForm.code.trim() ||
      editingInstitutionId ||
      editingCampusId
    ) {
      setError(
        editingInstitutionId || editingCampusId
          ? 'Save or cancel your edit before continuing.'
          : 'You have details typed in a form that were not added yet. Click “Add institution” / “Add campus”, or clear the fields.',
      )
      return
    }

    inFlight.current = true
    setSaving(true)
    try {
      if (platform) {
        await onboardingService.saveInstitutions(institutions, campuses)
        await refreshProfile()
      } else {
        organizationService.saveInstitutions(institutions)
        organizationService.saveCampuses(campuses)
      }
      navigate(returnTo ?? '/onboarding/products', { replace: !!returnTo })
    } catch (err) {
      setError(describeApiError(err, 'Could not save institutions and campuses. Please try again.'))
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }

  const orgName = saved.data?.organization.name || org?.name || 'your organization'

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <OnboardingProgress step={2} title="Institutions & Campuses" next="Choose Products" />

        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-xl shadow-slate-200/70 sm:p-10">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Register institutions and campuses</h1>
            <p className="mt-2 text-sm text-slate-500">
              Add every school or college in {orgName}, then add at least one campus for each institution. Fields marked{' '}
              <span className="text-rose-600">*</span> are required.
            </p>
            {editingFromReview && (
              <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                You are editing from review. Continue saves your changes and returns to the application summary.
              </p>
            )}
          </div>

          {saved.loading ? (
            <StepLoading label="Loading your saved institutions…" />
          ) : (
            <>
              {/* Institution */}
              <form onSubmit={addInstitution} noValidate className="space-y-4" aria-labelledby="inst-heading">
                <h2 id="inst-heading" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {editingInstitutionId ? 'Edit institution' : 'Add an institution'}
                  {editingInstitutionId && (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-blue-700">
                      Editing
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField id="inst-name" label="Institution name" required error={instShown('name')} className="sm:col-span-2">
                    {(control) => (
                      <input
                        {...control}
                        maxLength={150}
                        value={institutionForm.name}
                        onChange={(e) => setInst({ name: e.target.value })}
                        onBlur={instTouch('name')}
                        placeholder="e.g. Heritage Public School"
                        className={fieldInputClass(!!instShown('name'))}
                      />
                    )}
                  </FormField>
                  <FormField id="inst-type" label="Institution type" required error={instShown('type')}>
                    {(control) => (
                      <select
                        {...control}
                        value={institutionForm.type}
                        onChange={(e) => setInst({ type: e.target.value })}
                        className={fieldInputClass(!!instShown('type'))}
                      >
                        {INSTITUTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  </FormField>
                  <FormField id="inst-affiliation" label="Board / affiliation" required error={instShown('affiliation')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={100}
                        value={institutionForm.affiliation}
                        onChange={(e) => setInst({ affiliation: e.target.value })}
                        onBlur={instTouch('affiliation')}
                        placeholder="e.g. CBSE, ICSE, State Board, UGC"
                        className={fieldInputClass(!!instShown('affiliation'))}
                      />
                    )}
                  </FormField>
                  <FormField id="inst-registrationNumber" label="Registration number" required error={instShown('registrationNumber')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={50}
                        value={institutionForm.registrationNumber}
                        onChange={(e) => setInst({ registrationNumber: e.target.value })}
                        onBlur={instTouch('registrationNumber')}
                        placeholder="e.g. 1130245"
                        className={fieldInputClass(!!instShown('registrationNumber'))}
                      />
                    )}
                  </FormField>
                  <FormField id="inst-email" label="Official email" required error={instShown('email')}>
                    {(control) => (
                      <input
                        {...control}
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={254}
                        value={institutionForm.email}
                        onChange={(e) => setInst({ email: e.target.value })}
                        onBlur={instTouch('email')}
                        placeholder="office@school.edu.in"
                        className={fieldInputClass(!!instShown('email'))}
                      />
                    )}
                  </FormField>
                  <FormField id="inst-phone" label="Phone number" required error={instShown('phone')}>
                    {(control) => (
                      <input
                        {...control}
                        type="tel"
                        inputMode="tel"
                        maxLength={16}
                        value={institutionForm.phone}
                        onChange={(e) => setInst({ phone: e.target.value })}
                        onBlur={instTouch('phone')}
                        placeholder="e.g. 040 2345 6789"
                        className={fieldInputClass(!!instShown('phone'))}
                      />
                    )}
                  </FormField>
                  <FormField id="inst-city" label="City" required error={instShown('city')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={60}
                        value={institutionForm.city}
                        onChange={(e) => setInst({ city: e.target.value })}
                        onBlur={instTouch('city')}
                        placeholder="e.g. Hyderabad"
                        className={fieldInputClass(!!instShown('city'))}
                      />
                    )}
                  </FormField>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {editingInstitutionId ? (
                      <>
                        <Pencil className="h-4 w-4" aria-hidden="true" /> Save changes
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" aria-hidden="true" /> Add institution
                      </>
                    )}
                  </button>
                  {editingInstitutionId && (
                    <button
                      type="button"
                      onClick={resetInstitutionForm}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <X className="h-4 w-4" aria-hidden="true" /> Cancel
                    </button>
                  )}
                </div>
              </form>

              {institutions.length > 0 && (
                <ul aria-label="Added institutions" className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {institutions.map((inst) => {
                    const count = campuses.filter((c) => c.institutionId === inst.id).length
                    return (
                      <li key={inst.id} className="flex items-center justify-between gap-3 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {inst.name} <span className="font-mono text-[11px] font-normal text-slate-400">· {inst.code}</span>
                          </p>
                          <p className="truncate text-[11px] text-slate-500">
                            {[inst.type, inst.affiliation, inst.registrationNumber].filter(Boolean).join(' · ')}
                          </p>
                          <p className={`text-[11px] font-medium ${count ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {count ? `${count} campus${count === 1 ? '' : 'es'}` : 'No campus yet — add one below'}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => startEditInstitution(inst)}
                            aria-label={`Edit ${inst.name}`}
                            aria-pressed={editingInstitutionId === inst.id}
                            className={`rounded-lg p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              editingInstitutionId === inst.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeInstitution(inst.id)}
                            aria-label={`Remove ${inst.name}`}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Campus */}
              <form onSubmit={addCampus} noValidate className="space-y-4 border-t border-slate-200 pt-6" aria-labelledby="campus-heading">
                <h2 id="campus-heading" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {editingCampusId ? 'Edit campus' : 'Add a campus'}
                  {editingCampusId && (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-blue-700">
                      Editing
                    </span>
                  )}
                </h2>
                {institutions.length === 0 && <p className="text-xs text-slate-500">Add an institution first, then add its campuses here.</p>}
                <fieldset disabled={institutions.length === 0} className="grid grid-cols-1 gap-4 disabled:opacity-60 sm:grid-cols-2">
                  <FormField id="campus-institutionId" label="Institution" required error={campusShown('institutionId')} className="sm:col-span-2">
                    {(control) => (
                      <select
                        {...control}
                        value={campusForm.institutionId}
                        onChange={(e) => setCampus({ institutionId: e.target.value })}
                        onBlur={campusTouch('institutionId')}
                        className={fieldInputClass(!!campusShown('institutionId'))}
                      >
                        <option value="">Select institution</option>
                        {institutions.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </FormField>
                  <FormField id="campus-name" label="Campus name" required error={campusShown('name')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={150}
                        value={campusForm.name}
                        onChange={(e) => setCampus({ name: e.target.value })}
                        onBlur={campusTouch('name')}
                        placeholder="e.g. Main Campus"
                        className={fieldInputClass(!!campusShown('name'))}
                      />
                    )}
                  </FormField>
                  <FormField
                    id="campus-code"
                    label="Campus code"
                    required
                    hint="Short unique code, e.g. HPS-MAIN (letters, numbers, hyphens)."
                    error={campusShown('code')}
                  >
                    {(control) => (
                      <input
                        {...control}
                        maxLength={20}
                        autoCapitalize="characters"
                        spellCheck={false}
                        value={campusForm.code}
                        onChange={(e) => setCampus({ code: e.target.value.toUpperCase().replace(/\s+/g, '-') })}
                        onBlur={campusTouch('code')}
                        placeholder="e.g. HPS-MAIN"
                        className={fieldInputClass(!!campusShown('code'), 'font-mono')}
                      />
                    )}
                  </FormField>
                  <FormField id="campus-address" label="Street address" required error={campusShown('address')} className="sm:col-span-2">
                    {(control) => (
                      <input
                        {...control}
                        maxLength={250}
                        value={campusForm.address}
                        onChange={(e) => setCampus({ address: e.target.value })}
                        onBlur={campusTouch('address')}
                        placeholder="Building, street, area"
                        className={fieldInputClass(!!campusShown('address'))}
                      />
                    )}
                  </FormField>
                  <FormField id="campus-city" label="City" required error={campusShown('city')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={60}
                        value={campusForm.city}
                        onChange={(e) => setCampus({ city: e.target.value })}
                        onBlur={campusTouch('city')}
                        placeholder="e.g. Hyderabad"
                        className={fieldInputClass(!!campusShown('city'))}
                      />
                    )}
                  </FormField>
                  <FormField id="campus-headOfCampus" label="Head of campus" required error={campusShown('headOfCampus')}>
                    {(control) => (
                      <input
                        {...control}
                        maxLength={100}
                        value={campusForm.headOfCampus}
                        onChange={(e) => setCampus({ headOfCampus: e.target.value })}
                        onBlur={campusTouch('headOfCampus')}
                        placeholder="Principal / director name"
                        className={fieldInputClass(!!campusShown('headOfCampus'))}
                      />
                    )}
                  </FormField>
                </fieldset>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={institutions.length === 0}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editingCampusId ? (
                      <>
                        <Pencil className="h-4 w-4" aria-hidden="true" /> Save changes
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" aria-hidden="true" /> Add campus
                      </>
                    )}
                  </button>
                  {editingCampusId && (
                    <button
                      type="button"
                      onClick={resetCampusForm}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <X className="h-4 w-4" aria-hidden="true" /> Cancel
                    </button>
                  )}
                </div>
              </form>

              {campuses.length > 0 && (
                <ul aria-label="Added campuses" className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {campuses.map((campus) => (
                    <li key={campus.id} className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {campus.name} <span className="font-mono text-[11px] font-normal text-slate-400">· {campus.code}</span>
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {institutions.find((i) => i.id === campus.institutionId)?.name} — {[campus.address, campus.city].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => startEditCampus(campus)}
                          aria-label={`Edit ${campus.name}`}
                          aria-pressed={editingCampusId === campus.id}
                          className={`rounded-lg p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            editingCampusId === campus.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCampuses((list) => list.filter((item) => item.id !== campus.id))
                            if (editingCampusId === campus.id) resetCampusForm()
                          }}
                          aria-label={`Remove ${campus.name}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <FormAlert message={error} />

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(returnTo ?? '/onboarding/organization', returnTo ? { state: { returnTo } } : undefined)}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back
            </button>
            <PrimaryButton type="button" onClick={handleContinue} loading={saving} disabled={saved.loading} className="h-12 px-8">
              <span>{saving ? 'Saving…' : returnTo ? 'Save and return to review' : 'Continue'}</span>
              {!saving && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
