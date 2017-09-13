import { Component } from 'react'
import PropTypes from 'prop-types'
import { commitMutation } from 'react-relay'

export class RelayEnvironmentProvider extends Component {
  static propTypes = {
    environmentProvider: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  }

  static childContextTypes = {
    commitMutation: PropTypes.func.isRequired,
    relayEnvironment: PropTypes.any.isRequired,
    refreshRelayEnvironment: PropTypes.func.isRequired
  }

  state = {
    environment: this.props.environmentProvider()
  }

  getChildContext () {
    return {
      commitMutation: this.commitMutation,
      relayEnvironment: this.state.environment,
      refreshRelayEnvironment: this.refreshEnvironment
    }
  }

  commitMutation = (arg) => {
    commitMutation(this.state.environment, arg)
  }

  refreshEnvironment = (callback) => {
    const environment = this.props.environmentProvider()
    this.setState({ environment }, callback)
  }

  render () {
    return this.props.children
  }
}
