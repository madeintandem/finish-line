# finish-line

Handy components and functions to cut down on some of the boiler plate in Relay Modern apps.

## Installation

Via Yarn:

```sh
  yarn add finish-line
```

Or via NPM:

```sh
  npm install --save finish-line
```

## Usage

## API

### `buildEnvironment`

Builds a new [Relay `Environment`](https://facebook.github.io/relay/docs/relay-environment.html) that you can you can pass to Relay's `QueryRenderer`, `commitMutation`, etc. It can also be passed to Finish Line's `RelayRenderer` and `relayRendererFactory`.

#### with no arguments

It uses Finish Line's default `buildFetchQuery` for the Relay Network instance.

```js
import { QueryRenderer } from 'react-relay'
import { buildEnvironment } from 'finish-line'
// ...
const environment = buildEnvironment()
<QueryRenderer environment={environment} {/* ... */} />
```

#### with a config object

It passes the config object through to Finish Line's `buildFetchQuery`.

```js
import { QueryRenderer } from 'react-relay'
import { buildEnvironment } from 'finish-line'
// ...
const environment = buildEnvironment({ cache, headers })
<QueryRenderer environment={environment} {/* ... */} />
```

#### with a function

It uses the given function as the fetch query for the `Network`.

```js
import { QueryRenderer } from 'react-relay'
import { buildEnvironment } from 'finish-line'
// ...
const fetchQuery = (operation, variables, cacheConfig, uploadables) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => response.json())

const environment = buildEnvironment(fetchQuery)
<QueryRenderer environment={environment} {/* ... */} />
```

### `buildFetchQuery`

Creates a function that you can pass to Relay's `Network.create` to fetch your data. Posts JSON unless uploadables are present, in which case it posts `FormData`. It can be called with no arguments or with a config object with some or all of the following:

- `path` - A string of where to query data from. Defaults to `'/graphql'`
- `headers` - An object containing whatever headers you need to send to the server. Adds `'Content-Type': 'application/json'` when applicable.
- `cache` - A `QueryResponseCache` from `'relay-runtime'` (or something with the same interface). Clears the cache whenever a mutation is sent and caches all requests that don't have errors.

```js
import { QueryResponseCache, Network } from 'relay-runtime'
import { buildFetchQuery } from 'finish-line'

const fetchQuery = buildFetchQuery()
const network = Network.create(fetchQuery)

// or with all options

const path = 'https://example.org/graphql'
const headers = { Authorization: 'Bearer 1234567890' }
const cache = new QueryResponseCache({ size: 250, ttl: 5 * 60 * 1000 }) // 5 minute cache

const fetchQuery = buildFetchQuery({ path, headers, cache})
const network = Network.create(fetchQuery)
```

### `RelayEnvironmentProvider`

### `RelayRenderer`

### `relayRendererFactory`

### `withRelayEnvironment`

## License

[MIT](LICENSE.txt)
