import React, { Component } from 'react'
import { QueryRenderer } from 'react-relay'
import PropTypes from 'prop-types'

export class RelayRenderer extends Component {
  static propTypes = {
    container: PropTypes.any,
    error: PropTypes.any,
    loading: PropTypes.any,
    query: PropTypes.any.isRequired,
    refreshRelayEnvironment: PropTypes.any,
    render: PropTypes.func,
    variables: PropTypes.object
  }

  static contextTypes = {
    relayEnvironment: PropTypes.any.isRequired
  }

  render () {
    const {
      container: Container,
      error: ErrorComponent,
      loading: LoadingComponent,
      query,
      render,
      variables,
      ...otherProps
    } = this.props
    const { relayEnvironment } = this.context

    return <QueryRenderer
      query={query}
      environment={relayEnvironment}
      variables={variables}
      render={({ error, props }) => {
        if (render) {
          const combinedProps = { ...otherProps, ...props }
          return render({ error, props: combinedProps })
        } else if (error && ErrorComponent) {
          return <ErrorComponent error={error} {...otherProps} />
        } else if (error) {
          return null
        } else if (props) {
          return <Container {...otherProps} {...props} />
        } else if (LoadingComponent) {
          return <LoadingComponent {...otherProps} />
        } else {
          return null
        }
      }}
    />
  }
}
