import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { transform, documentParser } from './commonmark.ts'

const suite = await fetch(
  'https://spec.commonmark.org/0.29/spec.json'
).then((res) => res.json())

type Spec = {
  markdown: string
  html: string
  example: number
  start_line: number
  end_line: number
  section: 'Tabs'
}

const tests = [
  // Simple ordered list
  // ...suite.slice(234, 239),
  // Simple bullet list
  ...suite.slice(250, 254),
]
tests.forEach((spec: Spec) => {
  const testName = spec.markdown.replace(/\t/g, '\\t').replace(/\n/g, '\\n')
  Deno.test(`[${spec.example}] "${testName}"`, async () => {
    const result = documentParser(spec.markdown, 0)
    console.log(spec.markdown, JSON.stringify(result, null, 2))
    // const { html } = await transform(spec.markdown, {})
    // assertEquals(html, spec.html)
  })
})
// suite.slice(0, 4).forEach((spec: Spec) => {
//   const testName = spec.markdown.replace(/\t/g, '\\t').replace(/\n/g, '\\n')
//   Deno.test(`[${spec.example}] "${testName}"`, async () => {
//     const { html } = await transform(spec.markdown, {})
//     assertEquals(html, spec.html)
//   })
// })
