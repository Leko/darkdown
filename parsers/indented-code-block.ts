import { C_NEWLINE } from '../scanner.ts'
import { until, seq, map, atLeast, tap } from '../parser-combinator.ts'
import { lineEnding } from './line-ending.ts'
import { indent } from './indent.ts'
import { CodeBlock } from '../ast.ts'

// https://spec.commonmark.org/0.29/#indented-code-blocks
export const indentedCodeBlockParser = map(
  seq(
    tap(
      'code_block',
      map(atLeast(seq(indent, until(lineEnding), lineEnding), 1), (r) =>
        r.map((line) => line[1])
      )
    )
  ),
  (r, end, start): CodeBlock => ({
    type: 'code_block',
    text: r.flat().join(C_NEWLINE) + C_NEWLINE,
    start: start,
    length: end - start,
    language: null,
    info: null,
  })
)
