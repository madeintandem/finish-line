import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { buildFetchQuery } from './buildFetchQuery'

const extractFetchQuery = (options) => {
  if (typeof options === 'function') {
    return options
  } else if (options && typeof options === 'object') {
    return buildFetchQuery(options)
  } else {
    return buildFetchQuery()
  }
}

export const buildEnvironment = (options) => {
  const source = new RecordSource()
  const store = new Store(source)
  const fetchQuery = extractFetchQuery(options)
  const network = Network.create(fetchQuery)

  return new Environment({ network, store })
}
