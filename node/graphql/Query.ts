import { buildGraphQLError } from '@gocommerce/utils'

interface Filter { relation: string, field: string, values: string[] }

export const CollectionFilterRelationToMasterData: any = {
  EQUALS: (field: string, values: string[]) => `(${field}=${values.join('')})`,
  NOT_EQUALS: (field: string, values: string[]) => `(${field}<>${values.join('')})`,
  GREATER_THAN: (field: string, values: string[]) => `(${field}>=${values.join('')})`,
  LESS_THAN: (field: string, values: string[]) => `(${field}<=${values.join('')})`,
  BETWEEN: (field: string, values: string[]) => `(${field} between ${values[0]} and ${values[1]})`,
  IS_NULL: (field: string, _values: string[]) => `(${field} is null)`,
  IS_NOT_NULL: (field: string, _values: string[]) => `(${field} is not null)`
}

export const filterToWhere = (where: string, option: Filter) => {
  return (
    (where ? ` ${where} AND ` : ``) + CollectionFilterRelationToMasterData[option.relation](option.field, option.values)
  )
}
export const parseFilterMasterData = (filters: Array<Filter>) => {
  return filters.reduce(filterToWhere, '')
}

export const getNewsletterList = async (param: any, makeApiCall: Function) => {
  const filters = parseFilterMasterData(param.filters)

  const where = `&_where=isNewsletterOptIn=true ${filters !== '' ? `AND ${filters}` : ''}`
  const sort = param.sort ? `&_sort=${param.sort.field} ${param.sort.direction}` : ''
  const search = param.search !== '' ? `&_keyword=*${param.search}*` : ''

  const url = `/data/CL/search?_fields=_all${where}${sort}${search}`
  const rangeHeader = { 'REST-Range': `resources=${param.interval.init}-${param.interval.end}` }

  const newsletterList = await makeApiCall(url, 'get', null, rangeHeader)

  if (newsletterList.error) {
    throw buildGraphQLError('', newsletterList.error.status)
  }

  return {
    nodes: newsletterList.data,
    totalNodes: parseInt(newsletterList.headers['rest-content-range'].split('/')[1])
  }
}