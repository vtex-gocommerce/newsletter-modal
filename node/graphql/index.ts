import { loggerMiddleware } from '@gocommerce/utils'
import { getNewsletterList } from './Query'
import { unsubscribe } from './Mutation'

const tokenSplunk = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export const resolvers = loggerMiddleware(tokenSplunk, {
  Query: {
    getNewsletterList: async (_, param, ctx, info, makeApiCall) => await getNewsletterList(param, makeApiCall)
  },
  Mutation: {
    unsubscribe: async (_, param, ctx, info, makeApiCall) => await unsubscribe(param, makeApiCall)
  }
})
