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
