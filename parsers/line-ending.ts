import { Str } from '../ast.ts'
import { char, map, option, Parser, seq } from '../parser-combinator.ts'
import { C_CARRIAGE_RETURN, C_NEWLINE } from '../scanner.ts'
import { toLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#line-ending
export const lineEnding: Parser<Str> = map(
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
