import {
  Scanner,
  C_SPACE,
  C_DOUBLE_QUOTE,
  C_SINGLE_QUOTE,
  C_OPEN_PARENTHES,
  C_CLOSE_PARENTHES,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
} from './scanner.ts'
import { Tokenizer } from './tokenizer.ts'
import { Generator } from './generator.ts'
import { Document } from './ast.ts'
import {
  keyword,
  many,
  or,
  seq,
  option,
  map,
  atLeast,
  EOS,
} from './parser-combinator.ts'
import { TODO } from './parsers/todo.ts'
import { linkDefinitionParser } from './parsers/link-definition.ts'
import { listItemParser } from './parsers/list-item.ts'
import { fencedCodeBlockParser } from './parsers/fenced-code-block.ts'
import { indentedCodeBlockParser } from './parsers/indented-code-block.ts'
import { atxHeadingParser } from './parsers/atx-heading.ts'
import { setextHeadingParser } from './parsers/setext-heading.ts'
import { strParser } from './parsers/str.ts'

type Option = {}
type StringifyOption = {}
type Result = {
  html: string
}

const linkParser = seq(
  keyword(C_OPEN_BRACKET),
  strParser,
  keyword(C_CLOSE_BRACKET),
  or(
    seq(
      keyword(C_OPEN_PARENTHES),
      strParser, // FIXME
      keyword(C_CLOSE_PARENTHES)
    ),
    option(
      seq(
        atLeast(keyword(C_SPACE), 1),
        or(
          seq(keyword(C_DOUBLE_QUOTE), strParser, keyword(C_DOUBLE_QUOTE)),
          seq(keyword(C_SINGLE_QUOTE), strParser, keyword(C_SINGLE_QUOTE)),
          seq(keyword(C_OPEN_PARENTHES), strParser, keyword(C_CLOSE_PARENTHES))
        )
      )
    )
  )
)

const imageParser = seq(keyword('!'), linkParser)

const paragraphParser = atLeast(
  or(strParser, linkDefinitionParser, linkParser, imageParser),
  1
)

const blockQuoteParser = atLeast(seq(keyword('>'), paragraphParser), 1)

const listParser = map(many(listItemParser), (r, end, start) => ({
  type: 'list',
  items: r,
  start,
  length: end - start,
}))

const codeBlockParser = or(fencedCodeBlockParser, indentedCodeBlockParser)

const htmlBlockParser = TODO('htmlBlock')

const headingParser = or(atxHeadingParser, setextHeadingParser)

export const documentParser = seq(
  many(
    or(
      // paragraphParser,
      // blockQuoteParser,
      listItemParser,
      // listParser,
      codeBlockParser
      // htmlBlockParser,
      // headingParser,
      // thematicBreakParser
    )
  ),
  EOS()
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
// console.log('list_marker', listMarker('    9999999999)', 0))

// console.log('Done!')
// Deno.exit(0)

export async function transform(
  markdown: string,
  options: Option & StringifyOption
): Promise<Result> {
  return parse(markdown, options).then((ast) => stringify(ast, options))
}

export async function parse(
  markdown: string,
  options: Option
): Promise<Document> {
  const result = documentParser(markdown, 0)
  console.log(result)
  return {} as any

  const scanner = new Scanner()
  const tokenizer = new Tokenizer()
  // const parser = new Parser()

  // return parser.parse(tokenizer.tokenize(scanner.scan(markdown)))
}

export async function stringify(
  doc: Document,
  options: StringifyOption
): Promise<Result> {
  const generator = new Generator()
  let html = generator.generate(doc)
  return {
    html,
  }
}
