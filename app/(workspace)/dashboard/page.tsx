import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import { GlowCard } from '@/components/ui-kit/glow-card'
import { ProgressRing } from '@/components/ui-kit/progress-ring'
import { courses, demoLearner, getCompletion } from '@/lib/mock'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  const inProgress = courses
    .map((course) => ({ course, completion: getCompletion(demoLearner.id, course) }))
    .filter(({ completion }) => completion.completed > 0)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs text-muted-foreground">{demoLearner.streakDays}-day streak</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {demoLearner.name.split(' ')[0]}.</h1>
        <p className="text-muted-foreground">Workspace shell placeholder — the full dashboard comes next.</p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {inProgress.map(({ course, completion }) => (
          <li key={course.id}>
            <GlowCard className="flex items-center gap-5 p-5">
              <ProgressRing
                value={completion.percent}
                size={64}
                strokeWidth={6}
                label={`${course.title} progress`}
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {completion.completed} of {completion.total} pages
                </p>
              </div>
              <BookeyButton
                size="icon"
                variant="secondary"
                aria-label={`Continue ${course.title}`}
                nativeButton={false}
                render={<Link href={`/read/${course.slug}`} />}
              >
                <ArrowRight aria-hidden="true" />
              </BookeyButton>
            </GlowCard>
          </li>
        ))}
      </ul>
    </div>
  )
}
