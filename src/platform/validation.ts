// src/platform/validation.ts
// Field rules shared by the sign-up/sign-in and onboarding forms. Each validator returns an error
// message, or '' when the value is acceptable. The backend DTOs remain the authority; these rules
// only catch mistakes early and are never looser than what the server accepts.
import { ApiError } from '@/services/apiClient'
import { PIN_PREFIXES } from '@/platform/onboarding/indianLocations'

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PIN_RE = /^[1-9][0-9]{5}$/
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
const CODE_RE = /^[A-Z0-9][A-Z0-9-]*$/

/** bcrypt only uses the first 72 bytes of a password. */
export const PASSWORD_MAX = 72
export const PASSWORD_MIN = 10

const PASSWORD_SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/
const COMMON_WEAK_PASSWORDS = new Set(
  ['password', 'password1', 'password123', '1234567890', 'qwerty123', 'admin123', 'welcome1', 'letmein1'].map((s) =>
    s.toLowerCase(),
  ),
)

export type PasswordRule = { id: string; label: string; met: boolean }
export type PasswordStrength = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

export function validateEmail(value: string, label = 'Email address') {
  const v = value.trim()
  if (!v) return `${label} is required.`
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email address, like name@institution.edu.'
  return ''
}

export function validateRequiredText(
  value: string,
  label: string,
  { min = 2, max = 150 }: { min?: number; max?: number } = {},
) {
  const v = value.trim()
  if (!v) return `${label} is required.`
  if (v.length < min) return `${label} must be at least ${min} characters.`
  if (v.length > max) return `${label} must be ${max} characters or fewer.`
  return ''
}

export function validateOptionalText(value: string, label: string, max = 150) {
  return value.trim().length > max ? `${label} must be ${max} characters or fewer.` : ''
}

export function validatePersonName(value: string, label = 'Full name') {
  const base = validateRequiredText(value, label, { min: 2, max: 100 })
  if (base) return base
  if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(value.trim())) {
    return `${label} can only contain letters, spaces, dots, apostrophes and hyphens.`
  }
  return ''
}

export function passwordRules(value: string): PasswordRule[] {
  return [
    { id: 'length', label: `At least ${PASSWORD_MIN} characters`, met: value.length >= PASSWORD_MIN },
    { id: 'upper', label: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(value) },
    { id: 'lower', label: 'One lowercase letter (a–z)', met: /[a-z]/.test(value) },
    { id: 'number', label: 'One number (0–9)', met: /\d/.test(value) },
    { id: 'special', label: 'One special character (!@#$…)', met: PASSWORD_SPECIAL_RE.test(value) },
  ]
}

/** Visual strength for the sign-up meter (does not replace rule validation). */
export function passwordStrength(value: string): PasswordStrength {
  if (!value) return 'empty'
  const rules = passwordRules(value)
  const met = rules.filter((r) => r.met).length
  if (met === rules.length && value.length >= 14) return 'strong'
  if (met === rules.length) return 'good'
  if (met >= 3) return 'fair'
  return 'weak'
}

export function validateNewPassword(value: string) {
  if (!value) return 'Create a password.'
  if (value.length > PASSWORD_MAX) return `Password must be ${PASSWORD_MAX} characters or fewer.`
  if (COMMON_WEAK_PASSWORDS.has(value.toLowerCase())) {
    return 'This password is too common. Choose something harder to guess.'
  }
  if (passwordRules(value).some((r) => !r.met)) {
    return `Use at least ${PASSWORD_MIN} characters with uppercase, lowercase, a number, and a special character.`
  }
  return ''
}

/** Indian phone number: 10 digits, optionally prefixed with +91 / 91 / 0. Spaces and dashes are ignored. */
export function normalizeIndianPhone(value: string) {
  const digits = value.replace(/[\s()-]/g, '')
  const m = digits.match(/^(?:\+91|91|0)?(\d{10})$/)
  return m ? m[1] : null
}

export function validateIndianPhone(value: string, label = 'Phone number') {
  if (!value.trim()) return `${label} is required.`
  if (!normalizeIndianPhone(value)) return 'Enter a valid 10-digit phone number (you may add +91 in front).'
  return ''
}

/** When `state` is given, the PIN code must also fall in that state's postal range. */
export function validatePinCode(value: string, state?: string) {
  const v = value.trim()
  if (!v) return 'PIN code is required.'
  if (!PIN_RE.test(v)) return 'Enter a valid 6-digit PIN code that does not start with 0.'
  const inRange = (prefixes: string[]) => prefixes.some((p) => v.startsWith(p))
  if (!Object.values(PIN_PREFIXES).some(inRange)) return 'This is not a valid Indian PIN code.'
  const statePrefixes = state ? PIN_PREFIXES[state] : undefined
  if (statePrefixes && !inRange(statePrefixes)) {
    return `This PIN code is not in ${state}. Check the PIN code or the selected state.`
  }
  return ''
}

export function validateGstin(value: string) {
  const v = value.trim().toUpperCase()
  if (!v) return 'GST number is required.'
  if (v.length !== 15) return 'GST number must be exactly 15 characters.'
  if (!GSTIN_RE.test(v)) return 'Enter a valid GST number, e.g. 36AAATA1234F1Z8.'
  return ''
}

export function validateCode(value: string, label: string, { min = 2, max = 20 } = {}) {
  const v = value.trim().toUpperCase()
  if (!v) return `${label} is required.`
  if (v.length < min || v.length > max) return `${label} must be ${min}–${max} characters.`
  if (!CODE_RE.test(v)) return `${label} can only contain letters, numbers and hyphens.`
  return ''
}

export const hasErrors = (errors: FieldErrors) => Object.values(errors).some(Boolean)

/** Moves focus to the first field (in DOM order) that has an error. Fields are found by `id`. */
export function focusFirstError(errors: FieldErrors, idFor: (field: string) => string = (f) => f) {
  const ids = Object.entries(errors)
    .filter(([, msg]) => !!msg)
    .map(([field]) => idFor(field))
  const nodes = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
  nodes[0]?.focus()
}

/** Turns an API failure into a message a person can act on. */
export function describeApiError(err: unknown, fallback = 'Something went wrong. Please try again.') {
  if (err instanceof ApiError) {
    if (err.status === 0) return "We couldn't reach MyCampace. Check your internet connection and try again."
    if (err.status === 429) return 'Too many attempts. Please wait a minute and try again.'
    if (err.status >= 500) return 'Something went wrong on our side. Please try again in a moment.'
    return err.message || fallback
  }
  if (err instanceof TypeError) {
    // fetch() rejects with a TypeError when the server is unreachable (offline, CORS, DNS).
    return "We couldn't reach MyCampace. Check your internet connection and try again."
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}
