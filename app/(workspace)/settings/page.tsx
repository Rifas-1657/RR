import { Settings } from 'lucide-react'
import type { Metadata } from 'next'
import { ComingSoon, WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <WorkspacePage title="Settings" description="Reading preferences, theme, and notifications.">
      <ComingSoon
        icon={<Settings />}
        title="Settings are coming soon"
        description="Reader font size, theme, and reminder preferences will live here."
      />
    </WorkspacePage>
  )
}
