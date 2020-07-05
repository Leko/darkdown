import {
  C_NEWLINE,
  C_CARRIAGE_RETURN,
  C_TAB,
  C_FORM_FEED,
  C_NBSP,
  C_OGHAM_SPACE_MARK,
  C_EN_QUAD,
  C_EM_QUAD,
  C_EN_SPACE,
  C_EM_SPACE,
  C_THREE_PER_EM_SPACE,
  C_FOUR_PER_EM_SPACE,
  C_SIX_PER_EM_SPACE,
  C_FIGURE_SPACE,
  C_PUNCTUATION_SPACE,
  C_THIN_SPACE,
  C_HAIR_SPACE,
  C_NNBSP,
  C_MMSP,
  C_IDEOGRAPHIC_SPACE,
} from '../scanner.ts'
import { char } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#whitespace-character
export const unicodeWhitespaceChar = char(
  [
    C_NBSP,
    C_OGHAM_SPACE_MARK,
    C_EN_QUAD,
    C_EM_QUAD,
    C_EN_SPACE,
    C_EM_SPACE,
    C_THREE_PER_EM_SPACE,
    C_FOUR_PER_EM_SPACE,
    C_SIX_PER_EM_SPACE,
    C_FIGURE_SPACE,
    C_PUNCTUATION_SPACE,
    C_THIN_SPACE,
    C_HAIR_SPACE,
    C_NNBSP,
    C_MMSP,
    C_IDEOGRAPHIC_SPACE,
    C_TAB,
    C_CARRIAGE_RETURN,
    C_NEWLINE,
    C_FORM_FEED,
  ].join('')
)
