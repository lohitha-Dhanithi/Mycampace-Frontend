// src/platform/onboarding/OnboardingChrome.tsx
// Pieces shared by the onboarding steps: progress header, account bar, and access to what the
// applicant already saved on the server (so refreshes and deep links show the real data).
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { useAppDispatch } from '@/store/hooks'
import { refreshProfileThunk } from '@/store/slices/authSlice'
import { verificationService } from '@/services/verificationService'
import type { ReviewPack } from '@/types/verification'
import { useLocation } from 'react-router-dom'
import { AUTH_ROUTES, isOnboardingReviewReturn, type OnboardingNavState } from '@/platform/auth/landing'

export const ONBOARDING_STEPS = 5

/** When set (e.g. from the review page Edit links), saves return there instead of advancing the wizard. */
export function useOnboardingReturnTo() {
  const location = useLocation()
  const returnTo = (location.state as OnboardingNavState | null)?.returnTo
  const editingFromReview = isOnboardingReviewReturn(location.state)
  return { returnTo, editingFromReview }
}

export function OnboardingProgress({ step, title, next }: { step: number; title: string; next: string }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const pct = Math.round((step / ONBOARDING_STEPS) * 100)

  // The SPA keeps the previous step's scroll offset, which would open each step mid-form.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const signOut = async () => {
    setSigningOut(true)
    try {
      await logout()
    } finally {
      navigate(AUTH_ROUTES.signIn, { replace: true })
    }
  }

  return (
    <div className="mb-8">
      {user?.email && (
        <div className="mb-4 flex items-center justify-end gap-3 text-xs text-slate-500">
          <span className="truncate">Signed in as <span className="font-semibold text-slate-700">{user.email}</span></span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex shrink-0 items-center gap-1 rounded-md font-semibold hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Step {step} of {ONBOARDING_STEPS}: {title}
        </span>
        <span className="text-xs font-medium text-slate-500">Next: {next}</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuemin={0}
        aria-valuemax={ONBOARDING_STEPS}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of ${ONBOARDING_STEPS}`}
      >
        <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/**
 * Loads the application the server holds for this organization (GET /verification/review).
 * Failure is not fatal: the step simply starts from its local defaults.
 */
export function useSavedApplication(enabled: boolean) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [data, setData] = useState<ReviewPack | null>(null)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled || !userId) {
      setData(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setData(null)
    setLoading(true)
    verificationService
      .review()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled, userId])

  return { data, loading }
}

/** Re-reads the profile after a step is saved so route guards see the step the server recorded. */
export function useRefreshProfile() {
  const dispatch = useAppDispatch()
  return useCallback(async () => {
    await dispatch(refreshProfileThunk())
  }, [dispatch])
}

export function StepLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-hidden="true" />
      {label}
    </div>
  )
}

export function PrimaryButton({
  loading,
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
      {children}
    </button>
  )
}
