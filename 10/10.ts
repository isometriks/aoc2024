import * as fs from 'fs';

type Map = number[][]
type Position = [number, number]

function parseInput(): number[][] {
  const contents = fs.readFileSync('input.txt', 'utf-8').trim().split(/\n/)

  return contents.map(line => line.split("").map(char => parseInt(char, 10)))
}

class TrailHelper {
  #map: Map

  constructor(map: Map) {
    this.#map = map
  }

  get width(): number {
    return this.#map[0].length
  }

  get height(): number {
    return this.#map.length
  }

  heightAt(x: number, y: number): number | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null
    }

    return this.#map[y][x]
  }

  findStarts(): Position[] {
    const starts: Position[] = []

    for (let x=0; x<this.width; x++) {
      for (let y=0; y<this.height; y++) {
        if (this.heightAt(x, y) === 0) {
          starts.push([x, y])
        }
      }
    }

    return starts
  }
}

const map = new TrailHelper(parseInput())
const pairs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

function checkPath(position: Position, nextHeight: number = 1): Position[] {
  let positions: Position[] = []

  for (const pair of pairs) {
    const nextPosition: Position = [position[0] + pair[0], position[1] + pair[1]]
    const newHeight = map.heightAt(...nextPosition)

    if (newHeight !== nextHeight) {
      continue
    }

    if (nextHeight === 9) {
      positions.push(nextPosition)
    } else {
      positions.push(...checkPath(nextPosition, nextHeight + 1))
    }
  }

  return positions
}

let totalEndPoints = 0
let allPaths = 0
for (const start of map.findStarts()) {
  const uniqueEnds = new Map<string, boolean>()
  const paths = checkPath(start)

  paths.forEach(endPosition => {
    return uniqueEnds.set(endPosition.join("-"), true)
  })

  allPaths += paths.length
  totalEndPoints += uniqueEnds.size
}

console.log("Part 1", totalEndPoints)
console.log("Part 2", allPaths)
