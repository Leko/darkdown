import { Parser } from './parser.ts'

export const keyword = <T extends string>(token: T): Parser<T> => (
  input: string,
  pos: number
) => {
  if (input.slice(pos, pos + token.length) === token) {
    return [true, token, pos + token.length]
  }
  return [false, null, pos]
}
