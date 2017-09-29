import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { RelayEnvironment } from './RelayEnvironment'

export const withRelayEnvironment = (GivenComponent) => {
  class NewComponent extends Component {
    static propTypes = {
      wrappedComponentRef: PropTypes.func
    }

    render () {
      const { wrappedComponentRef, ...otherProps } = this.props

      return <RelayEnvironment>
        {relayEnvironment =>
          <GivenComponent ref={wrappedComponentRef} relayEnvironment={relayEnvironment} {...otherProps} />
        }
      </RelayEnvironment>
    }
  }

  NewComponent.displayName = `withRelayEnvironment(${GivenComponent.displayName || GivenComponent.name})`
  NewComponent.WrappedComponent = GivenComponent

  return hoistNonReactStatics(NewComponent, GivenComponent)
}
