import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Helmet } from 'render'
import { WithNavigate } from 'gocommerce.gc-utils'
import { Container, Input, Select, Toggle, RadioButton, Button } from 'gocommerce.styleguide'
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
      { label: <FormattedMessage id="newsletter-modal.admin.settings.general-title" />, id: 'general' },
      { label: <FormattedMessage id="newsletter-modal.admin.settings.popup-title" />, id: 'popup' },
      { label: <FormattedMessage id="newsletter-modal.admin.settings.apps-title" />, id: 'apps' }
    ]
    const activatesSeconds = [
      { label: '1', value: '1' },
      { label: '5', value: '5' },
      { label: '10', value: '10' }
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
                        <span className="db g-mb4 g-f4 c-on-base">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.general-title' })}</span>
                        <div className="mb4">
                          <Input label={this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.input-title' })} className="w-100" />
                        </div>
                        <div className="mb4">
                          <Input label={this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.input-text' })} className="w-100" />
                        </div>
                        <div className="mb5">
                          <Input label={this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.input-success-text' })} className="w-100" />
                        </div>
                      </Container>
                      <Container isPlaceholderActive={queryLoading}>
                        <span className="db g-mb4 g-f4 c-on-base">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.popup-title' })}</span>
                        <div className="mt3">
                          <div className="dib">
                            <label className="flex items-center">
                              <Toggle value="isHuman" className="dib mr2" />
                              <span className="ml3 g-f2 serious-black">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.popup-active' })}</span>
                            </label>
                          </div>
                        </div>
                        <hr className="w-auto g-nh8 g-mv6 bw0 bg-base-3 c-on-base-3" style={{height: 1}} />
                        <span className="db g-mb4 g-f3 c-on-base">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.activates-title' })}</span>
                        <div className="mt3 flex flex-column">
                          <div className="dib mb4">
                            <div className="flex items-center">
                              <RadioButton id="settings" name="settings" value="visible" onClick={(event)=>console.log(`Value -> ${event.target.value}`)} />
                              <label className="ml3">
                                <Select list={activatesSeconds} required className="g-w12" />
                              </label>
                              <label htmlFor="settings">
                                <span className="ml3 g-f2 serious-black">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.popup-active' })}</span>
                              </label>
                            </div>
                          </div>
                          <div className="dib">
                            <label className="flex items-center">
                              <RadioButton name="settings" value="visible" onClick={(event)=>console.log(`Value -> ${event.target.value}`)} />
                              <span className="ml3 g-f2 serious-black">{this.props.intl.formatMessage({ id: 'newsletter-modal.admin.settings.popup-active' })}</span>
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
