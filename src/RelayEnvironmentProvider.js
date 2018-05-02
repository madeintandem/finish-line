import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { commitMutation } from 'react-relay'

const { Provider, Consumer } = React.createContext()

export const RelayEnvironment = Consumer

export class RelayEnvironmentProvider extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  }

  state = {
    environment: this.props.create()
  }

  relayEnvironmentProps = () => {
    return {
      commitMutation: this.commitMutation,
      current: this.state.environment,
      refresh: this.refresh
    }
  }

  commitMutation = (arg) => {
    commitMutation(this.state.environment, arg)
  }

  refresh = (...args) => {
    const environment = this.props.create(...args)
    this.setState({ environment })
  }

  render () {
    return <Provider value={this.relayEnvironmentProps()}>
      {this.props.children}
    </Provider>
  }
}
