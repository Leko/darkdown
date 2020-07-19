import { Generator } from './generator.ts'
import { Document } from './ast.ts'
import { tap, many, or, seq, map, EOS } from './parser-combinator.ts'
import { leafBlockParser } from './parsers/leaf-block.ts'
import { containerBlockParser } from './parsers/container-block.ts'
import { blockQuoteParser } from './parsers/block-quote.ts'
import { listParser } from './parsers/list.ts'
import { codeBlockParser } from './parsers/code-block.ts'
import { emptyLineParser } from './parsers/empty-line.ts'
import { thematicBreakParser } from './parsers/thematic-break.ts'

type Option = {}
type StringifyOption = {}
type Result = {
  html: string
}

export const blockParser = or(
  blockQuoteParser,
  thematicBreakParser, // FIXME: Merge to leadBlockParser
  listParser,
  codeBlockParser,
  // headingParser,
  // thematicBreakParser
  // paragraphParser,
  leafBlockParser
)

export const documentParser = map(
  seq(
    many(tap('document > blockParser', blockParser)),
    tap('document > EOS', EOS())
  ),
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
  const convertToSpaces = (matchedEntire: string, matched: string) => {
    let start = matchedEntire.indexOf(matched)
    if (start === -1) {
      start = 0
    }
    const spaces = tabStop - (start % tabStop)
    return matchedEntire.replace(matched, ' '.repeat(spaces))
  }
  let tmp = str
  while (1) {
    const result = tmp.replace(/^[->]?\s*(\t)/gm, convertToSpaces)
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
    // console.log([markdown], doc, pos, markdown.length)
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
