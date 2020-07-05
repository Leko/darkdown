import { not } from '../parser-combinator.ts'
import { whitespaceChar } from './whitespace-char.ts'

// https://spec.commonmark.org/0.29/#non-whitespace-character
export const nonWhitespaceChar = not(whitespaceChar)
