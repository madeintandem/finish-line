/* eslint-env jest */
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { buildEnvironment } from '../buildEnvironment'
import { buildFetchQuery } from '../buildFetchQuery'

jest.mock('../buildFetchQuery', () => {
  const buildFetchQuery = jest.fn(() => 'buildFetchQuery')
  return { buildFetchQuery }
})

jest.mock('relay-runtime', () => {
  const actual = require.requireActual('relay-runtime')
  const NetworkMock = { create: jest.fn(() => 'network') }
  return { ...actual, Network: NetworkMock }
})

it('builds an environment when given nothing', () => {
  const result = buildEnvironment()
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith('buildFetchQuery')
  expect(buildFetchQuery).toHaveBeenCalled()
})

it('builds an environment when given buildFetchQuery configs', () => {
  const configs = { buildFetchQuery: 'configs' }
  const result = buildEnvironment(configs)
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith('buildFetchQuery')
  expect(buildFetchQuery).toHaveBeenCalledWith(configs)
})

it('builds an environment when given a fetch query function', () => {
  const fetchQuery = () => null
  const result = buildEnvironment(fetchQuery)
  expect(result).toBeInstanceOf(Environment)
  expect(result._network).toEqual('network')
  expect(result._store).toBeInstanceOf(Store)
  expect(result._store._recordSource).toBeInstanceOf(RecordSource)
  expect(Network.create).toHaveBeenCalledWith(fetchQuery)
  expect(buildFetchQuery).not.toHaveBeenCalled()
})
