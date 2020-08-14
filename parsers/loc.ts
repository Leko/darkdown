import { LoC } from '../ast.ts'

export const toLoC = ({ start, end }: { start: number; end: number }): LoC => ({
  start,
  length: end - start,
})

export const pickLoC = ({
  start,
  length,
}: {
  start: number
  length: number
}): LoC => ({
  start,
  length,
})
