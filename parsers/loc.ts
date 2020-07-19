import { LoC } from '../ast.ts'

export const toLoC = ({ start, end }: { start: number; end: number }): LoC => ({
  start,
  length: end - start,
})
