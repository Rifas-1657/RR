import Link from 'next/link'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import { EmptyState } from '@/components/ui-kit/empty-state'

interface WorkspacePageProps {
  title: string
  description: string
  children: React.ReactNode
}

export function WorkspacePage({ title, description, children }: WorkspacePageProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:gap-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

/** Honest placeholder for routes that are planned but not built yet. */
export function ComingSoon({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      className="py-16"
      action={
        <BookeyButton variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
          Back to overview
        </BookeyButton>
      }
    />
  )
}
