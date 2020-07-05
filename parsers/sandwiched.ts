import { Parser, keyword, until, seq } from '../parser-combinator.ts'
import { notEscaped } from './not-escaped.ts'

export const sandwiched = (
  startChar: string,
  endChar: string,
  option?: { escapeSeq?: string }
): Parser<[string, string, string]> =>
  seq(
    keyword(startChar),
    until(notEscaped(keyword(endChar), option)),
    keyword(endChar)
  ) as Parser<[string, string, string]>
