// src/store/selectors.ts
// Selectors only *read* what the server decided. None of these grant access;
// the backend independently enforces every rule (ApprovalGuard, role checks).
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'

export const selectAuthUser = (s: RootState) => s.auth.user
export const selectAccessLevel = (s: RootState) => s.auth.accessLevel
export const selectIsAuthenticated = (s: RootState) => !!s.auth.user

export const selectRequirements = (s: RootState) => s.verification.requirements
export const selectVerificationStatus = (s: RootState) => s.verification.status
export const selectUploadSlot = (key: string) => (s: RootState) => s.verification.uploads[key]

/** Required items first, then optional; each group ordered by the product's document number. */
export const selectSplitRequirements = createSelector(selectRequirements, (r) => {
  const items = r?.items ?? []
  const byNumber = (a: { number: number; label: string }, b: { number: number; label: string }) =>
    a.number - b.number || a.label.localeCompare(b.label)
  return {
    required: items.filter((i) => i.required).sort(byNumber),
    optional: items.filter((i) => !i.required).sort(byNumber),
  }
})

export const selectSuperadminVerification = (s: RootState) => s.superadminVerification
