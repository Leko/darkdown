import {
  C_SPACE,
  C_NEWLINE,
  C_CARRIAGE_RETURN,
  C_TAB,
  C_LINE_TABULATION,
  C_FORM_FEED,
} from '../scanner.ts'
import { char } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#whitespace-character
export const whitespaceChar = char(
  [
    C_SPACE,
    C_TAB,
    // C_NEWLINE,
    C_LINE_TABULATION,
    C_FORM_FEED,
    C_CARRIAGE_RETURN,
  ].join('')
)
