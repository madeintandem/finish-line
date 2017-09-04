const BABEL_ENV = process.env.BABEL_ENV
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs'

const plugins = [
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-object-rest-spread'
]

if (BABEL_ENV === 'umd') {
  plugins.push('external-helpers')
}

if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-react-remove-prop-types')
}

module.exports = {
  presets: [
    [ 'es2015', {
      loose: true,
      modules: building ? false : 'commonjs'
    } ],
    'react'
  ],
  plugins: plugins
}
