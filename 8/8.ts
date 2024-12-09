import * as fs from 'fs';

interface Antenna {
  x: number
  y: number
  char: string
}

function parseInput(): [number, number, Map<string, Antenna[]>] {
  const antennas: Map<string, Antenna[]> = new Map();
  const contents = fs.readFileSync('input.txt', 'utf-8').trim().split(/\n/)
  const width = contents[0].length;
  const height = contents.length;

  for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
      const char = contents[y][x]

      if (char === '.') {
        continue
      }

      antennas.set(char, [...(antennas.get(char) ?? []), { x, y, char }])
    }
  }

  return [width, height, antennas]
}

const [width, height, antennas] = parseInput();
type Slope = { x: number, y: number }
type CheckFunction = (first: Antenna, second: Antenna, slope: Slope) => (readonly [number, number])[]

function withinBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < width && y < height
}

function checkAntinodes(antennas: Antenna[], checkFunction: CheckFunction) {
  const validNodes = []

  for (let a=0; a<antennas.length; a++) {
    const first = antennas[a];

    for (let b=a+1; b<antennas.length; b++) {
      const second = antennas[b];
      const slope = { x: second.x - first.x, y: second.y - first.y }

      validNodes.push(
        ...checkFunction(first, second, slope)
      )
    }
  }

  return validNodes
}

const uniqueNodes1 = new Map<string, boolean>()
const part1: CheckFunction = (first: Antenna, second: Antenna, slope: Slope) => {
  return [
    [first.x - slope.x, first.y - slope.y] as const,
    [second.x + slope.x, second.y + slope.y] as const,
  ].filter(node => withinBounds(...node))
}

const uniqueNodes2 = new Map<string, boolean>()
const part2: CheckFunction = (first: Antenna, second: Antenna, slope: Slope) => {
  const nodes: (readonly [number, number])[] = []
  const checkPoint = (x: number, y: number, i: number): [boolean, readonly [number, number]] => {
    const [newX, newY] = [x + (slope.x * i), y + (slope.y * i)]
    return [withinBounds(newX, newY), [newX, newY] as const]
  }

  for (let i=0;;i--) {
    const [within, node] = checkPoint(first.x, first.y, i)

    if (!within) {
      break
    }

    nodes.push(node)
  }

  for (let i=0;;i++) {
    const [within, node] = checkPoint(second.x, second.y, i)

    if (!within) {
      break
    }

    nodes.push(node)
  }

  return nodes
}

for (const [_, antennaGroup] of antennas.entries()) {
  checkAntinodes(antennaGroup, part1).forEach((node: readonly [number, number]) => {
    uniqueNodes1.set(node.join("-"), true)
  })

  checkAntinodes(antennaGroup, part2).forEach((node: readonly [number, number]) => {
    uniqueNodes2.set(node.join("-"), true)
  })
}

console.log("Part 1", uniqueNodes1.size)
console.log("Part 2", uniqueNodes2.size)
