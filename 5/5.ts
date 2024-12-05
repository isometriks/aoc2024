import * as fs from 'fs';

interface Rule {
  before: number
  after: number
}

type Update = number[]

function parseInput() {
  const contents: string = fs.readFileSync('input.txt', 'utf-8')
  const [rulesStrings, updatesStrings] = contents.split(/\n\n/).map(block => block.trim().split(/\n/))

  const rules = rulesStrings.map<Rule>(ruleString => {
    const [before, after] = ruleString.split(/\|/).map(s => parseInt(s, 10))
    return { before, after }
  })

  const updates = updatesStrings.map<Update>(updateString => updateString.split(/,/).map(s => parseInt(s, 10)))

  return { rules, updates }
}

const { rules, updates } = parseInput()
const indexedRules: Map<number, number[]> = new Map()

rules.forEach(rule => {
  if (!indexedRules.has(rule.before)) {
    indexedRules.set(rule.before, [])
  }

  indexedRules.get(rule.before)!.push(rule.after)
})

const validAtIndex = (index: number, update: Update) => {
  const page = update[index]
  const partialUpdate = update.slice(index)

  for (let i=0; i<partialUpdate.length; i++) {
    const laterPage = partialUpdate[i]

    if (!indexedRules.has(laterPage)) {
      continue
    }

    if (indexedRules.get(laterPage)!.includes(page)) {
      return index + i
    }
  }

  return true
}

const fixUpdate = (startingPoint: number, update: Update) => {
  const correctUpdate = [...update]

  for (let i=startingPoint; i<update.length - 1; i++) {
    const wrongIndex = validAtIndex(i, correctUpdate)

    if (wrongIndex === true) {
      continue
    }

    ;[correctUpdate[i], correctUpdate[wrongIndex]] = [correctUpdate[wrongIndex], correctUpdate[i]]
    i--
  }

  incorrect.push(correctUpdate)
}

const correct: Update[] = []
const incorrect: Update[] = []

updates.forEach(update => {
  for (let i=0; i < update.length - 1; i++) {
    if (validAtIndex(i, update) !== true) {
      fixUpdate(i, update)

      return
    }
  }

  correct.push(update)
})

const [part1, part2] = [correct, incorrect].map(updates => updates.reduce((accumulator, current) => {
  return accumulator + current[Math.floor(current.length / 2)]
}, 0));

console.log("Part 1", part1)
console.log("Part 2", part2)
