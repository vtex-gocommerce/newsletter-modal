import { loggerMiddleware } from '@gocommerce/utils'
import { getNewsletterList } from './Query'
import { unsubscribe } from './Mutation'

const tokenSplunk = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export type Param = {
  [key: string]: any,
}

export const resolvers = loggerMiddleware(tokenSplunk, {
  Query: {
    getNewsletterList: async (
      _: any,
      param: Param,
      __: any,
      ___: any,
      makeApiCall: Function,
    ) => await getNewsletterList(param, makeApiCall),
  },
  Mutation: {
    unsubscribe: async (
      _: any,
      param: { [key: string]: string | null },
      __: any,
      ___: any,
      makeApiCall: Function,
    ) => await unsubscribe(param, makeApiCall),
  }
})
