/* eslint-env jest */
import React from 'react'
import { mount, shallow } from 'enzyme'
import { RelayRenderer } from '../RelayRenderer'

jest.mock('react-relay', () => {
  const QueryRenderer = (props) => null
  return { QueryRenderer }
})

const mockContext = () => ({
  relayEnvironment: 'relay-environment'
})

describe('Basic QueryRenderer props', () => {
  it('passes the appropriate props through to the QueryRenderer', () => {
    const ContainerDummy = () => 'container'
    const ErrorDummy = () => 'error'
    const LoadingDummy = () => 'loading'
    const renderDummy = () => 'render'

    const subject = mount(<RelayRenderer
      container={ContainerDummy}
      query='query'
      variables={{ some: 'variables' }}
      loading={LoadingDummy}
      error={ErrorDummy}
      render={renderDummy}
    />, { context: mockContext() })
    expect(subject).toMatchSnapshot()
  })
})

describe('render passed to QueryRenderer', () => {
  const ContainerDummy = () => 'container'
  const ErrorDummy = () => 'error'
  const LoadingDummy = () => 'loading'
  let subject

  const callRender = (props, renderArg) => {
    subject = mount(<RelayRenderer
      query='query'
      variables={{ some: 'variables' }}
      {...props}
    />, { context: mockContext() })

    return subject.find('QueryRenderer').props().render(renderArg)
  }

  describe('render function given', () => {
    it('calls the given render with the error and props the QueryRenderer render was called with', () => {
      const aProp = 'a prop'
      const props = { some: 'prop' }
      const combinedProps = { ...props, aProp }
      const error = 'error'
      const returnValue = 'something to return'
      const mockRender = jest.fn(() => returnValue)

      const result = callRender({ render: mockRender, aProp }, { error, props })
      expect(result).toEqual(returnValue)
      expect(mockRender).toHaveBeenCalledWith({ error, props: combinedProps })
    })
  })

  describe('no render function given', () => {
    describe('on error', () => {
      it('renders null without a given error component', () => {
        const result = callRender({}, { error: 'an error' })
        expect(result).toEqual(null)
      })

      it('renders the error component when one is given', () => {
        const aProp = 'a prop'
        const error = 'some error'
        const result = callRender({ error: ErrorDummy, aProp }, { error })
        expect(result).toEqual(<ErrorDummy
          error={error}
          aProp={aProp}
          refreshRenderer={subject.instance().refreshRenderer}
        />)
      })
    })

    describe('when given props and no error', () => {
      it('renders the container with the remaining props', () => {
        const aProp = 'a prop'
        const props = { some: 'prop' }
        const result = callRender({ aProp, container: ContainerDummy }, { props })
        expect(result).toEqual(<ContainerDummy aProp={aProp} {...props} />)
      })
    })

    describe('no props and no error', () => {
      it('renders null without a given loading component', () => {
        const result = callRender({}, {})
        expect(result).toEqual(null)
      })

      it('renders the loading comopnent when one is given', () => {
        const aProp = 'a prop'
        const result = callRender({ loading: LoadingDummy, aProp }, {})
        expect(result).toEqual(<LoadingDummy aProp={aProp} />)
      })
    })
  })
})

describe('#refreshRenderer', () => {
  it('increments the queryRendererKey that is applied to the query renderer', () => {
    const subject = shallow(<RelayRenderer query='query' />, { context: mockContext() })
    expect(subject).toHaveState('queryRendererKey', 1)
    expect(subject.find('QueryRenderer').key()).toEqual('1')
    subject.instance().refreshRenderer()
    expect(subject).toHaveState('queryRendererKey', 2)
    expect(subject.find('QueryRenderer').key()).toEqual('2')
    subject.instance().refreshRenderer()
    expect(subject).toHaveState('queryRendererKey', 3)
    expect(subject.find('QueryRenderer').key()).toEqual('3')
  })
})
