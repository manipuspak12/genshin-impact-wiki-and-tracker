import type { Vision } from '../api/types'
import { VISION_META } from '../lib/genshin'

export function VisionChip({ vision, className = '' }: { vision: Vision; className?: string }) {
  const meta = VISION_META[vision]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white ${className}`}
      style={{ backgroundColor: meta.color }}
    >
      <span aria-hidden="true">{meta.glyph}</span>
      {meta.label}
    </span>
  )
}

export function RarityStars({ rarity }: { rarity: number }) {
  return (
    <span
      className="text-sm leading-none text-amber-400"
      aria-label={`${rarity} star rarity`}
      title={`${rarity}★`}
    >
      {'★'.repeat(rarity)}
    </span>
  )
}
