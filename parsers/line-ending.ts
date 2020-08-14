import { C_NEWLINE, C_CARRIAGE_RETURN } from '../scanner.ts'
import { Str } from '../ast.ts'
import { map, char, seq, option } from '../parser-combinator.ts'
import { toLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#line-ending
export const lineEnding = map(
  seq(option(char(C_CARRIAGE_RETURN)), char(C_NEWLINE)),
  (r, end, start): Str => ({
    type: 'str',
    children: [
      {
        type: 'text',
        text: r[1],
        ...toLoC({ start, end }),
      },
    ],
    ...toLoC({ start, end }),
  })
)
