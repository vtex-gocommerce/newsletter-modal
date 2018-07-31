import { Apps } from '@vtex/api'

const getStoreConfig = async ctx => {
  const client = new Apps(ctx.vtex)
  return await client.getAppSettings('gocommerce.newsletter-modal')
}

const setStoreConfig = async (data, ctx) => {
  const client = new Apps(ctx.vtex)
  return await client.saveAppSettings('gocommerce.newsletter-modal', data.config)
}

export const resolvers = {
  Query: {
    getConfig: (_, data, ctx) => getStoreConfig(ctx),
  },
  Mutation: {
    setConfig: (_, data, ctx) => setStoreConfig(data, ctx),
  },
}
