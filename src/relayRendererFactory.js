import React, { Component } from 'react'
import { commitMutation } from 'react-relay'
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

  const wrappedCommitMutation = (arg) => {
    commitMutation(currentEnvironment, arg)
  }

  class CustomRelayRenderer extends Component {
    static propTypes = RelayRenderer.propTypes

    static childContextTypes = RelayEnvironmentProvider.childContextTypes

    state = {
      environment: currentEnvironment
    }

    customRelayRendererId = id++

    getChildContext () {
      return {
        relayEnvironment: {
          commitMutation: wrappedCommitMutation,
          current: this.state.environment,
          refresh: refreshRelayEnvironment
        }
      }
    }

    componentWillMount () {
      customRendererCache.set(this.customRelayRendererId, this.setNewEnvironment)
    }

    componentWillUnmount () {
      customRendererCache.delete(this.customRelayRendererId)
    }

    setNewEnvironment = (environment) => {
      this.setState({ environment })
    }

    render () {
      return <RelayRenderer {...this.props} />
    }
  }

  return CustomRelayRenderer
}
