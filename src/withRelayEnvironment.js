import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import RelayEnvironmentProvider from './RelayEnvironmentProvider'

const withRelayEnvironment = (GivenComponent) => {
  class NewComponent extends Component {
    static propTypes = {
      wrappedComponentRef: PropTypes.func
    }

    static contextTypes = RelayEnvironmentProvider.childContextTypes

    render () {
      const { props, context } = this
      const { wrappedComponentRef, ...otherProps } = props
      return <GivenComponent ref={wrappedComponentRef} {...context} {...otherProps} />
    }
  }

  NewComponent.displayName = `withRelayEnvironment(${GivenComponent.displayName || GivenComponent.name})`
  NewComponent.WrappedComponent = GivenComponent

  return hoistNonReactStatics(NewComponent, GivenComponent)
}

export default withRelayEnvironment
