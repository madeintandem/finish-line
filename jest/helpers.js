/* eslint-env jest */
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'

class DeepWrapper {
  constructor (jsx) {
    this._renderer = ReactTestRenderer.create(jsx)
  }

  instance = () => {
    return this.renderer().getInstance()
  }

  renderer = () => {
    return this._renderer
  }

  toJSON = () => {
    return this.renderer().toJSON()
  }
}

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

  props = () => {
    return this.instance().props
  }

  rendered = () => {
    return this.renderer().getRenderOutput()
  }
}

const mount = (jsx) => {
  return (new DeepWrapper(jsx))
}

const shallow = (jsx) => {
  return (new ShallowWrapper(jsx))
}

export {
  mount,
  shallow
}
