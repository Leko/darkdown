export type Context = {
  debug: boolean
}

export type Parser<T> = (
  input: string,
  pos: number,
  context: Readonly<Context>
) => ParseResult<T> | ParseFailed

export type ParseResult<T> = [true, T, number]
export type ParseFailed = [false, null, number]

export function isParseResult<T>(
  arg: ParseResult<T> | ParseFailed
): arg is ParseResult<T> {
  return arg[0]
}

export function isParseFailed(
  arg: ParseResult<any> | ParseFailed
): arg is ParseFailed {
  return !arg[0]
}
