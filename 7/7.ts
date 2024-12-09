import * as fs from 'fs';

interface Calibration {
  result: number
  numbers: number[]
}

function parseInput(): Calibration[] {
  const contents: string = fs.readFileSync('input.txt', 'utf-8').trim()
  return contents.split(/\n/).map(line => {
    const [resultString, numbersString] = line.split(/:\s+/)

    return {
      result: parseInt(resultString, 10),
      numbers: numbersString.split(/\s+/).map(n => parseInt(n, 10))
    }
  });
}

const calibrations = parseInput()
const add = (a: number, b: number) => a + b
const multiply = (a: number, b: number) => a * b
const concat = (a: number, b: number) => parseInt(String(a) + String(b), 10)
const combos = [add, multiply]

function tryCombos(result: number, numbers: number[], current: number): boolean {
  if (numbers.length === 1) {
    return combos.some(fn => fn(current, numbers[0]) === result)
  }

  return combos.some(fn => {
    return tryCombos(result, numbers.slice(1), fn(current, numbers[0]))
  })
}

const sum = () => {
  return calibrations.reduce((accumulator, calibration) => {
    const valid = tryCombos(
      calibration.result,
      calibration.numbers.slice(1),
      calibration.numbers[0],
    )

    return accumulator + (valid ? calibration.result : 0)
  }, 0)
}

console.log("Part 1:", sum())
combos.push(concat)
console.log("Part 2:", sum())
