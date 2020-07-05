import { many, atLeast } from '../parser-combinator.ts'
import { whitespaceChar } from './whitespace-char.ts'

// https://spec.commonmark.org/0.29/#whitespace
export const whitespaces = atLeast(whitespaceChar, 1)
export const anyWhitespaces = many(whitespaceChar)
