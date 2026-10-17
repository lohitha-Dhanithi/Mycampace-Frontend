// src/routes/guards.tsx
// Client-side route gates driven by the session the SERVER reported (accessLevel from /auth/me).
// These improve UX only. They are not a security boundary: the backend's ApprovalGuard and role
// checks reject unapproved or unauthorised API calls regardless of what the UI shows.
import React from 'react'
import { Navigate, useLocation, type RouteObject } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { usePlatformApi } from '@/services/onboardingService'
import {
  AUTH_ROUTES,
  accessLevelOf,
  landingPathFor,
  onboardingStepOf,
  pathFromLocationState,
  postAuthPath,
} from '@/platform/auth/landing'

function Checking() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50" role="status" aria-label="Checking your session">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  )
}

/** Sends a signed-out visitor to sign-in, remembering where they were going. */
function ToSignIn() {
  const location = useLocation()
  return <Navigate to={AUTH_ROUTES.signIn} replace state={{ from: location }} />
}

/** ERP area: only an approved institution administrator gets in. */
export function RequireApproved({ children }: { children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  if (!usePlatformApi()) return children // demo mode without a backend
  if (!initialized) return <Checking />
  if (!user) return <ToSignIn />
  if (accessLevelOf(user) === 'INSTITUTION_ADMIN') return children
  return <Navigate to={landingPathFor(user)} replace />
}

/** Superadmin console. */
export function RequireSuperadmin({ children }: { children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  if (!initialized) return <Checking />
  if (!user) return <ToSignIn />
  if (accessLevelOf(user) === 'SUPERADMIN') return children
  return <Navigate to={landingPathFor(user)} replace />
}

/**
 * Onboarding area: signed-in applicants whose institution is not approved yet.
 * `step` is the onboarding step a page belongs to; pages beyond the step the server has recorded
 * redirect back to the current step, so deep links and refreshes cannot skip unsaved steps.
 */
export function RequireApplicant({ step, children }: { step?: number; children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  if (!usePlatformApi()) return children
  if (!initialized) return <Checking />
  if (!user) return <ToSignIn />
  if (accessLevelOf(user) !== 'APPLICANT_RESTRICTED') return <Navigate to={landingPathFor(user)} replace />
  if (step) {
    const status = user.verification?.status as string | undefined
    if (status === 'Submitted' || status === 'Approved') return <Navigate to="/onboarding/verification-status" replace />
    if (step > onboardingStepOf(user)) return <Navigate to={landingPathFor(user)} replace />
  }
  return children
}

/** `/onboarding` on its own: resume wherever this applicant left off. */
export function OnboardingResume() {
  const { user } = useAuth()
  return <Navigate to={landingPathFor(user)} replace />
}

/**
 * App entry (`/`, unknown paths): wait for the session, then send visitors to the right place.
 * Avoids sending everyone through `/app` (which briefly loads the hub or onboarding step 1).
 */
export function HomeRedirect() {
  const { user, initialized } = useAuth()
  if (!usePlatformApi()) return <Navigate to="/app" replace />
  if (!initialized) return <Checking />
  if (!user) return <Navigate to={AUTH_ROUTES.signIn} replace state={{ from: { pathname: '/' } }} />
  return <Navigate to={landingPathFor(user)} replace />
}

/** Sign-in / sign-up / recovery pages: a signed-in user is sent on to their area instead. */
export function RedirectIfAuthenticated({ children }: { children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  const location = useLocation()
  if (!usePlatformApi()) return children
  if (!initialized) return <Checking />
  if (user) return <Navigate to={postAuthPath(user, pathFromLocationState(location.state))} replace />
  return children
}

/** Wraps every /app route in RequireApproved. */
export function gateRoutes(routes: RouteObject[]): RouteObject[] {
  return routes.map((r) =>
    r.path?.startsWith('/app') && r.element ? { ...r, element: <RequireApproved>{r.element as React.ReactElement}</RequireApproved> } : r,
  )
}
