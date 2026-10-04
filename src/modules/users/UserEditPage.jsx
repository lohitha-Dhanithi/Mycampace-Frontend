// src/modules/users/UserEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { UserForm } from './components/UserForm'
import { userService } from './services/userService'

export function UserEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    userService.getUserById(id).then((data) => {
      if (!data) setError('User not found')
      else setUser(data)
      setLoading(false)
    })
  }, [id])

  const handleSave = async (data) => {
    setSaving(true)
    await userService.updateUser(id, data)
    setSaving(false)
    navigate(`/users/${id}`)
  }

  if (loading) return <LoadingState />
  if (error || !user) return <ErrorState message={error || 'User not found'} />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/users/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={`Edit User — ${user.name}`}
          subtitle="Update user profile, organization details and access settings."
        />
      </div>
      <UserForm mode="edit" user={user} onSave={handleSave} loading={saving} onCancel={() => navigate(`/users/${id}`)} />
    </div>
  )
}
