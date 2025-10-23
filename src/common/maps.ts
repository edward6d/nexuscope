import mapJson from '@/assets/data/maps.json'

type MapType = 'standard' | 'brawl' | 'ARAM'

type GameMap = {
  map_id: number
  name: string
  short_name: string
  type: MapType
  sanitized_map_name: string
}

type GameMaps = Record<string, GameMap>

const mapData = mapJson as GameMaps
const unknownMap: GameMap = {
  map_id: -1,
  name: 'Unknown Map',
  short_name: '_unknown',
  type: 'standard',
  sanitized_map_name: 'unknown_map'
}

export function getMapData(sanitizedName: string): GameMap {
  let gameMap = mapData[sanitizedName]
  if (!gameMap) {
    console.warn(`Unknown map: ${gameMap}`)
    return unknownMap
  }
  return gameMap
}

export function getMapList(mapType?: MapType | undefined): string[] {
  if (!mapType) {
    return Object.keys(mapData)
  }
  return Object.entries(mapData)
    .filter(([_, map]) => map.type === mapType)
    .map(([key]) => key)
}

export const ALL_STANDARD_MAPS = getMapList('standard')
Object.freeze(ALL_STANDARD_MAPS)

export function getMapIconUrl(sanitizedName: string): string {
  if (!Object.hasOwn(mapData, sanitizedName)) {
    sanitizedName = unknownMap.sanitized_map_name
  }
  return new URL(`../assets/img/maps/${sanitizedName}.webp`, import.meta.url).href
}

export type { MapType, GameMap, GameMaps }

export const TEST_ARR = []
