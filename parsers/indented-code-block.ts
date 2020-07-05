import { C_NEWLINE } from '../scanner.ts'
import { until, seq, map, atLeast } from '../parser-combinator.ts'
import { lineEnding } from './line-ending.ts'
import { indent } from './indent.ts'

// https://spec.commonmark.org/0.29/#indented-code-blocks
export const indentedCodeBlockParser = map(
  seq(
    map(atLeast(seq(indent, until(lineEnding), lineEnding), 1), (r) =>
      r.map((line) => line[1])
    )
  ),
  (r, end, start) => ({
    type: 'code_block',
    text: r.flat().join(C_NEWLINE),
    start: start,
    length: end - start,
  })
)
