import { Component } from 'react'
import PropTypes from 'prop-types'

export default class RelayEnvironmentProvider extends Component {
  static propTypes = {
    environmentProvider: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  }

  static childContextTypes = {
    relayEnvironment: PropTypes.any.isRequired,
    refreshRelayEnvironment: PropTypes.func.isRequired
  }

  state = {
    environment: this.props.environmentProvider()
  }

  getChildContext () {
    return {
      relayEnvironment: this.state.environment,
      refreshRelayEnvironment: this.refreshEnvironment
    }
  }

  refreshEnvironment = (callback) => {
    const environment = this.props.environmentProvider()
    this.setState({ environment }, callback)
  }

  render () {
    return this.props.children
  }
}
