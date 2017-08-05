/* eslint-env mocha */

const RecursiveIterator = require('../src/RecursiveIterator')
const assert = require('assert')

describe('Actual iteration should return the object of the specified type', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }

  let iterator = new RecursiveIterator(root)
  let state = iterator.next().value

  it('it object must have "parent" property', function () {
    assert.strictEqual(state.hasOwnProperty('parent'), true)
  })
  it('it object must have "node" property', function () {
    assert.strictEqual(state.hasOwnProperty('node'), true)
  })
  it('it object must have "key" property', function () {
    assert.strictEqual(state.hasOwnProperty('key'), true)
  })
  it('it object must have "path" property', function () {
    assert.strictEqual(state.hasOwnProperty('path'), true)
  })
  it('it object must have "deep" property', function () {
    assert.strictEqual(state.hasOwnProperty('deep'), true)
  })
})
