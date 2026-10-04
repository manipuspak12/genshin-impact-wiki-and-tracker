import type { Character, Vision, WeaponType } from '../api/types'

export interface Filters {
  query: string
  vision: Vision | 'all'
  weapon: WeaponType | 'all'
  rarity: number | 'all'
}

export const EMPTY_FILTERS: Filters = { query: '', vision: 'all', weapon: 'all', rarity: 'all' }

export function isFiltered(filters: Filters): boolean {
  return (
    filters.query !== '' ||
    filters.vision !== 'all' ||
    filters.weapon !== 'all' ||
    filters.rarity !== 'all'
  )
}

export function applyFilters(characters: Character[], filters: Filters): Character[] {
  const q = filters.query.trim().toLowerCase()

  return characters.filter((c) => {
    if (filters.vision !== 'all' && c.vision !== filters.vision) return false
    if (filters.weapon !== 'all' && c.weapon_type !== filters.weapon) return false
    if (filters.rarity !== 'all' && c.rarity !== filters.rarity) return false
    if (!q) return true

    const haystack = [
      c.name,
      c.title,
      c.nation,
      c.affiliation,
      c.constellation,
      c.weapon,
      c.vision,
      c.specialDish ?? '',
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
}
