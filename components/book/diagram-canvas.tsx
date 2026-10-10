import { ArrowRight, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DiagramCanvasProps, DiagramNode, DiagramTone } from '@/types/book'

const toneClass: Record<DiagramTone, string> = {
  neutral: 'border-border bg-card',
  highlight: 'border-book-orange/60 bg-book-marker/25',
  valid: 'border-emerald-300 bg-emerald-50',
  invalid: 'border-red-300 bg-red-50',
}

function Node({ node, focused }: { node: DiagramNode; focused: boolean }) {
  const tone = node.tone ?? 'neutral'
  return (
    <li
      className={cn(
        'flex min-w-0 flex-1 basis-28 flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-center transition-shadow',
        toneClass[tone],
        focused && 'ring-4 ring-book-orange/40',
      )}
    >
      <span className="flex items-center gap-1 font-mono text-sm font-semibold break-all">
        {tone === 'valid' && <Check className="size-3.5 shrink-0 text-emerald-700" aria-label="Valid" />}
        {tone === 'invalid' && <X className="size-3.5 shrink-0 text-red-700" aria-label="Invalid" />}
        {node.label}
      </span>
      {node.value && (
        <span className="w-full rounded-lg border border-dashed border-book-amber/60 bg-book-page px-2 py-1 font-mono text-base">
          {node.value}
        </span>
      )}
      {node.caption && <span className="text-xs text-muted-foreground">{node.caption}</span>}
    </li>
  )
}

/**
 * Static rendering of a page's diagram spec. Animated, cue-driven drawing
 * replaces the internals later; the props contract stays the same.
 */
export function DiagramCanvas({ spec, focusNodeId = null }: DiagramCanvasProps) {
  const isFlow = spec.kind === 'assignment-flow' || spec.kind === 'io-flow'

  return (
    <figure className="rounded-3xl border bg-muted/60 p-4" aria-labelledby="diagram-title">
      <figcaption className="mb-3">
        <p id="diagram-title" className="font-display text-sm font-semibold">
          {spec.title}
        </p>
        <p className="text-xs text-muted-foreground">{spec.caption}</p>
      </figcaption>
      <ul className={cn('flex flex-wrap items-stretch gap-2', isFlow && 'flex-nowrap')}>
        {spec.nodes.map((node, index) => (
          <li key={node.id} className="contents">
            {isFlow && index > 0 && (
              <ArrowRight className="size-4 shrink-0 self-center text-book-deep" aria-hidden="true" />
            )}
            <ul className="contents">
              <Node node={node} focused={focusNodeId === node.id} />
            </ul>
          </li>
        ))}
      </ul>
    </figure>
  )
}
