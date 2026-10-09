import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReaderShell } from '@/components/reader/reader-shell'
import { courses, getCourseBySlug, getCoursePages } from '@/lib/mock'

interface ReaderPageProps {
  params: Promise<{ courseSlug: string }>
}

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }))
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const { courseSlug } = await params
  const course = getCourseBySlug(courseSlug)
  return { title: course ? `Reading ${course.title}` : 'Reader' }
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { courseSlug } = await params
  const course = getCourseBySlug(courseSlug)
  if (!course) notFound()

  const page = getCoursePages(course)[0]
  if (!page) notFound()

  return <ReaderShell courseTitle={course.title} author={course.author} page={page} />
}
