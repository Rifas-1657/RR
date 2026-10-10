import type { BookPage, Chapter, ChapterId, Course, CourseId, PageId, PageKind } from '@/types/learning'

type PageSeed = { kind: PageKind; title: string; body: string; minutes: number }
type ChapterSeed = { title: string; summary: string; pages: PageSeed[] }
type CourseSeed = Omit<Course, 'id' | 'chapterIds'> & { key: string; chapters: ChapterSeed[] }

const courseSeeds: CourseSeed[] = [
  {
    key: 'deep-work',
    slug: 'the-focus-engine',
    title: 'The Focus Engine',
    subtitle: 'Design days that protect deep, uninterrupted work',
    author: 'Mara Okafor',
    level: 'Foundations',
    status: 'published',
    category: 'Productivity',
    cover: { base: '#E11D48', spine: '#9F1239', accent: '#FFE4E6', text: '#FFFFFF' },
    tags: ['focus', 'habits', 'planning'],
    publishedAt: '2026-03-12',
    chapters: [
      {
        title: 'Why attention is the real budget',
        summary: 'Treat attention as a finite resource and audit where it actually goes.',
        pages: [
          { kind: 'reading', title: 'The cost of switching', body: 'Every context switch leaves attention residue: part of your mind stays with the previous task for minutes after you move on.', minutes: 4 },
          { kind: 'exercise', title: 'Run a one-day attention audit', body: 'Log each switch for a single workday. Note the trigger, the task you left, and how long it took to return.', minutes: 6 },
          { kind: 'quiz', title: 'Check your understanding', body: 'Three quick questions on attention residue and switching costs.', minutes: 2 },
        ],
      },
      {
        title: 'Building a focus block',
        summary: 'Shape a repeatable 90-minute block with a clear start ritual and exit note.',
        pages: [
          { kind: 'reading', title: 'Rituals beat willpower', body: 'A short, identical start ritual tells your brain what comes next, so you spend less effort getting going.', minutes: 5 },
          { kind: 'exercise', title: 'Draft your start ritual', body: 'Choose three small actions, under two minutes total, that you will repeat before every focus block.', minutes: 5 },
          { kind: 'reflection', title: 'What breaks your blocks?', body: 'Write down the two interruptions that most often end a block early and one boundary for each.', minutes: 4 },
        ],
      },
    ],
  },
  {
    key: 'systems',
    slug: 'thinking-in-systems',
    title: 'Thinking in Systems',
    subtitle: 'See feedback loops, delays, and leverage points in everyday problems',
    author: 'Elias Brandt',
    level: 'Intermediate',
    status: 'published',
    category: 'Thinking',
    cover: { base: '#3B0A14', spine: '#12040A', accent: '#FB7185', text: '#FFE4E6' },
    tags: ['mental models', 'strategy'],
    publishedAt: '2026-05-02',
    chapters: [
      {
        title: 'Stocks and flows',
        summary: 'Describe any system as accumulations and the rates that change them.',
        pages: [
          { kind: 'reading', title: 'The bathtub model', body: 'A stock changes only through its inflows and outflows. Most surprises come from forgetting a flow exists.', minutes: 5 },
          { kind: 'exercise', title: 'Map a stock you care about', body: 'Pick savings, energy, or team morale. List every inflow and outflow you can name.', minutes: 7 },
        ],
      },
      {
        title: 'Feedback loops',
        summary: 'Recognise reinforcing and balancing loops and the delays between them.',
        pages: [
          { kind: 'reading', title: 'Reinforcing vs. balancing', body: 'Reinforcing loops amplify change; balancing loops push toward a goal. Real systems mix both.', minutes: 6 },
          { kind: 'quiz', title: 'Spot the loop', body: 'Classify four short scenarios as reinforcing or balancing.', minutes: 3 },
          { kind: 'reflection', title: 'Where are you delayed?', body: 'Describe one decision whose effects showed up much later than you expected.', minutes: 4 },
        ],
      },
    ],
  },
  {
    key: 'writing',
    slug: 'clear-writing-at-work',
    title: 'Clear Writing at Work',
    subtitle: 'Write memos, updates, and proposals people actually finish',
    author: 'Priya Natarajan',
    level: 'Foundations',
    status: 'review',
    category: 'Communication',
    cover: { base: '#FFE4E6', spine: '#FB7185', accent: '#9F1239', text: '#1F0A10' },
    tags: ['writing', 'communication'],
    publishedAt: '2026-08-21',
    chapters: [
      {
        title: 'Lead with the answer',
        summary: 'Put the conclusion first and let detail support it.',
        pages: [
          { kind: 'reading', title: 'The inverted pyramid', body: 'Readers decide in the first two sentences whether to keep going. Give them the decision there.', minutes: 4 },
          { kind: 'exercise', title: 'Rewrite a recent update', body: 'Take a status message you sent this week and move its conclusion to the first line.', minutes: 6 },
        ],
      },
    ],
  },
]

function buildCatalog(seeds: CourseSeed[]) {
  const courses: Course[] = []
  const chapters: Chapter[] = []
  const pages: BookPage[] = []

  for (const seed of seeds) {
    const { key, chapters: chapterSeeds, ...courseFields } = seed
    const courseId: CourseId = `course_${key}`
    const chapterIds: ChapterId[] = []

    chapterSeeds.forEach((chapterSeed, chapterIndex) => {
      const chapterId: ChapterId = `chapter_${key}_${chapterIndex + 1}`
      const pageIds: PageId[] = chapterSeed.pages.map((pageSeed, pageIndex) => {
        const pageId: PageId = `page_${key}_${chapterIndex + 1}_${pageIndex + 1}`
        pages.push({
          id: pageId,
          chapterId,
          order: pageIndex + 1,
          kind: pageSeed.kind,
          title: pageSeed.title,
          body: pageSeed.body,
          estimatedMinutes: pageSeed.minutes,
        })
        return pageId
      })
      chapters.push({
        id: chapterId,
        courseId,
        order: chapterIndex + 1,
        title: chapterSeed.title,
        summary: chapterSeed.summary,
        pageIds,
      })
      chapterIds.push(chapterId)
    })

    courses.push({ ...courseFields, id: courseId, chapterIds })
  }

  return { courses, chapters, pages }
}

export const { courses, chapters, pages } = buildCatalog(courseSeeds)
