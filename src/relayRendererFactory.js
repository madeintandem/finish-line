import React, { Component } from 'react'
import { RelayRenderer } from './RelayRenderer'
import { RelayEnvironmentProvider } from './RelayEnvironmentProvider'

export const relayRendererFactory = (environmentProvider) => {
  let currentEnvironment = environmentProvider()
  let id = 1
  const customRendererCache = new Map()

  const refreshRelayEnvironment = () => {
    currentEnvironment = environmentProvider()
    customRendererCache.forEach((callback, _key) => callback(currentEnvironment))
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
      customRendererCache.set(this.customRelayRendererId, this.setNewEnvironment)
    }

    componentWillUnmount () {
      customRendererCache.delete(this.customRelayRendererId)
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
