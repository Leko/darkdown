import { ParseResult, ParseFailed } from './types.ts'

export const keyword = <T extends string>(token: T) => (
  input: string,
  pos: number
): ParseResult<T> | ParseFailed => {
  if (input.slice(pos, pos + token.length) === token) {
    return [true, token, pos + token.length]
  }
  return [false, null, pos]
}
