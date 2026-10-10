import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ClassroomsPanel } from '../components/ClassroomsPanel'

export function ClassroomsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Classrooms"
        description="Add rooms, attach a homeroom section, and remove rooms that are not in use."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add classroom
          </Button>
        }
      />
      <ClassroomsPanel open={open} onOpenChange={setOpen} />
    </div>
  )
}
