import type { Vision, WeaponType } from '../api/types'

interface VisionMeta {
  label: Vision
  /** Tailwind-ish hex used for chips and glow accents. */
  color: string
  /** Ring/border colour for cards. */
  ring: string
  /** Emoji fallback so the UI degrades gracefully if images ever fail. */
  glyph: string
}

export const VISION_META: Record<Vision, VisionMeta> = {
  Pyro: { label: 'Pyro', color: '#ef4444', ring: 'ring-red-500/40', glyph: '🔥' },
  Hydro: { label: 'Hydro', color: '#3b82f6', ring: 'ring-blue-500/40', glyph: '💧' },
  Anemo: { label: 'Anemo', color: '#22c55e', ring: 'ring-emerald-500/40', glyph: '🌪️' },
  Electro: { label: 'Electro', color: '#a855f7', ring: 'ring-purple-500/40', glyph: '⚡' },
  Dendro: { label: 'Dendro', color: '#84cc16', ring: 'ring-lime-500/40', glyph: '🌿' },
  Cryo: { label: 'Cryo', color: '#67e8f9', ring: 'ring-cyan-400/40', glyph: '❄️' },
  Geo: { label: 'Geo', color: '#eab308', ring: 'ring-yellow-500/40', glyph: '🪨' },
}

export const WEAPON_LABEL: Record<WeaponType, string> = {
  SWORD: 'Sword',
  BOW: 'Bow',
  CLAYMORE: 'Claymore',
  POLEARM: 'Polearm',
  CATALYST: 'Catalyst',
}

export const WEAPON_GLYPH: Record<WeaponType, string> = {
  SWORD: '🗡️',
  BOW: '🏹',
  CLAYMORE: '⚔️',
  POLEARM: '🔱',
  CATALYST: '🔮',
}

/**
 * The API returns birthdays as "0000-08-22": a meaningless year, and the month
 * is zero-indexed in-game (so January is 00). Return a human-readable date.
 */
export function formatBirthday(raw: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (!match) return null
  const [, , month, day] = match
  const index = Number(month)
  if (Number.isNaN(index) || index < 1 || index > 12) return null
  const date = new Date(Date.UTC(2000, index, Number(day)))
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatRelease(raw: string): string | null {
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Render the API's \n-separated skill text as clean paragraphs. */
export function splitDescription(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
