export type ApoloVarible = { [name: string]: string }
export type MutateType = { mutation: Function; variables: ApoloVarible }
export type QueryType = { query: Function; variables?: ApoloVarible }

export interface defaultCurrenceType {
  currencySymbol: string
  currencyFormatInfo: {
    currencyDecimalDigits: number
    currencyDecimalSeparator: string
    currencyGroupSeparator: string
    currencyGroupSize: number
    startsWithCurrencySymbol: boolean
  }
}

export interface ApoloClient {
  mutate({ mutation, variables }: MutateType)
  query({ query, variables }: QueryType)
}

export abstract class Operation {
  type: string = formatActionName(this.constructor.name)
}

export function assign<T>(state: T, patch: Partial<T>): T {
  return Object.assign({}, state, patch)
}

const formatActionName = (inputString: string) => {
  let formatedActionName: string = ''
  for (var i = 0; i < inputString.length; i++) {
    if (inputString[i].match(/[A-Z]/) != null) {
      formatedActionName = formatedActionName + '_'
    }
    formatedActionName = formatedActionName + inputString[i]
  }
  return formatedActionName.toUpperCase()
}

// export function parseQueryString(queryString: string) {
//   const arrayQueryString = queryString.split('&')

//   return arrayQueryString.map(item => {
//     const value = item.split('=')

//     return { [value[0]]: decodeURIComponent(value[1]) }
//   })
// }

////////////////////////////////////

export interface ConfigObjectToQueryString {
  field: string
  nameInUrl?: string
  format?: Function
  default?: string
}

export interface Sort {
  field: string
  direction: 'ASC' | 'DESC'
}
