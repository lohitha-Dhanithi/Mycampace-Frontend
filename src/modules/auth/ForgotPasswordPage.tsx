// src/modules/auth/ForgotPasswordPage.tsx
// Password recovery help. The platform API has no self-service reset endpoint yet, so this page
// explains how to regain access instead of pretending a reset email was sent.
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, KeyRound, LifeBuoy, Mail, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AUTH_ROUTES } from '@/platform/auth/landing'

const SUPPORT_EMAIL = 'support@mycampace.com'

export function ForgotPasswordPage() {
  const location = useLocation()
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Password reset request')}&body=${encodeURIComponent(
    'Hello MyCampace Support,\n\nPlease help me reset the password for my account.\n\nRegistered email:\nOrganization name:\n',
  )}`

  return (
    <Card className="border-slate-200 bg-white shadow-lg">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">Forgot your password?</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Self-service password reset isn’t available yet. Here’s how to get back into your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">You registered your organization</p>
            <p className="mt-0.5">
              Email our support team from your registered email address. We’ll verify your identity and reset your password.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">You were added by your institution</p>
            <p className="mt-0.5">Ask your institution’s MyCampace administrator to reset your access.</p>
          </div>
        </div>

        <a
          href={mailto}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email {SUPPORT_EMAIL}
        </a>
      </CardContent>

      <CardFooter className="flex items-center justify-center border-t border-slate-100 p-4">
        <Link
          to={AUTH_ROUTES.signIn}
          state={location.state}
          className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
