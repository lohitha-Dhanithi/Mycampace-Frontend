// src/modules/auth/ResetPasswordPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { authService } from '@/services/authService'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [token, setToken] = useState('MC-AUTH-8910')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    await authService.resetPassword(token, newPassword)
    setLoading(false)
    setSuccess(true)
  }

  return (
    <Card className="border-slate-200 shadow-lg bg-white">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Set New Password</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Create a strong password following institutional cryptographic compliance guidelines.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="py-4 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Password Updated Successfully</h4>
            <p className="text-xs text-slate-500">
              Your institutional credentials have been renewed. You may now log in with your updated credentials.
            </p>
            <div className="pt-2">
              <Button size="sm" className="w-full text-xs" onClick={() => navigate('/login')}>
                Sign In Now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Verification Code</label>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-10 text-xs"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 text-xs font-semibold" disabled={loading}>
              {loading ? 'Securing account...' : 'Save New Password'}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="pt-0 border-t border-slate-100 flex items-center justify-center p-4">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Login
        </Link>
      </CardFooter>
    </Card>
  )
}
