// src/modules/finance/pages/FeeRemindersPage.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { INITIAL_REMINDER_RULES } from '../data/financeMockData'
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle,
  Save,
  ArrowLeft,
  Radio,
} from 'lucide-react'

export function FeeRemindersPage() {
  const [rules, setRules] = useState([...INITIAL_REMINDER_RULES])
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleToggle = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const handleUpdateTemplate = (id, newTemplate) => {
    setRules(rules.map(r => r.id === id ? { ...r, template: newTemplate } : r))
  }

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const getChannelIcon = (ch) => {
    switch (ch.toLowerCase()) {
      case 'email':
        return <Mail className="h-3 w-3" />
      case 'sms':
        return <Smartphone className="h-3 w-3" />
      case 'whatsapp':
        return <MessageSquare className="h-3 w-3" />
      default:
        return <Bell className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Fee Reminder Rules & Dispatch Triggers"
        description="Automated cadence for upcoming fee due alerts, due-date notices, and progressive overdue escalations."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/dues">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Dues
              </Link>
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Rules
            </Button>
          </div>
        }
      />

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Reminder rules and dispatch event hooks successfully saved to Communication module.</span>
        </div>
      )}

      {/* Communication Engine Hook Notification */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-3">
        <Radio className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Abstracted Communication Integration:</span> When triggered, reminders fire standardized event hooks (<code className="font-mono bg-white px-1 rounded text-blue-800">finance.fee_due</code>, <code className="font-mono bg-white px-1 rounded text-blue-800">finance.fee_overdue</code>) consumed by the central MyCampace Multichannel Communication Service.
        </div>
      </div>

      {/* Rules Cards */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={rule.active ? 'success' : 'secondary'} className="text-[10px]">
                  {rule.active ? 'Active' : 'Disabled'}
                </Badge>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">{rule.name}</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Trigger: {rule.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {rule.channels.map((ch, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] bg-slate-50 flex items-center gap-1">
                      {getChannelIcon(ch)}
                      {ch}
                    </Badge>
                  ))}
                </div>
                <Switch
                  checked={rule.active}
                  onCheckedChange={() => handleToggle(rule.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Notification Message Template:
              </label>
              <Textarea
                value={rule.template}
                onChange={(e) => handleUpdateTemplate(rule.id, e.target.value)}
                className="text-xs font-sans resize-none h-16"
              />
              <div className="text-[11px] text-slate-400">
                Variables supported: <code className="text-slate-600 font-mono">{'{StudentName}'}</code>, <code className="text-slate-600 font-mono">{'{Amount}'}</code>, <code className="text-slate-600 font-mono">{'{DueDate}'}</code>, <code className="text-slate-600 font-mono">{'{PaymentLink}'}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
