/* eslint-env jest */
import { QueryResponseCache } from 'relay-runtime'
import { createFetchQueryWithCache } from '../createFetchQueryWithCache'
import { createFetchQueryBase } from '../createFetchQueryBase'

jest.mock('../createFetchQueryBase', () => {
  const {
    createFetchQueryBase: createFetchQueryBaseOriginal
  } = require.requireActual('../createFetchQueryBase')

  const createFetchQueryBase = jest.fn(createFetchQueryBaseOriginal)

  return { createFetchQueryBase }
})

let cache
let query
let operation
let variables
let response

beforeEach(() => {
  cache = new QueryResponseCache({ size: 250, ttl: 5 * 60 * 1000 })
  response = { data: { foo: 'bar' } }
  fetch.mockResponse(JSON.stringify(response), { status: 200 })
  query = 'some query'
  operation = { text: query, name: 'SomeOperation' }
  variables = { some: 'variables' }
})

it('passes through non-cache options to createFetchQueryBase', () => {
  const path = '/some-path'
  const headers = { some: 'headers' }
  createFetchQueryWithCache({ cache, path, headers })
  expect(createFetchQueryBase).toHaveBeenCalledWith({ path, headers })
})

it('clears the cache when executing a mutation', () => {
  const subject = createFetchQueryWithCache({ cache })
  cache.clear = jest.fn()

  subject(operation, variables)
  expect(cache.clear).not.toHaveBeenCalled()

  operation.name = 'fooMutationBar'
  subject(operation, variables)
  expect(cache.clear).toHaveBeenCalled()
})

it('uses a cached value when possible', async () => {
  const cachedValues = { some: 'cached stuff' }
  cache.set(operation.name, variables, cachedValues)
  const subject = createFetchQueryWithCache({ cache })
  const result = await subject(operation, variables)

  expect(fetch).not.toHaveBeenCalled()
  expect(result).toEqual(cachedValues)
})

it('makes the fetch and returns the result', async () => {
  const subject = createFetchQueryWithCache({ cache })
  const result = await subject(operation, variables)

  expect(fetch).toHaveBeenCalled()
  expect(result).toEqual(response)
})

it('caches the result when successful', async () => {
  const subject = createFetchQueryWithCache({ cache })

  fetch.mockResponse(JSON.stringify(response), { status: 200 })
  await subject(operation, variables)
  expect(cache.get(operation.name, variables)).toEqual(response)

  operation.name = 'different'
  response.data = null
  fetch.mockResponse(JSON.stringify(response), { status: 200 })
  await subject(operation, variables)
  expect(cache.get(operation.name, variables)).toEqual(null)

  operation.name = 'another different name'
  response.data = { foo: 'bar' }
  response.errors = { an: 'error' }
  fetch.mockResponse(JSON.stringify(response), { status: 200 })
  await subject(operation, variables)
  expect(cache.get(operation.name, variables)).toEqual(null)
})
