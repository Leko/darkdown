# darkdown

Markdown parser for Deno

- :sparkles: Written in ES Modules
- :heavy_check_mark: 100% compatible with [CommonMark spec](https://spec.commonmark.org/0.29/) (see [our tests](https://github.com/Leko/darkdown/blob/master/commonmark.test.ts))
- :revolving_hearts: [GitHub flavored markdown](https://github.github.com/gfm/) is also supported
- :boom: AST structure is the same as [remark](https://github.com/remarkjs/remark)

## Getting started

### CommonMark

```ts
import {
  parse,
  stringify,
  renderHTML,
  transform,
} from 'https://denopkg.com/Leko/darkdown/commonmark.ts'

const ast = parse('# markdown')
const markdown = stringify(ast) // => "# markdown"
const html = renderHTML(ast) // => "<h1>markdown</h1>"

const html = transform('# markdown') // => "<h1>markdown</h1>
```

### GitHub flavored markdown

```ts
import {
  parse,
  stringify,
  transform,
} from 'https://denopkg.com/Leko/darkdown/gfm.ts'

// You can use the same as commonmark.ts
```

## Development

### Test

```
deno test --allow-read=./fixtures/commonmark-0.29-spec.json
```

### Update spec file

```

```
