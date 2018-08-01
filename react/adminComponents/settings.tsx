import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Helmet } from 'render'
import PageHeader from './components/pageHeader'
import GetNewsletterModalConfig from './../graphql/GetNewsletterModalConfig.gql'
import SetNewsletterModalConfig from './../graphql/SetNewsletterModalConfig.gql'

interface NewsletterConfigProps {
  intl: {
    formatMessage({ id: string }, values?: {
      [key: string]: string | number
    })
  }
  locale: string
}

class NewsletterConfig extends React.Component<NewsletterConfigProps, {}> {
  render() {
    const breadcrumbConfig = [
      { title: <FormattedMessage id="newsletter-modal.admin.newsletter" />, to: 'admin/marketing/newsletter-modal' },
      { title: <FormattedMessage id="newsletter-modal.admin.settings" /> }
    ]
    const tabsConfig = [
      { label: <FormattedMessage id="newsletter-modal.admin.general" />, id: 'general' },
      { label: <FormattedMessage id="newsletter-modal.admin.popup" />, id: 'popup' },
      { label: <FormattedMessage id="newsletter-modal.admin.apps" />, id: 'apps' }
    ]
    return (
      <div className="min-h-100">
        <Helmet>
          <title>{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.page-title' })}</title>
        </Helmet>
        <PageHeader
          breadcrumbConfig={breadcrumbConfig}
          tabsConfig={tabsConfig}
          activeTab={'general'}
          handleChangeTab={() => ''}
        />
        <div className="g-mh8 g-mb8 g-mt14 g-pt8">
          <Query query={GetNewsletterModalConfig} ssr={false}>
            {({ loading: queryLoading, error: queryError, data }) => (
              <Mutation
                mutation={SetNewsletterModalConfig}
                update={(cache, { data }) => {
                  cache.writeQuery({
                    query: GetNewsletterModalConfig,
                    data: {
                      getNewsletterModalConfig: {
                        modalEnabled: data.setNewsletterModalConfig.modalEnabled,
                        __typename: data.setNewsletterModalConfig.__typename,
                      },
                    },
                  })
                }}
              >
                {(
                  setNewsletterModalConfig,
                  { error: mutationError, loading: mutationLoading },
                ) => {
                  const enabled = data && data.getNewsletterModalConfig && data.getNewsletterModalConfig.modalEnabled
                  return queryError || mutationError ? (
                    <div>DEU ERRO</div>
                  ) : (
                    <div>NEWSLETTER = {enabled ? 'true' : 'false'}
                      <br />
                      <button onClick={() => {
                        setNewsletterModalConfig({
                          variables: {
                            config: {
                              modalTitle: '',
                              modalDescription: '',
                              modalTextSuccess: '',
                              modalEnabled: !enabled,
                              modalShowRule: '',
                              modalShowWhen: '',
                            },
                          },
                        })
                      }}>CHANGE!</button>
                    </div>
                  )
                }}
              </Mutation>
            )}
          </Query>
        </div>
      </div>
    )
  }
}

export default injectIntl(NewsletterConfig)
