# `@number0/iroh`

> A toolkit for building distributed applications

## Install

```sh
> npm i --save @number0/iroh
```


## Development

```sh
# debug build
> yarn build:debug

# run tests
> yarn test
```


## License

This project is licensed under either of

 * Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or
   http://opensource.org/licenses/MIT)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.

## Direct-only application payload policy (experimental fork)

`builder.directApplicationDataOnly()` retains relay assistance/control but restricts
outbound application STREAM/DATAGRAM frames to IP paths. Check
`endpoint.directApplicationDataOnly()` after binding to confirm effective policy.
Without that setting the normal upstream relay fallback is unchanged.

`connection.paths()` and `connection.watchPaths((error, paths) => ...)` include
`applicationDataAllowed`: local policy permits application payload on that selected
open path. It uses the same native predicate as enforcement, not the displayed
remote-address class. False covers filtered paths, unvalidated/closed paths and
unselected paths. With no selected eligible path, application writes may queue.
This is last-observed eligibility, not proof of reachability, peer policy, stream
completion, or remote delivery. Network-failure detection can lag.

The snapshot watcher delivers current state initially and on path changes; events
may coalesce. Use it for current readiness. Raw `watchPathEvents` reports lifecycle
including `Lagged`; recover a lagged event consumer using `paths()`. Subscribe
before reading a snapshot to avoid missing a transition. Watch callbacks are
error-first `(error, payload)` with `null` on success. Stop handles on teardown
and observe `connection.closed()` for terminal closure.

Raw Selected-relay events/logs remain transport diagnostics; they do not mean
strict-policy application payload is allowed. `endpoint.online()` and home-relay
notifications concern the relay, not peer readiness. RTT/traffic/loss counters
include protocol control and cannot measure delivered application bytes. A write
accepted locally is not delivery; use the application's ordinary response or
receiver acknowledgment. The separate upstream watchNetworkChange trigger-loop
bug is not repaired by this policy and that method is not a readiness observer.
