import { seq } from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'

// https://spec.commonmark.org/0.29/#blank-line
export const blankLine = seq(SOL(), lineEnding)
