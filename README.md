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

A component that helps manage your application's Relay `Environment`. It takes an `environmentProvider` `prop` which is a function that returns a new instance of a Relay `Environment`. It provides a few pieces of helper `context` that you can access through Finish Line's `withRelayEnvironment` helper (check out its documentation for more). Finish Line's `RelayRenderer` must be rendered inside of `RelayEnvironmentProvider` or something that provides similar `context`.

```js
import {
  RelayEnvironmentProvider,
  RelayRenderer,
  buildEnvironment,
  withRelayEnvironment
} from 'finish-line'
import { MyComponent } from './MyComponent'

const headers = { Authorization: 'Bearer 1234567890' }
const newAppEnvironment = () => buildEnvironment({ headers })
const MyComponentWithRelayEnvironment = withRelayEnvironment(MyComponent)

// ...

<RelayEnvironmentProvider environmentProvider={newAppEnvironment}>
  <MyComponentWithRelayEnvironment />
  <RelayRenderer {/* ... */} />
</RelayEnvironmentProvider>
```

### `RelayRenderer`

`RelayRenderer` is Relay's `QueryRenderer` wrapped up for convenience. You don't need to pass it a Relay `Environment` since it pulls it from `context`, therefore it should always be rendered as a child of `RelayEnvironmentProvider` (it does not need to be a direct child). It accepts the following `props`:

- `container` - A Relay Container or some other component to pass data from the graphql `query` to. It also receives all additional `props` provided to the `RelayRenderer` that are not listed here.
- `error` - A component to render in the event of an error. It receives the `error` object and a `refreshRenderer` function as `props` along with all additional `props` provided to the `RelayRenderer` that are not listed here.
- `loading` - A component to render while Relay fetches data. It receives all additional `props` provided to the `RelayRenderer` that are not listed here.
- `query` - A Relay `graphql` object.
- `render` - Works the same as `QueryRenderer`'s `render` `prop`, but is called with all of the `props` passed to the `RelayRenderer` along with whatever `props` Relay provides. If passed, the `error` and `loading` props are ignored.
- `variables` - Variables for your `query`.

```js
import { graphql } from 'react-relay'
import { RelayRenderer } from 'finish-line'
import { MyContainer } from './MyContainer'

const TryAgain = ({error, refreshRenderer}) => (
  <div>
    <h4>Something went wrong!</h4>
    <span>{error.message}</span>
    <button onPress={refreshRenderer}>Try Again?</button>
  </div>
)

const Loading = (props) => (
  <div>Loading...</div>
)

// ...

<RelayRenderer
  query={graphql`query { get { some { data } } }`}
  error={TryAgain}
  loading={Loading}
  container={MyContainer}
/>

```

### `relayRendererFactory`

Creates a component that behaves like `RelayRenderer` but does not need to be rendered inside a `RelayEnvironmentProvider`. All instances of the created component class will share the same environment and stay in sync with one another. `withRelayEnvironment` will work as it normally does for all `children` of your factory built `RelayRenderer`. It takes an `environmentProvider` `prop`.

```js
import { relayRendererFactory, buildEnvironment, withRelayEnvironment } from 'finish-line'
import { MyComponent } from './MyComponent'

const headers = { Authorization: 'Bearer 1234567890' }
const newAppEnvironment = () => buildEnvironment({ headers })
const MyComponentWithRelayEnvironment = withRelayEnvironment(MyComponent)

const CustomRelayRenderer = relayRendererFactory(newAppEnvironment)
// ...

<div>
  <CustomRelayRenderer {/* ... */}>
    <MyComponentWithRelayEnvironment />
    <MyComponentWithRelayEnvironment />
  </CustomRelayRenderer>
  <br />
  <CustomRelayRenderer {/* ... */}>
    <MyComponentWithRelayEnvironment />
  </CustomRelayRenderer>
</div>
```

### `withRelayEnvironment`

## License

[MIT](LICENSE.txt)
