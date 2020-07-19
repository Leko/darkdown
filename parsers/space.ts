import { C_SPACE, C_TAB } from '../scanner.ts'
import { char } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#space
export const space = char([C_SPACE, C_TAB].join(''))
