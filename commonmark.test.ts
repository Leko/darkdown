import {
  assertEquals,
  assertNotEquals,
} from 'https://deno.land/std/testing/asserts.ts'
import { readFileStr } from 'https://deno.land/std/fs/read_file_str.ts'
import { transform } from './commonmark.ts'
import range from 'https://deno.land/x/lodash/range.js'

const suite = JSON.parse(
  await readFileStr('./fixtures/commonmark-0.29-spec.json')
)

type Spec = {
  markdown: string
  html: string
  example: number
  start_line: number
  end_line: number
  section: 'Tabs'
}

const SKIP_CASES = [
  // TODO: List with paragraph, empty lines with paragraph
  34,
  // TODO: When implement list
  9,
  // TODO: Continue condition of paragraph, intercept
  48, // heading
  110, // fenced code block
  // TODO: Continue condition of list
  30,
  31,
  // TODO: Inline lex
  36, // ATX heading
  50, // SeText heading
  // TODO: ATX heading with trailing sharp
  44,
  45,
  46,
  // TODO: SeText heading with multiple line header
  51,
  52,
  53,
  // TODO: Nested multiple type list (ol > ul)
  79,
  // TODO: Multiline inline code
  91,
  // TODO: BlockQuote > FencedCodeBlock
  98,
  // TODO: Edge cases of FencedCodeBlock
  107,
  108,
  115,
  117,
  // TODO: HTML block
  ...range(118, 161, 1),
]
const omit = (suite: Spec[], indexes: number[]) => {
  return suite.filter((spec) => !indexes.includes(spec.example))
}

const tests = omit(suite.slice(0, 172), SKIP_CASES)

// SKIP_CASES.map((index) => suite[index - 1]).forEach((spec: Spec) => {
//   const testName = JSON.stringify(spec.markdown)
//   Deno.test(`FAIL [${spec.example}] ${testName}`, async () => {
//     const { html } = await transform(spec.markdown, {})
//     assertNotEquals(html, spec.html)
//   })
// })

tests.forEach((spec: Spec) => {
  const testName = JSON.stringify(spec.markdown)
  Deno.test(`[${spec.example}] ${testName}`, async () => {
    const { html } = await transform(spec.markdown, {})
    assertEquals(html, spec.html)
  })
})
