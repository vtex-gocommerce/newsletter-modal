import * as React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IconBan, ListTableTemplate } from 'gocommerce.styleguide'

import ModalUnsubscribe from './components/modalUnsubscribe'
import { Notify } from 'gocommerce.styleguide'

import { tableConfig } from './config/tableConfig'
import { TemplatePage, WithNavigate } from 'gocommerce.gc-utils'

interface NewsletterListProps {
  newsletterList: any
  isLoadingData: boolean
  refetchCustomersList: Function
  query: any
  intl?: any
  isLoadingUnsubscribe: boolean
  unsubscribe(options: any)
  navigate(options: any)
}
interface NewsletterListState {
  seletedList: any[]
  isModalUnsubscribeOpen: boolean
}

@WithNavigate.HOC()
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

  render() {
    const breadcrumbConfig = [
      {
        title: <FormattedMessage id="newsletter-modal.admin.marketing" />
      },
      { title: <FormattedMessage id={'newsletter-modal.admin.newsletter'} /> }
    ]

    const tabsConfigs = [{ id: 'default', label: <FormattedMessage id="newsletter-modal.admin.all-subscribers" /> }]
    const { isLoadingData, newsletterList, query, isLoadingUnsubscribe, navigate } = this.props
    const { isModalUnsubscribeOpen } = this.state
    const isLoadingPage: boolean = !newsletterList

    return (
      <TemplatePage>
        <TemplatePage.Header
          breadcrumbConfig={breadcrumbConfig}
          tabsConfig={tabsConfigs}
          handleChangeTab={() => {}}
          activeTab={'default'}
        />
        <TemplatePage.Content>
          {({ globalNotifications }) => (
            <ListTableTemplate pageUrl="admin/newsletter/list" query={query} navigate={navigate}>
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
      </TemplatePage>
    )
  }
}

export default injectIntl(NewsletterList)
