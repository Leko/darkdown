import { Context, Parser } from './types.ts'

// @ts-expect-error Property '0' is missing in type 'any[]' but required in type '[any]'
export const seq: VariadicSeq = (...parsers: Parser<any>[]): Parser<any[]> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const results: any[] = []
  let newPos = pos
  for (let parser of parsers) {
    const result = parser(input, newPos, ctx)
    if (!result[0]) {
      return [false, null, pos]
    }
    newPos = result[2]
    results.push(result[1])
  }
  return [true, results, newPos]
}

export interface VariadicSeq {
  <A>(p1: Parser<A>): Parser<[A]>
  <A, B>(p1: Parser<A>, p2: Parser<B>): Parser<[A, B]>
  <A, B, C>(p1: Parser<A>, p2: Parser<B>, p3: Parser<C>): Parser<[A, B, C]>
  <A, B, C, D>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<D>
  ): Parser<[A, B, C, D]>
  <A, B, C, D, E>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>
  ): Parser<[A, B, C, D, E]>
  <A, B, C, D, E, F>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>,
    p6: Parser<F>
  ): Parser<[A, B, C, D, E, F]>
  <A, B, C, D, E, F, G>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>,
    p6: Parser<F>,
    p7: Parser<G>
  ): Parser<[A, B, C, D, E, F, F]>
  <A, B, C, D, E, F, G, H>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>,
    p6: Parser<F>,
    p7: Parser<G>,
    p8: Parser<H>
  ): Parser<[A, B, C, D, E, F, F, H]>
  <A, B, C, D, E, F, G, H, I>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>,
    p6: Parser<F>,
    p7: Parser<G>,
    p8: Parser<H>,
    p9: Parser<I>
  ): Parser<[A, B, C, D, E, F, F, H, I]>
  <A, B, C, D, E, F, G, H, I, J>(
    p1: Parser<A>,
    p2: Parser<B>,
    p3: Parser<C>,
    p4: Parser<E>,
    p5: Parser<D>,
    p6: Parser<F>,
    p7: Parser<G>,
    p8: Parser<H>,
    p9: Parser<I>,
    p10: Parser<J>
  ): Parser<[A, B, C, D, E, F, F, H, I, J]>
  (...parsers: Parser<any>[]): Parser<any[]>
}
