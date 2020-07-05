import { atLeast } from '../parser-combinator.ts'
import { unicodeWhitespaceChar } from './unicode-whitespace-char.ts'

// https://spec.commonmark.org/0.29/#unicode-whitespace
export const unicodeWhitespace = atLeast(unicodeWhitespaceChar, 1)
