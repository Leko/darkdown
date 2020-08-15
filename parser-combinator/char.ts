import { Parser } from './types.ts'

export const char = <T extends string>(chars: T): Parser<T> => (
  input: string,
  pos: number
) => {
  const c = input.slice(pos, pos + 1)
  if (c.length === 0 || chars.indexOf(c) === -1) {
    return [false, null, pos]
  }
  return [true, c as T, pos + 1]
}
