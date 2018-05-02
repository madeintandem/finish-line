/* eslint-env jest */
import React, { Component } from 'react'
import { mount } from 'enzyme'
import { withRelayEnvironment } from '../withRelayEnvironment'

jest.mock('../RelayEnvironmentProvider', () => {
  const RelayEnvironment = ({ children }) => children({ mocked: 'env' })

  return {
    RelayEnvironment
  }
})

describe('provided props', () => {
  let givenProps

  const Dummy = withRelayEnvironment((props) => {
    givenProps = props
    return <div />
  })

  beforeEach(() => {
    mount(<Dummy />)
  })

  it('is the context from the environment provider', () => {
    expect(givenProps).toEqual({ relayEnvironment: { mocked: 'env' } })
  })
})

describe('displayName', () => {
  it('is the existing display name wrapped', () => {
    const component = () => null
    component.displayName = 'display-name'
    const wrapped = withRelayEnvironment(component)
    expect(wrapped.displayName).toEqual(`withRelayEnvironment(${component.displayName})`)
  })

  it('is the name wrapped if there is no existing display name', () => {
    const component = () => null
    component.displayName = null
    const wrapped = withRelayEnvironment(component)
    expect(wrapped.displayName).toEqual(`withRelayEnvironment(${component.name})`)
  })
})

describe('statics', () => {
  it('hoists the statics', () => {
    const Dummy = () => null
    Dummy.foo = 'foo'
    Dummy.bar = () => 'bar'
    const wrapped = withRelayEnvironment(Dummy)
    expect(wrapped.foo).toEqual(Dummy.foo)
    expect(wrapped.bar).toEqual(Dummy.bar)
  })
})

describe('WrappedComponent', () => {
  it('is the wrapped component', () => {
    const Dummy = () => null
    const wrapped = withRelayEnvironment(Dummy)
    expect(wrapped.WrappedComponent).toEqual(Dummy)
  })
})

describe('wrappedComponentRef', () => {
  it('does not pass the wrapped component ref to the wrapped component', () => {
    class Dummy extends Component {
      render () { return null }
    }
    const Wrapped = withRelayEnvironment(Dummy)
    const subject = mount(<Wrapped wrappedComponentRef={() => 'hi'} foo='bar' />)
    expect(subject).toMatchSnapshot()
  })
})
