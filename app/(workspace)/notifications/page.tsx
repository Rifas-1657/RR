import { Bell } from 'lucide-react'
import type { Metadata } from 'next'
import { ComingSoon, WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Notifications' }

export default function NotificationsPage() {
  return (
    <WorkspacePage title="Notifications" description="Streak reminders, new chapters, and practice nudges.">
      <ComingSoon
        icon={<Bell />}
        title="You’re all caught up"
        description="Notifications will appear here once reminders are turned on in a later build."
      />
    </WorkspacePage>
  )
}
