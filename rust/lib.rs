use deno_core::plugin_api::{Interface, Op, ZeroCopyBuf};
use comrak::{markdown_to_html, ComrakOptions};

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
  interface.register_op("transpile", op_transpile);
}

fn op_transpile(
  _interface: &mut dyn Interface,
  _data: &[u8],
  zero_copy: &mut [ZeroCopyBuf],
) -> Op {
  let markdown = std::str::from_utf8(&zero_copy[0][..]).unwrap();
  let html = markdown_to_html(
    markdown,
    &ComrakOptions::default()
  );
  Op::Sync(html.into_bytes().into_boxed_slice())
}
