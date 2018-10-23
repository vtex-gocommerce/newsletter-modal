import { biuldGraphQlError } from '@gocommerce/utils'
import axios from 'axios'

export const unsubscribe = async (param, makeApiCall) => {
  const promisesList = param.ids.map(async id => {
    const url = `/data/CL/documents/${id}`
    const data = { isNewsletterOptIn: false }

    return makeApiCall(url, 'patch', data)
  })

  const allResponses = await axios.all(promisesList)

  const responseStatus = allResponses.reduce((prev, current) => (current.status !== 204 ? 400 : prev), 204)

  return { status: responseStatus }
}

export const addNewsletterOmsProfile = async (param, ctx, makeApiCall) => {
  const errorList = []
  const { data, error } = await makeApiCall(
    `/data/CL/documents`,
    'patch',
    param.data
  )
  if(error) {
    errorList.push({ message: 'addNewsletterOmsProfile', code: error.status })
  }

  return { userErrors: errorList }
}
