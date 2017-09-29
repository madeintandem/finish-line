# Finish Line

[![npm version](https://badge.fury.io/js/finish-line.svg)](https://badge.fury.io/js/finish-line)

Handy [React](https://facebook.github.io/react/) components and functions to cut down on some of the boiler plate in [Relay Modern](https://facebook.github.io/relay/) apps. Most of the functionality is around managing the Relay [Environment](https://facebook.github.io/relay/docs/relay-environment.html).

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [`RelayEnvironmentProvider` with `RelayRenderer` or `relayRendererFactory`?](#relayenvironmentprovider-with-relayrenderer-or-relayrendererfactory)
- [API](#api)
  - [`createEnvironment`](#createenvironment)
  - [`createFetchQuery`](#createfetchquery)
  - [`RelayEnvironmentProvider`](#relayenvironmentprovider)
  - [`RelayRenderer`](#relayrenderer)
  - [`relayRendererFactory`](#relayrendererfactory)
  - [`withRelayEnvironment`](#withrelayenvironment)
- [License](#license)

## Installation

Via [Yarn](https://yarnpkg.com/en/):

```sh
  yarn add finish-line
```

Or via [NPM](https://www.npmjs.com/):

```sh
  npm install --save finish-line
```

## Usage

Here are a few examples. Check out the [API](#api) for more specifics.

```js
import { graphql } from 'react-relay'
import {
  RelayRenderer,
  RelayEnvironmentProvider,
  withRelayEnvironment,
  createEnvironment
} from 'finish-line'

const MyComponent = ({ somethingFromQuery }) => (
  <span>{somethingFromQuery}</span>
)

const Buttons = withRelayEnvironment(({ relayEnvironment }) => (
  <div>
    <button onClick={() => relayEnvironment.commitMutation({ mutationExample: 'config' })}>
      Mutate!
    </button>

    <button onClick={relayEnvironment.refresh}>
      Reset!
    </button>
  </div>
))

const query = graphql`query { somethingFromQuery }`

const App = () => (
  <RelayEnvironmentProvider create={createEnvironment}>
    <div>
      <h2>Some examples!</h2>
      <RelayRenderer query={query} container={MyComponent} />
      <Buttons />
    </div>
  </RelayEnvironmentProvider>
)
```

### `RelayEnvironmentProvider` with `RelayRenderer` or `relayRendererFactory`?

It depends. [`RelayEnvironmentProvider`](#relayenvironmentprovider) with [`RelayRenderer`](#relayrenderer) is a much easier to understand (just wrap your app with `RelayEnvironmentProvider` and use `RelayRenderer` at will), but whenever you [`relayEnvironment.refresh`](#withrelayenvironment) your entire component tree will update. This can make other React patterns tricky, for instance this update could trigger transition animations for navigating between routes [React Router v4](https://reacttraining.com/react-router/).

```js
import { RelayEnvironmentProvider, RelayRenderer } from 'finish-line'

const App = () => (
  <div>
    <RelayRenderer {/* ... */} />
    <div>
      <RelayRenderer {/* ... */} />
    </div>
  </div>
)

export default () => (
  <RelayEnvironmentProvider {/* ... */}>
    <App />
  </RelayEnvironmentProvider>
)
```

Since [`relayRendererFactory`](#relayrendererfactory) is more self-contained, you can move `relayEnvironment.refresh` updates further down your component tree. The downside is that this is harder to understand and you could end up with warnings from React if they update while nested (you can always use a regular `RelayRenderer` inside your custom one).

```js
import { relayRendererFactory, RelayRenderer, createEnvironment } from 'finish-line'

const MyRelayRenderer = relayRendererFactory(createEnvironment)

// ...

const MyContainer = (props) => (
  <div>
    <h2>This works</h2>
    <RelayRenderer {/* ... */} />
  </div>
)

const App = () => (
  <div>
    <MyRelayRenderer container={MyContainer} {/* ... */} />
    <br />
    <MyRelayRenderer container={MyContainer} {/* ... */} />
  </div>
)
```

## API

- [`createEnvironment`](#createenvironment)
- [`createFetchQuery`](#createfetchquery)
- [`RelayEnvironmentProvider`](#relayenvironmentprovider)
- [`RelayRenderer`](#relayrenderer)
- [`relayRendererFactory`](#relayrendererfactory)
- [`withRelayEnvironment`](#withrelayenvironment)

### `createEnvironment`

Creates a new [Relay `Environment`](https://facebook.github.io/relay/docs/relay-environment.html) that you can you can pass to Relay's [`QueryRenderer`](#https://facebook.github.io/relay/docs/query-renderer.html), [`commitMutation`](https://facebook.github.io/relay/docs/mutations.html), etc. It can also be passed to Finish Line's [`RelayRenderer`](#relayrenderer) and [`relayRendererFactory`](#relayrendererfactory).

#### with no arguments

It uses Finish Line's default [`createFetchQuery`](#createfetchquery) for the Relay [Network](https://facebook.github.io/relay/docs/network-layer.html) instance.

```js
import { QueryRenderer } from 'react-relay'
import { createEnvironment } from 'finish-line'
// ...
const environment = createEnvironment()
<QueryRenderer environment={environment} {/* ... */} />
```

#### with a config object

It passes the config object through to Finish Line's [`createFetchQuery`](#createfetchquery).

```js
import { QueryRenderer } from 'react-relay'
import { createEnvironment } from 'finish-line'
// ...
const environment = createEnvironment({ cache, headers })
<QueryRenderer environment={environment} {/* ... */} />
```

#### with a function

It uses the given function as the fetch query for the [Network](https://facebook.github.io/relay/docs/network-layer.html).

```js
import { QueryRenderer } from 'react-relay'
import { createEnvironment } from 'finish-line'
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

const environment = createEnvironment(fetchQuery)
<QueryRenderer environment={environment} {/* ... */} />
```

### `createFetchQuery`

Creates a function that you can pass to Relay's [`Network.create`](https://facebook.github.io/relay/docs/network-layer.html) to fetch your data. Posts JSON unless uploadables are present, in which case it posts [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). It can be called with no arguments or with a config object with some or all of the following:

- `path` - A string of where to query data from. Defaults to `'/graphql'`
- `headers` - An object containing whatever headers you need to send to the server or a function that takes `operation`, `variables`, `cacheConfig`, and `uploadables` and returns an object of headers. Adds `'Content-Type': 'application/json'` when applicable.
- `cache` - A [`QueryResponseCache`](https://github.com/facebook/relay/commit/00c7e90b4b928607c4db43cf02161e29e6df3800) from `'relay-runtime'` (or something with the same interface). Clears the cache whenever a mutation is sent and caches all requests that don't have errors.

```js
import { QueryResponseCache, Network } from 'relay-runtime'
import { createFetchQuery } from 'finish-line'

const fetchQuery = createFetchQuery()
const network = Network.create(fetchQuery)

// or with all options

const path = 'https://example.org/graphql'
const headers = { Authorization: 'Bearer 1234567890' }
const cache = new QueryResponseCache({ size: 250, ttl: 5 * 60 * 1000 }) // 5 minute cache

const fetchQuery = createFetchQuery({ path, headers, cache})
const network = Network.create(fetchQuery)
```

### `RelayEnvironmentProvider`

A component that helps manage your application's Relay `Environment`. It takes a `create` `prop` which is a function that returns a new instance of a Relay `Environment`. It provides a few pieces of helper `context` that you can access through Finish Line's `withRelayEnvironment` helper (check out its documentation for more). Finish Line's `RelayRenderer` must be rendered inside of `RelayEnvironmentProvider` or something that provides similar `context`. [Here is a comparison of the `RelayEnvironmentProvider` with `RelayRenderer` and `relayRendererFactory`.](relayenvironmentprovider-with-relayrenderer-or-relayrendererfactory)

```js
import {
  RelayEnvironmentProvider,
  RelayRenderer,
  createEnvironment,
  withRelayEnvironment
} from 'finish-line'
import { MyComponent } from './MyComponent'

const headers = { Authorization: 'Bearer 1234567890' }
const newAppEnvironment = () => createEnvironment({ headers })
const MyComponentWithRelayEnvironment = withRelayEnvironment(MyComponent)

// ...

<RelayEnvironmentProvider create={newAppEnvironment}>
  <MyComponentWithRelayEnvironment />
  <RelayRenderer {/* ... */} />
</RelayEnvironmentProvider>
```

### `RelayRenderer`

`RelayRenderer` is Relay's [`QueryRenderer`](https://facebook.github.io/relay/docs/query-renderer.html) wrapped up for convenience. You don't need to pass it a Relay [`Environment`](https://facebook.github.io/relay/docs/relay-environment.html) since it pulls it from [`context`](https://facebook.github.io/react/docs/context.html), therefore it should always be rendered as a child of [`RelayEnvironmentProvider`](#relayenvironmentprovider) (it does not need to be a direct child). It accepts the following `props`:

- `container` - A Relay [Container](https://facebook.github.io/relay/docs/fragment-container.html) or some other component to pass data from the graphql `query` to. It also receives all additional `props` provided to the `RelayRenderer` that are not listed here.
- `error` - A component to render in the event of an error. It receives the `error` object and a `refreshRenderer` function as `props` along with all additional `props` provided to the `RelayRenderer` that are not listed here. When not provided it renders `null` when there's an error.
- `loading` - A component to render while Relay fetches data. It receives all additional `props` provided to the `RelayRenderer` that are not listed here. When not provided it renders `null` during loading.
- `query` - A Relay `graphql` object.
- `render` - Works the same as `QueryRenderer`'s `render` `prop`, but is called with all of the `props` passed to the `RelayRenderer` along with whatever `props` Relay provides. If passed, the `error` and `loading` props are ignored.
- `variables` - Variables for your `query`.

 [Here is a comparison of the `RelayEnvironmentProvider` with `RelayRenderer` and `relayRendererFactory`.](relayenvironmentprovider-with-relayrenderer-or-relayrendererfactory)

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

Creates a component that behaves like [`RelayRenderer`](#relayrenderer) but does not need to be rendered inside a [`RelayEnvironmentProvider`](#relayenvironmentprovider). All instances of the created component class will share the same environment and stay in sync with one another. [`withRelayEnvironment`](#withrelayenvironment) will work as it normally does for anything rendered by your factory built `RelayRenderer`. It takes a function that returns a new [Relay `Environment`](https://facebook.github.io/relay/docs/relay-environment.html) instance. [Here is a comparison of the `RelayEnvironmentProvider` with `RelayRenderer` and `relayRendererFactory`.](relayenvironmentprovider-with-relayrenderer-or-relayrendererfactory)

```js
import { relayRendererFactory, createEnvironment, withRelayEnvironment } from 'finish-line'
import { MyComponent } from './MyComponent'

const headers = { Authorization: 'Bearer 1234567890' }
const newAppEnvironment = () => createEnvironment({ headers })
const MyComponentWithRelayEnvironment = withRelayEnvironment(MyComponent)

const CustomRelayRenderer = relayRendererFactory(newAppEnvironment)
// ...

<div>
  <CustomRelayRenderer container={MyComponentWithRelayEnvironment} {/* ... */} />
  <br />
  <CustomRelayRenderer container={MyComponentWithRelayEnvironment} {/* ... */} />
</div>
```

### `withRelayEnvironment`

Wraps your components to provides a single `prop` of `relayEnvironment` which contains the following:

- `commitMutation` - Relay's [`commitMutation`](https://facebook.github.io/relay/docs/mutations.html) function wrapped up so you don't have to pass the `environment` in.
- `current` - The current instance of Relay's [`environment`](https://facebook.github.io/relay/docs/relay-environment.html). This comes from the `create` function that was given to [`RelayEnvironmentProvider`](#relayenvironmentprovider) or [`relayRendererFactory`](#relayrendererfactory). Generally you won't need to actually use this `prop` because Finish Line wraps Relay up so you don't have to worry about it.
- `refresh` - A function that will call the `create` function that was given to [`RelayEnvironmentProvider`](#relayenvironmentprovider) or [`relayRendererFactory`](#relayrendererfactory) to replace the current `environment`. This is handy when someone signs in or out of your application. If called in a `RelayEnvironmentProvider`, all of the `RelayEnvironmentProvider`'s children will update as a result. If called by a component rendered by a custom `RelayRenderer` (via `relayRendererFactory`), all custom `RelayRenderer`s that are rendered will update.

It accepts a `wrappedComponentRef` `prop` that will provide a [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html) of the wrapped component when rendered.

Also, all `static` functions on the wrapped component are hoisted up to the wrapper for convenience.

```js
import React, { Component } from 'react'
import {
  withRelayEnvironment,
  RelayEnvironmentProvider,
  relayRendererFactory
} from 'finish-line'

class MyComponent extends Component {
  render () {
    const { relayEnvironment } = this.props

    return <div>
      <h2>Example!</h2>

      <button onClick={() => relayEnvironment.commitMutation({ mutationExample: 'config' })}>
        Mutate!
      </button>

      <button onClick={relayEnvironment.refresh}>
        Reset!
      </button>
    </div>
  }
}
const MyComponentWithRelayEnvironment = withRelayEnvironment(MyComponent)

const headers = { Authorization: 'Bearer 1234567890' }
const newAppEnvironment = () => createEnvironment({ headers })
const CustomRelayRenderer = relayRendererFactory(newAppEnvironment)

// ...

<div>
  <RelayEnvironmentProvider create={newAppEnvironment}>
    <RelayRenderer container={MyComponentWithRelayEnvironment} {/* ... */} />
  </RelayEnvironmentProvider>
  <br />
  <CustomRelayRenderer container={MyComponentWithRelayEnvironment} {/* ... */} />
</div>
```

## License

[MIT](LICENSE.txt)
