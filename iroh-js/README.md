# @natewalton/iroh-direct

Experimental, independently maintained Iroh fork. This is not an official n0
package or release. First binary distribution: **macOS Apple Silicon (darwin-arm64),
Node.js 24 or newer only**. Other platforms and language bindings are not supported
by this release. There is no dependency on any application codebase.

## Install

```sh
npm install https://github.com/natewalton/iroh-ffi/releases/download/iroh-direct-v0.1.0-experimental.1/natewalton-iroh-direct-0.1.0-experimental.1.tgz
```

Distributed as a GitHub prerelease asset, not yet through the npm registry.
The package includes its own optimized, ad-hoc signed native addon (not Apple
notarized). Its loader has no upstream
package fallback, environment override, or install-time download script. Verify
the release's SHA256SUMS before installation if downloading manually.

## Use the strict policy

```js
const { Endpoint, presetMinimal } = require('@natewalton/iroh-direct')
const builder = Endpoint.builder()
presetMinimal(builder) // no public relays/discovery in this preset
builder.directApplicationDataOnly()
const endpoint = await builder.bind()
if (!endpoint.directApplicationDataOnly()) throw new Error('strict policy unavailable')
// Configure explicit peer addresses/assistance with the existing Iroh APIs.
// Both supported endpoints must select the strict policy.
// ... connect and exchange application data ...
await endpoint.close()
```

Wrap the snippet in an async function for CommonJS. Iroh still authenticates and
encrypts connections and manages hole punching and recovery. When strict policy
is selected, relays may carry transport handshake, probing and connection control,
but never outbound application STREAM or DATAGRAM payload, including retransmits.
Use the normal Iroh APIs to configure assistance; no relay operator is bundled.
Without `directApplicationDataOnly()`, upstream relay fallback remains unchanged.
A peer cannot force a direct connection through every NAT/firewall combination.
Relays can observe network metadata, even though traffic is encrypted.

## Observe readiness

`connection.paths()` and `connection.watchPaths((error, paths) => ...)` expose
`applicationDataAllowed`. It is true only for a selected open path permitted by
the effective native policy, using the same predicate as frame emission. Strict
mode rejects relay, Mixed and custom paths. No selected eligible path means data
may queue; this is last-observed local permission, not a delivery/reachability
promise. A consumer label such as Linked means an eligible connection is open
now, not that it will remain available between requests.

The snapshot watcher emits an initial/current snapshot and subsequent changes;
updates may coalesce. Raw `watchPathEvents` retains Opened, Selected, Closed and
Lagged. A lagged diagnostic consumer must read a current snapshot. Subscribe
before reading state, stop watcher handles during teardown and observe
`connection.closed()` for final closure. Runtime watch callbacks are error-first;
`error` is null on success. The declarations match that calling convention.

Raw Selected-relay events and native logs still describe transport selection.
Under strict policy they do not imply permission to send application payload.
`endpoint.online()` and home-relay events describe assistance availability, not
peer readiness. RTT and byte/loss metrics include protocol/control traffic and
are not delivered application-byte counters. A successful enqueue is not proof
of delivery: use an application response or receiver acknowledgment. Native loss
detection can lag, and unreliable datagrams retain upstream loss semantics.

## Experimental limitations

- No cross-internet success rate, stable Rust-policy API or production security
  guarantee is asserted by this release. The strict/default controlled-network
  proofs were rerun against the exact optimized addon in the release tarball.
- The native Rust `accept_with(ServerConfig)` path can use a configuration from
  another non-strict builder. This Node binding does not expose that API; do not
  assume the source fork enforces endpoint policy across that Rust usage.
- The inherited `watchNetworkChange` binding is defective: it loops an imperative
  network-recheck trigger instead of waiting for network changes. **Do not use
  it.** It is not a readiness observer; its separate upstream fix is not included.
- The native effective-policy query still uses a function-pointer identity check.
  It can fail closed; it is not an integrity check for a malicious binary.

## Source and reproduction

Feature source: Iroh 1.4.1, Noq 1.4.0 and iroh-ffi/JS 1.2.0. The NOTICE records
upstream/fork revisions. Public fork dependencies are pinned by full Git SHAs in
Cargo.toml/Cargo.lock; no sibling scratch checkout is required to build.

```sh
git clone --branch direct-application-data https://github.com/natewalton/iroh-ffi.git
cd iroh-ffi/iroh-js
npm install --ignore-scripts
npm run build
npm test
```

Building requires Rust 1.91+ and the normal macOS native development toolchain.
Retain the committed root Cargo.lock; cargo must resolve the pinned source forks.
This release was built with locked Cargo dependencies. Native binaries and
package publication are separate from any consuming application's release.

MIT OR Apache-2.0. Original n0 and Noq/Quinn attribution and both license texts
are preserved. See NOTICE, LICENSE-MIT and LICENSE-APACHE.
