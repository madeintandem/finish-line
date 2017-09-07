/* eslint-env jest */
import ReactShallowRenderer from 'react-test-renderer/shallow'

class ShallowWrapper {
  constructor (jsx) {
    this._renderer = new ReactShallowRenderer()
    this.renderer().render(jsx)
  }

  instance = () => {
    return this.renderer()._instance._instance
  }

  renderer = () => {
    return this._renderer
  }

  state = () => {
    return this.instance().state
  }

  rendered = () => {
    return this.renderer().getRenderOutput()
  }
}

const shallow = (jsx) => {
  return (new ShallowWrapper(jsx))
}

export {
  shallow
}
