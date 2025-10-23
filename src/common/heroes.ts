import heroesJson from '@/assets/data/heroes.json' assert { type: 'json' }

export const HERO_ROLES = [
  'Bruiser', 'Healer', 'Melee Assassin', 'Ranged Assassin', 'Support', 'Tank'
] as const
export type HeroRole = typeof HERO_ROLES[number]

export const HERO_TYPES = [ 'Melee', 'Ranged' ]
export type HeroType = typeof HERO_TYPES[number]

export type Hero = {
  name: string
  short_name: string
  alt_name: string | null
  role: HeroRole
  type: HeroType
}

export type Heroes = Record<string, Hero>

const heroesData = heroesJson as Heroes
const unknownHero: Hero = {
  name: 'Unknown Hero',
  short_name: '_unknown',
  alt_name: null,
  role: 'Support',
  type: 'Melee'
}

export function getHeroData(shortName: string): Hero {
  let hero = heroesData[shortName]
  if (!hero) {
    console.warn(`Unknown hero: ${hero}`)
    return unknownHero
  }
  return hero
}

export function getHeroList() : string[] {
  return Object.keys(heroesData)
}

export const ALL_HEROES = getHeroList()
Object.freeze(ALL_HEROES)

export function sanitizeName(s: string): string {
  s = s.normalize('NFKD')
  s = s.replace(/[^A-Za-z0-9]+/g, '')
  return s.toLowerCase()
}

export function getHeroIconUrl(shortName: string): string {
  if (!Object.hasOwn(heroesData, shortName)) {
    shortName = unknownHero.short_name
  }
  return new URL(`../assets/img/heroes/${shortName}.webp`, import.meta.url).href
}

export function getRoleIconUrl(role: string): string {
  if (!HERO_ROLES.includes(role as HeroRole)) {
    return new URL(`../assets/img/heroes/_unknown}.webp`, import.meta.url).href
  }
  return new URL(`../assets/img/roles/${sanitizeName(role)}.webp`, import.meta.url).href
}

