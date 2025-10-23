import assert from 'assert'
import Papa from 'papaparse'
import rawCsvData from '@/assets/data/hero_map_winrates.csv?raw'

// CSV format:
// hero, minor_patch, wins_total, games_total, [wins_{map_short_name}, games_{map_short_name}]+

const parsedCsvData = Papa.parse<string[]>(rawCsvData, {
    header: false
  })
const [csvHeader, ...csvRows] = parsedCsvData.data


export const hmwColumnNames: Record<number, string> = {}
export const hmwColumnNumbers: Record<string, number> = {}

// first two columns are hero and minor_patch
csvHeader?.forEach((columnName, i) => {
  hmwColumnNames[i-2] = columnName
  hmwColumnNumbers[columnName] = i-2
})

export type HeroMapWinrate = {
  hero: string,
  minor_patch: string,
  data: number[]
}

const heroMapWinrates: HeroMapWinrate[] = csvRows.map((r) => {
  const hero = r[0] ?? '_unknown'
  const minor_patch = r[1] ?? '0.0'
  const data = r.slice(2).map(v => (v === '' ? 0 : Number(v)))
  return {hero, minor_patch, data} as HeroMapWinrate
})

export function getHeroMapWinrates(hero: string, patches: Set<string>): HeroMapWinrate {
  const filtered = heroMapWinrates.filter((hmw) => hmw.hero===hero && patches.has(hmw.minor_patch))
  if (filtered.length === 0) {
    return {hero, minor_patch:'aggregate', data: []}
  }
  const sums = new Array<number>(filtered[0]?.data.length ?? 0).fill(0)
  for (const { data } of filtered) {
    for (let i=0; i<data.length; i++) {
      sums[i]! += data[i]! // forcing typescript with ! to stop screaming about undefined
    }
  }
  return { hero, minor_patch:'aggregate', data: sums }
}
