import { ConfigObjectToQueryString, CollectionIntervalInput, CollectionSortInput, CollectionFilterInput } from './types'

export function objectToQueryString(source: object, config: ConfigObjectToQueryString[]): string {
  const fields: string[] = config
    .filter((item: ConfigObjectToQueryString): Boolean => !!source[item.field])
    .map((item: ConfigObjectToQueryString) => {
      const queryName: string = encodeURIComponent(item.nameInUrl ? item.nameInUrl : item.field)
      const queryValue: string = encodeURIComponent(item.format ? item.format(source[item.field]) : source[item.field])
      return `${queryName}=${queryValue || item.default}`
    })

  return fields.join('&')
}

export function parseIntervalCollection(page: number, perPage: number): CollectionIntervalInput {
  return {
    init: (page - 1) * perPage,
    end: page * perPage
  }
}

export function parseSortCollection(sort: string): CollectionSortInput {
  if (!sort) {
    return null
  }
  const sortValues: string[] = sort.split('|')
  return { field: sortValues[0], direction: sortValues[1] }
}

export function parseSortString(sort: string): string {
  if (!sort) {
    return ''
  }
  const sortValues: any = sort.split('|')

  return sortValues.join(' ')
}

export function parseActiveSidebarFilterOptions(query, sidebarFilterConfig) {
  let filters = sidebarFilterConfig.reduce((prev, element) => {
    if (!query.hasOwnProperty(element.nameInUrl)) return [...prev]

    let option = element.queryStringToEnabledOption(query[element.nameInUrl], element.options)

    return [...prev, ...option]
  }, [])

  return filters
}

export function getSidebarFilterByOptionCode(optionCode: string, sidebarFilterConfig: any[] = []) {
  return sidebarFilterConfig.find(filter => filter.code === optionCode.split('-')[0])
}

export function parseFilterCollection(enabledSidebarFilterOptions: any[] = [], sidebarFilterConfig: any[] = []) {
  const filters = sidebarFilterConfig.reduce((collectionFilters: [CollectionFilterInput], filter) => {
    return [
      ...collectionFilters,
      ...filter.optionToFilterCollection(
        enabledSidebarFilterOptions.filter(option => option.code.indexOf(filter.code + '-') !== -1)
      )
    ]
  }, [])

  return filters
}
