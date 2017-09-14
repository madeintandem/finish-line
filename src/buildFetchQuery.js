export const buildFetchQuery = ({ path, headers } = {}) => {
  const fetchQuery = (operation, variables, _cacheConfig, uploadables) => {
    return fetch(path || '/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {})
      },
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables
      })
    }).then(response => response.json())
  }
  return fetchQuery
}
