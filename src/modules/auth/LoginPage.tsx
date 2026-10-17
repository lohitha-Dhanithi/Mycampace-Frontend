// src/modules/auth/LoginPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/store/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please provide your corporate email and password.')
      return
    }

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please verify your institutional identity.')
    }
  }

  return (
    <Card className="border-slate-200 shadow-lg bg-white">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">Institutional Sign In</CardTitle>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Enterprise SSO
          </span>
        </div>
        <CardDescription className="text-xs text-slate-500">
          Enter your registered institutional credentials to access MyCampace OS.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email or Mobile Number</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="name@institution.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-10 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <Checkbox checked={rememberMe} onChange={setRememberMe} />
              <span>Remember this workstation</span>
            </label>
          </div>

          <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to MyCampace'}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="pt-0 border-t border-slate-100 flex flex-col items-center justify-center p-4">
        <p className="text-[11px] text-slate-400 text-center">
          Encrypted with 256-bit TLS. Unauthorized access is logged under the Institutional IT Act.
        </p>
      </CardFooter>
    </Card>
  )
}
