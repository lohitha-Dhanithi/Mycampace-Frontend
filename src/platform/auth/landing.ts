// src/platform/auth/landing.ts
// Where to send a user right after sign-in. Navigation convenience only: the backend independently
// blocks ERP APIs for anyone who is not approved (ApprovalGuard), whatever the UI does.
import type { AccessLevel } from '@/types/verification'

const STEP_ROUTE: Record<number, string> = {
  1: '/onboarding/organization',
  2: '/onboarding/institutions',
  3: '/onboarding/products',
  4: '/onboarding/team', // step 4 = document upload
  5: '/onboarding/products/confirmation', // step 5 = review & send
}

export function landingPathFor(user: Record<string, any> | null | undefined): string {
  if (!user) return '/auth'
  const level = user.accessLevel as AccessLevel | undefined
  if (level === 'SUPERADMIN') return '/admin/superadmin'
  if (level === 'APPLICANT_RESTRICTED') {
    const status = user.verification?.status as string | undefined
    if (status && status !== 'Draft') return '/onboarding/verification-status'
    return STEP_ROUTE[user.onboarding?.step ?? 1] ?? STEP_ROUTE[1]
  }
  return '/app' // approved institution admin (or demo mode without a backend)
}
