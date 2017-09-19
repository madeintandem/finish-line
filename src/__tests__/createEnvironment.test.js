/* eslint-env jest */
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { createEnvironment } from '../createEnvironment'
import { createFetchQuery } from '../createFetchQuery'

jest.mock('../createFetchQuery', () => {
  const createFetchQuery = jest.fn(() => 'createFetchQuery')
  return { createFetchQuery }
})

jest.mock('relay-runtime', () => {
  const actual = require.requireActual('relay-runtime')
  const NetworkMock = { create: jest.fn(() => 'network') }
  return { ...actual, Network: NetworkMock }
})

it('creates an environment when given nothing', () => {
  const result = createEnvironment()
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith('createFetchQuery')
  expect(createFetchQuery).toHaveBeenCalled()
})

it('creates an environment when given createFetchQuery configs', () => {
  const configs = { createFetchQuery: 'configs' }
  const result = createEnvironment(configs)
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith('createFetchQuery')
  expect(createFetchQuery).toHaveBeenCalledWith(configs)
})

it('creates an environment when given a fetch query function', () => {
  const fetchQuery = () => null
  const result = createEnvironment(fetchQuery)
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith(fetchQuery)
  expect(createFetchQuery).not.toHaveBeenCalled()
})
