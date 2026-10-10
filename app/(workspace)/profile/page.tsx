import { UserRound } from 'lucide-react'
import type { Metadata } from 'next'
import { ComingSoon, WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <WorkspacePage title="Profile" description="Your name, avatar, and learning goals.">
      <ComingSoon
        icon={<UserRound />}
        title="Profiles arrive with sign-in"
        description="This is a demo workspace, so there is no account to edit yet."
      />
    </WorkspacePage>
  )
}
