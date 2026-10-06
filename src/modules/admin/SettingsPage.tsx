// src/modules/admin/SettingsPage.jsx
import React, { useState } from 'react'
import { Settings, Shield, Bell, Database, Lock, Save, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    sessionTimeout: '30',
    enforce2FA: true,
    allowParentSignup: false,
    defaultCurrency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)',
    systemEmail: 'no-reply@mycampace.edu.in',
    backupFrequency: 'Daily Automated (02:00 AM UTC)',
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional System Settings"
        subtitle="Configure enterprise parameters, multi-factor authentication, retention policies and automated backups"
        actions={
          <Button size="sm" onClick={handleSave} className="text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save Configuration
          </Button>
        }
      />

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>System configuration successfully updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Security & Authentication Policies</CardTitle>
            <CardDescription>Enterprise login and session constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-700">Idle Session Inactivity Timeout (Minutes)</label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="h-9 text-xs mt-1"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                checked={settings.enforce2FA}
                onChange={(checked) => setSettings({ ...settings, enforce2FA: checked })}
              />
              <div>
                <span className="font-semibold text-slate-800 block">Enforce Two-Factor Authentication (2FA)</span>
                <span className="text-slate-400 text-[11px]">Mandatory for Administrators, Principals and Accountants</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                checked={settings.allowParentSignup}
                onChange={(checked) => setSettings({ ...settings, allowParentSignup: checked })}
              />
              <div>
                <span className="font-semibold text-slate-800 block">Self-Service Parent Portal Registration</span>
                <span className="text-slate-400 text-[11px]">Requires mobile OTP verification matching student record</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Regional & Localization Defaults</CardTitle>
            <CardDescription>Timezone, currencies and dispatch gateways</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold text-slate-700">Default Currency</label>
              <Select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="h-9 text-xs mt-1"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">System Timezone</label>
              <Input
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="h-9 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Transactional System Email</label>
              <Input
                value={settings.systemEmail}
                onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
                className="h-9 text-xs mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
