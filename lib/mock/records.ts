import type { AdminMember, AppNotification, CourseProgress, Learner } from '@/types/learning'

export const demoLearner: Learner = {
  id: 'user_demo',
  name: 'Ava Lindqvist',
  handle: 'ava.reads',
  joinedAt: '2026-02-14',
  streakDays: 12,
}

/** Completed page IDs must exist in the catalog; see lib/mock/index.ts selectors. */
export const progress: CourseProgress[] = [
  {
    userId: 'user_demo',
    courseId: 'course_deep-work',
    completedPageIds: ['page_deep-work_1_1', 'page_deep-work_1_2', 'page_deep-work_1_3', 'page_deep-work_2_1'],
    lastPageId: 'page_deep-work_2_1',
    lastOpenedAt: '2026-10-08T19:42:00Z',
    weeklyMinutes: [18, 24, 0, 32, 27, 41, 22],
  },
  {
    userId: 'user_demo',
    courseId: 'course_systems',
    completedPageIds: ['page_systems_1_1'],
    lastPageId: 'page_systems_1_1',
    lastOpenedAt: '2026-10-05T08:10:00Z',
    weeklyMinutes: [0, 6, 12, 0, 9, 0, 14],
  },
]

export const notifications: AppNotification[] = [
  {
    id: 'notif_1',
    kind: 'streak',
    title: '12-day streak',
    body: 'You have studied every day since September 27. One short page keeps it going.',
    createdAt: '2026-10-09T07:00:00Z',
    read: false,
  },
  {
    id: 'notif_2',
    kind: 'course',
    title: 'New chapter in Thinking in Systems',
    body: 'Elias Brandt published “Feedback loops” with a new interactive quiz.',
    createdAt: '2026-10-07T15:30:00Z',
    read: false,
  },
  {
    id: 'notif_3',
    kind: 'system',
    title: 'Reader preferences saved on this device',
    body: 'Font size and highlight color are stored locally in your browser only.',
    createdAt: '2026-10-02T11:12:00Z',
    read: true,
  },
]

export const adminMembers: AdminMember[] = [
  { id: 'user_owner', name: 'Jonah Whitfield', email: 'jonah@bookey.example', role: 'owner', lastActiveAt: '2026-10-09T09:15:00Z' },
  { id: 'user_editor', name: 'Priya Natarajan', email: 'priya@bookey.example', role: 'editor', lastActiveAt: '2026-10-08T16:40:00Z' },
  { id: 'user_reviewer', name: 'Sam Ortega', email: 'sam@bookey.example', role: 'reviewer', lastActiveAt: '2026-10-06T13:05:00Z' },
]
