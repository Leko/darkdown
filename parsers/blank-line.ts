import { seq } from '../parser-combinator/seq.ts'
import { map } from '../parser-combinator/map.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { C_NEWLINE } from '../scanner.ts'

// https://spec.commonmark.org/0.29/#blank-line
export const blankLine = map(seq(SOL(), lineEnding), () => C_NEWLINE)
