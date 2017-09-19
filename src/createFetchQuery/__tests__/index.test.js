/* eslint-env jest */
import { buildFetchQuery } from '../index'
import { createFetchQueryBase } from '../createFetchQueryBase'
import { createFetchQueryWithCache } from '../createFetchQueryWithCache'

jest.mock('../createFetchQueryBase', () => {
  const createFetchQueryBase = jest.fn(() => 'createFetchQueryBase')
  return { createFetchQueryBase }
})

jest.mock('../createFetchQueryWithCache', () => {
  const createFetchQueryWithCache = jest.fn(() => 'createFetchQueryWithCache')
  return { createFetchQueryWithCache }
})

describe('without arguments', () => {
  it('uses the createFetchQueryBase', () => {
    const result = buildFetchQuery()

    expect(createFetchQueryBase).toHaveBeenCalledWith({})
    expect(createFetchQueryWithCache).not.toHaveBeenCalled()
    expect(result).toEqual('createFetchQueryBase')
  })
})

describe('without a given cache', () => {
  it('uses the createFetchQueryBase', () => {
    const args = { cache: null, headers: { a: 'header' } }
    const result = buildFetchQuery(args)

    expect(createFetchQueryBase).toHaveBeenCalledWith(args)
    expect(createFetchQueryWithCache).not.toHaveBeenCalled()
    expect(result).toEqual('createFetchQueryBase')
  })
})

describe('with a given cache', () => {
  it('uses the createFetchQueryWithCache', () => {
    const args = { cache: 'a cache', headers: { a: 'header' } }
    const result = buildFetchQuery(args)

    expect(createFetchQueryWithCache).toHaveBeenCalledWith(args)
    expect(createFetchQueryBase).not.toHaveBeenCalled()
    expect(result).toEqual('createFetchQueryWithCache')
  })
})
