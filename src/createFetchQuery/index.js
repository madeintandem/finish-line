import { createFetchQueryBase } from './createFetchQueryBase'
import { createFetchQueryWithCache } from './createFetchQueryWithCache'

export const createFetchQuery = (args = {}) => {
  if (args.cache) {
    return createFetchQueryWithCache(args)
  } else {
    return createFetchQueryBase(args)
  }
}
