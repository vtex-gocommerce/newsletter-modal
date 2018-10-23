import * as React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IconDanger } from 'gocommerce.styleguide'

import FilterListPageTemplate from './../components/filterListPageTemplate'
import TableListPagination from './../components/tableListPagination'
import TableList from './../components/tableList'
import FilterController from './../components/filterController'
import ModalUnsubscribe from './components/modalUnsubscribe'
import { Notify } from 'gocommerce.styleguide'

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
  isLoadingUnsubscribe: boolean
  unsubscribe(options: any)
}
interface NewsletterListState {
  seletedList: any[]
  isModalUnsubscribeOpen: boolean
}

class NewsletterList extends React.PureComponent<NewsletterListProps, NewsletterListState> {
  state = {
    seletedList: [],
    isModalUnsubscribeOpen: false,
    toQueryStringConfig: [
      { field: 'date' },
      { field: 'newsletter' },
      { field: 'activeTab' },
      { field: 'searchText', nameInUrl: 'q' },
      { field: 'page', nameInUrl: 'page' },
      { field: 'perPage', nameInUrl: 'perPage' },
      {
        field: 'sort',
        nameInUrl: 'sort',
        format: sort => `${sort.field}|${sort.direction}`
      }
    ]
  }

  handleToggleModalUnsubscribeOpen = () => {
    this.setState(prevState => ({ isModalUnsubscribeOpen: !prevState.isModalUnsubscribeOpen }))
  }

  handleChangeSeletedList = seletedList => {
    this.setState({ seletedList })
  }

  handleUnsubscribe = globalNotifications => {
    return () => {
      const unsubscribeIds = this.state.seletedList.map(customer => {
        const currentCustomer = this.props.newsletterList.nodes.filter(current => current.email === customer.email)
        return currentCustomer[0].id
      })

      this.props.unsubscribe({ variables: { ids: unsubscribeIds } }).then(({ data }) => {
        data.unsubscribe.status === '204'
          ? Notify.show(this.props.intl.formatMessage({ id: `newsletter-modal.admin.general-success-message` }), {
              position: 'top-right',
              type: 'success'
            })
          : globalNotifications.openAlert(
              this.props.intl.formatMessage({
                id: `newsletter-modal.admin.general-error-message`
              }),
              'error',
              true
            )

        this.handleToggleModalUnsubscribeOpen()
      })
    }
  }

  renderActions = () => {
    const totalSelectedList = this.state.seletedList.length
    const isEmptySelectedList = totalSelectedList === 0
    return (
      <>
        {!isEmptySelectedList && (
          <span className="g-mr4">
            {totalSelectedList} <FormattedMessage id="newsletter-modal.admin.selected" />
          </span>
        )}{' '}
        <span
          onClick={isEmptySelectedList ? null : this.handleToggleModalUnsubscribeOpen}
          className={isEmptySelectedList ? 'c-on-base-2' : 'pointer hover-c-primary inline-flex items-center'}
        >
          <IconDanger className="g-mr2" />
          <FormattedMessage id="newsletter-modal.admin.unsubscribe" />
        </span>
      </>
    )
  }

  render() {
    const { isLoadingData, newsletterList, refetchCustomersList, query, pageUrl, isLoadingUnsubscribe } = this.props
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
        toQueryStringConfig={this.state.toQueryStringConfig}
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
              activeTab={activeTab}
            />
            <TemplatePage.Content>
              {({ globalNotifications }) => (
                <>
                  <FilterController
                    disableSidebar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    placeholder={this.props.intl.formatMessage({
                      id: 'admin.oms.customers-search-by'
                    })}
                    isLoading={isLoadingData && (totalFilters > 0 || searchText !== '')}
                  />

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
                    action={this.handleUnsubscribe(globalNotifications)}
                    isActionLoading={isLoadingUnsubscribe}
                  />
                </>
              )}
            </TemplatePage.Content>
          </TemplatePage>
        )}
      </FilterListPageTemplate>
    )
  }
}

export default injectIntl(NewsletterList)
