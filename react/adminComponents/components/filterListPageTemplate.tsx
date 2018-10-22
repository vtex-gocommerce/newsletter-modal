import * as React from 'react'

import { WithNavigate } from 'gocommerce.gc-utils'
import { SidebarFilter } from 'gocommerce.styleguide'
import { FormattedMessage } from 'react-intl'
import {
  objectToQueryString,
  parseIntervalCollection,
  parseSortCollection,
  getSidebarFilterByOptionCode,
  parseActiveSidebarFilterOptions,
  parseFilterCollection
} from './../../utils/functions'

const NavigateHoc = WithNavigate.HOC

interface InjectedFilterListPageTemplateProps {
  intl: Intl
  page: number
  perPage: number
  sort: CollectionSortInput | null
  searchText: string
  activeTab: string
  totalFilters: number
  handleChangePage: Function
  handleChangePerPage: Function
  handleChangeOrderBy: Function
  handleSearch: Function
  handleChangeTab: Function
  handleOpenSidebarFilter: Function
}

interface FilterListPageTemplateProps {
  pageUrl: string
  query: any
  navigate?: Function
  toQueryStringConfig: any[]
  tabsConfig: any
  sidebarFilterConfig: any[]
  sortDefault?: CollectionSortInput | Sort | null
  children(props: InjectedFilterListPageTemplateProps): JSX.Element
  refecthData(
    interval: CollectionIntervalInput | null,
    sort: CollectionSortInput | NavigatorUserMediaSuccessCallback,
    search?: string | null,
    filters?: [CollectionFilterInput] | null,
    options?: any | null
  ): void
}

interface FilterListPageTemplateState {
  page: number
  perPage: number
  sort: CollectionSortInput | Sort | null
  searchText: string
  activeTab: string
  enabledSidebarFilterOptions: any[]
  showFilter: boolean
  sidebarFilterConfig: any[]
}

const defaultPage: number = 1
const defaultPerPage: number = 15
const defaultSort: CollectionSortInput = null

@NavigateHoc()
class FilterListPageTemplate extends React.PureComponent<FilterListPageTemplateProps, FilterListPageTemplateState> {
  state = {
    showFilter: false,
    page: parseInt(this.props.query.page ? this.props.query.page : defaultPage),
    perPage: parseInt(this.props.query.perPage ? this.props.query.perPage : defaultPerPage),
    sort: parseSortCollection(this.props.query.sort) || this.props.sortDefault,
    searchText: this.props.query.q || '',
    activeTab: this.props.query.activeTab ? this.props.query.activeTab : 'default',
    enabledSidebarFilterOptions: parseActiveSidebarFilterOptions(this.props.query, this.props.sidebarFilterConfig),
    sidebarFilterConfig: this.props.sidebarFilterConfig
  }

  componentDidMount() {
    const urlData = {
      page: this.props.pageUrl,
      query: objectToQueryString(this.getObjectToQuery(), this.props.toQueryStringConfig)
    }
    localStorage.setItem('filterBack', JSON.stringify(urlData))
  }

  /* Get items to query string (State + enabledSidebarFilterOptions) */
  getObjectToQuery = () => {
    let filtersQuery = this.state.enabledSidebarFilterOptions.reduce((prev, option) => {
      const filterConfig = getSidebarFilterByOptionCode(option.code, this.state.sidebarFilterConfig)

      if (!!filterConfig.multi) {
        return {
          ...prev,
          [filterConfig.nameInUrl]: prev[filterConfig.nameInUrl]
            ? option.value + ',' + prev[filterConfig.nameInUrl]
            : option.value
        }
      }

      return { ...prev, [filterConfig.nameInUrl]: option.value }
    }, {})

    return { ...this.state, ...filtersQuery }
  }

  changeUrl = () => {
    const urlData = {
      page: this.props.pageUrl,
      query: objectToQueryString(this.getObjectToQuery(), this.props.toQueryStringConfig)
    }
    localStorage.setItem('filterBack', JSON.stringify(urlData))
    this.props.navigate(urlData)
  }

  refecthData = () => {
    const interval = parseIntervalCollection(this.state.page, this.state.perPage)
    const sort = this.state.sort
    const search = this.state.searchText
    const filters = parseFilterCollection(this.state.enabledSidebarFilterOptions, this.state.sidebarFilterConfig)

    // this.props.refecthData(interval, sort, search, filters)
  }

  setStateAndRefetchData = newState => {
    this.setState(
      prevState => ({ ...prevState, ...newState }),
      () => {
        this.refecthData()
        this.changeUrl()
      }
    )
  }

  handleChangePage = (nextPage: number) => {
    this.setStateAndRefetchData({ page: nextPage })
  }

  handleChangePerPage = perPage => {
    this.setStateAndRefetchData({ page: defaultPage, perPage: parseInt(perPage) })
  }

  handleChangeOrderBy = (sort: CollectionSortInput) => {
    this.setStateAndRefetchData({ sort })
  }

  handleSearch = (value: { searchValue: string; optionValue: string }) => {
    this.setStateAndRefetchData({ searchText: value.searchValue })
  }

  handleChangeTab = (tabId: string) => {
    const tab = this.props.tabsConfig.find(tab => tab.id === tabId)

    this.setStateAndRefetchData({
      searchText: '',
      showFilter: false,
      activeTab: tabId,
      sort: defaultSort,
      page: 1,
      enabledSidebarFilterOptions: parseActiveSidebarFilterOptions(tab.query, this.state.sidebarFilterConfig)
    })
  }

  handleChangeEnabledSidebarFilterOptions = filters => {
    this.setStateAndRefetchData({ enabledSidebarFilterOptions: filters, page: 1 })
  }

  handleOpenSidebarFilter = () => {
    this.setState({ showFilter: true })
  }

  handleCloseSidebarFilter = () => {
    this.setState({ showFilter: false })
  }

  handleToggleSidebarFilterExpanded = sidebarFilterConfig => {
    this.setState({ sidebarFilterConfig })
  }

  render() {
    const renderProps = {
      page: this.state.page,
      perPage: this.state.perPage,
      sort: this.state.sort,
      searchText: this.state.searchText,
      activeTab: this.state.activeTab,
      handleChangePage: this.handleChangePage,
      handleChangePerPage: this.handleChangePerPage,
      handleChangeOrderBy: this.handleChangeOrderBy,
      handleSearch: this.handleSearch,
      handleChangeTab: this.handleChangeTab,
      handleOpenSidebarFilter: this.handleOpenSidebarFilter,
      totalFilters: this.state.enabledSidebarFilterOptions.length
    }

    const sidebarFilterLocale = {
      filters: <FormattedMessage id="admin.oms.sidebarfilter.filters" />,
      applyFilter: <FormattedMessage id="admin.oms.sidebarfilter.apply-filter" />,
      editFilters: <FormattedMessage id="admin.oms.sidebarfilter.edit-filters" />,
      appliedFilters: <FormattedMessage id="admin.oms.sidebarfilter.applied-filters" />,
      filtersConfig: {
        date: {
          dateRange: <FormattedMessage id="admin.sidebar.date-range" />,
          from: <FormattedMessage id="admin.sidebar.from" />,
          to: <FormattedMessage id="admin.sidebar.to" />
        }
      }
    }

    return (
      <>
        <div className={this.state.showFilter ? 'db' : 'dn'}>
          <SidebarFilter
            handleClose={this.handleCloseSidebarFilter}
            config={this.state.sidebarFilterConfig}
            handleToggleFilterOption={this.handleToggleSidebarFilterExpanded}
            handleChange={this.handleChangeEnabledSidebarFilterOptions}
            enabledOptions={this.state.enabledSidebarFilterOptions}
            localeConfig={sidebarFilterLocale}
            locale={this.props.intl.locale}
          />
        </div>

        {this.props.children({ ...renderProps })}
      </>
    )
  }
}

export default FilterListPageTemplate
