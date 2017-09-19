import { Component } from 'react'
import PropTypes from 'prop-types'
import { commitMutation } from 'react-relay'

export class RelayEnvironmentProvider extends Component {
  static propTypes = {
    environmentProvider: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  }

  static childContextTypes = {
    relayEnvironment: PropTypes.shape({
      commitMutation: PropTypes.func.isRequired,
      current: PropTypes.any.isRequired,
      refresh: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    environment: this.props.environmentProvider()
  }

  getChildContext () {
    return {
      relayEnvironment: {
        commitMutation: this.commitMutation,
        current: this.state.environment,
        refresh: this.refresh
      }
    }
  }

  commitMutation = (arg) => {
    commitMutation(this.state.environment, arg)
  }

  refresh = (callback) => {
    const environment = this.props.environmentProvider()
    this.setState({ environment }, callback)
  }

  render () {
    return this.props.children
  }
}
