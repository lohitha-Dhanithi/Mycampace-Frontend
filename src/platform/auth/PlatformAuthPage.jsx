// src/platform/auth/PlatformAuthPage.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Check,
  X,
  Play,
  BookOpen,
  Code,
  Globe,
  HelpCircle,
  Layers,
  GraduationCap,
  DollarSign,
  MonitorPlay,
  UserPlus,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Key,
  QrCode,
  Copy,
  AlertCircle,
} from 'lucide-react'
import { authService } from '@/services/authService'
import { useAuth } from '@/store/AuthContext'

export function PlatformAuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  // Mode: 'signin' | 'signup' | '2fa'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : searchParams.get('mode') === '2fa' ? '2fa' : 'signin'
  const [mode, setMode] = useState(initialMode)

  // Sign In State
  const [email, setEmail] = useState('vikram.aditya@abcschool.edu.in')
  const [password, setPassword] = useState('MyCampace@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Sign Up State
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(true)

  // 2FA State
  const [twoFaMethod, setTwoFaMethod] = useState('app') // 'app' | 'backup'
  const [twoFaCode, setTwoFaCode] = useState(['', '', '', '', '', ''])
  const [trustDevice, setTrustDevice] = useState(true)
  const [showTwoFaSetupModal, setShowTwoFaSetupModal] = useState(false)
  const [twoFaSetupStep, setTwoFaSetupStep] = useState(1)
  const [copiedKey, setCopiedKey] = useState(false)

  // General State
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showSupportModal, setShowSupportModal] = useState(false)

  const twoFaInputRefs = useRef([])

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Simulate credential check; if 2FA is triggered, move to '2fa' step
      // For demonstration of the requested 2FA screen:
      if (email.includes('2fa')) {
        setMode('2fa')
        setLoading(false)
        return
      }

      const user = await authService.signInWithEmail(email, password)
      if (login) await login({ email, password })
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }
    if (signupPassword.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }
    if (!agreedTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      await authService.signUpWithEmail({
        email: signupEmail,
        password: signupPassword,
      })
      // Pre-fill email so signin will work normally using the same email
      setEmail(signupEmail)
      setPassword(signupPassword)
      // Transition smoothly to success confirmation screen
      setMode('signup-success')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async (isSignup = false) => {
    setError('')
    setGoogleLoading(true)
    try {
      const user = await authService.signInWithGoogle()
      if (isSignup) {
        setEmail(user.email)
        setMode('signup-success')
      } else {
        if (login) await login({ email: user.email })
        navigate('/app')
      }
    } catch (err) {
      setError(isSignup ? 'Google Sign-Up failed. Please try again.' : 'Google Sign-In failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handle2FaCodeChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of 6 digits
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const updated = [...twoFaCode]
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d
      })
      setTwoFaCode(updated)
      if (digits.length === 6 && twoFaInputRefs.current[5]) {
        twoFaInputRefs.current[5].focus()
      }
      return
    }

    const updated = [...twoFaCode]
    updated[index] = value.slice(-1)
    setTwoFaCode(updated)

    // Auto-advance
    if (value && index < 5 && twoFaInputRefs.current[index + 1]) {
      twoFaInputRefs.current[index + 1].focus()
    }
  }

  const handle2FaKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFaCode[index] && index > 0) {
      twoFaInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify2Fa = (e) => {
    e.preventDefault()
    const entered = twoFaCode.join('')
    if (entered.length < 6) {
      setError('Please enter the full 6-digit authentication code.')
      return
    }
    // Success -> proceed to /app
    navigate('/app')
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // -------------------------------------------------------------
  // Video Showcase Data (3 Columns with distinct vertical loops)
  // -------------------------------------------------------------
  const col1Videos = [
    {
      id: 'v1',
      title: 'Platform Architecture & Product Hub Walkthrough',
      duration: '05:20',
      category: 'Platform Core',
      tagColor: 'bg-blue-100 text-blue-700',
      thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description: 'How MyCampace separates platform identity from isolated product applications.',
    },
    {
      id: 'v2',
      title: 'Academics: Curricula, Course Regulations & Credits',
      duration: '07:45',
      category: 'Academics',
      tagColor: 'bg-indigo-100 text-indigo-700',
      thumb: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      description: 'Setting up multi-board programs, sections and faculty workload rosters.',
    },
    {
      id: 'v3',
      title: 'Finance Automation: Dynamic Fee Structures & Gateways',
      duration: '06:10',
      category: 'Finance',
      tagColor: 'bg-amber-100 text-amber-700',
      thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      description: 'Configuring split fee heads, automated invoice schedules and reconciliation.',
    },
    {
      id: 'v4',
      title: 'Admissions CRM: Lead Pipelines & Counselling Funnel',
      duration: '04:30',
      category: 'Admissions',
      tagColor: 'bg-emerald-100 text-emerald-700',
      thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      description: 'Managing walk-in interviews, online forms and merit-list generation.',
    },
  ]

  const col2Videos = [
    {
      id: 'v5',
      title: 'LMS: Interactive Multimedia Modules & Quizzes',
      duration: '08:15',
      category: 'LMS',
      tagColor: 'bg-purple-100 text-purple-700',
      thumb: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
      description: 'Creating blended video lessons, student progress rubrics and test banks.',
    },
    {
      id: 'v6',
      title: 'Product-Specific RBAC: Multi-Product Role Mapping',
      duration: '05:50',
      category: 'Security',
      tagColor: 'bg-blue-100 text-blue-700',
      thumb: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      description: 'How one user can be an Admin in LMS and a Teacher in Academics without conflicts.',
    },
    {
      id: 'v7',
      title: 'Campus Operations: Hostels, Transport GPS & Libraries',
      duration: '06:40',
      category: 'Operations',
      tagColor: 'bg-teal-100 text-teal-700',
      thumb: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      description: 'Fleet routing, RFID accession registers, and warden gate pass tracking.',
    },
    {
      id: 'v8',
      title: 'REST API & Webhook Integrations for Developers',
      duration: '09:20',
      category: 'Developers',
      tagColor: 'bg-rose-100 text-rose-700',
      thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      description: 'Connecting third-party SIS, payment gateways and ERP data lakes.',
    },
  ]

  const col3Videos = [
    {
      id: 'v9',
      title: 'White Label Deployment: Custom Domains & Theming',
      duration: '04:55',
      category: 'White Label',
      tagColor: 'bg-sky-100 text-sky-700',
      thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      description: 'Branded portal setups, custom email domains, and tenant isolation.',
    },
    {
      id: 'v10',
      title: 'AI Copilot & Predictive Institutional Analytics',
      duration: '06:05',
      category: 'Intelligence',
      tagColor: 'bg-cyan-100 text-cyan-700',
      thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      description: 'Generating lesson outlines, predicting fee dropouts, and NIRF dashboards.',
    },
    {
      id: 'v11',
      title: 'Student SIS: Digital Enrolments, Exits & Alumni Records',
      duration: '05:30',
      category: 'SIS',
      tagColor: 'bg-indigo-100 text-indigo-700',
      thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
      description: 'Full student lifecycle management across academic cohorts.',
    },
    {
      id: 'v12',
      title: 'Institutional Audit Logs & SOC2 Compliance Controls',
      duration: '07:15',
      category: 'Compliance',
      tagColor: 'bg-slate-100 text-slate-700',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
      description: 'Maintaining tamper-proof audit trails for government and CBSE accreditations.',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ============================================================== */}
      {/* 1. AUTHENTICATION HEADER                                       */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 h-14 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-xs group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                MYCAMPACE
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Platform Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => scrollToSection('learn')}
            className="hover:text-blue-600 transition-colors"
          >
            Learn & Videos
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('knowledge')}
            className="hover:text-blue-600 transition-colors"
          >
            Knowledge Hub
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('api')}
            className="hover:text-blue-600 transition-colors"
          >
            API Docs
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('whitelabel')}
            className="hover:text-blue-600 transition-colors"
          >
            White Label
          </button>
        </nav>

        {/* Right: Support */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Need help?</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2 & 3. HERO AUTHENTICATION & FLOATING ECOSYSTEM VISUAL         */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/30 min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle ambient blur backdrops */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Right Column (Desktop) / Primary Form: Authentication Container with Animated Segmented Control */}
          <div className="lg:col-span-6 lg:order-2 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xl shadow-slate-200/50 relative">
              {/* Animated Segmented Control Toggle (Sign In | Sign Up) */}
              {mode !== '2fa' && mode !== 'signup-success' && (
                <div className="mb-3.5 p-1 bg-slate-100/90 rounded-2xl flex relative">
                  <div
                    className={`absolute inset-y-1 w-1/2 bg-white rounded-xl shadow-xs transition-transform duration-300 ease-out ${
                      mode === 'signup' ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setError('')
                    }}
                    className={`relative z-10 w-1/2 py-1.5 text-xs font-bold transition-colors text-center ${
                      mode === 'signin' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                    }}
                    className={`relative z-10 w-1/2 py-1.5 text-xs font-bold transition-colors text-center ${
                      mode === 'signup' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="mb-3 flex items-center gap-2 p-2.5 text-xs text-red-700 bg-red-50 rounded-xl border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STATE A: SIGN IN FORM                                    */}
              {/* -------------------------------------------------------- */}
              {mode === 'signin' && (
                <div className="space-y-3 animate-in fade-in-0 duration-200">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Welcome back
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sign in to continue to your MyCampace workspace
                    </p>
                  </div>

                  {/* Continue with Google (Visually Secondary) */}
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn(false)}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs disabled:opacity-50"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>

                  <div className="relative my-2.5 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      OR
                    </span>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@institution.com"
                          className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="text-[11px] font-bold text-slate-700">Password</label>
                        <Link
                          to="/auth/forgot-password"
                          className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-9 pl-9 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>Remember me</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                      <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STATE B: SIGN UP FORM                                    */}
              {/* -------------------------------------------------------- */}
              {mode === 'signup' && (
                <div className="space-y-3.5 animate-in fade-in-0 duration-200">
                  <div className="mb-2">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Create your MyCampace account
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Start building your institution workspace
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn(true)}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs disabled:opacity-50"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative my-2.5 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      OR
                    </span>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="name@institution.com"
                          className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-9 pl-9 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showSignupConfirm ? 'text' : 'password'}
                          required
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-9 pl-9 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showSignupConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => setAgreedTerms(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>I agree to Terms & Privacy Policy</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                      <span>{loading ? 'Creating...' : 'Create MyCampace Account'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STATE C: SIGN UP SUCCESS / EXECUTIVE CONTACT CONFIRMATION */}
              {/* -------------------------------------------------------- */}
              {mode === 'signup-success' && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-2 border border-emerald-100 shadow-2xs">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Welcome to MyCampace
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                      Account created successfully
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Your account has been created successfully. Our executive will contact you shortly to understand your requirements and help you choose the right MyCampace solutions for your institution.
                    </p>
                  </div>

                  {/* Assistance Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
                    <p className="font-bold text-slate-800 mb-2">
                      You can expect assistance with:
                    </p>
                    <ul className="space-y-1.5 text-[11.5px] text-slate-600">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Understanding your institution&apos;s requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Selecting the right products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Product demonstrations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Pricing and plans</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Setup and onboarding</span>
                      </li>
                    </ul>
                  </div>

                  {/* Approval Information Note */}
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Sign in will work normally using <strong className="font-semibold text-slate-900">{email}</strong> once approved by the admin panel for your institution.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setError('')
                    }}
                    className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* STATE C: TWO-FACTOR AUTHENTICATION (2FA)                 */}
              {/* -------------------------------------------------------- */}
              {mode === '2fa' && (
                <div className="space-y-5 animate-in fade-in-0 duration-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Verify your identity
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the 6-digit authentication code to confirm access.
                    </p>
                  </div>

                  {/* Method Toggle: Authenticator App vs Backup Code */}
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setTwoFaMethod('app')}
                      className={`w-1/2 py-1.5 rounded-lg transition-all ${
                        twoFaMethod === 'app' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Authenticator App
                    </button>
                    <button
                      type="button"
                      onClick={() => setTwoFaMethod('backup')}
                      className={`w-1/2 py-1.5 rounded-lg transition-all ${
                        twoFaMethod === 'backup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Backup Code
                    </button>
                  </div>

                  <form onSubmit={handleVerify2Fa} className="space-y-5">
                    {/* 6-digit Input Boxes */}
                    <div className="flex items-center justify-between gap-2 max-w-xs mx-auto">
                      {twoFaCode.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (twoFaInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handle2FaCodeChange(idx, e.target.value)}
                          onKeyDown={(e) => handle2FaKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trustDevice}
                          onChange={(e) => setTrustDevice(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span>Trust this device for 30 days</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTwoFaSetupModal(true)}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Setup 2FA
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                    >
                      <span>Verify & Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin')
                        setError('')
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Left Column (Desktop): Floating MyCampace Ecosystem Visualization */}
          <div className="hidden lg:flex lg:col-span-6 lg:order-1 flex-col items-center justify-center relative select-none">
            <div className="relative w-full max-w-lg h-[410px] flex items-center justify-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border border-blue-200/40 animate-pulse pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-indigo-100/60 pointer-events-none" />

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 410">
                <line x1="250" y1="205" x2="110" y2="80" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="390" y2="80" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="80" y2="205" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="420" y2="205" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="130" y2="340" stroke="#A5F3FC" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="370" y2="340" stroke="#DDD6FE" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>

              {/* Center Core: MyCampace Platform Diamond */}
              <div className="relative z-20 h-22 w-22 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                <div className="h-full w-full rounded-[22px] bg-slate-900/90 flex flex-col items-center justify-center text-white text-center p-2">
                  <div className="h-6 w-6 rounded-lg bg-blue-500 flex items-center justify-center font-black text-xs">
                    M
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">
                    MYCAMPACE
                  </span>
                  <span className="text-[8px] text-blue-300 font-bold uppercase">Core</span>
                </div>
              </div>

              {/* Floating Node 1: Academics (Top Left) */}
              <div className="absolute top-4 left-10 animate-float-slow">
                <div className="p-2.5 rounded-2xl bg-white border border-blue-200/80 shadow-md shadow-blue-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Academics</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Curriculum & Classes</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 2: LMS (Top Right) */}
              <div className="absolute top-4 right-8 animate-float-medium">
                <div className="p-2.5 rounded-2xl bg-white border border-purple-200/80 shadow-md shadow-purple-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <MonitorPlay className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">LMS</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Digital Learning</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 3: Finance (Mid Left) */}
              <div className="absolute top-40 -left-2 animate-float-fast">
                <div className="p-2.5 rounded-2xl bg-white border border-amber-200/80 shadow-md shadow-amber-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Finance</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Fees & Billing</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 4: Admissions (Mid Right) */}
              <div className="absolute top-40 -right-2 animate-float-slow">
                <div className="p-2.5 rounded-2xl bg-white border border-emerald-200/80 shadow-md shadow-emerald-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Admissions</h4>
                    <span className="text-[10px] text-slate-400 font-medium">CRM & Leads</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 5: Analytics (Bottom Left) */}
              <div className="absolute bottom-4 left-10 animate-float-medium">
                <div className="p-2.5 rounded-2xl bg-white border border-cyan-200/80 shadow-md shadow-cyan-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Analytics</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Executive KPIs</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 6: Operations (Bottom Right) */}
              <div className="absolute bottom-4 right-8 animate-float-fast">
                <div className="p-2.5 rounded-2xl bg-white border border-indigo-200/80 shadow-md shadow-indigo-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Operations</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Campus & Fleet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom trust banner */}
            <div className="mt-2.5 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Single Sign-On Across All Institutional Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. LEARN — 3-COLUMN VERTICAL INFINITE VIDEO SHOWCASE            */}
      {/* ============================================================== */}
      <section id="learn" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
              Video Knowledge & Demos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learn MyCampace
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Product walkthroughs, tutorials and platform updates. Hover any stream to pause and inspect.
            </p>
          </div>

          {/* 3 Columns Showcase with Independent Vertical Movements */}
          <div className="relative h-[620px] overflow-hidden rounded-3xl p-4 bg-white/70 border border-slate-200/90 shadow-lg shadow-slate-200/50 pause-on-hover">
            {/* Top and Bottom gradient masks for smooth seamless fading */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
              {/* Column 1: Moves UPWARD continuously */}
              <div className="overflow-hidden relative h-full">
                <div className="animate-scroll-up space-y-4">
                  {[...col1Videos, ...col1Videos].map((video, idx) => (
                    <div
                      key={`col1-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Moves DOWNWARD continuously */}
              <div className="hidden sm:block overflow-hidden relative h-full">
                <div className="animate-scroll-down space-y-4">
                  {[...col2Videos, ...col2Videos].map((video, idx) => (
                    <div
                      key={`col2-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-purple-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Moves UPWARD continuously */}
              <div className="hidden lg:block overflow-hidden relative h-full">
                <div className="animate-scroll-up space-y-4">
                  {[...col3Videos, ...col3Videos].map((video, idx) => (
                    <div
                      key={`col3-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. KNOWLEDGE HUB                                               */}
      {/* ============================================================== */}
      <section id="knowledge" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              KNOWLEDGE HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to get the most out of MyCampace.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Getting Started */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Getting Started</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Fast-track your onboarding with step-by-step institutional configuration tutorials.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Setup guides & domain verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>First steps: Campus hierarchy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Organization profile & branding</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Explore Getting Started</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Product Guides */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Product Guides</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Deep-dive manuals for each education product within the MyCampace ecosystem.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Academics: Curricula & Schedules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>LMS: Course creation & Rubrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Finance: Fee structures & Gateways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Admissions & Campus Operations</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600 group-hover:text-purple-700">
                <span>Explore Product Guides</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Help Center */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Help Center</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Answers to frequent operational queries, troubleshooting, and enterprise support tickets.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Frequently Asked Questions (FAQs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Troubleshooting & Service Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Account Security & 2FA Recovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Billing Invoices & Subscriptions</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>Explore Help Center</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. API DOCUMENTATION — DEVELOPER PLATFORM                      */}
      {/* ============================================================== */}
      <section id="api" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Headline & Cards */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  DEVELOPER PLATFORM
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
                  Build with MyCampace
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Connect your applications, data lakes, and custom workflows with secure RESTful endpoints and real-time event webhooks.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span>API Documentation</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Explore OpenAPI specifications, JWT authorization schemes, and payload parameters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span>API Reference & SDKs</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Browse endpoints for Academics, LMS, Finance Ledgers, and Admissions pipelines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>Developer Guides</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Production integration examples, rate-limiting guidelines, and webhook delivery.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span>Explore API Documentation</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Developer Code Snippet Visual */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl font-mono text-xs">
                {/* Header dots */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">REST • OpenAPI 3.0</span>
                </div>

                {/* Code Body */}
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                    <span className="bg-emerald-950 px-2 py-0.5 rounded font-bold">POST</span>
                    <span>/api/v1/students/enrolment</span>
                  </div>

                  <p className="text-slate-500 text-[10px]">// Request Payload</p>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-blue-300 overflow-x-auto leading-relaxed">
{`{
  "studentId": "STU-8921",
  "programCode": "CBSE-SR",
  "academicYear": "2026-27",
  "campusId": "camp-hyd-main",
  "productEntitlement": ["academics", "lms"]
}`}
                  </pre>

                  <p className="text-slate-500 text-[10px] pt-1">// Response: 200 OK</p>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "status": "success",
  "enrolmentId": "ENR-2026-9041",
  "provisions": {
    "academics": "Active",
    "lms": "Provisioned",
    "feeLedger": "Generated"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. MYCAMPACE WHITE LABEL                                       */}
      {/* ============================================================== */}
      <section id="whitelabel" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/80 border border-blue-200/80 p-8 sm:p-12 shadow-lg shadow-blue-500/5">
          <div className="max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              ENTERPRISE SOLUTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              MyCampace White Label
            </h2>
            <p className="text-base font-semibold text-blue-700 mt-1">
              Your institution. Your brand. Powered by MyCampace.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Universities, multi-campus groups, and edtech partners can run the entire MyCampace product suite under their own independent institutional branding and custom domains.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-6 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Custom logo, favicon & institutional branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Custom domain & SSL (e.g. portal.college.edu)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Tailored institutional color palettes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Completely branded student & faculty portal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Dedicated SLA & enterprise API support</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Explore White Label</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="h-11 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
              >
                Talk to our team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. ENTERPRISE FOOTER                                          */}
      {/* ============================================================== */}
      <footer className="py-12 px-4 sm:px-8 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              M
            </div>
            <span className="font-bold text-slate-800">MyCampace Education Operating System</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/app" className="hover:text-blue-600">Product Hub</Link>
            <Link to="/app/products" className="hover:text-blue-600">Marketplace</Link>
            <button type="button" onClick={() => scrollToSection('api')} className="hover:text-blue-600">APIs</button>
            <button type="button" onClick={() => scrollToSection('whitelabel')} className="hover:text-blue-600">White Label</button>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              SOC2 Type II Certified
            </span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-200/80 text-center text-[11px] text-slate-400">
          © 2026 MyCampace Technologies Inc. All rights reserved. Built for modern educational institutions.
        </div>
      </footer>

      {/* ============================================================== */}
      {/* MODAL 1: VIDEO PLAYER MODAL                                    */}
      {/* ============================================================== */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedVideo.tagColor}`}>
                  {selectedVideo.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedVideo.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player Mockup / Embed */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
              <img
                src={selectedVideo.thumb}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 bg-slate-950/40">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3 hover:scale-105 transition-transform cursor-pointer">
                  <Play className="h-6 w-6 ml-1 fill-current" />
                </div>
                <p className="text-sm font-bold">{selectedVideo.title}</p>
                <p className="text-xs text-slate-300 mt-1 max-w-md">{selectedVideo.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Duration: {selectedVideo.duration} • 1080p Full HD</span>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: 2FA SETUP MODAL                                       */}
      {/* ============================================================== */}
      {showTwoFaSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Configure Two-Factor Auth</h3>
                  <p className="text-[10px] text-slate-400">Step {twoFaSetupStep} of 4</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTwoFaSetupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Setup Steps */}
            {twoFaSetupStep === 1 && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Secure Your Account</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Two-factor authentication adds an extra layer of security to prevent unauthorized access to student and financial data.
                </p>
                <button
                  type="button"
                  onClick={() => setTwoFaSetupStep(2)}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Continue to Scan QR Code
                </button>
              </div>
            )}

            {twoFaSetupStep === 2 && (
              <div className="space-y-4 text-center">
                <h4 className="text-sm font-bold text-slate-900">Scan QR Code</h4>
                <p className="text-xs text-slate-500">
                  Open Google Authenticator or Authy on your mobile device and scan this code:
                </p>

                {/* QR Code SVG Graphic */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl inline-block shadow-xs">
                  <QrCode className="h-32 w-32 text-slate-900" />
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700 font-bold">JBSWY3DPEHPK3PXP</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('JBSWY3DPEHPK3PXP')
                      setCopiedKey(true)
                      setTimeout(() => setCopiedKey(false), 2000)
                    }}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTwoFaSetupStep(3)}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Enter Verification Code →
                </button>
              </div>
            )}

            {twoFaSetupStep === 3 && (
              <div className="space-y-4 text-center">
                <h4 className="text-sm font-bold text-slate-900">Enter 6-Digit Code</h4>
                <p className="text-xs text-slate-500">
                  Enter the confirmation code generated by your authenticator app:
                </p>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i === 0 ? '4' : i === 1 ? '8' : ''}
                      className="w-10 h-11 text-center font-bold border border-slate-200 bg-slate-50 rounded-lg text-sm"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFaSetupStep(4)}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Generate Backup Codes →
                </button>
              </div>
            )}

            {twoFaSetupStep === 4 && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">2FA Successfully Enabled!</h4>
                <p className="text-xs text-slate-500">
                  Save these single-use backup recovery codes in a secure vault:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 grid grid-cols-2 gap-2 text-left">
                  <span>• 8912-3490</span>
                  <span>• 7741-2094</span>
                  <span>• 3319-8802</span>
                  <span>• 9924-1180</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTwoFaSetupModal(false)}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Finish & Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: NEED HELP / SUPPORT MODAL                             */}
      {/* ============================================================== */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">MyCampace Institutional Support</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Need assistance with onboarding, enterprise Single Sign-On (SSO), or product activation?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-800">Enterprise Support Desk:</p>
                <p className="font-mono text-slate-600">support@mycampace.com</p>
                <p className="font-mono text-slate-600">+91 40 2345 6789 (Mon–Fri, 9am–6pm IST)</p>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="h-9 px-4 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
