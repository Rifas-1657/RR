import type { BookPage, Chapter, Course, CourseId, CourseProgress, UserId } from '@/types/learning'
import { chapters, courses, pages } from './catalog'
import { adminMembers, demoLearner, notifications, progress } from './records'

export { adminMembers, chapters, courses, demoLearner, notifications, pages, progress }

const pageById = new Map(pages.map((page) => [page.id, page]))
const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]))

export function getCourse(id: CourseId): Course | undefined {
  return courses.find((course) => course.id === id)
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug)
}

export function getChapters(course: Course): Chapter[] {
  return course.chapterIds.map((id) => chapterById.get(id)).filter((c): c is Chapter => Boolean(c))
}

export function getCoursePages(course: Course): BookPage[] {
  return getChapters(course).flatMap((chapter) =>
    chapter.pageIds.map((id) => pageById.get(id)).filter((p): p is BookPage => Boolean(p)),
  )
}

export function getCourseStats(course: Course) {
  const coursePages = getCoursePages(course)
  return {
    chapterCount: course.chapterIds.length,
    pageCount: coursePages.length,
    totalMinutes: coursePages.reduce((sum, page) => sum + page.estimatedMinutes, 0),
  }
}

export function getProgress(userId: UserId, courseId: CourseId): CourseProgress | undefined {
  return progress.find((entry) => entry.userId === userId && entry.courseId === courseId)
}

/** Percent complete derived from real page counts so numbers always agree. */
export function getCompletion(userId: UserId, course: Course) {
  const coursePageIds = new Set(getCoursePages(course).map((page) => page.id))
  const entry = getProgress(userId, course.id)
  const completed = entry?.completedPageIds.filter((id) => coursePageIds.has(id)).length ?? 0
  const total = coursePageIds.size
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) }
}

export const WEEKDAY_LABELS = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'] as const

export function getWeeklyMinutes(userId: UserId) {
  return WEEKDAY_LABELS.map((day, index) => ({
    day,
    minutes: progress
      .filter((entry) => entry.userId === userId)
      .reduce((sum, entry) => sum + (entry.weeklyMinutes[index] ?? 0), 0),
  }))
}
