'use client'

import { BookOpen, FileText, Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import { getCoursePosition, learningCourses } from '@/lib/mock/learning'
import { cn } from '@/lib/utils'

interface SearchResult {
  key: string
  href: string
  title: string
  meta: string
  kind: 'course' | 'chapter'
}

const ALL_RESULTS: SearchResult[] = learningCourses.flatMap((course) => [
  {
    key: course.id,
    href: `/book/${course.id}`,
    title: course.title,
    meta: `${course.level} · ${course.chapters.length} chapters · ${getCoursePosition(course).totalPages} pages`,
    kind: 'course' as const,
  },
  ...course.chapters.map((chapter) => ({
    key: `${course.id}-${chapter.number}`,
    href: `/book/${course.id}`,
    title: chapter.title,
    meta: `${course.title} · Chapter ${chapter.number} · ${chapter.pages} pages`,
    kind: 'chapter' as const,
  })),
])

const SUGGESTED = ALL_RESULTS.filter((result) => result.kind === 'course')

interface SearchPanelProps {
  autoFocus?: boolean
  onNavigate?: () => void
  className?: string
}

export function SearchPanel({ autoFocus, onNavigate, className }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const inputId = useId()
  const q = query.trim().toLowerCase()

  const results = useMemo(
    () => (q ? ALL_RESULTS.filter((r) => `${r.title} ${r.meta}`.toLowerCase().includes(q)).slice(0, 12) : SUGGESTED),
    [q],
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Search courses and chapters
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={inputId}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses and chapters"
          autoComplete="off"
          className="h-12 w-full rounded-2xl border border-input bg-background pr-4 pl-11 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/20"
        />
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase" aria-live="polite">
          {q ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Demo courses'}
        </p>
        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No demo course or chapter matches &ldquo;{query.trim()}&rdquo;. Try &ldquo;loops&rdquo; or &ldquo;HTML&rdquo;.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {results.map((result) => {
              const Icon = result.kind === 'course' ? BookOpen : FileText
              return (
                <li key={result.key}>
                  <Link
                    href={result.href}
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-4 focus-visible:ring-ring/20"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{result.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{result.meta}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
