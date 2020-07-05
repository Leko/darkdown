import { C_SPACE, C_NEWLINE, C_ASTERISK, C_GRAVE_ACCENT } from '../scanner.ts'
import { keyword, until, or, seq, lazy } from '../parser-combinator.ts'
import { TODO } from './todo.ts'

const textParser = TODO('text')
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
const htmlInlineParser = TODO('HTML inline')

export const strParser = or(
  textParser,
  softbreakParser,
  linebreakParser,
  emphParser,
  strongParser,
  codeParser,
  htmlInlineParser
)
