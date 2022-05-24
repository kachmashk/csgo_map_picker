import Maps from '../data/Maps'
import Map from './Map'

export default class Match {
  bestOf: 1 | 3 | 5 = 1
  selectedMaps: Map[]
  mapPool: Map[]

  constructor(bo: 1 | 3 | 5) {
    const _maps: Map[] = Maps.map(
      (map: string, index: number) => new Map(index + 1, map)
    )

    this.bestOf = bo
    this.mapPool = _maps
    this.selectedMaps = []
  }

  reset(): void {
    const _maps: Map[] = Maps.map(
      (map: string, index: number) => new Map(index + 1, map)
    )

    this.bestOf = 1
    this.mapPool = _maps
    this.selectedMaps = []
  }

  isNextMapToBan(): boolean {
    if (this.bestOf === 1) {
      return true
    }

    if (this.bestOf === 3) {
      if (this.mapPool.length > 3) {
        return true
      } else {
        return false
      }
    }

    if (this.bestOf === 5) {
      if (this.mapPool.length > 5) {
        return true
      } else {
        return false
      }
    }
  }
}
