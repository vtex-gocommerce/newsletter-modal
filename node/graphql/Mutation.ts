import { biuldGraphQlError } from '@gocommerce/utils'
import axios from 'axios'

export const unsubscribe = async (param, makeApiCall) => {
  const promisesList = param.ids.map(async id => {
    const url = `/data/CL/documents/${id}?_fields=_all`
    const data = { isNewsletterOptIn: true }

    const teste = await makeApiCall(url, 'patch', data)
    // console.log('------teste-------', teste)

    return makeApiCall(url, 'patch', data)
  })

  const allResponses = await axios.all(promisesList)
  // console.log('------allResponses-------', allResponses)

  // allResponses.map(resp => console.log('------resp-------', resp.error.data))

  return { status: 200 }
}
