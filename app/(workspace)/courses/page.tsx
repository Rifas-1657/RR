import type { Metadata } from 'next'
import { CourseProgressGrid } from '@/components/dashboard/course-progress-grid'
import { WorkspacePage } from '@/components/workspace/workspace-page'
import { learningCourses } from '@/lib/mock/learning'

export const metadata: Metadata = { title: 'Courses' }

export default function CoursesPage() {
  return (
    <WorkspacePage title="Courses" description="Every demo book on your shelf, with progress counted in pages.">
      <CourseProgressGrid courses={learningCourses} />
    </WorkspacePage>
  )
}
