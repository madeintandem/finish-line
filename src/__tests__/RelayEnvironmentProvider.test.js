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
    const create = jest.fn(() => environment)

    loadSubject({ create })

    expect(create).toHaveBeenCalled()
    expect(subject.state()).toEqual({ environment })
  })
})

describe('#relayEnvironmentProps', () => {
  let result

  beforeEach(() => {
    loadSubject({ create: uniqueId })
    result = subject.instance().relayEnvironmentProps()
  })

  it('has the current environment', () => {
    const currentEnv = subject.state().environment
    expect(currentEnv).toBeTruthy()
    expect(result.current).toEqual(currentEnv)
  })

  it('has refresh', () => {
    expect(result.refresh).toEqual(subject.instance().refresh)
  })

  it('has commitMutation', () => {
    expect(result.commitMutation).toEqual(subject.instance().commitMutation)
  })

  it('is only the current environment, refresh, and commitMutation', () => {
    expect(keys(result)).toEqual(['commitMutation', 'current', 'refresh'])
  })
})

describe('#commitMutation', () => {
  it('calls commitMutation from relay with the environment passing through other arguments', () => {
    const environment = 'some environment'
    const arg = { some: 'mutation', config: 'stuff' }
    loadSubject({ create: () => environment })
    subject.instance().commitMutation(arg)
    expect(commitMutation).toHaveBeenCalledWith(environment, arg)
  })
})

describe('#refresh', () => {
  let counter

  beforeEach(() => {
    let count = 1
    counter = jest.fn(() => count++)
    loadSubject({ create: counter })
  })

  it('sets a new environment', () => {
    expect(subject.state().environment).toEqual(1)
    subject.instance().refresh()
    expect(subject.state().environment).toEqual(2)
  })

  it('passes through arguments', () => {
    subject.instance().refresh(1, 2, 3)
    expect(counter).toHaveBeenCalledWith(1, 2, 3)
  })
})

describe('#render', () => {
  it('is the children', () => {
    loadSubject({ create: uniqueId })
    expect(subject).toMatchSnapshot()
  })
})
