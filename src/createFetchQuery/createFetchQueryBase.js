const createHeaders = (givenHeaders, isJson, operation, variables, cacheConfig, uploadables) => {
  let headers
  if (typeof givenHeaders === 'function') {
    headers = givenHeaders(operation, variables, cacheConfig, uploadables)
  } else {
    headers = givenHeaders || {}
  }

  if (isJson) {
    return {
      'Content-Type': 'application/json',
      ...headers
    }
  } else {
    return headers
  }
}

const createBody = (query, variables, uploadables) => {
  if (uploadables) {
    const uploadablesMap = new Map(Object.entries(uploadables))
    const formData = new FormData()
    formData.append('query', query)
    formData.append('variables', JSON.stringify(variables))
    uploadablesMap.forEach((value, key) => {
      formData.append(key, value)
    })
    return formData
  } else {
    return JSON.stringify({ query, variables })
  }
}

export const createFetchQueryBase = ({ path, headers, credentials, catch: catchCallback, then: thenCallback } = {}) => {
  const fetchQuery = (operation, variables, cacheConfig, uploadables) => {
    return fetch(path || '/graphql', {
      method: 'POST',
      credentials: credentials || 'omit',
      headers: createHeaders(headers, !uploadables, operation, variables, cacheConfig, uploadables),
      body: createBody(operation.text, variables, uploadables)
    }).then(thenCallback || ((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else {
        return Promise.reject(response)
      }
    })).catch(catchCallback || ((response) => {
      console.error(response)
      return response
    }))
  }
  return fetchQuery
}
