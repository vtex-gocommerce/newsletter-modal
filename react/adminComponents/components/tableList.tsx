import * as React from 'react'
import { Table, IconCaret, IconSearch } from 'gocommerce.styleguide'
import { FormattedMessage, injectIntl } from 'react-intl'
import { WithNavigate } from 'gocommerce.gc-utils'

const NavigateHoc = WithNavigate.HOC

interface TableListProps {
  tableConfig: any
  data: any[]
  sort: any
  isLoading: boolean
  handleChangeOrderBy: Function
  isFiltered: boolean
  intl: Intl
  currencySpec: any
  timezone: string
  navigate?: Function
  selectable: boolean
  actions: Node
  onChange: Function
}

interface TableListState {}

@NavigateHoc()
class TableList extends React.PureComponent<TableListProps, TableListState> {
  handleOnSortClick = (value: string, label: string) => {
    const direction = !this.props.sort ? 'ASC' : this.props.sort.direction === 'ASC' ? 'DESC' : 'ASC'

    return (
      <div
        onClick={() =>
          this.props.handleChangeOrderBy({
            field: value,
            direction: direction
          })
        }
        className="c-primary pointer inline-flex justify-center"
      >
        {label}{' '}
        {this.props.sort &&
          this.props.sort.field == value && (
            <IconCaret side={direction === 'DESC' ? 'up' : 'down'} className="g-ml2 g-f2" />
          )}
      </div>
    )
  }

  parseColumns = () => {
    return this.props.tableConfig.columns.map(column => {
      if (column.sort) {
        return {
          ...column,
          label: this.handleOnSortClick(column.id, column.label)
        }
      }

      return { ...column, isCentered: !!column.isCentered }
    })
  }

  hasBgColor() {
    return this.props.tableConfig.options && this.props.tableConfig.options.bgColor
  }

  hasLineLink() {
    return this.props.tableConfig.options && this.props.tableConfig.options.cellWrapperProps
  }

  parseRows = () => {
    return this.props.data.map(item => {
      const row = this.props.tableConfig.columns.reduce((row, column) => {
        return {
          ...row,
          ...{
            [column.id]: column.row(item, {
              intl: this.props.intl,
              currencySpec: this.props.currencySpec,
              timezone: this.props.timezone
            })
          }
        }
      }, {})

      if (this.hasBgColor()) {
        row.bgColor = this.props.tableConfig.options.bgColor(item)
      }

      if (this.hasLineLink()) {
        row.cellWrapperProps = this.props.tableConfig.options.cellWrapperProps(item)
      }

      return row
    })
  }

  render() {
    const { isLoading, isFiltered, selectable, actions, onChange } = this.props
    const rows = this.parseRows()
    const columns = this.parseColumns()

    return (
      <>
        <div className="g-f2">
          <Table
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            placeholderLength={rows.length || 5}
            selectable={selectable}
            actions={actions}
            onChange={onChange}
          />
        </div>
        {!isLoading &&
          rows.length === 0 && (
            <div className="tc c-on-base-2 g-f6 fw6 g-pv12 bg-on-inverted bl br bb b--base-4 br--bottom br1">
              <IconSearch width="40px" height="40px" />
              <p className="g-mv3">
                <FormattedMessage id="admin.oms.could-not-find-any-item" />
              </p>
              <p className="g-f2 normal">
                <FormattedMessage id="admin.oms.try-using-another-filter-or-searching-for-a-less-specific-term" />
              </p>
            </div>
          )}
      </>
    )
  }
}

export default injectIntl(TableList)
