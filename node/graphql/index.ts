import { loggerMiddleware } from '@gocommerce/utils'
import { getNewsletterList, getAppData } from './Query'
import { unsubscribe, addNewsletterOmsProfile } from './Mutation'

const tokenSplunk = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export const resolvers = loggerMiddleware(tokenSplunk, {
  Query: {
    getNewsletterList: async (_, param, ctx, info, makeApiCall) => await getNewsletterList(param, makeApiCall),
    getAppData: async (_, params, ctx, info, makeApiCall) => await getAppData(ctx),
  },
  Mutation: {
    unsubscribe: async (_, param, ctx, info, makeApiCall) => await unsubscribe(param, makeApiCall),
    addNewsletterOmsProfile: (_, param, ctx, info, makeApiCall) => addNewsletterOmsProfile(param, ctx, makeApiCall),
  }
})
