'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BookeyButton } from '@/components/ui-kit/bookey-button'
import type { LearningCourse } from '@/lib/mock/learning'
import { cn } from '@/lib/utils'
import { getBookHref, useCourseSurvey } from './use-course-survey'

const QUESTIONS = [
  {
    id: 'experience',
    label: 'How familiar are you with this topic?',
    options: ['Completely new', 'Tried it a little', 'Comfortable with basics'],
  },
  {
    id: 'goal',
    label: 'What brings you to this course?',
    options: ['Career change', 'School or university', 'Personal project', 'Just curious'],
  },
  {
    id: 'pace',
    label: 'How much time can you give each week?',
    options: ['Under 1 hour', '1–3 hours', 'More than 3 hours'],
  },
] as const

export function CourseSurveyForm({ course }: { course: LearningCourse }) {
  const router = useRouter()
  const { saveSurvey } = useCourseSurvey(course)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState(false)
  const missing = QUESTIONS.filter((question) => !answers[question.id])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (missing.length > 0) {
      setShowErrors(true)
      document.getElementById(`q-${missing[0].id}-0`)?.focus()
      return
    }
    saveSurvey(answers)
    router.push(getBookHref(course.id))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {QUESTIONS.map((question) => {
        const invalid = showErrors && !answers[question.id]
        return (
          <fieldset
            key={question.id}
            aria-describedby={invalid ? `q-${question.id}-error` : undefined}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6"
          >
            <legend className="sr-only">{question.label}</legend>
            <p aria-hidden="true" className="mb-4 font-display text-lg font-semibold">
              {question.label}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const checked = answers[question.id] === option
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/30',
                      checked ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border hover:border-primary/40',
                    )}
                  >
                    <input
                      id={`q-${question.id}-${index}`}
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={checked}
                      onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: option }))}
                      className="size-4 accent-primary"
                    />
                    {option}
                  </label>
                )
              })}
            </div>
            {invalid && (
              <p id={`q-${question.id}-error`} className="mt-3 text-sm font-medium text-destructive">
                Choose one option to continue.
              </p>
            )}
          </fieldset>
        )
      })}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Answers are saved on this device only and tune the demo tutor&apos;s tone.</p>
        <BookeyButton type="submit" size="lg">
          Save and open the book
          <ArrowRight aria-hidden="true" />
        </BookeyButton>
      </div>
    </form>
  )
}
