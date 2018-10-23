import { biuldGraphQlError } from '@gocommerce/utils'

export const CollectionFilterRelationToMasterData = {
  EQUALS: (field, values) => `(${field}=${values.join('')})`,
  NOT_EQUALS: (field, values) => `(${field}<>${values.join('')})`,
  GREATER_THAN: (field, values) => `(${field}>=${values.join('')})`,
  LESS_THAN: (field, values) => `(${field}<=${values.join('')})`,
  BETWEEN: (field, values) => `(${field} between ${values[0]} and ${values[1]})`,
  IS_NULL: (field, values) => `(${field} is null)`,
  IS_NOT_NULL: (field, values) => `(${field} is not null)`
}

export const filterToWhere = (where, option) => {
  return (
    (where ? ` ${where} AND ` : ``) + CollectionFilterRelationToMasterData[option.relation](option.field, option.values)
  )
}
export const parseFilterMasterData = filters => {
  return filters.reduce(filterToWhere, '')
}

export const getNewsletterList = async (param, makeApiCall) => {
  const filters = parseFilterMasterData(param.filters)

  const where = `&_where=isNewsletterOptIn=true ${filters !== '' ? `AND ${filters}` : ''}`
  const sort = param.sort ? `&_sort=${param.sort.field} ${param.sort.direction}` : ''
  const search = param.search !== '' ? `&_keyword=*${param.search}*` : ''

  const url = `/data/CL/search?_fields=_all${where}${sort}${search}`
  const rangeHeader = { 'REST-Range': `resources=${param.interval.init}-${param.interval.end}` }

  const newsletterList = await makeApiCall(url, 'get', null, rangeHeader)

  if (newsletterList.error) {
    throw biuldGraphQlError('GET Customers Newsletter Faild:', newsletterList.error.response.status)
  }

  return {
    nodes: newsletterList.data,
    totalNodes: parseInt(newsletterList.headers['rest-content-range'].split('/')[1])
  }
}
