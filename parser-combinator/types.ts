export type Parser<T> = (
  input: string,
  pos: number
) => ParseResult<T> | ParseFailed

export type ParseResult<T> = [true, T, number]
export type ParseFailed = [false, null, number]
