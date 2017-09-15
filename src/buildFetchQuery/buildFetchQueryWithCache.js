import { buildFetchQueryBase } from './buildFetchQueryBase'

export const buildFetchQueryWithCache = ({ cache, ...options }) => {
  const fetchQueryWithoutCache = buildFetchQueryBase(options)

  const fetchQuery = (operation, variables, cacheConfig, uploadables) => {
    const { name: queryId } = operation

    if (/Mutation/.test(queryId)) { cache.clear() }

    let payload = cache.get(queryId, variables)
    if (payload) { return payload }

    return fetchQueryWithoutCache(
      operation,
      variables,
      cacheConfig,
      uploadables
    ).then(payload => {
      if (payload.data && !payload.errors) {
        cache.set(queryId, variables, payload)
      }
      return payload
    })
  }
  return fetchQuery
}
