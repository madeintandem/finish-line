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

### `RelayEnvironmentProvider`

### `RelayRenderer`

### `relayRendererFactory`

### `withRelayEnvironment`

## License

[MIT](LICENSE.txt)
