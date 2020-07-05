import { Parser, ParseResult, ParseFailed } from './types.ts'

export const many = <T>(parser: Parser<T>) => (
  input: string,
  pos: number
): ParseResult<T[]> | ParseFailed => {
  const results: T[] = []
  let newPos = pos
  while (newPos <= input.length) {
    const result = parser(input, newPos)
    if (!result[0]) {
      break
    }
    results.push(result[1])
    newPos = result[2]
  }
  return [true, results, newPos]
}
