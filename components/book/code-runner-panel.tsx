'use client'

import { Check, Copy, Play } from 'lucide-react'
import { useState } from 'react'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import { cn } from '@/lib/utils'
import type { CodeRunnerPanelProps } from '@/types/book'

/**
 * Code shell. Without `onRun` it only reveals the author's expected output;
 * a real sandboxed runner plugs into `onRun` later.
 */
export function CodeRunnerPanel({ example, onRun, onResult, focusLine = null }: CodeRunnerPanelProps) {
  const [copied, setCopied] = useState(false)
  const [running, setRunning] = useState(false)
  const lines = example.source.split('\n')

  async function handleRun() {
    if (!onRun) {
      onResult?.({ stdout: example.expectedOutput }, 'expected')
      return
    }
    setRunning(true)
    try {
      onResult?.(await onRun(example.source), 'executed')
    } catch (error) {
      onResult?.({ stdout: '', stderr: error instanceof Error ? error.message : 'Run failed' }, 'executed')
    } finally {
      setRunning(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(example.source)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard can be blocked; the code stays selectable */
    }
  }

  return (
    <section aria-label="Code example" className="overflow-hidden rounded-3xl border border-[#3b2c17] bg-[#1d160c] text-[#fdf6e3]">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs tracking-wide text-[#e9d9b5] uppercase">{example.language}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex size-8 items-center justify-center rounded-full text-[#e9d9b5] transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-book-marker focus-visible:outline-none"
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
          <BookeyButton
            size="sm"
            className="h-8 bg-book-orange px-3 text-[#1d160c] hover:bg-book-marker"
            onClick={handleRun}
            disabled={running}
          >
            <Play aria-hidden="true" />
            {onRun ? (running ? 'Running…' : 'Run') : 'Show output'}
          </BookeyButton>
        </div>
      </div>
      <pre data-swipe-ignore className="overflow-x-auto px-0 py-3 font-mono text-[0.8125rem] leading-relaxed" tabIndex={0} aria-label="Python source">
        <code>
          {lines.map((line, index) => (
            <span
              key={index}
              className={cn('flex gap-4 px-4', focusLine === index + 1 && 'bg-book-marker/20')}
            >
              <span className="w-5 shrink-0 text-right text-[#8a7756] select-none" aria-hidden="true">
                {index + 1}
              </span>
              <span className={cn(line.trimStart().startsWith('#') && 'text-[#a8956f]')}>{line || ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </section>
  )
}
