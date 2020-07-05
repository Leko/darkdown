# deno-plugin-study

Example of a Deno plugin using a third party crate.

## Getting started

```
cargo build
deno run --unstable --allow-plugin --allow-read --allow-write lib.ts
```

## See also

- [plugin_prepare](https://deno.land/x/plugin_prepare)
  - Utility for loading plugin
- [denoland/deno/test_plugin](https://github.com/denoland/deno/tree/master/test_plugin)
  - Officially provided example plugin and TypeScript tests

## Testing

```
deno test --allow-read=spec.json darkdown.test.ts
```
