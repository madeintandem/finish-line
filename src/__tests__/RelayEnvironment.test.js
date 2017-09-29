/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { RelayEnvironment } from '../RelayEnvironment'

describe('#render', () => {
  let relayEnvironment
  let children
  let subject

  beforeEach(() => {
    children = jest.fn(() => <div>rendered!</div>)
    relayEnvironment = {
      commitMutation: jest.fn(),
      current: 'something',
      refresh: jest.fn()
    }
    subject = shallow(<RelayEnvironment>
      {children}
    </RelayEnvironment>, { context: { relayEnvironment } })
  })

  it('renders the result of calling the children function with relayEnvironment from context', () => {
    expect(children).toHaveBeenCalledWith(relayEnvironment)
    expect(subject).toMatchSnapshot()
  })
})
