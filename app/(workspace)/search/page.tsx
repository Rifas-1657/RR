import type { Metadata } from 'next'
import { SearchPanel } from '@/components/workspace/search-panel'
import { WorkspacePage } from '@/components/workspace/workspace-page'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  return (
    <WorkspacePage title="Search" description="Find a course or jump straight to a chapter.">
      <div className="max-w-2xl rounded-3xl border border-border bg-card p-5 sm:p-6">
        <SearchPanel />
      </div>
    </WorkspacePage>
  )
}
