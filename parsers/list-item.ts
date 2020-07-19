// import { ListItem } from '../ast.ts'
// import { C_SPACE, C_NEWLINE } from '../scanner.ts'
// import {
//   atLeast,
//   char,
//   many,
//   seq,
//   map,
//   tap,
//   lazy,
//   or,
// } from '../parser-combinator.ts'
// import { SOL } from './sol.ts'
// import { lineEnding } from './line-ending.ts'
// import { listMarker } from './list-marker.ts'
// // FIXME: Circular dependency
// // import { containerBlockParser } from './container-block.ts'
// import { blockQuoteParser } from './block-quote.ts'
// import { leafBlockParser } from './leaf-block.ts'

// type TODO<Comment extends string> = any

// // https://spec.commonmark.org/0.29/#list-items
// export const listItemParser = lazy(() =>
//   map(
//     tap(
//       'list_item',
//       seq(
//         tap('list_item > SOL', SOL()),
//         tap('list_item > spaces', many(char(C_SPACE))),
//         tap('list_item > marker', listMarker),
//         tap('list_item > space', char(C_SPACE)),
//         tap(
//           'list_item > nested',
//           many(or(leafBlockParser, char(C_SPACE), lineEnding))
//         )
//       )
//     ),
//     (r, end, start): ListItem => ({
//       // @ts-ignore
//       _: console.log(
//         'list_item:',
//         r,
//         'JSON:',
//         JSON.stringify(r.slice(4)[0], null, 2)
//       ),
//       type: 'list_item',
//       indent: r[1].length,
//       marker: r[2],
//       children: r
//         .slice(4)[0]
//         .filter(
//           (el: TODO<'Strongly typed'>) =>
//             !(Array.isArray(el) && el[0] === null && el[1] === C_NEWLINE)
//         ),
// ...toLoC({ end, start }),
//     })
//   )
// )
