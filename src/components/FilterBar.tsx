import { VISIONS, WEAPON_TYPES } from '../api/types'
import type { Filters } from '../lib/filters'
import { isFiltered } from '../lib/filters'
import { VISION_META, WEAPON_GLYPH, WEAPON_LABEL } from '../lib/genshin'

const CONTROL =
  'rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 dark:border-zinc-700 dark:bg-zinc-950'

export function FilterBar({
  filters,
  onChange,
  onClear,
  resultCount,
  totalCount,
}: {
  filters: Filters
  onChange: (next: Filters) => void
  onClear: () => void
  resultCount: number
  totalCount: number
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor="roster-search" className="sr-only">
            Search characters
          </label>
          <input
            id="roster-search"
            type="search"
            value={filters.query}
            onChange={(e) => set('query', e.target.value)}
            placeholder="Search name, nation, constellation…"
            className={`${CONTROL} w-full dark:placeholder:text-zinc-500`}
          />
        </div>

        <select
          value={filters.vision}
          onChange={(e) => set('vision', e.target.value as Filters['vision'])}
          aria-label="Filter by element"
          className={CONTROL}
        >
          <option value="all">All elements</option>
          {VISIONS.map((v) => (
            <option key={v} value={v}>
              {VISION_META[v].glyph} {v}
            </option>
          ))}
        </select>

        <select
          value={filters.weapon}
          onChange={(e) => set('weapon', e.target.value as Filters['weapon'])}
          aria-label="Filter by weapon type"
          className={CONTROL}
        >
          <option value="all">All weapons</option>
          {WEAPON_TYPES.map((w) => (
            <option key={w} value={w}>
              {WEAPON_GLYPH[w]} {WEAPON_LABEL[w]}
            </option>
          ))}
        </select>

        <select
          value={filters.rarity}
          onChange={(e) => set('rarity', e.target.value === 'all' ? 'all' : Number(e.target.value))}
          aria-label="Filter by rarity"
          className={CONTROL}
        >
          <option value="all">Any rarity</option>
          <option value="5">5★</option>
          <option value="4">4★</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span aria-live="polite">
          {resultCount === totalCount
            ? `${totalCount} characters`
            : `${resultCount} of ${totalCount} characters`}
        </span>
        {isFiltered(filters) && (
          <button
            type="button"
            onClick={onClear}
            className="text-accent-600 dark:text-accent-400 font-medium hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
