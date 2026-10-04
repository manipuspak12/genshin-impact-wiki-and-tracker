import { Link, useParams } from 'react-router-dom'
import { characterCard } from '../api/genshin'
import type {
  AscensionMaterials,
  Character,
  Constellation,
  PassiveTalent,
  SkillTalent,
} from '../api/types'
import { RarityStars, VisionChip } from '../components/Chips'
import { useRoster } from '../hooks/useRoster'
import {
  VISION_META,
  WEAPON_GLYPH,
  WEAPON_LABEL,
  formatBirthday,
  formatRelease,
  splitDescription,
} from '../lib/genshin'

const ASCENSION_LEVELS = ['level_20', 'level_40', 'level_50', 'level_60', 'level_70', 'level_80']

export function CharacterPage() {
  const { id = '' } = useParams()
  const roster = useRoster()

  if (roster.status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="h-56 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  if (roster.status === 'error') {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
        <p className="font-medium text-red-800 dark:text-red-300">Could not load this character</p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-400">{roster.message}</p>
        <button
          type="button"
          onClick={roster.reload}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    )
  }

  const character = roster.characters.find((c) => c.id === id)

  if (!character) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
        <p className="text-lg font-medium">No character named “{id}”</p>
        <Link
          to="/"
          className="text-accent-600 dark:text-accent-400 mt-3 inline-block hover:underline"
        >
          ← Back to the roster
        </Link>
      </div>
    )
  }

  return <CharacterDetail character={character} />
}

function CharacterDetail({ character }: { character: Character }) {
  const meta = VISION_META[character.vision]
  const birthday = formatBirthday(character.birthday)
  const released = formatRelease(character.release)
  const description = splitDescription(character.description)

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="text-accent-600 dark:text-accent-400 inline-block text-sm hover:underline"
      >
        ← Back to the roster
      </Link>

      <header
        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        style={{ borderTop: `4px solid ${meta.color}` }}
      >
        <div className="flex flex-col gap-6 p-6 sm:flex-row">
          <img
            src={characterCard(character.id)}
            alt={`${character.name} portrait`}
            width={160}
            height={160}
            className="h-40 w-40 shrink-0 self-start rounded-xl bg-zinc-100 object-cover dark:bg-zinc-800"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {character.name}
              </h1>
              <RarityStars rarity={character.rarity} />
            </div>
            <p className="mt-0.5 text-lg text-zinc-500 dark:text-zinc-400">{character.title}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <VisionChip vision={character.vision} />
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <span aria-hidden="true">{WEAPON_GLYPH[character.weapon_type]}</span>
                {WEAPON_LABEL[character.weapon_type]}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Fact label="Nation" value={character.nation} />
              <Fact label="Affiliation" value={character.affiliation} />
              <Fact label="Gender" value={character.gender} />
              <Fact label="Constellation" value={character.constellation} />
              {birthday && <Fact label="Birthday" value={birthday} />}
              {released && <Fact label="Released" value={released} />}
              {character.specialDish && <Fact label="Special Dish" value={character.specialDish} />}
            </dl>
          </div>
        </div>

        {description.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <p className="text-sm leading-relaxed text-zinc-600 italic dark:text-zinc-400">
              {description.join(' ')}
            </p>
          </div>
        )}
      </header>

      <Section title="Skills" subtitle={`${character.skillTalents.length} talents`}>
        {character.skillTalents.map((skill, i) => (
          <SkillCard key={`${skill.name}-${i}`} skill={skill} index={i} />
        ))}
      </Section>

      <Section title="Passive Talents" subtitle={`${character.passiveTalents.length} talents`}>
        {character.passiveTalents.map((talent) => (
          <PassiveCard key={talent.name} talent={talent} />
        ))}
      </Section>

      <Section
        title="Constellations"
        subtitle={`${character.constellations.length} unlocks`}
        hint={`${character.constellation} is ${character.name}'s constellation.`}
      >
        {character.constellations.map((c) => (
          <ConstellationCard key={c.level} constellation={c} />
        ))}
      </Section>

      <Section title="Ascension Materials" subtitle="Cost per ascension cap">
        <AscensionTable materials={character.ascension_materials} />
      </Section>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-zinc-500 uppercase">{label}</dt>
      <dd className="font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  )
}

function Section({
  title,
  subtitle,
  hint,
  children,
}: {
  title: string
  subtitle?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        {subtitle && <span className="text-sm text-zinc-500">{subtitle}</span>}
      </div>
      {hint && <p className="text-sm text-zinc-500">{hint}</p>}
      {children}
    </section>
  )
}

function Description({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {splitDescription(text).map((line, i) => (
        <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {line}
        </p>
      ))}
    </div>
  )
}

function Panel({
  accent,
  title,
  subtitle,
  children,
}: {
  accent?: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60"
        style={accent ? { borderLeft: `3px solid ${accent}` } : undefined}
      >
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
      </div>
      <div className="p-4">{children}</div>
    </article>
  )
}

function SkillCard({ skill, index }: { skill: SkillTalent; index: number }) {
  return (
    <Panel title={skill.name} subtitle={skill.unlock}>
      <Description text={skill.description} />
      {skill.upgrades && skill.upgrades.length > 0 && (
        <details className="mt-3">
          <summary className="text-accent-600 dark:text-accent-400 cursor-pointer text-sm font-medium hover:underline">
            {skill.upgrades.length} upgrade levels
          </summary>
          <ul className="mt-2 space-y-1 text-sm">
            {skill.upgrades.map((up, i) => (
              <li key={`${up.name}-${i}`} className="flex justify-between gap-4">
                <span className="text-zinc-600 dark:text-zinc-400">{up.name}</span>
                <span className="shrink-0 font-mono text-zinc-900 dark:text-zinc-200">
                  {up.value}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      <span className="sr-only">Skill {index + 1}</span>
    </Panel>
  )
}

function PassiveCard({ talent }: { talent: PassiveTalent }) {
  return (
    <Panel title={talent.name} subtitle={talent.unlock}>
      <Description text={talent.description} />
    </Panel>
  )
}

function ConstellationCard({ constellation }: { constellation: Constellation }) {
  return (
    <Panel title={constellation.name} subtitle={constellation.unlock}>
      <Description text={constellation.description} />
    </Panel>
  )
}

function AscensionTable({ materials }: { materials: AscensionMaterials }) {
  const levels = ASCENSION_LEVELS.filter((l) => materials[l]?.length)
  if (levels.length === 0) return <p className="text-sm text-zinc-500">No data available.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-2xl text-left text-sm">
        <caption className="sr-only">Ascension material costs by target level</caption>
        <thead className="bg-zinc-50 text-xs tracking-wide text-zinc-500 uppercase dark:bg-zinc-900/60">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">
              Level
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Materials
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {levels.map((level) => (
            <tr key={level}>
              <th
                scope="row"
                className="px-4 py-3 font-mono whitespace-nowrap text-zinc-900 dark:text-zinc-100"
              >
                {level.replace('level_', '')}
              </th>
              <td className="px-4 py-3">
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {materials[level].map((m) => (
                    <li key={m.name} className="text-zinc-600 dark:text-zinc-400">
                      {m.name} <span className="font-mono font-semibold">×{m.value}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
