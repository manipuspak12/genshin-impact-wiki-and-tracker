import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CharacterCard } from '../components/CharacterCard'
import { FilterBar } from '../components/FilterBar'
import { useRoster } from '../hooks/useRoster'
import { EMPTY_FILTERS, applyFilters } from '../lib/filters'

export function RosterPage() {
  const roster = useRoster()
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  // Keep the union intact rather than destructuring — destructuring a
  // discriminated union in one statement discards the narrowing.
  const visible = useMemo(
    () => (roster.status === 'ready' ? applyFilters(roster.characters, filters) : []),
    [roster, filters],
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Characters</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Browse the full roster with talents, constellations, and ascension costs.
        </p>
      </header>

      {roster.status === 'loading' && <RosterSkeleton />}

      {roster.status === 'error' && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
          <p className="font-medium text-red-800 dark:text-red-300">Could not load the roster</p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">{roster.message}</p>
          <button
            type="button"
            onClick={roster.reload}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {roster.status === 'ready' && (
        <>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
            resultCount={visible.length}
            totalCount={roster.characters.length}
          />

          {visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
              No characters match those filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((character) => (
                <Link
                  key={character.id}
                  to={`/characters/${character.id}`}
                  className="focus-visible:ring-accent-500 rounded-xl focus:outline-none focus-visible:ring-2"
                >
                  <CharacterCard character={character} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RosterSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  )
}
