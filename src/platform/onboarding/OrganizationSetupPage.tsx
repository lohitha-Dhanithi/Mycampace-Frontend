// src/platform/onboarding/OrganizationSetupPage.tsx
// Step 1 of 5: the organization that owns the workspace (POST /onboarding/organization).
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Check } from 'lucide-react'
import { organizationService } from '@/services/organizationService'
import { onboardingService, usePlatformApi } from '@/services/onboardingService'
import { useAuth } from '@/store/AuthContext'
import { INDIAN_LOCATIONS, INDIAN_STATES } from '@/platform/onboarding/indianLocations'
import { FormAlert, FormField, fieldInputClass } from '@/platform/FormField'
import {
  describeApiError,
  focusFirstError,
  hasErrors,
  normalizeIndianPhone,
  validateEmail,
  validateGstin,
  validateIndianPhone,
  validatePersonName,
  validatePinCode,
  validateRequiredText,
  type FieldErrors,
} from '@/platform/validation'
import { onboardingStepOf } from '@/platform/auth/landing'
import {
  OnboardingProgress,
  PrimaryButton,
  StepLoading,
  useOnboardingReturnTo,
  useRefreshProfile,
  useSavedApplication,
} from './OnboardingChrome'

const DRAFT_KEY = 'mycampace_onboarding_org_draft'
const COUNTRY = 'India'

const ORGANIZATION_TYPES = ['School', 'College', 'University', 'Coaching Institute', 'Training Institute']

interface OrgForm {
  name: string
  type: string
  country: string
  state: string
  city: string
  address: string
  postalCode: string
  taxId: string
  primaryContactName: string
  primaryContactEmail: string
  primaryContactPhone: string
  primaryContactDesignation: string
}
type OrgField = keyof OrgForm

const blankForm = (user?: { name?: string; email?: string } | null): OrgForm => ({
  name: '',
  type: 'School',
  country: COUNTRY,
  state: '',
  city: '',
  address: '',
  postalCode: '',
  taxId: '',
  primaryContactName: user?.name || '',
  primaryContactEmail: user?.email || '',
  primaryContactPhone: '',
  primaryContactDesignation: 'Organization Admin',
})

function validate(f: OrgForm): FieldErrors<OrgField> {
  const cities = INDIAN_LOCATIONS[f.state] || []
  return {
    name: validateRequiredText(f.name, 'Organization name', { min: 3, max: 120 }),
    type: ORGANIZATION_TYPES.includes(f.type) ? '' : 'Select an organization type.',
    address: validateRequiredText(f.address, 'Registered address', { min: 5, max: 250 }),
    state: INDIAN_STATES.includes(f.state) ? '' : 'Select a state.',
    city: cities.includes(f.city) ? '' : f.state ? 'Select a city.' : 'Select a state first, then a city.',
    postalCode: validatePinCode(f.postalCode, f.state),
    taxId: validateGstin(f.taxId),
    primaryContactName: validatePersonName(f.primaryContactName, 'Contact person name'),
    primaryContactEmail: validateEmail(f.primaryContactEmail, 'Official email'),
    primaryContactPhone: validateIndianPhone(f.primaryContactPhone, 'Official phone'),
  }
}

export function OrganizationSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const platform = usePlatformApi()
  const refreshProfile = useRefreshProfile()
  const { returnTo, editingFromReview } = useOnboardingReturnTo()
  const draftKey = `${DRAFT_KEY}:${user?.id ?? 'local'}`

  // Review pack is for saved org data (step > 1 or editing from review), not right after signup.
  const needsReviewPack = !!platform && (editingFromReview || onboardingStepOf(user) > 1)
  const saved = useSavedApplication(needsReviewPack)

  const [formData, setFormData] = useState<OrgForm>(() => {
    // Platform mode: server data is the source of truth across browsers; avoid another user's draft.
    if (!platform) {
      try {
        const draft = localStorage.getItem(draftKey)
        if (draft) return { ...blankForm(user), ...JSON.parse(draft), country: COUNTRY }
      } catch {
        // Unreadable draft: start from a blank form.
      }
    }
    return blankForm(user)
  })

  useEffect(() => {
    const org = saved.data?.organization
    if (!org) return
    const contact = org.primaryContact ?? {}
    const serverState = org.state && org.state !== 'TBD' ? org.state : ''
    const serverCity = org.city && org.city !== 'TBD' ? org.city : ''
    setFormData((current) => ({
      ...current,
      name: org.name?.endsWith(`'s Organization`) ? current.name || org.name.replace(/'s Organization$/, '') : org.name || current.name,
      type: ORGANIZATION_TYPES.includes(org.type) ? org.type : current.type,
      state: serverState || current.state,
      city: serverCity || current.city,
      address: org.address || current.address,
      postalCode: org.postalCode || current.postalCode,
      taxId: org.taxId || current.taxId,
      primaryContactName: contact.name || current.primaryContactName,
      primaryContactEmail: contact.email || current.primaryContactEmail,
      primaryContactPhone: contact.phone?.replace(/^\+91/, '') || current.primaryContactPhone,
    }))
  }, [saved.data])

  const [touched, setTouched] = useState<Partial<Record<OrgField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)

  const errors = validate(formData)
  const shown = (field: OrgField) => (submitted || touched[field] ? errors[field] : '')
  const touch = (field: OrgField) => () => setTouched((t) => (t[field] ? t : { ...t, [field]: true }))
  const set = (patch: Partial<OrgForm>) => setFormData((current) => ({ ...current, ...patch }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current) return
    setSubmitted(true)
    setError('')
    if (hasErrors(errors)) {
      focusFirstError(errors, (f) => `org-${f}`)
      return
    }

    const code =
      formData.name
        .trim()
        .split(/\s+/)
        .map((word) => word[0] || '')
        .join('')
        .slice(0, 6)
        .toUpperCase() || 'ORG'
    const contactEmail = formData.primaryContactEmail.trim().toLowerCase()
    const emailDomain = contactEmail.split('@')[1]
    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      code,
      country: COUNTRY,
      state: formData.state.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      taxId: formData.taxId.trim().toUpperCase(),
      ...(emailDomain ? { domains: [emailDomain] } : {}),
      branding: {
        primaryColor: '#2563eb',
        accentColor: '#4f46e5',
        themeMode: 'light',
        customSubdomain: `${code.toLowerCase()}.mycampace.com`,
      },
      primaryContact: {
        name: formData.primaryContactName.trim(),
        email: contactEmail,
        phone: `+91${normalizeIndianPhone(formData.primaryContactPhone)}`,
        designation: 'Organization Admin',
      },
    }

    inFlight.current = true
    setSaving(true)
    try {
      if (platform) {
        await onboardingService.saveOrganization(payload)
        await refreshProfile()
        localStorage.removeItem(draftKey)
      } else {
        organizationService.updateOrganization(payload)
        localStorage.setItem(draftKey, JSON.stringify(formData))
      }
      navigate(returnTo ?? '/onboarding/institutions', { replace: !!returnTo })
    } catch (err) {
      setError(describeApiError(err, 'Could not save the organization profile. Please try again.'))
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }

  const cities = INDIAN_LOCATIONS[formData.state] || []

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <OnboardingProgress step={1} title="Organization Setup" next="Institutions & Campuses" />

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Tell us about your organization</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter the legal organization that will own this workspace. Institutions and campuses are collected on the next step.
              Fields marked <span className="text-rose-600">*</span> are required.
            </p>
            {editingFromReview && (
              <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                You are editing from review. Save to return to your application summary — you will not lose progress on other steps.
              </p>
            )}
          </div>

          {saved.loading ? (
            <StepLoading label="Loading your saved details…" />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <FormAlert message={error} />

              <FormField id="org-name" label="Organization name" required error={shown('name')}>
                {(control) => (
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      {...control}
                      type="text"
                      autoComplete="organization"
                      maxLength={120}
                      value={formData.name}
                      onChange={(e) => set({ name: e.target.value })}
                      onBlur={touch('name')}
                      placeholder="e.g. Heritage Education Trust"
                      className={fieldInputClass(!!shown('name'), 'h-11 pl-9')}
                    />
                  </div>
                )}
              </FormField>

              <fieldset>
                <legend id="org-type-label" className="mb-2 block text-xs font-semibold text-slate-700">
                  Organization type<span className="ml-0.5 text-rose-600" aria-hidden="true">*</span>
                </legend>
                <div id="org-type" role="radiogroup" aria-labelledby="org-type-label" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {ORGANIZATION_TYPES.map((type) => {
                    const selected = formData.type === type
                    return (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => set({ type })}
                        className={`flex h-11 items-center justify-between rounded-xl border px-3 text-left text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <span>{type}</span>
                        {selected && <Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
                {shown('type') && <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.type}</p>}
              </fieldset>

              <FormField id="org-address" label="Registered address" required error={shown('address')}>
                {(control) => (
                  <input
                    {...control}
                    type="text"
                    autoComplete="street-address"
                    maxLength={250}
                    value={formData.address}
                    onChange={(e) => set({ address: e.target.value })}
                    onBlur={touch('address')}
                    placeholder="Building, street, area, landmark"
                    className={fieldInputClass(!!shown('address'))}
                  />
                )}
              </FormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField id="org-country" label="Country" required hint="MyCampace onboarding is currently available in India.">
                  {(control) => (
                    <input {...control} type="text" value={COUNTRY} readOnly className={fieldInputClass(false, 'bg-slate-50 text-slate-600')} />
                  )}
                </FormField>

                <FormField id="org-state" label="State / UT" required error={shown('state')}>
                  {(control) => (
                    <select
                      {...control}
                      value={INDIAN_STATES.includes(formData.state) ? formData.state : ''}
                      onChange={(e) => set({ state: e.target.value, city: '' })}
                      onBlur={touch('state')}
                      className={fieldInputClass(!!shown('state'))}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>

                <FormField id="org-city" label="City" required error={shown('city')}>
                  {(control) => (
                    <select
                      {...control}
                      value={cities.includes(formData.city) ? formData.city : ''}
                      disabled={!formData.state}
                      onChange={(e) => set({ city: e.target.value })}
                      onBlur={touch('city')}
                      className={fieldInputClass(!!shown('city'))}
                    >
                      <option value="">{formData.state ? 'Select city' : 'Select a state first'}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField id="org-postalCode" label="PIN code" required error={shown('postalCode')}>
                  {(control) => (
                    <input
                      {...control}
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={(e) => set({ postalCode: e.target.value.replace(/\D/g, '') })}
                      onBlur={touch('postalCode')}
                      placeholder="e.g. 500032"
                      className={fieldInputClass(!!shown('postalCode'))}
                    />
                  )}
                </FormField>
                <FormField id="org-taxId" label="GST Number" required hint="15 characters, as shown on your GST registration certificate." error={shown('taxId')}>
                  {(control) => (
                    <input
                      {...control}
                      type="text"
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={15}
                      value={formData.taxId}
                      onChange={(e) => set({ taxId: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '') })}
                      onBlur={touch('taxId')}
                      placeholder="e.g. 36AAATA1234F1Z8"
                      className={fieldInputClass(!!shown('taxId'), 'font-mono tracking-wide')}
                    />
                  )}
                </FormField>
              </div>

              <fieldset className="border-t border-slate-200 pt-5">
                <legend className="sr-only">Primary organization contact</legend>
                <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500" aria-hidden="true">
                  Primary organization contact
                </h2>
                <p className="mb-4 text-xs text-slate-500">The person our verification team will contact about this application.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField id="org-primaryContactName" label="Contact person name" required error={shown('primaryContactName')}>
                    {(control) => (
                      <input
                        {...control}
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        value={formData.primaryContactName}
                        onChange={(e) => set({ primaryContactName: e.target.value })}
                        onBlur={touch('primaryContactName')}
                        placeholder="Full name"
                        className={fieldInputClass(!!shown('primaryContactName'))}
                      />
                    )}
                  </FormField>
                  <FormField id="org-primaryContactEmail" label="Official email" required error={shown('primaryContactEmail')}>
                    {(control) => (
                      <input
                        {...control}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={254}
                        value={formData.primaryContactEmail}
                        onChange={(e) => set({ primaryContactEmail: e.target.value })}
                        onBlur={touch('primaryContactEmail')}
                        placeholder="name@institution.edu"
                        className={fieldInputClass(!!shown('primaryContactEmail'))}
                      />
                    )}
                  </FormField>
                  <FormField id="org-primaryContactPhone" label="Official phone" required error={shown('primaryContactPhone')}>
                    {(control) => (
                      <input
                        {...control}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={16}
                        value={formData.primaryContactPhone}
                        onChange={(e) => set({ primaryContactPhone: e.target.value })}
                        onBlur={touch('primaryContactPhone')}
                        placeholder="e.g. 98480 12345"
                        className={fieldInputClass(!!shown('primaryContactPhone'))}
                      />
                    )}
                  </FormField>
                </div>
              </fieldset>

              <div className="flex justify-end border-t border-slate-100 pt-6">
                <PrimaryButton type="submit" loading={saving} className="h-12 w-full px-8 sm:w-auto">
                  <span>
                    {saving ? 'Saving…' : returnTo ? 'Save and return to review' : 'Continue'}
                  </span>
                  {!saving && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
