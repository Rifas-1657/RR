import { ChevronLeft, Lock } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CourseSurveyForm } from '@/components/courses/course-survey-form'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import { EmptyState } from '@/components/ui-kit/empty-state'
import { getLearningCourse, learningCourses } from '@/lib/mock/learning'

export function generateStaticParams() {
  return learningCourses.map((course) => ({ courseId: course.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params
  const course = getLearningCourse(courseId)
  return { title: course ? `Before you start · ${course.title}` : 'Course not found' }
}

export default async function CourseSurveyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = getLearningCourse(courseId)
  if (!course) notFound()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-1 rounded-full text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/30"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          {course.title}
        </Link>
      </nav>

      {course.available ? (
        <>
          <div className="space-y-2">
            <p className="font-mono text-[11px] tracking-[0.18em] text-primary uppercase">Before you start</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-balance">Three quick questions</h1>
            <p className="text-pretty text-muted-foreground">
              Help the demo tutor pitch {course.title} at the right level. You&apos;ll only see this once per course.
            </p>
          </div>
          <CourseSurveyForm course={course} />
        </>
      ) : (
        <EmptyState
          icon={<Lock />}
          title={`${course.title} is locked in this demo`}
          description="This book's pages aren't included in the preview, so there's nothing to set up yet."
          action={
            <BookeyButton nativeButton={false} render={<Link href="/courses" />}>
              Back to catalog
            </BookeyButton>
          }
        />
      )}
    </div>
  )
}
