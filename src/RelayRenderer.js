import React, { Component } from 'react'
import { QueryRenderer } from 'react-relay'
import PropTypes from 'prop-types'
import { warn } from './warn'
import { RelayEnvironment } from './RelayEnvironmentProvider'

export class RelayRenderer extends Component {
  static propTypes = {
    container: PropTypes.any,
    error: PropTypes.any,
    loading: PropTypes.any,
    query: PropTypes.any.isRequired,
    render: PropTypes.func,
    variables: PropTypes.object
  }

  state = {
    childKey: 1
  }

  componentWillMount () {
    const { render, container, error, loading } = this.props

    warn(
      !!(render && (container || error || loading)),
      'RelayRenderer was rendered with a `render` prop and `container`, `error`, and/or `loading` props as well. Passing `render` causes those other props to have no affect.'
    )
  }

  refreshRenderer = () => {
    this.setState({ childKey: this.state.childKey + 1 })
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

    return <RelayEnvironment key={this.state.childKey}>
      {(relayEnvironment) => (
        <QueryRenderer
          query={query}
          environment={relayEnvironment.current}
          variables={variables}
          render={({ error, props }) => {
            if (render) {
              const combinedProps = { ...otherProps, ...props }
              return render({ error, props: combinedProps })
            } else if (error && ErrorComponent) {
              return <ErrorComponent error={error} refreshRenderer={this.refreshRenderer} {...otherProps} />
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
      )}
    </RelayEnvironment>
  }
}
