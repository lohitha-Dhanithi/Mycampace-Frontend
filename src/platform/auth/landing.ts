// src/platform/auth/landing.ts
// Where to send a user right after sign-in. Navigation convenience only: the backend independently
// blocks ERP APIs for anyone who is not approved (ApprovalGuard), whatever the UI does.
import type { AccessLevel } from '@/types/verification'
import { usePlatformApi as isPlatformApi } from '@/services/onboardingService'

export const AUTH_ROUTES = {
  signIn: '/auth',
  signUp: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
} as const

/** Final review step before submit for verification. */
export const ONBOARDING_REVIEW_PATH = '/onboarding/products/confirmation'

const STEP_ROUTE: Record<number, string> = {
  1: '/onboarding/organization',
  2: '/onboarding/institutions',
  3: '/onboarding/products',
  4: '/onboarding/team', // step 4 = document upload
  5: ONBOARDING_REVIEW_PATH, // step 5 = review & send
}

export type OnboardingNavState = { returnTo?: string }

/** True when the user opened a step from the review screen to edit, not to restart the wizard. */
export function isOnboardingReviewReturn(state: unknown): state is OnboardingNavState {
  const returnTo = (state as OnboardingNavState | null)?.returnTo
  return returnTo === ONBOARDING_REVIEW_PATH
}

/** Platform mode fails closed: a profile without a server-stated level is treated as an applicant. */
export function accessLevelOf(user: Record<string, any> | null | undefined): AccessLevel {
  if (!user) return 'NONE'
  return (user.accessLevel as AccessLevel | undefined) ?? (isPlatformApi() ? 'APPLICANT_RESTRICTED' : 'INSTITUTION_ADMIN')
}

/** Highest onboarding step the server says this organization has reached (1-based). */
export const onboardingStepOf = (user: Record<string, any> | null | undefined): number =>
  Number(user?.onboarding?.step) || 1

export function landingPathFor(user: Record<string, any> | null | undefined): string {
  if (!user) return AUTH_ROUTES.signIn
  const level = accessLevelOf(user)
  if (level === 'SUPERADMIN') return '/admin/superadmin'
  if (level === 'APPLICANT_RESTRICTED') {
    const status = user.verification?.status as string | undefined
    if (status && status !== 'Draft') return '/onboarding/verification-status'
    return STEP_ROUTE[onboardingStepOf(user)] ?? STEP_ROUTE[1]
  }
  return '/app' // approved institution admin (or demo mode without a backend)
}

const AREA_PREFIXES: Partial<Record<AccessLevel, string[]>> = {
  INSTITUTION_ADMIN: ['/app'],
  SUPERADMIN: ['/admin/superadmin', '/superadmin'],
  APPLICANT_RESTRICTED: ['/onboarding'],
}

/** Builds "path?query#hash" from a router location kept in navigation state by the route guards. */
export function pathFromLocationState(state: unknown): string | null {
  const from = (state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from
  if (!from?.pathname) return null
  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
}

/**
 * After sign-in, return to the page the user originally asked for when it belongs to their area;
 * otherwise go to their normal landing page. Only same-app absolute paths are accepted.
 */
export function postAuthPath(user: Record<string, any> | null | undefined, from?: string | null): string {
  const landing = landingPathFor(user)
  if (!user || !from || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/auth')) return landing
  const prefixes = AREA_PREFIXES[accessLevelOf(user)] ?? []
  const pathname = from.split(/[?#]/)[0]
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ? from : landing
}
