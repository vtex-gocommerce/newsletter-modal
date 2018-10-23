import * as React from 'react'
import { Search, Badge, IconFilter } from 'gocommerce.styleguide'
import { injectIntl } from 'react-intl'

interface FilterControllerProps {
  searchText: string
  activeFilterCount: number
  handleSearch: Function
  handleOpenSidebarFilter: Function
  intl: Intl
  placeholder: string
  disableSidebar: boolean
}

interface FilterControllerState {}

class FilterController extends React.Component<FilterControllerProps, FilterControllerState> {
  render() {
    const { searchText, activeFilterCount, handleSearch, handleOpenSidebarFilter, disableSidebar } = this.props
    return (
      <div className="flex justify-between">
        <div className="w-third">
          <Search placeholder={false} onClick={handleSearch} searchValue={searchText} placeholder={this.props.placeholder} className="f6" />
        </div>
        <div className="w-third g-mh8" />
        <div className="pointer self-center w-third">
          {!disableSidebar && (
            <span className="fr dib">
              {activeFilterCount === 0 ? (
                <span
                  className="db"
                  onClick={() => {
                    handleOpenSidebarFilter()
                  }}
                >
                  <IconFilter className="c-on-base-2 hover-c-primary" width="25px" height="19px" />
                </span>
              ) : (
                <Badge
                  onClick={() => {
                    handleOpenSidebarFilter()
                  }}
                  count={activeFilterCount}
                  icon={<IconFilter className="c-on-base-2 hover-c-primary" />}
                />
              )}
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default injectIntl(FilterController)
