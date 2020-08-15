import { Parser, Parser, , Context } from './types.ts'

export const seq = (...parsers: Parser<any>[]) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): Parser<any[]> => {
  const results = []
  let newPos = pos
  for (let parser of parsers) {
    const result = parser(input, newPos, ctx)
    if (!result[0]) {
      return [false, null, pos]
    }
    newPos = result[2]
    results.push(result[1])
  }
  return [true, results, newPos]
}
