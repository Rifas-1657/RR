import { TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import { ComingSoon, WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Progress' }

export default function ProgressPage() {
  return (
    <WorkspacePage title="Progress" description="Long-term trends across chapters, practice, and streaks.">
      <ComingSoon
        icon={<TrendingUp />}
        title="Detailed progress is coming soon"
        description="For now, your overview shows demo progress for every course and this week’s activity."
      />
    </WorkspacePage>
  )
}
