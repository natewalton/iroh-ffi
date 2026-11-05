#!/bin/bash
# Build only this fork's macOS arm64 addon; no application checkout is needed.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE="$(cd "$HERE/.." && pwd)"
cargo build --manifest-path "$WORKSPACE/Cargo.toml" --package number0_iroh --locked --release --target aarch64-apple-darwin
TARGET_DIRECTORY="${CARGO_TARGET_DIR:-$WORKSPACE/target}"
cp "$TARGET_DIRECTORY/aarch64-apple-darwin/release/libnumber0_iroh.dylib" "$HERE/iroh.darwin-arm64.node"
strip -x "$HERE/iroh.darwin-arm64.node"
install_name_tool -id @rpath/iroh.darwin-arm64.node "$HERE/iroh.darwin-arm64.node"
codesign --force --sign - "$HERE/iroh.darwin-arm64.node"
