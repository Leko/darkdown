import { C_SPACE } from '../scanner.ts'
import { keyword } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#space
export const space = keyword(C_SPACE)
