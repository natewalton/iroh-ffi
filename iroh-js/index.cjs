// Independent experimental fork; never resolve an upstream binary fallback.
if (process.platform !== 'darwin' || process.arch !== 'arm64') {
  throw new Error('@natewalton/iroh-direct currently supports macOS arm64 only')
}
const native = require('./iroh.darwin-arm64.node')
module.exports.presetIrohServices = native.presetIrohServices
module.exports.PathEventKind = native.PathEventKind
module.exports.LogLevel = native.LogLevel
module.exports.setLogLevel = native.setLogLevel
module.exports.Side = native.Side
module.exports.presetN0 = native.presetN0
module.exports.presetMinimal = native.presetMinimal
module.exports.presetN0DisableRelay = native.presetN0DisableRelay
module.exports.Endpoint = native.Endpoint
module.exports.Connection = native.Connection
module.exports.EndpointAddr = native.EndpointAddr
module.exports.RelayMap = native.RelayMap
module.exports.SendStream = native.SendStream
module.exports.ServicesClient = native.ServicesClient
module.exports.BiStream = native.BiStream
module.exports.WatchHandle = native.WatchHandle
module.exports.Connecting = native.Connecting
module.exports.SecretKey = native.SecretKey
module.exports.Signature = native.Signature
module.exports.EndpointBuilder = native.EndpointBuilder
module.exports.EndpointId = native.EndpointId
module.exports.Accepting = native.Accepting
module.exports.EndpointTicket = native.EndpointTicket
module.exports.Incoming = native.Incoming
module.exports.RelayMode = native.RelayMode
module.exports.RecvStream = native.RecvStream
