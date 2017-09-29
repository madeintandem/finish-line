import { Component } from 'react'
import PropTypes from 'prop-types'
import { RelayEnvironmentProvider } from './RelayEnvironmentProvider'

export class RelayEnvironment extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  static contextTypes = RelayEnvironmentProvider.childContextTypes

  render () {
    return this.props.children(this.context.relayEnvironment)
  }
}
