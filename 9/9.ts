import * as fs from 'fs';

function parseInput(): string[][] {
  const contents = fs.readFileSync('input.txt', 'utf-8').trim()
  const diskLayout = []

  for (let i=0; i<contents.length; i++) {
    const blocks = parseInt(contents[i], 10)
    const id = i % 2 == 0 ? String(i/2) : "."

    if (blocks > 0) {
      diskLayout.push(Array(blocks).fill(id))
    }
  }

  return diskLayout
}

function getChecksum(indices: string[]) {
  return indices.reduce((accumulator, current, i) => {
    return accumulator + (current === "." ? 0 : parseInt(current, 10) * i)
  }, 0)
}

function flattenDisk(parts: string[][]): string[] {
  return parts.reduce((accumulator, block) => {
    return [...accumulator, ...block]
  }, [])
}

// Use flat disk for part 1
const disk = flattenDisk(parseInput())

for (let fromEnd = disk.length - 1, fromBeginning = 0; fromEnd > 0; fromEnd--) {
  if (disk[fromEnd] === ".") {
    continue
  }

  for (;fromBeginning < fromEnd; fromBeginning++) {
    if (disk[fromBeginning] === ".") {
      ;[disk[fromBeginning], disk[fromEnd]] = [disk[fromEnd], disk[fromBeginning]]

      break
    }
  }
}

console.log("Part 1", getChecksum(disk))

// Part 2
const partedDisk = parseInput()

for (let fromEnd = 1; fromEnd <= partedDisk.length; fromEnd++) {
  const endIndex = partedDisk.length - fromEnd
  const currentBlock = partedDisk[endIndex]

  if (currentBlock[0] === ".") {
    continue
  }

  for (let fromBeginning = 0; fromBeginning < endIndex; fromBeginning++) {
    const currentSeek = partedDisk[fromBeginning]

    if (currentSeek[0] !== ".") {
      continue
    }

    if (currentSeek.length < currentBlock.length) {
      continue
    }

    if (currentSeek.length === currentBlock.length) {
      ;[partedDisk[fromBeginning], partedDisk[endIndex]] = [partedDisk[endIndex], partedDisk[fromBeginning]]

      break
    }

    const extraSpace = currentSeek.length - currentBlock.length

    // Remove block from original spot
    partedDisk.splice(endIndex, 1)
    partedDisk.splice(endIndex, 0, Array(currentBlock.length).fill("."))

    // Shorted the blank space
    partedDisk[fromBeginning].length = extraSpace

    // Move it to where the blank space is
    partedDisk.splice(fromBeginning, 0, currentBlock)

    break
  }
}

console.log("Part 2", getChecksum(flattenDisk(partedDisk)))
