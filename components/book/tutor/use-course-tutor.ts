'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { LearningCourseId } from '@/lib/mock/learning'
import type { PreferredLanguage } from '@/lib/stores/personalization'
import { type ChatMessage, useCourseChat } from '@/lib/stores/course-chat'
import { answerQuestion, MAX_QUESTION_LENGTH, tokenizeAnswer } from '@/lib/tutor/demo-tutor'
import type { BookLessonPage } from '@/types/book'

const THINKING_MS = 1100
const TOKEN_MS = 38
const EMPTY: ChatMessage[] = []

interface UseCourseTutorOptions {
  courseId: LearningCourseId
  courseTitle: string
  page: BookLessonPage | undefined
  pageIndex: number
  language: PreferredLanguage
  reducedMotion: boolean
}

export interface CourseTutor {
  messages: ChatMessage[]
  busy: boolean
  /** Tokens revealed so far for the answer currently streaming. */
  reveal: { id: string; count: number } | null
  ask: (question: string) => boolean
  clear: () => void
}

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useCourseTutor({
  courseId,
  courseTitle,
  page,
  pageIndex,
  language,
  reducedMotion,
}: UseCourseTutorOptions): CourseTutor {
  const messages = useCourseChat((s) => s.threads[courseId]) ?? EMPTY
  const [reveal, setReveal] = useState<CourseTutor['reveal']>(null)
  const timeoutRef = useRef<number | undefined>(undefined)
  const intervalRef = useRef<number | undefined>(undefined)
  const busy = messages.some((m) => m.status !== 'done')

  const stopTimers = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    window.clearInterval(intervalRef.current)
  }, [])

  useEffect(() => stopTimers, [stopTimers])

  const ask = useCallback(
    (raw: string) => {
      const question = raw.trim().slice(0, MAX_QUESTION_LENGTH)
      if (!question || !page || busy) return false
      const { append, update } = useCourseChat.getState()
      const answer = answerQuestion({ question, courseId, courseTitle, page, pageIndex, language })
      const pageLabel = `Page ${pageIndex + 1} · ${page.title}`
      const tutorId = makeId()

      append(courseId, { id: makeId(), role: 'user', text: question, createdAt: Date.now(), pageLabel, status: 'done' })
      append(courseId, {
        id: tutorId,
        role: 'tutor',
        text: answer.text,
        createdAt: Date.now(),
        pageLabel,
        status: 'thinking',
        code: answer.code,
        diagram: answer.diagram,
        sources: answer.sources,
        offTopic: answer.intent === 'off-topic',
      })

      stopTimers()
      timeoutRef.current = window.setTimeout(() => {
        const total = tokenizeAnswer(answer.text).length
        if (reducedMotion) {
          update(courseId, tutorId, { status: 'done' })
          return
        }
        update(courseId, tutorId, { status: 'streaming' })
        let count = 0
        setReveal({ id: tutorId, count })
        intervalRef.current = window.setInterval(() => {
          count += 1
          if (count >= total) {
            window.clearInterval(intervalRef.current)
            update(courseId, tutorId, { status: 'done' })
            setReveal(null)
          } else {
            setReveal({ id: tutorId, count })
          }
        }, TOKEN_MS)
      }, THINKING_MS)
      return true
    },
    [busy, page, courseId, courseTitle, pageIndex, language, reducedMotion, stopTimers],
  )

  const clear = useCallback(() => {
    stopTimers()
    setReveal(null)
    useCourseChat.getState().clear(courseId)
  }, [courseId, stopTimers])

  return { messages, busy, reveal, ask, clear }
}
