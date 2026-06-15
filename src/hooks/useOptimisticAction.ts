// src/hooks/useOptimisticAction.ts
'use client'
import { useState, useCallback } from 'react'

interface UseOptimisticActionOptions<T> {
  onAction: (data: T) => Promise<void>
  onError?: (error: Error, previousState: T) => void
}

// Renders an action's result immediately and reverts if the async call fails.
export function useOptimisticAction<T>(
  currentState: T,
  { onAction, onError }: UseOptimisticActionOptions<T>
) {
  const [optimisticState, setOptimisticState] = useState<T | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async (newState: T) => {
    const previousState = optimisticState ?? currentState
    setOptimisticState(newState)
    setIsPending(true)
    setError(null)

    try {
      await onAction(newState)
    } catch (err) {
      // Revert on error
      setOptimisticState(previousState)
      const e = err instanceof Error ? err : new Error('Action failed')
      setError(e)
      onError?.(e, previousState)
    } finally {
      setIsPending(false)
    }
  }, [currentState, optimisticState, onAction, onError])

  return {
    state: optimisticState ?? currentState,
    execute,
    isPending,
    error,
  }
}
