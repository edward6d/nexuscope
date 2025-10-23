import patchesJson from '@/assets/data/patches.json' assert { type: 'json' }

export type Patches = Record<string, string[]>
export type Patchsets = Record<string, Set<string>>

const patchesData = patchesJson as Patches
const patchsets: Patchsets = Object.fromEntries(
  Object.entries(patchesData).map(([majorPatch, minorPatches]) => [majorPatch, new Set(minorPatches)])
)

export function getPatchsets(): Patchsets {
  return patchsets
}

export function getMajorPatches(): string[] {
  return Object.keys(patchesData)
}

export function getMinorPatches(majorPatch?: string | undefined): string[] {
  if (!majorPatch) {
    return Object.values(patchesData).flat()
  }
  return patchesData[majorPatch] ?? []
}

export function compareVersionStrings(a: string, b: string): number {
  const partsA = a.split('.').map(Number)
  const partsB = b.split('.').map(Number)
  const len = Math.max(partsA.length, partsB.length)

  for (let i = 0; i < len; i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}
