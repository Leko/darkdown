import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { readFileStr } from 'https://deno.land/std/fs/mod.ts'
import { transform, documentParser } from './commonmark.ts'

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

const EDGE_CASES = [4, 5]
const omit = (suite: Spec[], indexes: number[]) => {
  return suite.filter((spec) => !indexes.includes(spec.example))
}

const tests = omit(
  [
    ...suite.slice(0, 7),
    // Simple ordered list
    // ...suite.slice(234, 239),
    // Simple bullet list
    // ...suite.slice(250, 254),
  ],
  EDGE_CASES
)
tests.forEach((spec: Spec) => {
  const testName = spec.markdown.replace(/\t/g, '\\t').replace(/\n/g, '\\n')
  Deno.test(`[${spec.example}] "${testName}"`, async () => {
    const result = documentParser(spec.markdown, 0)
    console.log(spec.markdown, JSON.stringify(result, null, 2))
    const { html } = await transform(spec.markdown, {})
    assertEquals(html, spec.html)
  })
})
// suite.slice(0, 4).forEach((spec: Spec) => {
//   const testName = spec.markdown.replace(/\t/g, '\\t').replace(/\n/g, '\\n')
//   Deno.test(`[${spec.example}] "${testName}"`, async () => {
//     const { html } = await transform(spec.markdown, {})
//     assertEquals(html, spec.html)
//   })
// })
