// src/modules/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { authService } from '@/services/authService'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await authService.requestPasswordReset(email)
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <Card className="border-slate-200 shadow-lg bg-white">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Reset Password</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your registered institutional email to receive a secure password recovery authorization code.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="py-4 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Recovery Instructions Sent</h4>
            <p className="text-xs text-slate-500">
              We have dispatched a password reset link to <strong className="text-slate-700">{email}</strong>. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link to="/reset-password">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Proceed to Enter New Password
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@institution.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-xs font-semibold" disabled={loading}>
              {loading ? 'Transmitting link...' : 'Send Recovery Link'}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="pt-0 border-t border-slate-100 flex items-center justify-center p-4">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Return to Login
        </Link>
      </CardFooter>
    </Card>
  )
}
