import type { LearningCourseId } from '@/lib/mock/learning'

/**
 * Typed contracts for the immersive book reader (`/book/[courseId]`).
 * Kept separate from `types/learning.ts` so the existing catalog model stays
 * untouched. Fields marked optional can be expanded by later features
 * (voice narration, animated diagrams, code execution) without breaking pages.
 */

export type LessonPageId = `lesson_${string}`

/** `full` shows the whole page at once; `guided` is reserved for word streaming. */
export type ReaderViewMode = 'full' | 'guided'

export type DiagramKind = 'labeled-boxes' | 'assignment-flow' | 'type-table' | 'naming-rules' | 'io-flow' | 'practice'

export type DiagramTone = 'neutral' | 'highlight' | 'valid' | 'invalid'

export interface DiagramNode {
  id: string
  label: string
  value?: string
  /** Short hint rendered under the node (e.g. a type name). */
  caption?: string
  tone?: DiagramTone
}

export interface DiagramSpec {
  kind: DiagramKind
  title: string
  caption: string
  nodes: DiagramNode[]
}

export interface CodeExample {
  language: 'python'
  source: string
  /** Static, author-written output. Shown until a real runner exists. */
  expectedOutput: string
  /** Whether a future runner should allow editing + executing this snippet. */
  runnable: boolean
}

export type CueKind = 'highlight-term' | 'focus-node' | 'focus-code-line'

/** Narration cue: when `atWord` is spoken, focus `target` on the visual page. */
export interface NarrationCue {
  id: string
  atWord: number
  kind: CueKind
  target: string
}

export interface BookLessonPage {
  id: LessonPageId
  courseId: LearningCourseId
  chapterId: string
  /** 1-based chapter number, matching `LearningChapter.number`. */
  chapterNumber: number
  /** 1-based position across all seeded pages of this course. */
  pageNumber: number
  title: string
  /** Tanglish narration script; technical terms stay in English. */
  narrationText: string
  paragraphs: string[]
  /** Terms to mark with the yellow annotation highlight in the text. */
  keyTerms?: string[]
  codeExample: CodeExample
  diagramSpec: DiagramSpec
  cues?: NarrationCue[]
  estimatedMinutes?: number
}

/* ---- Stable component interfaces for upcoming features ---- */

export interface VoiceDockProps {
  page: BookLessonPage
  /** False in full-book mode: the dock must never stream words then. */
  streamingEnabled: boolean
  onCue?: (cue: NarrationCue) => void
  onComplete?: () => void
}

export interface DiagramCanvasProps {
  spec: DiagramSpec
  /** Node id to emphasise, driven by narration cues later. */
  focusNodeId?: string | null
}

export interface CodeRunResult {
  stdout: string
  stderr?: string
  durationMs?: number
}

export interface CodeRunnerPanelProps {
  example: CodeExample
  /** Optional executor; when absent the panel only reveals the expected output. */
  onRun?: (source: string) => Promise<CodeRunResult>
  onResult?: (result: CodeRunResult, source: 'expected' | 'executed') => void
  focusLine?: number | null
}

export interface OutputPreviewProps {
  result: CodeRunResult | null
  source: 'expected' | 'executed' | null
}
