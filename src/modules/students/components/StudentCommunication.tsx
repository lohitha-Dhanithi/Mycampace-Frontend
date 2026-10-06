// src/modules/students/components/StudentCommunication.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CommunicationTimeline } from '@/modules/admissions/components/CommunicationTimeline'

export function StudentCommunication({ student, initialCommunications = [] }) {
  const [comms, setComms] = useState(
    initialCommunications.length > 0
      ? initialCommunications
      : [
          {
            id: 'scomm-1',
            type: 'Email',
            recipient: student?.contact?.email || 'student@mycampace.edu.in',
            sentBy: 'Principal Office',
            date: '2026-09-29 04:00 PM',
            status: 'Delivered',
            subject: 'Welcome to AY 2026-2027 Academic Term',
            message: 'Classroom schedules, dress code handbook and bus pass instructions.',
          },
          {
            id: 'scomm-2',
            type: 'SMS',
            recipient: student?.contact?.primaryMobile || '+91 98765 43210',
            sentBy: 'System Notification Gateway',
            date: '2026-09-30 08:30 AM',
            status: 'Delivered',
            subject: 'Student ID card issuance and library activation complete.',
          },
        ]
  )

  const handleSendMessage = (newMsg) => {
    setComms([newMsg, ...comms])
  }

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardContent className="p-5">
        <CommunicationTimeline
          communications={comms}
          onSendMessage={handleSendMessage}
        />
      </CardContent>
    </Card>
  )
}
