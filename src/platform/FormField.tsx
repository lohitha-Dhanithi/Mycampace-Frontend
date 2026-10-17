// src/platform/FormField.tsx
// Labelled form field used by the authentication and onboarding screens.
import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FieldControlProps {
  id: string
  name: string
  'aria-invalid': boolean
  'aria-required'?: boolean
  'aria-describedby'?: string
}

interface FormFieldProps {
  id: string
  label: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: string
  /** Follow-up content shown under the error message (e.g. "Sign in instead"). */
  errorAction?: React.ReactNode
  /** Right-aligned content in the label row (e.g. a "Forgot password?" link). */
  labelAside?: React.ReactNode
  className?: string
  children: (control: FieldControlProps) => React.ReactNode
}

export function FormField({ id, label, required, hint, error, errorAction, labelAside, className, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('min-w-0', className)}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
          {label}
          {required ? (
            <span className="ml-0.5 text-rose-600" aria-hidden="true">*</span>
          ) : (
            <span className="ml-1 font-normal text-slate-400">(optional)</span>
          )}
        </label>
        {labelAside}
      </div>
      {children({
        id,
        name: id,
        'aria-invalid': !!error,
        'aria-required': required || undefined,
        'aria-describedby': describedBy,
      })}
      {error ? (
        <>
          <p id={errorId} className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600">
            <AlertCircle className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
          {errorAction && <p className="mt-0.5 pl-4 text-[11px] text-slate-600">{errorAction}</p>}
        </>
      ) : hint ? (
        <p id={hintId} className="mt-1 text-[11px] text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Shared look for text inputs and selects; turns red when the field has an error. */
export function fieldInputClass(hasError: boolean, extra?: string) {
  return cn(
    'w-full h-10 px-3 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 transition-colors',
    'focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
    hasError
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
      : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20',
    extra,
  )
}

/** Page-level error banner (server/network failures). */
export function FormAlert({ message, children }: { message?: string; children?: React.ReactNode }) {
  if (!message) return null
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
      <AlertCircle className="mt-px h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
      <div className="min-w-0">
        <span>{message}</span>
        {children}
      </div>
    </div>
  )
}
