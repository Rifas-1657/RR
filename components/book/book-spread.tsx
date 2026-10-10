'use client'

import { BookOpenText, Shapes } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { BookLessonPage, CodeRunResult, ReaderViewMode } from '@/types/book'
import { AnnotatedText } from './annotated-text'
import { CodeRunnerPanel } from './code-runner-panel'
import { DiagramCanvas } from './diagram-canvas'
import { OutputPreview } from './output-preview'

interface BookSpreadProps {
  page: BookLessonPage
  pageLabel: string
  chapterTitle: string
  viewMode: ReaderViewMode
  fontScale: number
  swipeHandlers: { onTouchStart: (e: React.TouchEvent) => void; onTouchEnd: (e: React.TouchEvent) => void }
}

type MobilePanel = 'text' | 'visual'

const paperTexture =
  'bg-[radial-gradient(circle_at_1px_1px,rgb(41_32_19/0.035)_1px,transparent_0)] bg-[length:6px_6px]'

function TextPage({ page, pageLabel, chapterTitle, viewMode, fontScale }: Omit<BookSpreadProps, 'swipeHandlers'>) {
  return (
    <article
      aria-labelledby="page-title"
      className="flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-10 lg:px-12"
      style={{ fontSize: `${fontScale}rem` }}
    >
      <p className="text-[0.75em] font-semibold tracking-[0.18em] text-book-deep uppercase">{chapterTitle}</p>
      <h1 id="page-title" className="mt-2 font-display text-[1.875em] leading-tight font-bold">
        {page.title}
      </h1>

      <aside
        aria-label="Narration"
        className="mt-6 rounded-2xl border-l-4 border-book-orange bg-book-marker/15 px-4 py-3"
      >
        <p className="text-[0.7em] font-semibold tracking-wider text-book-deep uppercase">
          {viewMode === 'guided' ? 'Narration · guided mode' : 'Narration'}
        </p>
        <p lang="ta-Latn" className="mt-1 font-serif text-[1em] leading-relaxed italic">
          {page.narrationText}
        </p>
      </aside>

      <div className="mt-6 flex flex-col gap-4 font-serif text-[1.0625em] leading-[1.75]">
        {page.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <AnnotatedText text={paragraph} terms={page.keyTerms} />
          </p>
        ))}
      </div>

      <p className="mt-auto pt-8 text-center font-mono text-[0.7em] text-muted-foreground">{pageLabel}</p>
    </article>
  )
}

function VisualPage({ page }: { page: BookLessonPage }) {
  const [output, setOutput] = useState<{ result: CodeRunResult; source: 'expected' | 'executed' } | null>(null)

  return (
    <section aria-label="Visual explanation" className="flex h-full flex-col gap-4 overflow-y-auto px-5 py-8 sm:px-8">
      <DiagramCanvas spec={page.diagramSpec} />
      <CodeRunnerPanel example={page.codeExample} onResult={(result, source) => setOutput({ result, source })} />
      <OutputPreview result={output?.result ?? null} source={output?.source ?? null} />
    </section>
  )
}

/** Two-page spread on desktop; single page with a text/visual switcher on mobile. */
export function BookSpread(props: BookSpreadProps) {
  const { page, swipeHandlers } = props
  const [panel, setPanel] = useState<MobilePanel>('text')

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div role="tablist" aria-label="Page view" className="mx-auto flex rounded-full border border-border bg-card/40 p-1 backdrop-blur-md lg:hidden">
        {(
          [
            { id: 'text', label: 'Read', icon: BookOpenText },
            { id: 'visual', label: 'Visual', icon: Shapes },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={panel === id}
            aria-controls={`panel-${id}`}
            onClick={() => setPanel(id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const next = panel === 'text' ? 'visual' : 'text'
                setPanel(next)
                document.getElementById(`tab-${next}`)?.focus()
              }
            }}
            tabIndex={panel === id ? 0 : -1}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              panel === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div
        key={page.id}
        data-theme="book"
        {...swipeHandlers}
        className="relative grid min-h-0 flex-1 animate-in rounded-[1.75rem] bg-book-paper p-2 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.06)] duration-300 fade-in lg:grid-cols-2 lg:p-3"
      >
        <div
          id="panel-text"
          role="tabpanel"
          aria-labelledby="tab-text"
          className={cn(
            'min-h-0 rounded-[1.25rem] bg-book-page lg:block lg:rounded-r-md',
            paperTexture,
            panel === 'text' ? 'block' : 'hidden',
          )}
        >
          <TextPage {...props} />
        </div>
        <div
          id="panel-visual"
          role="tabpanel"
          aria-labelledby="tab-visual"
          className={cn(
            'min-h-0 rounded-[1.25rem] bg-book-page lg:block lg:rounded-l-md',
            paperTexture,
            panel === 'visual' ? 'block' : 'hidden',
          )}
        >
          <VisualPage page={page} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(41_32_19/0.10)_45%,rgb(41_32_19/0.18)_50%,rgb(41_32_19/0.10)_55%,transparent)] lg:block"
        />
      </div>
    </div>
  )
}
