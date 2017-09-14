/* eslint-env jest */
import { buildFetchQuery } from '../buildFetchQuery'

describe('buildFetchQuery', () => {
  let query
  let operation
  let variables
  let response

  beforeEach(() => {
    response = { foo: 'bar' }
    fetch.mockResponse(JSON.stringify(response))
    query = 'some query'
    operation = { text: query }
    variables = { some: 'variables' }
  })

  it('calls fetch properly', () => {
    const subject = buildFetchQuery()
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })
  })

  it('accepts a path', () => {
    const path = '/some-other-path'
    const subject = buildFetchQuery({ path })
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith(path, expect.anything())
  })

  it('accepts additional headers', () => {
    const headers = { other: 'headers' }
    const subject = buildFetchQuery({ headers })
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        other: 'headers'
      },
      body: JSON.stringify({ query, variables })
    })
  })

  it('converts the response to json', async () => {
    const subject = buildFetchQuery()
    const result = await subject(operation, variables)
    expect(result).toEqual(response)
  })
})
