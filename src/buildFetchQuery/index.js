import { buildFetchQueryBase } from './buildFetchQueryBase'
import { buildFetchQueryWithCache } from './buildFetchQueryWithCache'

export const buildFetchQuery = (args = {}) => {
  if (args.cache) {
    return buildFetchQueryWithCache(args)
  } else {
    return buildFetchQueryBase(args)
  }
}
