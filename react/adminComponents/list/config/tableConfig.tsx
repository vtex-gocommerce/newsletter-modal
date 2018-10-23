import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormatData } from 'gocommerce.gc-utils'

export const tableConfig = {
  columns: [
    {
      sort: true,
      label: <FormattedMessage id="newsletter-modal.admin.subscription" />,
      id: 'updatedIn',
      size: 15,
      row: item => {
        return <FormatData>{({ formatDate }) => formatDate(item.createdIn, 'table-list')}</FormatData>
      }
    },
    {
      label: <FormattedMessage id="newsletter-modal.admin.name" />,
      id: 'name',
      row: item => {
        return `${item.firstName} ${item.lastName}`
      }
    },
    {
      label: <FormattedMessage id="newsletter-modal.admin.email" />,
      id: 'email',
      row: item => {
        return item.email
      }
    }
  ]
}
