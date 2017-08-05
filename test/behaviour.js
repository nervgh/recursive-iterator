/* eslint-env mocha */

const RecursiveIterator = require('../src/RecursiveIterator')
const assert = require('assert')

describe('The end of the iteration', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }

  let iterator = new RecursiveIterator(root)
  iterator.next()
  iterator.next()
  iterator.next()
  iterator.next()

  it('item.value must undefined', function () {
    assert.strictEqual(iterator.next().value, undefined)
  })
  it('item.done must true', function () {
    assert.strictEqual(iterator.next().done, true)
  })
})
