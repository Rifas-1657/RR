'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { physicalLineFor, runPythonDemo, type DemoRunResult, type DemoVariable } from '@/lib/runner'
import { storageKeys, useLocalStorage } from '@/lib/storage'
import type { CodeExample, LessonPageId } from '@/types/book'

export type LabStatus = 'ready' | 'running' | 'awaiting-input' | 'done' | 'error'
export type LabMode = 'run' | 'step'
export type OutputTab = 'output' | 'variables' | 'preview'

export interface RunnerSnapshot {
  code: string
  stdout: string
  exampleId: string | null
  savedAt: string
}

type SnapshotMap = Partial<Record<LessonPageId, RunnerSnapshot>>

interface LabState {
  code: string
  status: LabStatus
  mode: LabMode | null
  result: DemoRunResult | null
  inputs: string[]
  visibleSteps: number
  stopped: boolean
  narrated: boolean
  tab: OutputTab
  terminalOpen: boolean
  /** Characters revealed while narration streams the sample; `null` when not streaming. */
  streamChars: number | null
  /** Increments on each successful run so persistence and the saved card fire once per run. */
  completedRunId: number
  dismissedRunId: number
}

type LabAction =
  | { type: 'edit'; code: string }
  | { type: 'run'; mode: LabMode; narrated?: boolean }
  | { type: 'advance' }
  | { type: 'submitInput'; value: string }
  | { type: 'stop' }
  | { type: 'reset'; code: string }
  | { type: 'setTab'; tab: OutputTab }
  | { type: 'toggleTerminal' }
  | { type: 'startStream' }
  | { type: 'streamTick'; chars: number }
  | { type: 'finishStream' }
  | { type: 'dismissSaved' }

const idleRun = {
  status: 'ready' as LabStatus,
  mode: null,
  result: null,
  inputs: [],
  visibleSteps: 0,
  stopped: false,
  narrated: false,
}

function settle(state: LabState): LabState {
  const result = state.result
  if (!result || state.visibleSteps < result.steps.length) return state
  if (result.status === 'awaiting-input') return { ...state, status: 'awaiting-input', terminalOpen: true }
  if (result.status === 'done') return { ...state, status: 'done', completedRunId: state.completedRunId + 1 }
  return { ...state, status: 'error' }
}

function reducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'edit':
      if (state.streamChars !== null || state.status === 'running' || state.status === 'awaiting-input') return state
      return { ...state, ...idleRun, code: action.code }
    case 'run': {
      if (state.streamChars !== null) return state
      const inputs = action.narrated ? (runPythonDemo(state.code).sampleInputs ?? []) : []
      const result = runPythonDemo(state.code, inputs)
      const next: LabState = {
        ...state,
        ...idleRun,
        status: 'running',
        mode: action.mode,
        result,
        inputs,
        narrated: Boolean(action.narrated),
        visibleSteps: action.mode === 'step' ? Math.min(1, result.steps.length) : 0,
        tab: state.tab === 'preview' ? 'output' : state.tab,
      }
      return action.mode === 'step' || result.steps.length === 0 ? settle(next) : next
    }
    case 'advance':
      if (state.status !== 'running' || !state.result) return state
      return settle({ ...state, visibleSteps: state.visibleSteps + 1 })
    case 'submitInput': {
      if (state.status !== 'awaiting-input') return state
      const inputs = [...state.inputs, action.value]
      const result = runPythonDemo(state.code, inputs)
      const next: LabState = { ...state, inputs, result, status: 'running' }
      return state.mode === 'step' ? settle({ ...next, visibleSteps: next.visibleSteps + 1 }) : next
    }
    case 'stop':
      return { ...state, ...idleRun, stopped: state.status === 'running' || state.status === 'awaiting-input' }
    case 'reset':
      return { ...state, ...idleRun, code: action.code, streamChars: null, tab: 'output' }
    case 'setTab':
      return { ...state, tab: action.tab }
    case 'toggleTerminal':
      return { ...state, terminalOpen: !state.terminalOpen }
    case 'startStream':
      return { ...state, ...idleRun, streamChars: 0 }
    case 'streamTick':
      return state.streamChars === null ? state : { ...state, streamChars: action.chars }
    case 'finishStream':
      return { ...state, streamChars: null }
    case 'dismissSaved':
      return { ...state, dismissedRunId: state.completedRunId }
  }
}

const STEP_INTERVAL_MS = 260
const STREAM_INTERVAL_MS = 22

export function useCodeLab(pageId: LessonPageId, example: CodeExample) {
  const reducedMotion = useReducedMotion()
  const [state, dispatch] = useReducer(reducer, null, () => ({
    ...idleRun,
    code: example.source,
    tab: 'output' as OutputTab,
    terminalOpen: true,
    streamChars: null,
    completedRunId: 0,
    dismissedRunId: 0,
  }))
  const [snapshots, setSnapshots] = useLocalStorage<SnapshotMap>(storageKeys.runnerSnapshots, {})

  const totalSteps = state.result?.steps.length ?? 0
  const autoAdvancing = state.status === 'running' && state.mode === 'run' && state.visibleSteps < totalSteps
  useEffect(() => {
    if (!autoAdvancing) return
    const timer = window.setTimeout(() => dispatch({ type: 'advance' }), reducedMotion ? 0 : STEP_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [autoAdvancing, state.visibleSteps, reducedMotion])

  const streaming = state.streamChars !== null
  useEffect(() => {
    if (!streaming) return
    if (reducedMotion) {
      dispatch({ type: 'finishStream' })
      return
    }
    let chars = 0
    const timer = window.setInterval(() => {
      chars += 1
      if (chars >= state.code.length) {
        window.clearInterval(timer)
        dispatch({ type: 'finishStream' })
      } else {
        dispatch({ type: 'streamTick', chars })
      }
    }, STREAM_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [streaming, reducedMotion, state.code.length])

  const { completedRunId, result, code } = state
  useEffect(() => {
    if (completedRunId === 0 || !result) return
    setSnapshots((previous) => ({
      ...previous,
      [pageId]: { code, stdout: result.stdout, exampleId: result.exampleId, savedAt: new Date().toISOString() },
    }))
    // Persist once per completed run, not on every edit afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedRunId])

  const steps = state.result?.steps ?? []
  const currentStep = state.visibleSteps > 0 ? steps[state.visibleSteps - 1] : undefined
  const stdout = steps
    .slice(0, state.visibleSteps)
    .map((step) => step.output ?? '')
    .join('')
  const runActive = state.status === 'running' || state.status === 'awaiting-input'
  const showsTrace = runActive || state.status === 'done' || state.status === 'error'

  let streamLine: number | null = null
  if (state.streamChars !== null) streamLine = state.code.slice(0, state.streamChars).split('\n').length

  const executingLine =
    showsTrace && currentStep ? physicalLineFor(state.code, currentStep.logicalLine) : null

  const variables: DemoVariable[] = currentStep?.variables ?? []
  const changedVariable =
    currentStep && state.visibleSteps > 0
      ? variables.find((variable) => {
          const before = steps[state.visibleSteps - 2]?.variables.find((entry) => entry.name === variable.name)
          return !before || before.value !== variable.value
        })?.name ?? null
      : null

  return {
    state,
    stdout,
    stderr: state.status === 'error' ? state.result?.stderr : undefined,
    message: state.result?.status === 'unsupported' ? state.result.message : undefined,
    runActive,
    streaming,
    streamLine,
    executingLine,
    variables,
    changedVariable,
    stepPosition: { current: state.visibleSteps, total: totalSteps },
    edited: state.code !== example.source,
    snapshot: snapshots[pageId] ?? null,
    savedCardVisible: state.status === 'done' && state.completedRunId > state.dismissedRunId,
    edit: useCallback((code: string) => dispatch({ type: 'edit', code }), []),
    run: useCallback((narrated = false) => dispatch({ type: 'run', mode: 'run', narrated }), []),
    step: useCallback(() => {
      dispatch(
        state.mode === 'step' && state.status === 'running' ? { type: 'advance' } : { type: 'run', mode: 'step' },
      )
    }, [state.mode, state.status]),
    submitInput: useCallback((value: string) => dispatch({ type: 'submitInput', value }), []),
    stop: useCallback(() => dispatch({ type: 'stop' }), []),
    reset: useCallback(() => dispatch({ type: 'reset', code: example.source }), [example.source]),
    restore: useCallback((code: string) => dispatch({ type: 'reset', code }), []),
    setTab: useCallback((tab: OutputTab) => dispatch({ type: 'setTab', tab }), []),
    toggleTerminal: useCallback(() => dispatch({ type: 'toggleTerminal' }), []),
    startStream: useCallback(() => dispatch({ type: 'startStream' }), []),
    finishStream: useCallback(() => dispatch({ type: 'finishStream' }), []),
    dismissSaved: useCallback(() => dispatch({ type: 'dismissSaved' }), []),
  }
}

export type CodeLab = ReturnType<typeof useCodeLab>
