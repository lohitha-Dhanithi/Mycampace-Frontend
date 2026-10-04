// src/modules/admissions/components/CommunicationTimeline.jsx
import React, { useState } from 'react'
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  Bell,
  Clock,
  CheckCheck,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function CommunicationTimeline({ communications = [], onSendMessage }) {
  const [logOpen, setLogOpen] = useState(false)
  const [form, setForm] = useState({
    type: 'Email',
    recipient: '',
    subject: '',
    message: '',
  })

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-emerald-600" />
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'call':
        return <Phone className="h-4 w-4 text-indigo-600" />
      default:
        return <Bell className="h-4 w-4 text-purple-600" />
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (onSendMessage) {
      onSendMessage({
        id: `comm-${Date.now()}`,
        type: form.type,
        recipient: form.recipient,
        sentBy: 'Current User',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: form.subject || form.message.slice(0, 40),
        message: form.message,
      })
    }
    setLogOpen(false)
    setForm({ type: 'Email', recipient: '', subject: '', message: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Communication History</h4>
          <p className="text-[11px] text-slate-500">Multichannel communication logs with applicant & parents</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setLogOpen(true)} className="h-8 text-xs gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Send Message / Log Communication
        </Button>
      </div>

      {communications.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
          No communication history recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {communications.map((comm) => (
            <div key={comm.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-100">{getIcon(comm.type)}</span>
                    <span className="text-xs font-bold text-slate-900">{comm.type}</span>
                    <span className="text-xs text-slate-500">to</span>
                    <span className="text-xs font-semibold text-slate-700">{comm.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {comm.date}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {comm.status || 'Sent'}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800">{comm.subject}</div>
                {comm.message && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    {comm.message}
                  </p>
                )}
                <div className="text-[10px] text-slate-400">Sent by: {comm.sentBy || 'Admissions System'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log communication dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send / Log Communication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSend} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Channel</label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS Gateway</option>
                <option value="WhatsApp">WhatsApp Business</option>
                <option value="Call">Phone Call Log</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Recipient Contact</label>
              <Input
                placeholder="Email address or phone number"
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Subject / Purpose</label>
              <Input
                placeholder="e.g. Admission Offer & Enrolment Instructions"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Message Content</label>
              <Textarea
                placeholder="Enter dispatch message or notes regarding this conversation..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setLogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-3.5 w-3.5" /> Dispatch Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
