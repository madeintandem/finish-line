import React, { Component } from 'react'
import values from 'lodash.values'
import { RelayRenderer } from './RelayRenderer'
import { RelayEnvironmentProvider } from './RelayEnvironmentProvider'

export const relayRendererFactory = (environmentProvider) => {
  let currentEnvironment = environmentProvider()
  let id = 1
  const customRendererCache = {}

  const refreshRelayEnvironment = () => {
    currentEnvironment = environmentProvider()
    values(customRendererCache).forEach(callback => callback(currentEnvironment))
  }

  class CustomRelayRenderer extends Component {
    static propTypes = RelayRenderer.propTypes

    static childContextTypes = RelayEnvironmentProvider.childContextTypes

    state = {
      relayEnvironment: currentEnvironment
    }

    customRelayRendererId = id++

    getChildContext () {
      return {
        relayEnvironment: this.state.relayEnvironment,
        refreshRelayEnvironment: refreshRelayEnvironment
      }
    }

    componentWillMount () {
      customRendererCache[this.customRelayRendererId] = this.setNewEnvironment
    }

    componentWillUnmount () {
      delete customRendererCache[this.customRelayRendererId]
    }

    setNewEnvironment = (relayEnvironment) => {
      this.setState({ relayEnvironment })
    }

    render () {
      return <RelayRenderer {...this.props} />
    }
  }

  return CustomRelayRenderer
}
