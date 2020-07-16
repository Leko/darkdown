import { C_SPACE, C_NEWLINE, C_ASTERISK, C_GRAVE_ACCENT } from '../scanner.ts'
import {
  keyword,
  until,
  map,
  or,
  seq,
  lazy,
  atLeast,
  tap,
  not,
} from '../parser-combinator.ts'
import { TODO } from './todo.ts'
import { lineEnding } from './line-ending.ts'
import { Str, Text } from '../ast.ts'

const textParser = map(
  tap('text', atLeast(not(lineEnding), 1)),
  (r, end, start): Text => ({
    type: 'text',
    text: r.join(''),
    start,
    length: end - start,
  })
)

const softbreakParser = keyword(C_SPACE)

const linebreakParser = keyword(C_NEWLINE)

const emphParser = seq(
  keyword(C_ASTERISK),
  lazy(() => strParser),
  keyword(C_ASTERISK)
)

const strongParser = seq(
  keyword(C_ASTERISK + C_ASTERISK),
  lazy(() => strParser),
  keyword(C_ASTERISK + C_ASTERISK)
)

const codeParser = seq(
  keyword(C_GRAVE_ACCENT),
  until(keyword(C_GRAVE_ACCENT)),
  keyword(C_GRAVE_ACCENT)
)
// const htmlInlineParser = TODO('HTML inline')

export const strParser = map(
  or(
    textParser
    // softbreakParser,
    // linebreakParser,
    // emphParser,
    // strongParser,
    // codeParser
    // htmlInlineParser
  ),
  (r, end, start): Str => ({
    // @ts-ignore
    _: console.log('str', r),
    type: 'str',
    children: [r as any],
    start,
    length: end - start,
  })
)
