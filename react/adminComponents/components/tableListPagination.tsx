import * as React from 'react'
import { Select, Pagination as PaginationStyleguide } from 'gocommerce.styleguide'
import { FormattedMessage, injectIntl } from 'react-intl'

interface TableListPaginationProps {
  total: number
  page: number
  perPage: number
  handleChangePerPage: Function
  handleChangePage: Function
  intl: Intl
}

interface TableListPaginationState {}

class TableListPagination extends React.PureComponent<TableListPaginationProps, TableListPaginationState> {
  handleChangePerPage = e => this.props.handleChangePerPage(e.target.value)
  render() {
    const { total, page, perPage, handleChangePerPage, handleChangePage, intl } = this.props

    const viewPageOptions: Array<{ label: any; value: number }> = [
      { label: intl.formatMessage({ id: 'admin.oms.view-15' }), value: 15 },
      { label: intl.formatMessage({ id: 'admin.oms.view-50' }), value: 50 },
      { label: intl.formatMessage({ id: 'admin.oms.view-100' }), value: 100 }
    ]

    return (
      <div className="flex justify-between items-center c-on-base-2 g-f2">
        <span>
          <FormattedMessage id="admin.oms.showing" /> {total} <FormattedMessage id="admin.oms.records" />
        </span>
        <div className="flex justify-end flex-auto">
          <div className="pointer justify-end ">
            <Select
              elementClassName="tracked-tight zeitungMicroPro pointer hover-c-primary"
              list={viewPageOptions}
              required
              placeholder={false}
              value={perPage}
              onChange={this.handleChangePerPage}
              withoutStyle
            />
          </div>

          <div className="flex items-center g-ml3 justify-end relative z-3 g-w14">
            <PaginationStyleguide
              currentPage={page}
              pageCount={Math.ceil(total / perPage || 1)}
              onPageChange={handleChangePage}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(TableListPagination)
