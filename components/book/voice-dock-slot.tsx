import { AudioLines, Play } from 'lucide-react'
import type { VoiceDockProps } from '@/types/book'

/** Placeholder for the upcoming VoiceDock; mounts in the same slot with the same props. */
export function VoiceDockSlot({ page, streamingEnabled }: VoiceDockProps) {
  return (
    <div
      role="region"
      aria-label="Voice narration"
      className="flex items-center gap-3 rounded-full border border-border bg-card/50 py-1.5 pr-4 pl-1.5 shadow-lg backdrop-blur-xl"
    >
      <button
        type="button"
        disabled
        aria-label={`Play narration for ${page.title} (coming soon)`}
        className="grid size-9 place-items-center rounded-full bg-primary/30 text-primary-foreground disabled:cursor-not-allowed"
      >
        <Play className="size-4" aria-hidden="true" />
      </button>
      <AudioLines className="size-4 text-muted-foreground" aria-hidden="true" />
      <p className="text-xs text-muted-foreground">
        Voice narration coming soon
        <span className="sr-only">{streamingEnabled ? ', guided mode selected' : ', full book mode selected'}</span>
      </p>
    </div>
  )
}
