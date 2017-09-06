/* eslint-env jest  */
import HelloWorld from '../HelloWorld'

describe('.sayHello', () => {
  it('says hello', () => {
    expect(HelloWorld.sayHello()).toEqual('hello')
  })
})
