import { useCallback, useEffect, useState } from 'react'
import { fetchRoster } from '../api/genshin'
import type { Character } from '../api/types'

type State =
  | { status: 'loading' }
  | { status: 'ready'; characters: Character[] }
  | { status: 'error'; message: string }

interface Failure {
  attempt: number
  message: string
}

/**
 * Loads the whole roster once and shares it — fetchRoster() memoises the promise,
 * so navigating between characters doesn't refetch.
 *
 * "Loading" is derived rather than set inside the effect: calling setState
 * synchronously in an effect body causes cascading renders. Sticky data also
 * means a retry never flashes an empty grid.
 */
export function useRoster(): State & { reload: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [data, setData] = useState<Character[] | null>(null)
  const [failure, setFailure] = useState<Failure | null>(null)

  useEffect(() => {
    let active = true

    fetchRoster()
      .then((characters) => {
        if (active) setData(characters)
      })
      .catch((error: unknown) => {
        if (!active) return
        setFailure({
          attempt,
          message: error instanceof Error ? error.message : 'Something went wrong.',
        })
      })

    return () => {
      active = false
    }
  }, [attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  if (failure?.attempt === attempt) {
    return { status: 'error', message: failure.message, reload }
  }
  if (!data) return { status: 'loading', reload }
  return { status: 'ready', characters: data, reload }
}
