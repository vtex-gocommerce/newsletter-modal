import * as React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IconDanger } from 'gocommerce.styleguide'

import FilterListPageTemplate from './../components/filterListPageTemplate'
import TableListPagination from './../components/tableListPagination'
import TableList from './../components/tableList'
import ModalUnsubscribe from './components/modalUnsubscribe'

import { tableConfig } from './config/tableConfig'
import { TemplatePage } from 'gocommerce.gc-utils'
import { type } from 'os'

interface NewsletterListProps {
  newsletterList: any
  isLoadingData: boolean
  refetchCustomersList: Function
  pageUrl: string
  query: any
  intl: Intl
  unsubscribe(options: any)
}
interface NewsletterListState {
  seletedList: any[]
  isModalUnsubscribeOpen: boolean
}

class NewsletterList extends React.PureComponent<NewsletterListProps, NewsletterListState> {
  state = {
    seletedList: [],
    isModalUnsubscribeOpen: false
  }

  handleToggleModalUnsubscribeOpen = () => {
    this.setState(prevState => ({ isModalUnsubscribeOpen: !prevState.isModalUnsubscribeOpen }))
  }

  handleChangeSeletedList = seletedList => {
    this.setState({ seletedList })
  }

  handleUnsubscribe = () => {
    const unsubscribeIds = this.state.seletedList.map(customer => {
      const currentCustomer = this.props.newsletterList.nodes.filter(current => current.email === customer.email)
      return currentCustomer[0].id
    })

    this.props.unsubscribe({
      variables: { ids: ['8ade3948-c383-4db6-a391-5e4ce54d0026', '8914e77c-1a62-484e-bd15-0e56bb0c16b2'] }
    })
    // this.props.unsubscribe({ variables: { ids: unsubscribeIds } })
  }

  renderActions = () => {
    const totalSelectedList = this.state.seletedList.length
    const isEmptySelectedList = totalSelectedList === 0
    return (
      <>
        {!isEmptySelectedList && <span className="g-mr4">{totalSelectedList} selected</span>}{' '}
        <span
          onClick={isEmptySelectedList ? null : this.handleToggleModalUnsubscribeOpen}
          className={isEmptySelectedList ? 'c-on-base-2' : 'pointer hover-c-primary inline-flex items-center'}
        >
          <IconDanger className="g-mr2" />
          Unsubscribe
        </span>
      </>
    )
  }

  render() {
    const { isLoadingData, newsletterList, refetchCustomersList, query, pageUrl } = this.props
    const { isModalUnsubscribeOpen } = this.state

    const isLoadingPage: boolean = !newsletterList

    const breadcrumbConfig = [
      {
        title: <FormattedMessage id="newsletter-modal.admin.marketing" />
      },
      { title: <FormattedMessage id={'newsletter-modal.admin.newsletter'} /> }
    ]

    const tabsConfigs = [{ id: 'default', label: <FormattedMessage id="newsletter-modal.admin.all-subscribers" /> }]
    return (
      <FilterListPageTemplate
        pageUrl={pageUrl}
        query={query}
        tabsConfig={tabsConfigs}
        refecthData={refetchCustomersList}
        toQueryStringConfig={[]}
        sidebarFilterConfig={[]}
        intl={this.props.intl}
      >
        {({
          page,
          perPage,
          sort,
          searchText,
          activeTab,
          totalFilters,
          handleChangePage,
          handleChangePerPage,
          handleChangeOrderBy,
          handleSearch,
          handleChangeTab,
          handleOpenSidebarFilter
        }) => (
          <TemplatePage>
            <TemplatePage.Header
              breadcrumbConfig={breadcrumbConfig}
              tabsConfig={tabsConfigs}
              handleChangeTab={() => {}}
            />
            <TemplatePage.Content>
              <div className="flex flex-column w-100 g-mt3">
                <TableListPagination
                  total={!isLoadingPage ? newsletterList.totalNodes : 0}
                  page={page}
                  perPage={perPage}
                  handleChangePage={handleChangePage}
                  handleChangePerPage={handleChangePerPage}
                />
                <div className="w-100 center g-mv2">
                  <TableList
                    tableConfig={tableConfig}
                    data={!isLoadingPage ? newsletterList.nodes : []}
                    sort={sort}
                    timezone="America/Sao_Paulo"
                    isLoading={isLoadingData || isLoadingPage}
                    handleChangeOrderBy={handleChangeOrderBy}
                    isFiltered={totalFilters > 0 || searchText !== ''}
                    selectable={true}
                    onChange={this.handleChangeSeletedList}
                    actions={this.renderActions()}
                  />
                </div>

                <TableListPagination
                  total={!isLoadingPage ? newsletterList.totalNodes : 0}
                  page={page}
                  perPage={perPage}
                  handleChangePage={handleChangePage}
                  handleChangePerPage={handleChangePerPage}
                />
              </div>

              <ModalUnsubscribe
                intl={this.props.intl}
                isOpen={isModalUnsubscribeOpen}
                close={this.handleToggleModalUnsubscribeOpen}
                action={this.handleUnsubscribe}
                isActionLoading={false}
              />
            </TemplatePage.Content>
          </TemplatePage>
        )}
      </FilterListPageTemplate>
    )
  }
}

export default injectIntl(NewsletterList)
