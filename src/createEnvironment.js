import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { createFetchQuery } from './createFetchQuery'

const extractFetchQuery = (options) => {
  if (typeof options === 'function') {
    return options
  } else if (options && typeof options === 'object') {
    return createFetchQuery(options)
  } else {
    return createFetchQuery()
  }
}

export const createEnvironment = (options) => {
  const source = new RecordSource()
  const store = new Store(source)
  const fetchQuery = extractFetchQuery(options)
  const network = Network.create(fetchQuery)

  return new Environment({ network, store })
}
