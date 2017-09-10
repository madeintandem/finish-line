/* eslint-env jest */
import React, { Component } from 'react'
import { mount } from 'enzyme'
import { uniqueId } from 'lodash'
import { RelayEnvironmentProvider } from '../RelayEnvironmentProvider'
import { withRelayEnvironment } from '../withRelayEnvironment'

describe('provided props', () => {
  let givenProps
  let envProvider

  const Dummy = withRelayEnvironment((props) => {
    givenProps = props
    return <div />
  })

  beforeEach(() => {
    envProvider = mount(<RelayEnvironmentProvider environmentProvider={uniqueId}>
      <Dummy />
    </RelayEnvironmentProvider>)
  })

  it('is the context from the environment provider', () => {
    expect(givenProps).toEqual(envProvider.instance().getChildContext())
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
    const subject = mount(<RelayEnvironmentProvider environmentProvider={() => 1}>
      <Wrapped wrappedComponentRef={() => 'hi'} />
    </RelayEnvironmentProvider>)
    expect(subject).toMatchSnapshot()
  })
})
