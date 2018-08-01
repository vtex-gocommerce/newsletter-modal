import * as React from 'react'
import { Breadcrumb, Tab } from 'gocommerce.styleguide'

interface PageHeaderProps {
  tabsConfig: any[]
  activeTab: string
  handleChangeTab: Function
  breadcrumbConfig: any
}

interface PageHeaderState {}

class PageHeader extends React.PureComponent<PageHeaderProps, PageHeaderState> {
  render() {
    const { tabsConfig, activeTab, handleChangeTab, breadcrumbConfig } = this.props

    return (
      <div className="fixed right-0 w-100 z-4 top-0">
        <div className="g-ml15 bg-white bb b--base-4 g-ph8">
          <div className="flex justify-between g-pv4 items-center">
            <Breadcrumb items={breadcrumbConfig} />
          </div>
          <div className="flex justify-between">
            <Tab list={tabsConfig} initialTab={activeTab} forceValue={activeTab} onClick={handleChangeTab} />
          </div>
        </div>
      </div>
    )
  }
}

export default PageHeader
