/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { keys, uniqueId } from 'lodash'
import { commitMutation } from 'react-relay'
import { RelayEnvironmentProvider } from '../RelayEnvironmentProvider'

jest.mock('react-relay', () => {
  const commitMutation = jest.fn()
  return { commitMutation }
})

let subject

beforeEach(() => {
  subject = null
})

const Dummy = () => null

const loadSubject = (props) => {
  subject = shallow(<RelayEnvironmentProvider {...props}>
    <Dummy />
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

  it('has commitMutation', () => {
    expect(result.commitMutation).toEqual(subject.instance().commitMutation)
  })

  it('is only the environment, refreshRelayEnvironment, and commitMutation', () => {
    expect(keys(result)).toEqual(['commitMutation', 'relayEnvironment', 'refreshRelayEnvironment'])
  })
})

describe('#commitMutation', () => {
  it('calls commitMutation from relay with the environment passing through other arguments', () => {
    const environment = 'some environment'
    const arg = { some: 'mutation', config: 'stuff' }
    loadSubject({ environmentProvider: () => environment })
    subject.instance().commitMutation(arg)
    expect(commitMutation).toHaveBeenCalledWith(environment, arg)
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
    expect(subject.instance().render()).toEqual(<Dummy />)
  })
})
