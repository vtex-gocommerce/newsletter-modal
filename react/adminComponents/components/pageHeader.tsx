import * as React from 'react'
import { injectIntl } from 'react-intl'
import { Breadcrumb, Tab, Button } from 'gocommerce.styleguide'

interface PageHeaderProps {
  tabsConfig: any[]
  activeTab: string
  handleChangeTab: Function
  handleSave: Function
  handleCancel: Function
  breadcrumbConfig: any
  intl: {
    formatMessage({ id: string }, values?: {
      [key: string]: string | number
    })
  }
  locale: string
}

interface PageHeaderState {}

class PageHeader extends React.PureComponent<PageHeaderProps, PageHeaderState> {
  render() {
    const { tabsConfig, activeTab, breadcrumbConfig, handleChangeTab, handleSave, handleCancel } = this.props

    return (
      <div className="fixed right-0 w-100 z-4 top-0">
        <div className="g-ml15 bg-white bb b--base-4 g-ph8">
          <div className="flex justify-between g-pv4 items-center">
            <Breadcrumb items={breadcrumbConfig} />
            <div>
              <Button onClick={() => handleCancel()} className="g-mr2" style="secondary">
                {this.props.intl.formatMessage({ id: 'admin.container.cancel' })}
              </Button>
              <Button onClick={() => handleSave()} className="g-mr2" style="primary">
                {this.props.intl.formatMessage({ id: 'admin.container.save' })}
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <Tab list={tabsConfig} initialTab={activeTab} forceValue={activeTab} onClick={handleChangeTab} />
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(PageHeader)
