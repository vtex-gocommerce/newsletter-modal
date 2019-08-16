import * as React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IconBan, ListTableTemplate, Button } from 'gocommerce.styleguide'

import ModalUnsubscribe from './components/modalUnsubscribe'
import { Notify, EmptyContent } from 'gocommerce.styleguide'

import { tableConfig } from './config/tableConfig'
import { TemplatePage, WithNavigate } from 'gocommerce.gc-utils'

import EmptyImage from '../../assets/images/newsletter-empty-list.svg'

import { hasQueryApplied } from '../../utils/functions'

interface NewsletterListProps {
  newsletterList: any
  isLoadingData: boolean
  refetchCustomersList: Function
  query: any
  intl?: any
  isLoadingUnsubscribe: boolean
  unsubscribe: (options: any) => Promise<any>
  handleExport: () => Promise<any>
  navigate: any 
}
interface NewsletterListState {
  seletedList: any[]
  isModalUnsubscribeOpen: boolean
}

class NewsletterList extends React.PureComponent<NewsletterListProps, NewsletterListState> {
  state = {
    seletedList: [],
    isModalUnsubscribeOpen: false,
    toQueryStringConfig: []
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
      <div className="inline-flex items-center">
        {!isEmptySelectedList && (
          <span className="g-mr4">
            {totalSelectedList} <FormattedMessage id="newsletter-modal.admin.selected" />
          </span>
        )}{' '}
        <span
          onClick={isEmptySelectedList ? null : this.handleToggleModalUnsubscribeOpen}
          className={isEmptySelectedList ? 'c-on-base-2' : 'pointer hover-c-primary inline-flex items-center'}
        >
          <IconBan className="g-mr2" />
          <FormattedMessage id="newsletter-modal.admin.unsubscribe" />
        </span>
      </div>
    )
  }

  renderListTable = (isLoadingPage: boolean) => {
    const { isLoadingData, newsletterList, query, isLoadingUnsubscribe, navigate, intl } = this.props
    const { isModalUnsubscribeOpen } = this.state

    if (!isLoadingPage && !newsletterList.nodes.length && !hasQueryApplied(query)) {
      return (
        <EmptyContent
          title={intl.formatMessage({ id: 'newsletter-modal.admin.empty-list.title' })}
          description={intl.formatMessage({ id: 'newsletter-modal.admin.empty-list.description' })}
          image={EmptyImage}
        />
      )
    }

    return (
      <TemplatePage.Content>
        {({ globalNotifications }) => (
          <ListTableTemplate pageUrl="admin.marketing.newsletter.list" query={query} navigate={navigate}>
            <ListTableTemplate.Filter
              isLoading={isLoadingData}
              placeholder={this.props.intl.formatMessage({
                id: 'newsletter-modal.admin.search-by'
              })}
            />
            <div className="flex flex-column w-100 g-mt3">
              <ListTableTemplate.Pagination total={!isLoadingPage ? newsletterList.totalNodes : 0} />
              <div className="w-100 center g-mv2">
                <ListTableTemplate.Table
                  tableConfig={tableConfig}
                  data={!isLoadingPage ? newsletterList.nodes : []}
                  isLoading={isLoadingData || isLoadingPage}
                  onChange={this.handleChangeSeletedList}
                  selectable={true}
                  actions={this.renderActions()}
                />
              </div>
              <ListTableTemplate.Pagination total={!isLoadingPage ? newsletterList.totalNodes : 0} />
            </div>
            <ModalUnsubscribe
              intl={this.props.intl}
              isOpen={isModalUnsubscribeOpen}
              close={this.handleToggleModalUnsubscribeOpen}
              action={this.handleUnsubscribe(globalNotifications)}
              isActionLoading={isLoadingUnsubscribe}
            />
          </ListTableTemplate>
        )}
      </TemplatePage.Content>
    )
  }

  render() {
    const { newsletterList, handleExport } = this.props
    const isLoadingPage: boolean = !newsletterList

    const breadcrumbConfig = [
      {
        title: <FormattedMessage id="newsletter-modal.admin.marketing" />
      },
      { title: <FormattedMessage id={'newsletter-modal.admin.newsletter'} /> }
    ]

    const tabsConfigs = !isLoadingPage && newsletterList.nodes.length 
      ? [{ id: 'default', label: <FormattedMessage id="newsletter-modal.admin.all-subscribers" /> }] 
      : null

    return (
      <TemplatePage title={this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.page-title' })}>
        <TemplatePage.Header
          breadcrumbConfig={breadcrumbConfig}
          tabsConfig={tabsConfigs}
          handleChangeTab={() => {}}
          activeTab={'default'}
          buttons={
            <div>
              <Button style="secondary"
                onClick={() => handleExport() }
                disabled={false}
              >
                Export
              </Button>
            </div>
          }
        />

        {this.renderListTable(isLoadingPage)}
      </TemplatePage>
    )
  }
}

export default WithNavigate.HOC()(injectIntl(NewsletterList))
