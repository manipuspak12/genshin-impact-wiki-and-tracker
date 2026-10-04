/**
 * Types for the genshin.dev API (https://genshin.jmp.blue).
 *
 * Field naming is not what you'd guess — note `vision` (not element),
 * `nation` (not region) and `weapon_type` (not weaponType).
 */

export const VISIONS = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'] as const
export type Vision = (typeof VISIONS)[number]

export const WEAPON_TYPES = ['SWORD', 'BOW', 'CLAYMORE', 'POLEARM', 'CATALYST'] as const
export type WeaponType = (typeof WEAPON_TYPES)[number]

export interface Material {
  name: string
  value: number
}

/** Ascension costs are keyed by level: level_20, level_40, ... level_80. */
export type AscensionMaterials = Record<string, Material[]>

export interface TalentUpgrade {
  name: string
  value: string | number
}

export interface SkillTalent {
  name: string
  unlock: string
  description: string
  /** Only present on skill talents (the combat abilities). */
  type?: string
  upgrades?: TalentUpgrade[]
}

export interface PassiveTalent {
  name: string
  unlock: string
  description: string
  level: number
}

export interface Constellation {
  name: string
  unlock: string
  description: string
  level: number
}

export interface Character {
  id: string
  name: string
  title: string
  vision: Vision
  /** Uppercase machine key, e.g. "PYRO". Useful for icon filenames. */
  vision_key: string
  weapon: string
  weapon_type: WeaponType
  gender: string
  nation: string
  affiliation: string
  specialDish?: string
  rarity: number
  /** ISO date, e.g. "2024-04-24". */
  release: string
  constellation: string
  /** Raw form is zero-padded and zero-indexed, e.g. "0000-08-22". Use formatBirthday(). */
  birthday: string
  description: string
  skillTalents: SkillTalent[]
  passiveTalents: PassiveTalent[]
  constellations: Constellation[]
  ascension_materials: AscensionMaterials
}

export type EntityType =
  | 'artifacts'
  | 'boss'
  | 'characters'
  | 'consumables'
  | 'domains'
  | 'elements'
  | 'enemies'
  | 'materials'
  | 'nations'
  | 'weapons'
