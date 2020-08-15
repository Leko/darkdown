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

// https://qiita.com/uhyo/items/80ce7c00f413c1d1be56
export type AtLeast<N extends number, T> = AtLeastRec<N, T, T[], []>

type Append<Item, T extends unknown[]> = ((
  arg: Item,
  ...rest: T
) => void) extends (...args: infer T2) => void
  ? T2
  : never
type AtLeastRec<N, Item, T extends unknown[], C extends unknown[]> = {
  0: T
  1: AtLeastRec<N, Item, Append<Item, T>, Append<unknown, C>>
}[C extends { length: N } ? 0 : 1]
