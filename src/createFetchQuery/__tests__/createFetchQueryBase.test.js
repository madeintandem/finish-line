/* eslint-env jest */
import { createFetchQueryBase } from '../createFetchQueryBase'

describe('createFetchQueryBase', () => {
  let query
  let operation
  let variables
  let response

  beforeEach(() => {
    response = { foo: 'bar' }
    fetch.mockResponse(JSON.stringify(response), { status: 200 })
    query = 'some query'
    operation = { text: query }
    variables = { some: 'variables' }
  })

  it('calls fetch properly', () => {
    const subject = createFetchQueryBase()
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      credentials: 'omit',
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
    const subject = createFetchQueryBase()
    subject(operation, variables, { cache: 'config' }, uploadables)

    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      credentials: 'omit',
      headers: {},
      body: formData
    })
  })

  it('accepts a path', () => {
    const path = '/some-other-path'
    const subject = createFetchQueryBase({ path })
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith(path, expect.anything())
  })

  it('accepts additional headers', () => {
    const headers = { other: 'headers' }
    const subject = createFetchQueryBase({ headers })
    subject(operation, variables)

    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        other: 'headers'
      },
      body: JSON.stringify({ query, variables })
    })
  })

  it('accepts a "credentials" parameter', () => {
    const credentials = 'same-origin'
    const subject = createFetchQueryBase({ credentials })
    subject(operation, variables)
    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      credentials,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ query, variables })
    })
  })

  it('accepts a function for headers', () => {
    const cacheConfig = { cache: 'config' }
    const uploadables = null
    const headers = jest.fn(() => ({ my: 'header' }))
    const subject = createFetchQueryBase({ headers })
    subject(operation, variables, cacheConfig, uploadables)

    expect(headers).toHaveBeenCalledWith(operation, variables, cacheConfig, uploadables)
    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        my: 'header'
      },
      body: JSON.stringify({ query, variables })
    })
  })

  it('converts the response to json', async () => {
    const subject = createFetchQueryBase()
    const result = await subject(operation, variables)
    expect(result).toEqual(response)
  })

  it('rejects the promise when it is not a 2XX status response', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => 'mocked')
    fetch.mockResponse(JSON.stringify(response), { status: 401 })
    const subject = createFetchQueryBase()
    const result = await subject(operation, variables)
    expect(result.status).toEqual(401)
    expect(console.error).toHaveBeenCalled()
  })

  it('accepts a "catch" argument for when the promise fails', async () => {
    fetch.mockResponse(JSON.stringify(response), { status: 401 })
    const catchCallback = jest.fn(() => {
      return 'caught'
    })

    const subject = createFetchQueryBase({ catch: catchCallback })
    const result = subject(operation, variables)
    expect(await result).toEqual('caught')
    expect(catchCallback).toHaveBeenCalled()
  })

  it('accepts a "then" argument for the promise', async () => {
    const thenCallback = jest.fn(() => {
      return 'thenned'
    })

    const subject = createFetchQueryBase({ then: thenCallback })
    const result = subject(operation, variables)
    expect(await result).toEqual('thenned')
    expect(thenCallback).toHaveBeenCalled()
  })
})
