'use client'

import { useEffect, useEffectEvent, useMemo, useReducer, useRef, useState } from 'react'
import type { BookLessonPage, NarrationCueEvent, NarrationStatus } from '@/types/book'
import { createMockAudioPlayer, type AudioPlayer } from './audio-player'
import { buildNarrationCues } from './cues'
import { tokenizeNarration, wordDelayMs, type NarrationSentence, type NarrationWord } from './tokenize'

const THINKING_MS = 1400

export interface TutorExchange {
  question: string
  phase: 'thinking' | 'answered'
}

export interface NarrationState {
  pageId: string
  wordCount: number
  status: NarrationStatus
  /** Active word; -1 before the first play, `wordCount` once completed. */
  wordIndex: number
  /** Increments on every fresh pass (play from start / restart) so cues can re-fire. */
  pass: number
  tutor: TutorExchange | null
  /** Set by the "Next page" CTA so the following page starts speaking on arrival. */
  autoplay: boolean
}

type NarrationAction =
  | { type: 'reset'; pageId: string; wordCount: number; autoplay: boolean }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'tick' }
  | { type: 'seek'; wordIndex: number }
  | { type: 'restart' }
  | { type: 'listen' }
  | { type: 'stopListening' }
  | { type: 'ask'; question: string }
  | { type: 'answered' }
  | { type: 'dismissTutor' }
  | { type: 'queueAutoplay' }

function initialState(pageId: string, wordCount: number, autoplay = false, pass = 0): NarrationState {
  const start = autoplay && wordCount > 0
  return {
    pageId,
    wordCount,
    status: start ? 'speaking' : 'idle',
    wordIndex: start ? 0 : -1,
    pass: start ? pass + 1 : pass,
    tutor: null,
    autoplay: false,
  }
}

function settledStatus(state: NarrationState): NarrationStatus {
  if (state.wordIndex < 0) return 'idle'
  if (state.wordIndex >= state.wordCount) return 'completed'
  return 'paused'
}

function reducer(state: NarrationState, action: NarrationAction): NarrationState {
  switch (action.type) {
    case 'reset':
      return initialState(action.pageId, action.wordCount, action.autoplay, state.pass)
    case 'play': {
      if (state.wordCount === 0) return state
      const fresh = state.wordIndex < 0 || state.wordIndex >= state.wordCount
      return {
        ...state,
        status: 'speaking',
        tutor: null,
        wordIndex: fresh ? 0 : state.wordIndex,
        pass: fresh ? state.pass + 1 : state.pass,
      }
    }
    case 'pause':
      return state.status === 'speaking' ? { ...state, status: 'paused' } : state
    case 'tick': {
      if (state.status !== 'speaking') return state
      const next = state.wordIndex + 1
      return next >= state.wordCount
        ? { ...state, wordIndex: state.wordCount, status: 'completed' }
        : { ...state, wordIndex: next }
    }
    case 'seek': {
      if (state.wordIndex < 0) return state
      const wordIndex = Math.min(state.wordCount, Math.max(0, action.wordIndex))
      if (wordIndex >= state.wordCount) return { ...state, wordIndex, status: 'completed' }
      const status = state.status === 'completed' ? 'paused' : state.status
      return { ...state, wordIndex, status }
    }
    case 'restart':
      return state.wordCount === 0
        ? state
        : { ...state, status: 'speaking', wordIndex: 0, pass: state.pass + 1, tutor: null }
    case 'listen':
      return { ...state, status: 'listening', tutor: null }
    case 'stopListening':
      return state.status === 'listening' ? { ...state, status: settledStatus(state) } : state
    case 'ask':
      return { ...state, status: 'thinking', tutor: { question: action.question, phase: 'thinking' } }
    case 'answered':
      return state.status === 'thinking' && state.tutor
        ? { ...state, status: settledStatus(state), tutor: { ...state.tutor, phase: 'answered' } }
        : state
    case 'dismissTutor': {
      const status = state.status === 'thinking' ? settledStatus(state) : state.status
      return { ...state, status, tutor: null }
    }
    case 'queueAutoplay':
      return { ...state, autoplay: true }
  }
}

interface UseNarrationStreamOptions {
  page: BookLessonPage | undefined
  /** False in full-book mode; any in-progress stream is reset. */
  enabled: boolean
  rate: number
  muted: boolean
  onCue?: (cue: NarrationCueEvent) => void
  onComplete?: () => void
}

export interface NarrationStream {
  status: NarrationStatus
  wordIndex: number
  pass: number
  words: NarrationWord[]
  sentences: NarrationSentence[]
  cues: NarrationCueEvent[]
  reachedCues: NarrationCueEvent[]
  currentSentence: NarrationSentence | null
  /** 0..1 progress through the page narration. */
  progress: number
  tutor: TutorExchange | null
  canSeek: boolean
  player: AudioPlayer
  play: () => void
  pause: () => void
  toggle: () => void
  restart: () => void
  previousSentence: () => void
  nextSentence: () => void
  seekToWord: (wordIndex: number) => void
  startListening: () => void
  stopListening: () => void
  ask: (question: string) => void
  dismissTutor: () => void
  queueAutoplay: () => void
}

export function useNarrationStream({
  page,
  enabled,
  rate,
  muted,
  onCue,
  onComplete,
}: UseNarrationStreamOptions): NarrationStream {
  const pageId = page?.id ?? ''
  const narrationText = page?.narrationText ?? ''
  const { words, sentences } = useMemo(() => tokenizeNarration(narrationText), [narrationText])
  const cues = useMemo(() => buildNarrationCues(page, words.length), [page, words.length])

  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(pageId, words.length))

  // Page change / full-book mode: reset during render so no stale word or timer survives a frame.
  if (state.pageId !== pageId) {
    dispatch({ type: 'reset', pageId, wordCount: words.length, autoplay: state.autoplay && enabled })
  } else if (!enabled && state.wordIndex >= 0) {
    dispatch({ type: 'reset', pageId, wordCount: words.length, autoplay: false })
  }

  const { status, wordIndex, pass } = state

  // Single timer: re-armed per word, cleared on any status/rate/page change and on unmount.
  useEffect(() => {
    if (status !== 'speaking' || wordIndex < 0 || wordIndex >= words.length) return
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), wordDelayMs(words[wordIndex].text, rate))
    return () => window.clearTimeout(timer)
  }, [status, wordIndex, rate, words])

  useEffect(() => {
    if (status !== 'thinking') return
    const timer = window.setTimeout(() => dispatch({ type: 'answered' }), THINKING_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  const emitCue = useEffectEvent((cue: NarrationCueEvent) => onCue?.(cue))
  const emitComplete = useEffectEvent(() => onComplete?.())
  const fired = useRef<{ key: string; ids: Set<string> }>({ key: '', ids: new Set() })

  useEffect(() => {
    const key = `${pageId}:${pass}`
    if (fired.current.key !== key) fired.current = { key, ids: new Set() }
    const ids = fired.current.ids
    for (const cue of cues) {
      const reached = wordIndex >= 0 && cue.atWord <= wordIndex
      if (reached && !ids.has(cue.id)) {
        ids.add(cue.id)
        emitCue(cue)
      } else if (!reached && ids.has(cue.id)) {
        // Seeking backwards re-arms cues ahead of the new position.
        ids.delete(cue.id)
      }
    }
  }, [cues, pageId, pass, wordIndex])

  useEffect(() => {
    if (status === 'completed') emitComplete()
  }, [status, pass])

  const [player] = useState(createMockAudioPlayer)
  const sentenceIndex = wordIndex >= 0 && wordIndex < words.length ? words[wordIndex].sentence : -1

  useEffect(() => () => player.dispose(), [player])
  useEffect(() => player.setRate(rate), [player, rate])
  useEffect(() => player.setMuted(muted), [player, muted])
  useEffect(() => {
    if (status === 'speaking' && sentenceIndex >= 0) player.speak({ text: sentences[sentenceIndex].text, rate })
    else if (status === 'idle' || status === 'completed') player.stop()
    else player.pause()
    // `rate` is applied through setRate; re-speaking on rate change would restart the sentence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, status, sentenceIndex, sentences])

  const reachedCues = useMemo(
    () => (wordIndex < 0 ? [] : cues.filter((cue) => cue.atWord <= wordIndex)),
    [cues, wordIndex],
  )

  const currentSentence = sentenceIndex >= 0 ? sentences[sentenceIndex] : null

  function seekToWord(target: number) {
    dispatch({ type: 'seek', wordIndex: target })
  }

  function previousSentence() {
    if (wordIndex < 0) return
    if (wordIndex >= words.length) {
      seekToWord(sentences.at(-1)?.start ?? 0)
      return
    }
    const current = sentences[words[wordIndex].sentence]
    const target = wordIndex - current.start > 1 ? current.start : (sentences[current.index - 1]?.start ?? 0)
    seekToWord(target)
  }

  function nextSentence() {
    if (wordIndex < 0 || wordIndex >= words.length) return
    const current = words[wordIndex].sentence
    seekToWord(sentences[current + 1]?.start ?? words.length)
  }

  return {
    status,
    wordIndex,
    pass,
    words,
    sentences,
    cues,
    reachedCues,
    currentSentence,
    progress: words.length === 0 || wordIndex < 0 ? 0 : Math.min(1, wordIndex / words.length),
    tutor: state.tutor,
    canSeek: wordIndex >= 0 && words.length > 0,
    player,
    play: () => dispatch({ type: 'play' }),
    pause: () => dispatch({ type: 'pause' }),
    toggle: () => dispatch({ type: status === 'speaking' ? 'pause' : 'play' }),
    restart: () => dispatch({ type: 'restart' }),
    previousSentence,
    nextSentence,
    seekToWord,
    startListening: () => dispatch({ type: 'listen' }),
    stopListening: () => dispatch({ type: 'stopListening' }),
    ask: (question) => dispatch({ type: 'ask', question }),
    dismissTutor: () => dispatch({ type: 'dismissTutor' }),
    queueAutoplay: () => dispatch({ type: 'queueAutoplay' }),
  }
}
