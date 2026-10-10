import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ReaderShell } from '@/components/reader/reader-shell'
import { getCoursePosition, getLearningCourse, learningCourses } from '@/lib/mock/learning'
import type { BookPage } from '@/types/learning'

interface BookPageProps {
  params: Promise<{ courseId: string }>
}

export function generateStaticParams() {
  return learningCourses.map((course) => ({ courseId: course.id }))
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { courseId } = await params
  const course = getLearningCourse(courseId)
  return { title: course ? `Reading ${course.title}` : 'Book not found' }
}

export default async function BookReaderPage({ params }: BookPageProps) {
  const { courseId } = await params
  const course = getLearningCourse(courseId)
  if (!course) notFound()

  const position = getCoursePosition(course)
  const page: BookPage = {
    id: `page_${course.id}_${position.bookPage}`,
    chapterId: `chapter_${course.id}_${position.chapter.number}`,
    order: position.pageInChapter,
    kind: 'reading',
    title: `Chapter ${position.chapter.number} · ${position.chapter.title}`,
    body: course.resumeExcerpt,
    estimatedMinutes: course.minutesPerPage,
  }

  return <ReaderShell courseTitle={course.title} author={course.author} page={page} />
}
