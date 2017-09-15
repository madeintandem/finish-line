/* eslint-env jest */
import { buildFetchQuery } from '../index'
import { buildFetchQueryBase } from '../buildFetchQueryBase'
import { buildFetchQueryWithCache } from '../buildFetchQueryWithCache'

jest.mock('../buildFetchQueryBase', () => {
  const buildFetchQueryBase = jest.fn(() => 'buildFetchQueryBase')
  return { buildFetchQueryBase }
})

jest.mock('../buildFetchQueryWithCache', () => {
  const buildFetchQueryWithCache = jest.fn(() => 'buildFetchQueryWithCache')
  return { buildFetchQueryWithCache }
})

describe('without arguments', () => {
  it('uses the buildFetchQueryBase', () => {
    const result = buildFetchQuery()

    expect(buildFetchQueryBase).toHaveBeenCalledWith({})
    expect(buildFetchQueryWithCache).not.toHaveBeenCalled()
    expect(result).toEqual('buildFetchQueryBase')
  })
})

describe('without a given cache', () => {
  it('uses the buildFetchQueryBase', () => {
    const args = { cache: null, headers: { a: 'header' } }
    const result = buildFetchQuery(args)

    expect(buildFetchQueryBase).toHaveBeenCalledWith(args)
    expect(buildFetchQueryWithCache).not.toHaveBeenCalled()
    expect(result).toEqual('buildFetchQueryBase')
  })
})

describe('with a given cache', () => {
  it('uses the buildFetchQueryWithCache', () => {
    const args = { cache: 'a cache', headers: { a: 'header' } }
    const result = buildFetchQuery(args)

    expect(buildFetchQueryWithCache).toHaveBeenCalledWith(args)
    expect(buildFetchQueryBase).not.toHaveBeenCalled()
    expect(result).toEqual('buildFetchQueryWithCache')
  })
})
