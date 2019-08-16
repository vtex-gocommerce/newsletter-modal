import { loggerMiddleware } from '@gocommerce/utils'

import { getNewsletterList } from './Query'
import { unsubscribe, requestExportNewsletterList, ExportNewsletterListParam } from './Mutation'

const tokenSplunk = 'dd433cc0-9106-4b0d-883a-377d57e8eb1a'

export type Param = { [key: string]: any }
export type Context = { [key: string]: any }
export type Info = { [key: string]: any }

export const resolvers = loggerMiddleware(tokenSplunk, {
  Query: {
    getNewsletterList: async (_: any, param: Param, _ctx: any, _info: Info, makeApiCall: Function) => await getNewsletterList(param, makeApiCall),
  },
  Mutation: {
    unsubscribe: async (_: any, param: Param, _ctx: any, _info: any, makeApiCall: Function) => await unsubscribe(param, makeApiCall),
    requestExportNewsletterList: async (_: any, param: ExportNewsletterListParam, ctx: Context, _info: Info, makeApiCall: Function) => await requestExportNewsletterList(param, ctx, makeApiCall),
  },
})
