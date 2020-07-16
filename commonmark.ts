import { Generator } from './generator.ts'
import { Document, List, BlockQuote } from './ast.ts'
import {
  keyword,
  many,
  or,
  seq,
  option,
  map,
  atLeast,
  EOS,
  tap,
  lazy,
  char,
} from './parser-combinator.ts'
import { TODO } from './parsers/todo.ts'
import { listItemParser } from './parsers/list-item.ts'
import { atxHeadingParser } from './parsers/atx-heading.ts'
import { setextHeadingParser } from './parsers/setext-heading.ts'
import { codeBlockParser } from './parsers/code-block.ts'
import { thematicBreakParser } from './parsers/thematic-break.ts'
import { SOL } from './parsers/sol.ts'
import { anyWhitespaces } from './parsers/whitespaces.ts'
import { lineEnding } from './parsers/line-ending.ts'
import { paragraphParser } from './parsers/paragraph.ts'
import { C_SPACE } from './scanner.ts'

type Option = {}
type StringifyOption = {}
type Result = {
  html: string
}

const blockQuoteParser = lazy(() =>
  map(
    tap(
      'block_quote',
      atLeast(seq(keyword('>'), char(C_SPACE), blockParser), 1)
    ),
    (r, end, start): BlockQuote => ({
      type: 'block_quote',
      children: r.map(([_mark, _space, content]) => content),
      start,
      length: end - start,
    })
  )
)

const listParser = map(
  tap('list', atLeast(listItemParser, 1)),
  (r, end, start): List => ({
    type: 'list',
    listType: r[0].marker.type,
    children: r,
    start,
    length: end - start,
  })
)

const htmlBlockParser = TODO('htmlBlock')

const headingParser = or(atxHeadingParser, setextHeadingParser)

const emptyLine = map(
  seq(SOL(), anyWhitespaces, lineEnding),
  (_, end, start) => ({
    type: 'empty_line',
    start,
    length: end - start,
  })
)

export const blockParser = or(
  blockQuoteParser,
  // listItemParser,
  listParser,
  codeBlockParser,
  // headingParser,
  // thematicBreakParser
  // paragraphParser,
  emptyLine
)

export const documentParser = map(
  seq(many(blockParser), EOS()),
  ([children]) => ({
    type: 'document',
    children,
  })
)

// console.log('Hi!')
// // console.log('thematic Break(*)', thematicBreakParser('***', 0))
// // console.log('thematic Break(-)', thematicBreakParser('---', 0))
// // console.log('thematic Break(_)', thematicBreakParser('___', 0))
// // console.log('Heading(1)', headingParser('# hoge', 0))
// // console.log('Heading(2)', headingParser('## hoge', 0))
// // console.log('Heading(6)', headingParser('###### hoge', 0))
// // console.log('Not heading(7)', headingParser('####### hoge', 0))
// console.log(
//   'link reference',
//   linkDefinitionParser(
//     `[foo]: /url "title"

// [foo]`,
//     0
//   )
// )
// console.log('list_marker', listMarker('    * ', 0))
// console.log('list_marker', listMarker('    - ', 0))
// console.log('list_marker', listMarker('    1.', 0))
// console.log('list_marker', listMarker('    2.', 0))
// console.log(documentParser('  - foo\n\n', 0))

// console.log('Done!')
// Deno.exit(0)

function tabToSpaces(str: string, tabStop: number): string {
  let tmp = str
  while (1) {
    const result = tmp.replace(/^>\s*(\t)/gm, (matchedEntire, matched) => {
      let start = matchedEntire.indexOf(matched)
      if (start === -1) {
        start = 0
      }
      const spaces = tabStop - (start % tabStop)
      return matchedEntire.replace(matched, ' '.repeat(spaces))
    })
    if (tmp === result) {
      break
    }
    tmp = result
  }
  return tmp
}

export async function transform(
  markdown: string,
  options: Option & StringifyOption
): Promise<Result> {
  console.log(
    [markdown, tabToSpaces(markdown, 4)].map((c) => JSON.stringify(c))
  )
  return parse(tabToSpaces(markdown, 4), options).then((ast) =>
    stringify(ast, options)
  )
}

export async function parse(
  markdown: string,
  options: Option
): Promise<Document> {
  const [parsed, doc, pos] = documentParser(markdown, 0) as any
  if (pos !== markdown.length) {
    console.log([markdown], doc, pos, markdown.length)
    throw new Error(`Unexpected token: "${markdown.slice(pos, pos + 1)}"`)
  }
  return doc
}

export async function stringify(
  doc: Document,
  options: StringifyOption
): Promise<Result> {
  const generator = new Generator()
  console.log(JSON.stringify(doc, null, 2))
  let html = generator.generate(doc)
  return {
    html,
  }
}
