import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Helmet } from 'render'
import { WithNavigate } from 'gocommerce.gc-utils'
import { Container, Input, Toggle, Button } from 'gocommerce.styleguide'
import PageHeader from './components/pageHeader'
import GetNewsletterModalConfig from './../graphql/GetNewsletterModalConfig.gql'
import SetNewsletterModalConfig from './../graphql/SetNewsletterModalConfig.gql'

const NavigateHoc = WithNavigate.HOC

interface NewsletterConfigProps {
  navigate?: Function
  intl: {
    formatMessage({ id: string }, values?: {
      [key: string]: string | number
    })
  }
  locale: string
}

@NavigateHoc()
class NewsletterConfig extends React.Component<NewsletterConfigProps, {}> {
  handleCancel = () => {
    this.props.navigate({
      to: '/admin/marketing/newsletter-modal'
    })
  }
  handleSave = (e, sendMutation) => {
    e.preventDefault();
    sendMutation({
      variables: {
        config: {
          modalTitle: '',
          modalDescription: '',
          modalTextSuccess: '',
          modalEnabled: false,
          modalShowRule: '',
          modalShowWhen: ''
        }
      }
    })
    return false
  }
  render() {
    const breadcrumbConfig = [
      { title: <FormattedMessage id="newsletter-modal.admin.newsletter" />, to: '/admin/marketing/newsletter-modal' },
      { title: <FormattedMessage id="newsletter-modal.admin.settings" /> }
    ]
    const tabsConfig = [
      { label: <FormattedMessage id="newsletter-modal.admin.general" />, id: 'general' },
      { label: <FormattedMessage id="newsletter-modal.admin.popup" />, id: 'popup' },
      { label: <FormattedMessage id="newsletter-modal.admin.apps" />, id: 'apps' }
    ]
    return (
      <div className="">
        <Helmet>
          <title>{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.page-title' })}</title>
        </Helmet>
        <PageHeader
          breadcrumbConfig={breadcrumbConfig}
          tabsConfig={tabsConfig}
          activeTab={'general'}
          handleChangeTab={() => ''}
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        />
        <div className="center g-mb8 g-ph8 g-pt14 g-mw8">
          <Query query={GetNewsletterModalConfig} ssr={false}>
            {({ loading: queryLoading, error: queryError, data }) => (
              <Mutation
                mutation={SetNewsletterModalConfig}
                update={(cache, { data }) => {
                  cache.writeQuery({
                    query: GetNewsletterModalConfig,
                    data: {
                      getNewsletterModalConfig: data.setNewsletterModalConfig,
                    },
                  })
                }}
              >
                {(
                  setNewsletterModalConfig,
                  { error: mutationError, loading: mutationLoading },
                ) => {
                  {/* const enabled = data && data.getNewsletterModalConfig && data.getNewsletterModalConfig.modalEnabled */}
                  return (
                    <form onSubmit={(e) => this.handleSave(e, setNewsletterModalConfig)}>
                      <Container isPlaceholderActive={queryLoading}>
                        <span className="db g-mb4 g-f4 c-on-base">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.general' })}</span>
                        <div className="mb4">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mb4">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mb5">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mt2">
                          <div className="dib">
                            <label className="flex items-center">
                              <Toggle value="isHuman" className="dib mr2" />
                              Label
                            </label>
                          </div>
                        </div>
                      </Container>
                      <Container isPlaceholderActive={queryLoading}>
                        <span className="db g-mb4 g-f4 c-on-base">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.general' })}</span>
                        <div className="mb4">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mb4">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mb5">
                          <Input label="Label of input" className="w-100" />
                        </div>
                        <div className="mt2">
                          <div className="dib">
                            <label className="flex items-center">
                              <Toggle value="isHuman" className="dib mr2" />
                              Label
                            </label>
                          </div>
                        </div>
                      </Container>
                      <div className={`flex justify-between items-center animated ${queryLoading ? 'o-0' : 'fadeIn'}`}>
                        <Button onClick={this.handleCancel} style="secondary">
                          {this.props.intl.formatMessage({ id: 'admin.container.cancel' })}
                        </Button>
                        <Button type="submit" style="primary">
                          {this.props.intl.formatMessage({ id: 'admin.container.save' })}
                        </Button>
                      </div>
                    </form>
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
