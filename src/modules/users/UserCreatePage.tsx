// src/modules/users/UserCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { UserForm } from './components/UserForm'
import { userService } from './services/userService'

export function UserCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSave = async (data) => {
    setLoading(true)
    await userService.createUser(data)
    setLoading(false)
    navigate('/users', { state: { toast: `User ${data.firstName} ${data.lastName} created successfully.` } })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add User"
        subtitle="Create a new user account and assign institutional role and access."
      />
      <UserForm mode="create" onSave={handleSave} loading={loading} />
    </div>
  )
}
