// src/platform/settings/GlobalSettingsPage.jsx
import React, { useState, useEffect } from 'react'
import {
  Settings,
  Shield,
  Lock,
  History,
  Check,
  Save,
  Key,
  Database,
  FileText,
  Smartphone,
  QrCode,
  Copy,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Laptop,
  CheckCircle,
} from 'lucide-react'
import { auditService } from '@/services/auditService'

export function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState('security')
  const [logs, setLogs] = useState([])

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [mfaEnforcement, setMfaEnforcement] = useState('admins') // 'optional' | 'admins' | 'all'
  const [showMfaModal, setShowMfaModal] = useState(false)
  const [mfaStep, setMfaStep] = useState(1)
  const [testCode, setTestCode] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [trustedDevicesCount, setTrustedDevicesCount] = useState(3)

  useEffect(() => {
    auditService.getLogs().then(setLogs)
  }, [])

  const handleCopyKey = () => {
    navigator.clipboard?.writeText('MYCAMP-77X9-K2L4-99P0')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleSavePolicies = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
          <Settings className="h-4 w-4" />
          <span>Platform Administration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Global Settings & Security Policies
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Platform-level security policies, Multi-Factor Authentication (MFA), and unified compliance audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Security & MFA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unified Audit Logs
        </button>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in-0">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Security and MFA policies updated successfully across all institutional products.</span>
        </div>
      )}

      {/* Security & MFA Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Section 1: Multi-Factor Authentication (MFA) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Multi-Factor Authentication (MFA / 2FA)</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    mfaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mfaEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Require a 6-digit one-time code from an authenticator app when signing in to MyCampace.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMfaModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs flex items-center gap-2"
                >
                  <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                  <span>Configure Authenticator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    mfaEnabled
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
                </button>
              </div>
            </div>

            {/* MFA Enforcement Rules */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Institutional Enforcement Policy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  mfaEnforcement === 'optional'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="mfaEnforcement"
                    value="optional"
                    checked={mfaEnforcement === 'optional'}
                    onChange={(e) => setMfaEnforcement(e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-bold text-xs text-slate-900 mb-1">Optional</div>
                  <p className="text-[11px] text-slate-500">
                    Users can opt in to MFA individually from their personal profile settings.
                  </p>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  mfaEnforcement === 'admins'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="mfaEnforcement"
                    value="admins"
                    checked={mfaEnforcement === 'admins'}
                    onChange={(e) => setMfaEnforcement(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Enforced for Admins</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Mandatory for Super Admins, Department Heads, and Finance Officers.
                  </p>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  mfaEnforcement === 'all'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="mfaEnforcement"
                    value="all"
                    checked={mfaEnforcement === 'all'}
                    onChange={(e) => setMfaEnforcement(e.target.value)}
                    className="sr-only"
                  />
                  <div className="font-bold text-xs text-slate-900 mb-1">Enforced for All</div>
                  <p className="text-[11px] text-slate-500">
                    Every faculty member, staff, and student must use 2FA to access any product.
                  </p>
                </label>
              </div>
            </div>

            {/* Trusted Devices Section */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Laptop className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Trusted Devices ({trustedDevicesCount} active)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Devices remembered for 30 days that bypass the 6-digit code on familiar networks.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrustedDevicesCount(0)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
              >
                Revoke All Trusted Devices
              </button>
            </div>
          </div>

          {/* Section 2: OAuth & SSO Providers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Single Sign-On (SSO) Providers</h3>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs shadow-2xs">
                  G
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Google Workspace SSO</p>
                  <p className="text-[11px] text-slate-500">
                    Allow faculty and students to authenticate via Google domain credentials.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-purple-600 text-xs shadow-2xs">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">SAML 2.0 / Okta Enterprise</p>
                  <p className="text-[11px] text-slate-500">
                    Connect institutional Active Directory or custom identity federation.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                Enterprise Addon
              </span>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSavePolicies}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Security Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">
              Cross-Product Activity & Security Trail
            </h3>
            <span className="text-[11px] text-slate-400">SOC2 Type II Immutable Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Product / Domain</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="py-3 px-4 sm:px-6 text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {log.product}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{log.action}</td>
                    <td className="py-3 px-4 font-sans text-slate-600">{log.details}</td>
                    <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MFA Configuration Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <button
              type="button"
              onClick={() => {
                setShowMfaModal(false)
                setMfaStep(1)
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Shield className="h-4 w-4" />
                <span>Step {mfaStep} of 3</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {mfaStep === 1 && 'Configure Authenticator App'}
                {mfaStep === 2 && 'Verify 6-Digit Code'}
                {mfaStep === 3 && 'Save Backup Recovery Codes'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mfaStep === 1 && 'Scan the QR code with Google Authenticator, 1Password, or Authy.'}
                {mfaStep === 2 && 'Enter the 6-digit confirmation code generated by your app.'}
                {mfaStep === 3 && 'Keep these one-time codes in a safe place in case you lose your phone.'}
              </p>
            </div>

            {/* Step 1: Scan QR Code */}
            {mfaStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
                  <div className="h-44 w-44 bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/MyCampace:admin@institution.edu?secret=MYCAMP77X9K2L499P0&issuer=MyCampace"
                      alt="TOTP QR Code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">Scan with your camera or authenticator</span>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Manual Key</span>
                    <code className="text-xs font-mono font-bold text-slate-800">MYCAMP-77X9-K2L4-99P0</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 shrink-0 ml-2"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMfaStep(2)}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Continue to Verification</span>
                </button>
              </div>
            )}

            {/* Step 2: Enter Verification Code */}
            {mfaStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    className="w-full h-11 text-center font-mono tracking-widest text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMfaStep(1)}
                    className="w-1/3 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setMfaStep(3)}
                    disabled={testCode.length < 6}
                    className="w-2/3 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Verify Code</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Backup Codes */}
            {mfaStep === 3 && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-700 grid grid-cols-2 gap-2 text-center">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100">8942-1049</div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100">3091-8842</div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100">7710-9281</div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-100">6521-4402</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMfaEnabled(true)
                    setShowMfaModal(false)
                    setMfaStep(1)
                    setSaveSuccess(true)
                    setTimeout(() => setSaveSuccess(false), 3000)
                  }}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <Check className="h-4 w-4" />
                  <span>Done & Activate MFA</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

