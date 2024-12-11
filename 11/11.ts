import * as fs from 'fs';

function parseInput(): number[] {
  return fs.
    readFileSync('input.txt', 'utf-8').
    trim().
    split(/\s+/).
    map(char => parseInt(char, 10))
}

function blink(stones: number[]) {
  for (let i=0; i<stones.length; i++) {
    const stone = stones[i]

    if (stone === 0) {
      stones[i] = stone + 1
    } else if (String(stone).length & 1) {
      stones[i] = stone * 2024
    } else {
      const s = String(stone)
      const h = s.length / 2
      const [left, right] = [s.substring(0, h), s.substring(h)].map(s => parseInt(s, 10))

      stones.splice(i, 1, left, right)
      i++
    }
  }
}

const part1 = parseInput()

for (let i=0; i<25; i++) {
  blink(part1)
}

console.log("Part 1", part1.length)

const part2 = parseInput()
const cacheSize = 5
const cache = new Map<number, number[]>()

function runWithCache(stone: number): number[] {
  if (cache.has(stone)) {
    return cache.get(stone)!
  }

  const stoneArray = [stone]

  for (let i=0; i<cacheSize; i++) {
    blink(stoneArray)
  }

  cache.set(stone, stoneArray)
  return stoneArray
}

type Cache = Map<number, number>
const sumCache: Cache[] = []
for (let c = 0; c < 75; c+=cacheSize) {
  sumCache[c] = new Map<number, number>()
}

// Iterate each number
function recursiveBlink(stones: number[], blinks: number = 0) {
  if (blinks === 75) {
    return stones.length
  }

  let sum = 0
  for (let i=0; i<stones.length; i++) {
    if (sumCache[blinks].has(stones[i])) {
      sum += sumCache[blinks].get(stones[i])!
      continue
    }

    let result = recursiveBlink(
      runWithCache(stones[i]),
      blinks + cacheSize,
    )

    sumCache[blinks].set(stones[i], result)

    sum += result
  }

  return sum
}


let finalSum = 0
for (let i=0; i < part2.length; i++) {
  console.log("Starting Initial Stone", i)
  finalSum += recursiveBlink([part2[i]])
}

console.time("part2");
console.log("Part 2", finalSum)
console.timeEnd("part2");
