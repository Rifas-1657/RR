import { Library } from 'lucide-react'
import type { Metadata } from 'next'
import { ComingSoon, WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Library' }

export default function LibraryPage() {
  return (
    <WorkspacePage title="Library" description="Saved highlights, notes, and bookmarks from your books.">
      <ComingSoon
        icon={<Library />}
        title="Your library is coming soon"
        description="Highlights and notes you save while reading will collect here in a later build."
      />
    </WorkspacePage>
  )
}
