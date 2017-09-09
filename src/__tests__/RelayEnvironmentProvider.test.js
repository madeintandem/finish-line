/* eslint-env jest */
import React from 'react'
import { RelayEnvironmentProvider } from '../RelayEnvironmentProvider'
import { shallow } from 'helpers'
import { keys, uniqueId } from 'lodash'

let subject

beforeEach(() => {
  subject = null
})

const loadSubject = (props) => {
  subject = shallow(<RelayEnvironmentProvider {...props}>
    <div id='some-child' />
  </RelayEnvironmentProvider>)
}

describe('default state', () => {
  it('has an environment from the environment provider', () => {
    const environment = 'env stub'
    const environmentProvider = jest.fn(() => environment)

    loadSubject({ environmentProvider })

    expect(environmentProvider).toHaveBeenCalled()
    expect(subject.state()).toEqual({ environment })
  })
})

describe('#getChildContext', () => {
  let result

  beforeEach(() => {
    loadSubject({ environmentProvider: uniqueId })
    result = subject.instance().getChildContext()
  })

  it('has the current environment', () => {
    const currentEnv = subject.state().environment
    expect(currentEnv).toBeTruthy()
    expect(result.relayEnvironment).toEqual(currentEnv)
  })

  it('has the refreshRelayEnvironment', () => {
    expect(result.refreshRelayEnvironment).toEqual(subject.instance().refreshEnvironment)
  })

  it('is only the environment and refreshRelayEnvironment', () => {
    expect(keys(result)).toEqual(['relayEnvironment', 'refreshRelayEnvironment'])
  })
})

describe('#refreshEnvironment', () => {
  let count

  beforeEach(() => {
    count = 1
    const counter = () => count++
    loadSubject({ environmentProvider: counter })
  })

  it('sets a new environment', () => {
    expect(subject.state().environment).toEqual(1)
    subject.instance().refreshEnvironment()
    expect(subject.state().environment).toEqual(2)
  })

  it('passes through the callback to set state', () => {
    const callback = jest.fn()
    subject.instance().refreshEnvironment(callback)
    expect(callback).toHaveBeenCalled()
  })
})

describe('#render', () => {
  it('is the children', () => {
    loadSubject({ environmentProvider: uniqueId })
    expect(subject.rendered()).toEqual(<div id='some-child' />)
  })
})
