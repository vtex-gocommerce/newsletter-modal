import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'render'
import { FormatData } from 'gocommerce.gc-utils'

export const tableConfig = {
  options: {
    cellWrapperProps: item => ({
      page: 'admin/oms/customer',
      params: { customer_id: item.userId }
    })
  },
  columns: [
    {
      cellWrapper: Link,
      sort: true,
      label: <FormattedMessage id="admin.oms.subscription" />,
      id: 'updatedIn',
      size: 15,
      row: item => {
        return <FormatData>{({ formatDate }) => formatDate(item.createdIn, 'table-list')}</FormatData>
      }
    },
    {
      label: <FormattedMessage id="admin.oms.name" />,
      id: 'name',
      row: item => {
        return `${item.firstName} ${item.lastName}`
      }
    },
    {
      label: <FormattedMessage id="admin.oms.email" />,
      id: 'email',
      row: item => {
        return item.email
      }
    }
  ]
}
