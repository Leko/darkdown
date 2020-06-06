import {
  prepare,
  PerpareOptions,
} from "https://deno.land/x/plugin_prepare@v0.6.0/mod.ts";

type DarkdownNativePlugin = {
  transpile(markdown: Uint8Array): Promise<string>;
  fromFile(filePath: string): Promise<string>;
  dispose(): void;
};

async function loadPlugin(): Promise<DarkdownNativePlugin> {
  const decoder = new TextDecoder();

  const base = `file://` + Deno.cwd() + "/target/debug";
  const pluginOptions: PerpareOptions = {
    name: "darkdown",
    urls: {
      darwin: `${base}/libdarkdown.dylib`,
      windows: `${base}/darkdown.dll`,
      linux: `${base}/libdarkdown.so`,
    },
  };

  async function transpile(markdown: Uint8Array): Promise<string> {
    // @ts-ignore
    const buff = Deno.core.dispatch(
      transpileNative,
      new Uint8Array([]),
      markdown
    );
    return decoder.decode(buff);
  }
  async function fromFile(filePath: string): Promise<string> {
    const file = await Deno.open(filePath, { read: true });
    const content = await Deno.readAll(file);
    Deno.close(file.rid);

    return transpile(content);
  }
  function dispose(): void {
    Deno.close(rid);
  }

  const rid = await prepare(pluginOptions);
  // @ts-ignore
  const { transpile: transpileNative } = Deno.core.ops();

  return {
    transpile,
    fromFile,
    dispose,
  };
}

const plugin = await loadPlugin();
console.log(await plugin.fromFile("./test.md"));
plugin.dispose();
