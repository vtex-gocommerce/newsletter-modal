import * as React from 'react'
import NewsletterList from './newsletterList'
import { GcQuery, GcMutation } from 'gocommerce.gc-utils'

import {
  parseIntervalCollection,
  parseSortCollection,
  parseActiveSidebarFilterOptions,
  parseFilterCollection
} from './../../utils/functions'

import getNewsletterList from './graphql/getNewsletterList.gql'
import unsubscribe from './graphql/unsubscribe.gql'
import requestExportNewsletterList from './graphql/requestExportNewsletterList.gql'
import listExportedNewsletter from './graphql/listExportedNewsletter.gql'

const defaultCurrentPage: number = 1
const defaultPerPage: number = 15
const defaultSort = { field: 'updatedIn', direction: 'DESC' }

export default ({ query }) => (
  <GcMutation mutation={unsubscribe}>
    {(unsubscribe, dataUnsubcribe) => (
      <GcMutation
        mutation={requestExportNewsletterList}
        variables={{
          interval: parseIntervalCollection(
            query.page || defaultCurrentPage,
            query.perPage || defaultPerPage
          ),
          sort: parseSortCollection(query.sort) || defaultSort,
          search: query.q || '',
          filters: parseFilterCollection(parseActiveSidebarFilterOptions(query, []), [])
        }}
      >
        {(handleExport, dataExport) => (
          <GcQuery
            ssr={false}
            notifyOnNetworkStatusChange={true}
            fetchPolicy="network-only"
            errorPolicy="all"
            query={getNewsletterList}
            variables={{
              interval: parseIntervalCollection(
                query.page || defaultCurrentPage,
                query.perPage || defaultPerPage
              ),
              sort: parseSortCollection(query.sort) || defaultSort,
              search: query.q || '',
              filters: parseFilterCollection(parseActiveSidebarFilterOptions(query, []), [])
            }}
          >
            {({ data, loading, fetchMore }) => (
              <GcQuery query={listExportedNewsletter}>
                {({ data: exportedList, loading: exportedListLoading }) => (
                  <NewsletterList
                    refetchNewsletterList={fetchMore}
                    newsletterList={data.getNewsletterList}
                    isLoadingData={loading}
                    query={query}
                    unsubscribe={unsubscribe}
                    handleExport={handleExport}
                    isLoadingUnsubscribe={dataUnsubcribe.loading || dataExport.loading}
                  />
                )}
              </GcQuery>
            )}
          </GcQuery>
      )}
      </GcMutation>
    )}
  </GcMutation>
)
