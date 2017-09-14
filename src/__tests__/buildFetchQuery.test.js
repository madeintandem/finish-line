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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })
  })

  it('calls fetch properly with uploadables (form data request)', () => {
    const uploadables = { maybe: 'a png' }
    const formData = new FormData()
    formData.append('query', operation.text)
    formData.append('variables', JSON.stringify(variables))
    formData.append('maybe', 'a png')
    const subject = buildFetchQuery()
    subject(operation, variables, { cache: 'config' }, uploadables)

    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      headers: {},
      body: formData
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
        'Content-Type': 'application/json',
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
