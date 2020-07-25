import { Parser, keyword, until, seq, or } from '../parser-combinator.ts'
import { notEscaped } from './not-escaped.ts'

export const sandwiched = <T>(
  startChar: string,
  endChar: string,
  option?: { intercept?: Parser<T>; escapeSeq?: string }
): Parser<[string, string, string]> =>
  seq(
    keyword(startChar),
    until(
      option?.intercept
        ? or(option?.intercept, notEscaped(keyword(endChar), option))
        : notEscaped(keyword(endChar), option)
    ),
    keyword(endChar)
  ) as Parser<[string, string, string]>
