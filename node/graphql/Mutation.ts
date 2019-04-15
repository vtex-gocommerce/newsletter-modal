import axios from 'axios'

import { Param } from './index'

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
