import type { BookCover } from '@/types/learning'

/**
 * Demo learning catalog for the learner workspace. Every derived number
 * (percent, current chapter, page position) is computed from chapter page
 * counts so the dashboard, search, and reader always agree.
 */

export type LearningCourseId = 'python' | 'java' | 'machine-learning' | 'web-development'

export interface LearningChapter {
  number: number
  title: string
  pages: number
}

export interface LearningCourse {
  id: LearningCourseId
  title: string
  subtitle: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  author: string
  cover: BookCover
  chapters: LearningChapter[]
  /** Demo progress: pages completed, read in order from page 1. */
  completedPages: number
  /** Relative label so the demo never depends on today's date. */
  lastOpened: string | null
  minutesPerPage: number
  resumeExcerpt: string
}

function chapters(entries: [string, number][]): LearningChapter[] {
  return entries.map(([title, pages], index) => ({ number: index + 1, title, pages }))
}

export const learningCourses: LearningCourse[] = [
  {
    id: 'python',
    title: 'Python from Zero',
    subtitle: 'Variables, loops, and functions — with code you run on the page.',
    level: 'Beginner',
    author: 'Bookey demo',
    cover: { base: '#E11D48', spine: '#9F1239', accent: '#FFE4E6', text: '#FFFFFF' },
    chapters: chapters([
      ['Hello, interpreter', 6],
      ['Values and variables', 8],
      ['Strings that behave', 8],
      ['Making decisions', 10],
      ['Loops that know when to stop', 9],
      ['Functions as building blocks', 8],
      ['Lists and tuples', 10],
      ['Dictionaries and sets', 9],
      ['Reading and writing files', 8],
      ['Errors and exceptions', 10],
      ['Modules and packages', 8],
      ['Your first small project', 6],
    ]),
    completedPages: 38,
    lastOpened: 'Yesterday',
    minutesPerPage: 4,
    resumeExcerpt:
      'A while loop keeps running as long as its condition is true. The trick is making sure something inside the loop eventually makes that condition false — otherwise the loop never ends.',
  },
  {
    id: 'java',
    title: 'Java Foundations',
    subtitle: 'Classes and objects explained with diagrams that draw themselves.',
    level: 'Intermediate',
    author: 'Bookey demo',
    cover: { base: '#3B0A14', spine: '#12040A', accent: '#FB7185', text: '#FFE4E6' },
    chapters: chapters([
      ['The JVM in one picture', 6],
      ['Types and variables', 8],
      ['Control flow', 8],
      ['Methods', 9],
      ['Classes and objects', 10],
      ['Encapsulation', 8],
      ['Inheritance', 9],
      ['Interfaces', 10],
      ['Collections', 8],
      ['Generics', 9],
      ['Exceptions', 8],
      ['Streams and lambdas', 7],
      ['Testing with JUnit', 8],
      ['Packaging an app', 6],
    ]),
    completedPages: 12,
    lastOpened: '3 days ago',
    minutesPerPage: 5,
    resumeExcerpt:
      'Java is statically typed: every variable has a type fixed at compile time. That sounds strict, but it lets the compiler catch whole categories of mistakes before your program ever runs.',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Intuition',
    subtitle: 'Gradients and models, narrated step by step by a voice tutor.',
    level: 'Advanced',
    author: 'Bookey demo',
    cover: { base: '#F59E0B', spine: '#C2410C', accent: '#FFFBEB', text: '#292013' },
    chapters: chapters([
      ['What a model actually learns', 8],
      ['Data, features, and labels', 10],
      ['Linear regression by hand', 9],
      ['Gradient descent, visually', 11],
      ['Classification and logistic loss', 10],
      ['Overfitting and validation', 12],
      ['Trees and ensembles', 10],
      ['Neural networks from scratch', 9],
      ['Evaluating models honestly', 11],
      ['Shipping a model responsibly', 8],
    ]),
    completedPages: 5,
    lastOpened: 'Last week',
    minutesPerPage: 6,
    resumeExcerpt:
      'A model does not memorize answers; it adjusts a handful of numbers until its guesses on known examples stop being wrong in the same direction.',
  },
  {
    id: 'web-development',
    title: 'Web Development Essentials',
    subtitle: 'HTML, CSS, and JavaScript with live previews for every chapter.',
    level: 'Beginner',
    author: 'Bookey demo',
    cover: { base: '#FFE4E6', spine: '#FB7185', accent: '#E11D48', text: '#3B0A14' },
    chapters: chapters([
      ['How the web loads a page', 5],
      ['HTML structure', 6],
      ['Semantic HTML', 6],
      ['CSS selectors', 7],
      ['The box model', 6],
      ['Flexbox layouts', 7],
      ['Grid layouts', 6],
      ['Responsive design', 8],
      ['JavaScript basics', 7],
      ['The DOM', 6],
      ['Events', 7],
      ['Fetching data', 6],
      ['Forms and validation', 7],
      ['Accessibility checks', 6],
      ['Performance basics', 5],
      ['Deploying your site', 5],
    ]),
    completedPages: 0,
    lastOpened: null,
    minutesPerPage: 4,
    resumeExcerpt:
      'When you type an address, your browser asks a server for an HTML file, then reads it top to bottom, fetching styles, scripts, and images as it discovers them.',
  },
]

export function getLearningCourse(id: string): LearningCourse | undefined {
  return learningCourses.find((course) => course.id === id)
}

export interface CoursePosition {
  totalPages: number
  completedPages: number
  percent: number
  /** Chapter containing the next unread page (the last chapter when finished). */
  chapter: LearningChapter
  /** 1-based page within that chapter. */
  pageInChapter: number
  /** 1-based page across the whole book. */
  bookPage: number
  started: boolean
  finished: boolean
}

export function getCoursePosition(course: LearningCourse): CoursePosition {
  const totalPages = course.chapters.reduce((sum, chapter) => sum + chapter.pages, 0)
  const completedPages = Math.min(course.completedPages, totalPages)
  const finished = completedPages >= totalPages
  const bookPage = finished ? totalPages : completedPages + 1

  let pagesBefore = 0
  let chapter = course.chapters[course.chapters.length - 1]
  for (const candidate of course.chapters) {
    if (bookPage <= pagesBefore + candidate.pages) {
      chapter = candidate
      break
    }
    pagesBefore += candidate.pages
  }

  return {
    totalPages,
    completedPages,
    percent: totalPages === 0 ? 0 : Math.round((completedPages / totalPages) * 100),
    chapter,
    pageInChapter: bookPage - pagesBefore,
    bookPage,
    started: completedPages > 0,
    finished,
  }
}

export function getRemainingMinutes(course: LearningCourse) {
  const { totalPages, completedPages } = getCoursePosition(course)
  return (totalPages - completedPages) * course.minutesPerPage
}

/** Most recently opened in-progress course, used for "Continue your book". */
export const featuredCourseId: LearningCourseId = 'python'

export interface PracticeTask {
  id: string
  courseId: LearningCourseId
  title: string
  detail: string
  minutes: number
  kind: 'Code' | 'Quiz' | 'Recall'
}

export const todaysPractice: PracticeTask[] = [
  {
    id: 'practice_loop',
    courseId: 'python',
    title: 'Fix the runaway loop',
    detail: 'Chapter 5 · Add the missing counter update so the loop stops.',
    minutes: 5,
    kind: 'Code',
  },
  {
    id: 'practice_types',
    courseId: 'java',
    title: 'Pick the right type',
    detail: 'Chapter 2 · Four quick questions on int, double, and String.',
    minutes: 3,
    kind: 'Quiz',
  },
  {
    id: 'practice_model',
    courseId: 'machine-learning',
    title: 'Explain a model in one sentence',
    detail: 'Chapter 1 · Recall the core idea without looking back.',
    minutes: 2,
    kind: 'Recall',
  },
]

/** Demo minutes per weekday (Mon → Sun). */
export const weeklyActivity = [
  { day: 'Mon', minutes: 24 },
  { day: 'Tue', minutes: 36 },
  { day: 'Wed', minutes: 12 },
  { day: 'Thu', minutes: 40 },
  { day: 'Fri', minutes: 28 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 18 },
]

export interface ActivityEvent {
  id: string
  courseId: LearningCourseId
  kind: 'page' | 'quiz' | 'chapter' | 'note'
  title: string
  when: string
}

export const recentActivity: ActivityEvent[] = [
  { id: 'act_1', courseId: 'python', kind: 'page', title: 'Read “Loops that know when to stop”, page 6', when: 'Yesterday' },
  { id: 'act_2', courseId: 'python', kind: 'chapter', title: 'Finished chapter 4, “Making decisions”', when: 'Yesterday' },
  { id: 'act_3', courseId: 'java', kind: 'quiz', title: 'Scored 4 of 5 on the control-flow check', when: '3 days ago' },
  { id: 'act_4', courseId: 'machine-learning', kind: 'note', title: 'Saved a note on features vs. labels', when: 'Last week' },
]

export const demoStreakDays = 5
