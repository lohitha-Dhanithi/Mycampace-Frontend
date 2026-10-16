// src/store/errors.ts
// Serializable error shape for Redux state (Error instances are not serializable).
import { ApiError } from '../services/apiClient'

export interface ErrorInfo {
  message: string
  status?: number
  /** field -> message, when the backend returns validation details */
  fieldErrors?: Record<string, string>
}

export function toErrorInfo(e: unknown): ErrorInfo {
  if (e instanceof ApiError) {
    const info: ErrorInfo = { message: e.message, status: e.status }
    const details = e.data?.errors ?? e.data?.fieldErrors
    if (details && typeof details === 'object' && !Array.isArray(details)) {
      info.fieldErrors = details as Record<string, string>
    }
    return info
  }
  if (e instanceof Error) return { message: e.message }
  return { message: 'Something went wrong' }
}

export const isUnauthorized = (e?: ErrorInfo | null) => e?.status === 401
export const isForbidden = (e?: ErrorInfo | null) => e?.status === 403
