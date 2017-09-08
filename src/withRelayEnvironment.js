import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import RelayEnvironmentProvider from './RelayEnvironmentProvider'

const withRelayEnvironment = (GivenComponent) => {
  class NewComponent extends Component {
    static contextTypes = RelayEnvironmentProvider.childContextTypes

    render () {
      const { props, context } = this
      return <GivenComponent {...context} {...props} />
    }
  }

  NewComponent.displayName = `withRelayEnvironment(${GivenComponent.displayName || GivenComponent.name})`
  NewComponent.WrappedComponent = GivenComponent

  return hoistNonReactStatics(NewComponent, GivenComponent)
}

export default withRelayEnvironment
