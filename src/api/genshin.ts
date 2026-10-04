import type { Character, EntityType } from './types'

const BASE = 'https://genshin.jmp.blue'

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, { signal })
  } catch (cause) {
    // fetch rejects on network failure and on abort; let aborts bubble as-is.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError('Could not reach genshin.dev. Check your connection.')
  }

  if (!response.ok) {
    throw new ApiError(`genshin.dev returned ${response.status}`, response.status)
  }
  return response.json() as Promise<T>
}

/**
 * The full roster is ~620 KB uncompressed (zstd on the wire) and the API sets no
 * cache headers, so we fetch once per session and share it across components.
 * Without this, every route change would re-download the whole roster.
 *
 * Takes no AbortSignal on purpose: the request is shared session-wide, so
 * aborting it from one unmounting consumer would break every other consumer
 * (and race with React StrictMode's double-effect). Callers ignore results they
 * no longer care about instead.
 */
let rosterPromise: Promise<Character[]> | null = null

export function fetchRoster(): Promise<Character[]> {
  rosterPromise ??= request<Character[]>('/characters/all?lang=en').catch((error) => {
    // Don't cache a failure — let the next caller retry.
    rosterPromise = null
    throw error
  })
  return rosterPromise
}

/** Fetch a single character. Prefer fetchRoster(); this is for one-off lookups. */
export async function fetchCharacter(id: string): Promise<Character> {
  const roster = await fetchRoster()
  const found = roster.find((c) => c.id === id)
  if (!found) throw new ApiError(`Unknown character "${id}"`, 404)
  return found
}

/** List of available entity types, e.g. ['characters', 'weapons', ...]. */
export function fetchEntityTypes(signal?: AbortSignal): Promise<EntityType[]> {
  return request<{ types: EntityType[] }>('', signal).then((r) => r.types)
}

/** Portrait/card image for a character. Returns a webp. */
export function characterCard(id: string): string {
  return `${BASE}/characters/${id}/card`
}
