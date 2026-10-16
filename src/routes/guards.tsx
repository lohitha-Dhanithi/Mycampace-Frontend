// src/routes/guards.tsx
// Client-side route gates driven by the session the SERVER reported (accessLevel from /auth/me).
// These improve UX only. They are not a security boundary: the backend's ApprovalGuard and role
// checks reject unapproved or unauthorised API calls regardless of what the UI shows.
import React from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { usePlatformApi } from '@/services/onboardingService'
import { landingPathFor } from '@/platform/auth/landing'

function Checking() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50" role="status" aria-label="Checking your session">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  )
}

/** ERP area: only an approved institution administrator gets in. */
export function RequireApproved({ children }: { children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  if (!usePlatformApi()) return children // demo mode without a backend
  if (!initialized) return <Checking />
  if (!user) return <Navigate to="/auth" replace />
  if (user.accessLevel === 'INSTITUTION_ADMIN') return children
  return <Navigate to={landingPathFor(user)} replace />
}

/** Superadmin console. */
export function RequireSuperadmin({ children }: { children: React.ReactElement }) {
  const { user, initialized } = useAuth()
  if (!initialized) return <Checking />
  if (!user) return <Navigate to="/auth" replace />
  if (user.accessLevel === 'SUPERADMIN') return children
  return <Navigate to={landingPathFor(user)} replace />
}

/** Wraps every /app route in RequireApproved. */
export function gateRoutes(routes: RouteObject[]): RouteObject[] {
  return routes.map((r) =>
    r.path?.startsWith('/app') && r.element ? { ...r, element: <RequireApproved>{r.element as React.ReactElement}</RequireApproved> } : r,
  )
}
