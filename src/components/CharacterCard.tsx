import { characterCard } from '../api/genshin'
import type { Character } from '../api/types'
import { VISION_META, WEAPON_GLYPH, WEAPON_LABEL } from '../lib/genshin'
import { RarityStars, VisionChip } from './Chips'

export function CharacterCard({ character }: { character: Character }) {
  const meta = VISION_META[character.vision]

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-zinc-200 bg-white ring-1 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 ${meta.ring}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: meta.color }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 p-4">
        <img
          src={characterCard(character.id)}
          alt=""
          loading="lazy"
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
          onError={(e) => {
            // Cards are webp; if one 404s, hide the broken image.
            e.currentTarget.style.visibility = 'hidden'
          }}
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
            {character.name}
          </h3>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{character.title}</p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <VisionChip vision={character.vision} />
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <span aria-hidden="true">{WEAPON_GLYPH[character.weapon_type]}</span>
              {WEAPON_LABEL[character.weapon_type]}
            </span>
            <RarityStars rarity={character.rarity} />
          </div>

          <p className="mt-2 truncate text-xs text-zinc-500 dark:text-zinc-500">
            {character.nation} · {character.affiliation}
          </p>
        </div>
      </div>
    </article>
  )
}
