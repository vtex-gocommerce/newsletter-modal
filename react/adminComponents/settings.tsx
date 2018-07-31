import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import GetConfig from './graphql/GetConfig.gql'
import SetConfig from './graphql/SetConfig.gql'

class NewsletterConfig extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Query query={GetConfig} ssr={false}>
          {({ loading: queryLoading, error: queryError, data }) => (
            <Mutation
              mutation={SetConfig}
              update={(cache, { data }) => {
                cache.writeQuery({
                  query: GetConfig,
                  data: {
                    getConfig: {
                      myCreditsEnabled: data.setConfig.myCreditsEnabled,
                      __typename: data.setConfig.__typename,
                    },
                  },
                })
              }}
            >
              {(
                setConfig,
                { error: mutationError, loading: mutationLoading },
              ) => {
                const enabled = data && data.getConfig && data.getConfig.myCreditsEnabled
                return queryError || mutationError ? (
                  <div>DEU ERRO</div>
                ) : (
                  <div>NEWSLETTER = {enabled? 'true' : 'false'}
                    <br />
                    <button onClick={() => {
                      setConfig({
                        variables: {
                          config: { myCreditsEnabled: !enabled },
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
    )
  }
}

export default NewsletterConfig
