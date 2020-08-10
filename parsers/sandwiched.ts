import { Parser, keyword, until, seq, or, tap } from '../parser-combinator.ts'
import { notEscaped } from './not-escaped.ts'

export const sandwiched = <T>(
  startChar: string,
  endChar: string,
  option?: { intercept?: Parser<T>; escapeSeq?: string }
): Parser<[string, string, string]> =>
  seq(
    tap(`sandwiched>START(${startChar})`, keyword(startChar)),
    tap(
      `sandwiched>CONTENT`,
      until(
        option?.intercept
          ? or(option?.intercept, notEscaped(keyword(endChar), option))
          : notEscaped(keyword(endChar), option)
      )
    ),
    tap(`sandwiched>END(${endChar})`, keyword(endChar))
  ) as Parser<[string, string, string]>
