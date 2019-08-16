import axios from 'axios'

import { Param } from './index'
import { Filter, parseFilterMasterData } from './Query'

export const unsubscribe = async (param: Param, makeApiCall: Function) => {
  const promisesList = param.ids.map(async (id: string) => {
    const url = `/data/CL/documents/${id}`
    const data = { isNewsletterOptIn: false }

    return makeApiCall(url, 'patch', data)
  })

  const allResponses = (await axios.all(promisesList) as {status: number}[])

  const responseStatus = allResponses.reduce((prev, current) => (current.status !== 204 ? 400 : prev), 204)

  return { status: responseStatus }
}

export interface ExportNewsletterListParam {
  filters: Array<Filter>
  recipients: string
}
export interface ExportNewsletterListResponse {
  canceled: boolean
  completedDate: string | null
  email: string
  enqueueDate: string
  finished: boolean
  id: string
  lastUpdateTime: null
  linkToDownload: null
  outputType: 'CSV' | 'XLSX' | 'JSON'
  percentageProcessed: number
  recordsSum: number
  startDate: string | null
  zipped: boolean
  lastErrorMessage: string | null
}
export const requestExportNewsletterList = async (params: ExportNewsletterListParam, context: any, makeApiCall: Function) => {
  const { filters } = params
  const { vtex: { account } } = context

  const query = parseFilterMasterData(filters)

  /** from reports api */
  const url = `http://${account}.mygocommerce.com/api/report/masterdata`
  const body = {
    mapId: 'b0d4c716-bfa0-11e9-82b1-0aa5d54792e4',
    where: `isNewsletterOptIn=true ${query}`,
    email: '',
    entityName: 'CL',
    schema: 'mdv1',
    queryAllStores: false,
    outputType: 'XLSX',
    utcTime: '03:00:00'
  }

  await makeApiCall(url, 'put', body)

  return { status: 'success' }
}