import * as React from 'react'
import NewsletterList from './newsletterList'
import { RenderContextConsumer } from 'vtex.render-runtime'
import { GcQuery, GcMutation } from 'gocommerce.gc-utils'

import {
  parseIntervalCollection,
  parseSortCollection,
  parseActiveSidebarFilterOptions,
  parseFilterCollection
} from './../../utils/functions'

import getNewsletterList from './graphql/getNewsletterList.gql'
import unsubscribe from './graphql/unsubscribe.gql'

interface indexListProps {
  query: any
}

const defaultCurrentPage: number = 1
const defaultPerPage: number = 15
const defaultSort = { field: 'updatedIn', direction: 'DESC' }

class indexList extends React.PureComponent<indexListProps, {}> {
  render() {
    return (
      <RenderContextConsumer>
        {context => {
          const listSidebarFilterConfig = []
          const currentPath = context.pages[context.page].path

          return (
            <GcMutation mutation={unsubscribe}>
              {(unsubscribe, dataUnsubcribe) => (
                <GcQuery
                  ssr={false}
                  notifyOnNetworkStatusChange={true}
                  fetchPolicy="network-only"
                  errorPolicy="all"
                  query={getNewsletterList}
                  variables={{
                    interval: parseIntervalCollection(
                      this.props.query.page || defaultCurrentPage,
                      this.props.query.perPage || defaultPerPage
                    ),
                    sort: parseSortCollection(this.props.query.sort) || defaultSort,
                    search: this.props.query.q || '',
                    filters: parseFilterCollection(
                      parseActiveSidebarFilterOptions(this.props.query, listSidebarFilterConfig),
                      listSidebarFilterConfig
                    )
                  }}
                >
                  {({ data, loading, fetchMore }) => {
                    return (
                      <NewsletterList
                        refetchNewsletterList={fetchMore}
                        newsletterList={data.getNewsletterList}
                        isLoadingData={loading}
                        query={this.props.query}
                        unsubscribe={unsubscribe}
                        isLoadingUnsubscribe={dataUnsubcribe.loading}
                      />
                    )
                  }}
                </GcQuery>
              )}
            </GcMutation>
          )
        }}
      </RenderContextConsumer>
    )
  }
}

export default indexList
