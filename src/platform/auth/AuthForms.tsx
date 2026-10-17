// src/platform/auth/AuthForms.tsx
// Sign-in and sign-up forms. The session itself lives in HttpOnly cookies set by the backend
// (see authService); these forms only collect credentials, validate them and route afterwards.
import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail, Minus, User } from 'lucide-react'
import { authService } from '@/services/authService'
import { ApiError } from '@/services/apiClient'
import { useAuth } from '@/store/AuthContext'
import { cn } from '@/lib/utils'
import { FormAlert, FormField, fieldInputClass, type FieldControlProps } from '@/platform/FormField'
import {
  PASSWORD_MAX,
  describeApiError,
  focusFirstError,
  hasErrors,
  passwordRules,
  passwordStrength,
  type PasswordRule,
  type PasswordStrength,
  validateEmail,
  validateNewPassword,
  validatePersonName,
} from '@/platform/validation'
import { usePlatformApi as isPlatformApi } from '@/services/onboardingService'
import { AUTH_ROUTES, accessLevelOf, landingPathFor, pathFromLocationState, postAuthPath } from './landing'

export type AuthMode = 'signin' | 'signup'

const STRENGTH_UI: Record<
  Exclude<PasswordStrength, 'empty'>,
  { label: string; bar: string; text: string; width: string }
> = {
  weak: { label: 'Weak', bar: 'bg-rose-500', text: 'text-rose-600', width: '25%' },
  fair: { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-600', width: '50%' },
  good: { label: 'Good', bar: 'bg-blue-500', text: 'text-blue-600', width: '75%' },
  strong: { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-600', width: '100%' },
}

function PasswordRequirementsPanel({ password, visible }: { password: string; visible: boolean }) {
  if (!visible) return null
  const rules = passwordRules(password)
  const strength = passwordStrength(password)
  const ui = strength === 'empty' ? null : STRENGTH_UI[strength]
  const allMet = rules.every((r) => r.met)

  return (
    <div
      id="signup-password-rules"
      role="region"
      aria-label="Password requirements"
      className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Password strength</p>
        {ui ? (
          <span className={cn('text-xs font-bold', ui.text)}>{ui.label}</span>
        ) : (
          <span className="text-xs font-medium text-slate-400">Start typing</span>
        )}
      </div>
      <div
        className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ui ? Number.parseInt(ui.width, 10) : 0}
        aria-label={ui ? `Password strength: ${ui.label}` : 'Password strength not rated yet'}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', ui?.bar ?? 'bg-slate-300')}
          style={{ width: ui?.width ?? '8%' }}
        />
      </div>
      <ul className="space-y-1.5">
        {rules.map((r) => (
          <PasswordRuleRow key={r.id} rule={r} />
        ))}
      </ul>
      {allMet && (
        <p className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-emerald-700">
          This password meets MyCampace security requirements.
        </p>
      )}
    </div>
  )
}

function PasswordRuleRow({ rule }: { rule: PasswordRule }) {
  return (
    <li
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] transition-colors',
        rule.met ? 'bg-emerald-50/80 text-emerald-800' : 'text-slate-600',
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
          rule.met ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white text-slate-400',
        )}
        aria-hidden="true"
      >
        {rule.met ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : <Minus className="h-2.5 w-2.5" />}
      </span>
      <span className="font-medium">{rule.label}</span>
      <span className="sr-only">{rule.met ? 'met' : 'not met'}</span>
    </li>
  )
}

function IconInput({
  icon: Icon,
  control,
  error,
  className,
  ...props
}: { icon: React.ComponentType<{ className?: string }>; control: FieldControlProps; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input {...control} {...props} className={fieldInputClass(!!error, cn('pl-9 bg-slate-50/50 focus:bg-white', className))} />
    </div>
  )
}

function PasswordInput({
  control,
  error,
  visible,
  onToggle,
  ...props
}: { control: FieldControlProps; error?: string; visible: boolean; onToggle: () => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        {...control}
        {...props}
        type={visible ? 'text' : 'password'}
        maxLength={PASSWORD_MAX}
        className={fieldInputClass(!!error, 'pl-9 pr-10 bg-slate-50/50 focus:bg-white')}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

function SubmitButton({ loading, idleLabel, busyLabel }: { loading: boolean; idleLabel: string; busyLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{busyLabel}</span>
        </>
      ) : (
        <>
          <span>{idleLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </>
      )}
    </button>
  )
}

/** Shows a field error once the field was left or the form was submitted. */
function useFieldVisibility<K extends string>() {
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  return {
    submitted,
    markSubmitted: () => setSubmitted(true),
    touch: (field: K) => () => setTouched((t) => (t[field] ? t : { ...t, [field]: true })),
    shown: (field: K, error: string) => (submitted || touched[field] ? error : ''),
  }
}

// ---------------------------------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------------------------------
type SignInField = 'email' | 'password'

function SignInForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adoptSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const inFlight = useRef(false)
  const v = useFieldVisibility<SignInField>()

  const errors: Record<SignInField, string> = {
    email: validateEmail(email),
    password: password ? '' : 'Enter your password.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current) return
    v.markSubmitted()
    if (hasErrors(errors)) {
      focusFirstError(errors, (f) => `signin-${f}`)
      return
    }
    inFlight.current = true
    setLoading(true)
    setServerError('')
    try {
      const user = await authService.signInWithEmail(email.trim(), password)
      adoptSession()
      navigate(postAuthPath(user, pathFromLocationState(location.state)), { replace: true })
    } catch (err) {
      setServerError(describeApiError(err, 'Sign in failed. Please try again.'))
      if (err instanceof ApiError && err.status === 401) document.getElementById('signin-password')?.focus()
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5" aria-describedby={serverError ? 'signin-server-error' : undefined}>
      {serverError && (
        <div id="signin-server-error">
          <FormAlert message={serverError} />
        </div>
      )}

      <FormField id="signin-email" label="Work email" required error={v.shown('email', errors.email)}>
        {(control) => (
          <IconInput
            icon={Mail}
            control={control}
            error={v.shown('email', errors.email)}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setServerError('')
            }}
            onBlur={v.touch('email')}
            placeholder="name@institution.edu"
            maxLength={254}
          />
        )}
      </FormField>

      <FormField
        id="signin-password"
        label="Password"
        required
        error={v.shown('password', errors.password)}
        labelAside={
          <Link to={AUTH_ROUTES.forgotPassword} state={location.state} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Forgot password?
          </Link>
        }
      >
        {(control) => (
          <PasswordInput
            control={control}
            error={v.shown('password', errors.password)}
            visible={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setServerError('')
            }}
            onBlur={v.touch('password')}
            placeholder="Enter your password"
          />
        )}
      </FormField>

      <SubmitButton loading={loading} idleLabel="Sign in" busyLabel="Signing in…" />
    </form>
  )
}

// ---------------------------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------------------------
type SignUpField = 'name' | 'email' | 'password' | 'confirmPassword' | 'terms'

function SignUpForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adoptSession } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  // Email the server reported as already registered; cleared as soon as the email changes.
  const [takenEmail, setTakenEmail] = useState('')
  const inFlight = useRef(false)
  const v = useFieldVisibility<SignUpField>()

  const emailTaken = !!takenEmail && takenEmail === email.trim().toLowerCase()
  const errors: Record<SignUpField, string> = {
    name: validatePersonName(name),
    email: validateEmail(email) || (emailTaken ? 'An account with this email already exists.' : ''),
    password: validateNewPassword(password),
    confirmPassword: !confirmPassword
      ? 'Re-enter your password.'
      : confirmPassword !== password
        ? 'Passwords do not match.'
        : '',
    terms: agreedTerms ? '' : 'Please accept the Terms of Service and Privacy Policy to continue.',
  }
  const shownEmailError = emailTaken ? errors.email : v.shown('email', errors.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inFlight.current) return
    v.markSubmitted()
    if (hasErrors(errors)) {
      focusFirstError(errors, (f) => `signup-${f}`)
      return
    }
    inFlight.current = true
    setLoading(true)
    setServerError('')
    try {
      const user = await authService.signUpWithEmail({
        name: name.trim().replace(/\s+/g, ' '),
        email: email.trim(),
        password,
      })
      if (isPlatformApi() && (!(user as Record<string, unknown>).id || accessLevelOf(user) !== 'APPLICANT_RESTRICTED')) {
        throw new Error('Account was created but the session could not be established. Please sign in.')
      }
      adoptSession()
      navigate(landingPathFor(user), { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setTakenEmail(email.trim().toLowerCase())
        document.getElementById('signup-email')?.focus()
      } else {
        setServerError(describeApiError(err, 'We could not create your account. Please try again.'))
      }
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  const showRules = passwordFocused || password.length > 0

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3" aria-describedby={serverError ? 'signup-server-error' : undefined}>
      {serverError && (
        <div id="signup-server-error">
          <FormAlert message={serverError} />
        </div>
      )}

      <FormField id="signup-name" label="Full name" required error={v.shown('name', errors.name)}>
        {(control) => (
          <IconInput
            icon={User}
            control={control}
            error={v.shown('name', errors.name)}
            type="text"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={v.touch('name')}
            placeholder="e.g. Anand Verma"
            maxLength={100}
          />
        )}
      </FormField>

      <FormField
        id="signup-email"
        label="Work email"
        required
        error={shownEmailError}
        errorAction={
          emailTaken && (
            <>
              <Link to={AUTH_ROUTES.signIn} state={location.state} className="font-semibold text-blue-600 hover:underline">
                Sign in instead
              </Link>{' '}
              or{' '}
              <Link to={AUTH_ROUTES.forgotPassword} className="font-semibold text-blue-600 hover:underline">
                recover your password
              </Link>
              .
            </>
          )
        }
      >
        {(control) => (
          <IconInput
            icon={Mail}
            control={control}
            error={shownEmailError}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={v.touch('email')}
            placeholder="name@institution.edu"
            maxLength={254}
          />
        )}
      </FormField>

      <FormField id="signup-password" label="Password" required error={v.shown('password', errors.password)}>
        {(control) => (
          <>
            <PasswordInput
              control={{ ...control, 'aria-describedby': [control['aria-describedby'], 'signup-password-rules'].filter(Boolean).join(' ') }}
              error={v.shown('password', errors.password)}
              visible={showPassword}
              onToggle={() => setShowPassword((s) => !s)}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false)
                v.touch('password')()
              }}
              placeholder="Create a password"
            />
            <PasswordRequirementsPanel password={password} visible={showRules} />
          </>
        )}
      </FormField>

      <FormField id="signup-confirmPassword" label="Confirm password" required error={v.shown('confirmPassword', errors.confirmPassword)}>
        {(control) => (
          <PasswordInput
            control={control}
            error={v.shown('confirmPassword', errors.confirmPassword)}
            visible={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={v.touch('confirmPassword')}
            placeholder="Re-enter your password"
          />
        )}
      </FormField>

      <div>
        <label htmlFor="signup-terms" className="flex cursor-pointer items-start gap-2 text-xs text-slate-600">
          <input
            id="signup-terms"
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            aria-invalid={!!v.shown('terms', errors.terms)}
            aria-describedby={v.shown('terms', errors.terms) ? 'signup-terms-error' : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>I agree to the MyCampace Terms of Service and Privacy Policy</span>
        </label>
        {v.shown('terms', errors.terms) && (
          <p id="signup-terms-error" className="mt-1 pl-6 text-[11px] font-medium text-rose-600">
            {errors.terms}
          </p>
        )}
      </div>

      <SubmitButton loading={loading} idleLabel="Create account" busyLabel="Creating your account…" />
    </form>
  )
}

// ---------------------------------------------------------------------------------------------
// Card with the Sign in | Sign up switch
// ---------------------------------------------------------------------------------------------
export function AuthCard({ mode }: { mode: AuthMode }) {
  const location = useLocation()
  // Keep the "return to" location when switching between the two forms.
  const tabs: { mode: AuthMode; label: string; to: string }[] = [
    { mode: 'signin', label: 'Sign in', to: AUTH_ROUTES.signIn },
    { mode: 'signup', label: 'Sign up', to: AUTH_ROUTES.signUp },
  ]

  return (
    <div className="relative w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7">
      <nav aria-label="Account access" className="relative mb-5 flex rounded-2xl bg-slate-100/90 p-1">
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out',
            mode === 'signup' && 'translate-x-full',
          )}
        />
        {tabs.map((t) => (
          <Link
            key={t.mode}
            to={t.to}
            state={location.state}
            aria-current={mode === t.mode ? 'page' : undefined}
            className={cn(
              'relative z-10 w-1/2 rounded-xl py-2 text-center text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              mode === t.mode ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mb-4">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          {mode === 'signin' ? 'Welcome back' : 'Create your MyCampace account'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'signin'
            ? 'Sign in to continue to your MyCampace workspace.'
            : 'Register as your organization’s administrator, then set up your workspace.'}
        </p>
      </div>

      {/* key: switching forms resets their state */}
      {mode === 'signin' ? <SignInForm key="signin" /> : <SignUpForm key="signup" />}

      <p className="mt-4 border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
        {mode === 'signin' ? 'New to MyCampace?' : 'Already have an account?'}{' '}
        <Link
          to={mode === 'signin' ? AUTH_ROUTES.signUp : AUTH_ROUTES.signIn}
          state={location.state}
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
