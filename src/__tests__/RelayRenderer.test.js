/* eslint-env jest */
import React from 'react'
import { mount, shallow } from 'enzyme'
import { RelayRenderer } from '../RelayRenderer'
import { warn } from '../warn'

jest.mock('react-relay', () => {
  const QueryRenderer = (props) => null
  return { QueryRenderer }
})

jest.mock('../warn', () => {
  const warn = jest.fn()
  return { warn }
})

jest.mock('../RelayEnvironmentProvider', () => {
  const RelayEnvironment = ({ children }) => children({
    commitMutation: jest.fn(),
    current: 'relay-environment',
    refresh: jest.fn()
  })

  return {
    RelayEnvironment
  }
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
    />)
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
    />)

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
  it('increments the childKey that is applied to the direct descendant', () => {
    const subject = shallow(<RelayRenderer query='query' />)
    expect(subject).toHaveState('childKey', 1)
    subject.instance().refreshRenderer()
    expect(subject).toHaveState('childKey', 2)
    subject.instance().refreshRenderer()
    expect(subject).toHaveState('childKey', 3)
  })
})

describe('#componentWillMount', () => {
  describe('given render and any prop that is ignored by render', () => {
    it('logs a warning', () => {
      shallow(<RelayRenderer
        query='query'
        render={() => null}
        container={() => null}
      />)
      expect(warn).toHaveBeenCalledWith(true, 'RelayRenderer was rendered with a `render` prop and `container`, `error`, and/or `loading` props as well. Passing `render` causes those other props to have no affect.')
    })
  })

  describe('given render without props that are ignored by render', () => {
    it('does not log a warning', () => {
      shallow(<RelayRenderer
        query='query'
        render={() => null}
      />)
      expect(warn).toHaveBeenCalledWith(false, expect.anything())
    })
  })

  describe('not given render', () => {
    it('does not log a warning', () => {
      shallow(<RelayRenderer
        query='query'
        container={() => null}
      />)
      expect(warn).toHaveBeenCalledWith(false, expect.anything())
    })
  })
})
