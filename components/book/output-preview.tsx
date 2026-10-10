import { Terminal } from 'lucide-react'
import type { OutputPreviewProps } from '@/types/book'

export function OutputPreview({ result, source }: OutputPreviewProps) {
  return (
    <section aria-label="Program output" className="rounded-3xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Terminal className="size-4 text-book-deep" aria-hidden="true" />
          Output
        </p>
        {source && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {source === 'expected' ? 'Expected output' : 'Executed'}
          </span>
        )}
      </div>
      <div aria-live="polite">
        {result ? (
          <pre data-swipe-ignore className="overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-[0.8125rem] leading-relaxed whitespace-pre">
            {result.stdout}
            {result.stderr && <span className="block text-red-700">{result.stderr}</span>}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">Press “Show output” to see what this code prints.</p>
        )}
      </div>
    </section>
  )
}
