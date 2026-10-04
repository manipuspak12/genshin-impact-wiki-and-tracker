import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { characterCard } from '../api/genshin'
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
  const featured =
    roster.status === 'ready'
      ? [...roster.characters]
          .sort((left, right) => right.release.localeCompare(left.release))
          .slice(0, 4)
      : []
  const metrics =
    roster.status === 'ready'
      ? [
          { label: 'Characters', value: roster.characters.length },
          { label: 'Elements', value: new Set(roster.characters.map((item) => item.vision)).size },
          { label: 'Nations', value: new Set(roster.characters.map((item) => item.nation)).size },
        ]
      : [
          { label: 'Characters', value: '—' },
          { label: 'Elements', value: '—' },
          { label: 'Nations', value: '—' },
        ]

  return (
    <div className="pb-10">
      <section className="roster-hero overflow-hidden border-b border-white/10 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
          <div className="hero-enter">
            <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-amber-200/80 uppercase">
              Genshin Impact, in one place
            </p>
            <h1 className="max-w-2xl text-5xl leading-[1.08] font-bold text-white sm:text-6xl lg:text-7xl">
              Stop guessing.
              <br />
              Start <span className="text-[#c9c8e8]">building better.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#c1c1cc] sm:text-lg sm:leading-8">
              Find the talents, constellations, and ascension details behind every character. Plan
              your next build with the whole roster at your fingertips.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#character-roster"
                className="rounded-lg bg-[#7778b8] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(119,120,184,0.3)] transition hover:bg-[#8586c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9c8e8]"
              >
                Explore characters <span aria-hidden="true">→</span>
              </a>
              <Link
                to="/tracker"
                className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9c8e8]"
              >
                Preview the tracker <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="mt-5 text-xs text-[#9494a1]">Free to browse · No account required</p>
          </div>

          <section
            aria-label="Roster overview"
            className="hero-preview overflow-hidden rounded-lg border border-white/10 bg-[#17171d]/95 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#9696a3] uppercase">
                  Roster overview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">Your next favorite awaits</h2>
              </div>
              <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-emerald-200">
                LIVE INDEX
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-white/10 px-4 py-4 sm:gap-3 sm:px-5">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-md border border-white/7 bg-white/3 p-3"
                >
                  <p className="text-2xl font-semibold text-white sm:text-3xl">{metric.value}</p>
                  <p className="mt-1 text-xs text-[#9b9ba7]">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3 sm:gap-3 sm:p-4">
              {roster.status === 'ready' ? (
                featured.map((character) => (
                  <Link
                    key={character.id}
                    to={`/characters/${character.id}`}
                    className="group overflow-hidden rounded-md border border-white/10 bg-[#0d0e13] transition hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9c8e8]"
                  >
                    <div className="relative aspect-[1.7/1] overflow-hidden bg-[#25242d]">
                      <img
                        src={characterCard(character.id)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.visibility = 'hidden'
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/5"
                      />
                      <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80">
                        {character.nation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                      <span className="truncate text-sm font-medium text-white">
                        {character.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-[#c9c8e8]">
                        {character.vision}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 flex min-h-40 items-center justify-center rounded-md border border-dashed border-white/10 text-sm text-[#9b9ba7]">
                  {roster.status === 'loading'
                    ? 'Loading the character roster…'
                    : 'Roster data is unavailable'}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3 text-xs text-[#9999a6] sm:px-5">
              Character details, talents, constellations, and materials in one guide.
            </div>
          </section>
        </div>
      </section>

      <section
        id="character-roster"
        className="mx-auto max-w-7xl space-y-6 px-5 py-12 sm:px-8 sm:py-16"
      >
        <header>
          <p className="text-accent-500 text-xs font-semibold tracking-[0.16em] uppercase">
            Explore
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Character roster
          </h2>
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
      </section>
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
