/* eslint-env mocha */

const RecursiveIterator = require('../src/RecursiveIterator')
const assert = require('assert')

describe('Do not iterate over objects if it keys.length === 0', function () {
  let root = new Date()
  let queue = []

  let iterator = new RecursiveIterator(root)
  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value
    queue.push(state.parent)
    queue.push(state.node)
    queue.push(state.key)
    queue.push(state.path)
    queue.push(state.deep)
  }

  it('queue.length must be 0', function () {
    assert.strictEqual(queue.length, 0)
  })
})

describe('Iterate through array-like objects', function () {
  // This is an array-like object
  let rootOne = {
    '0': 1,
    'length': 1
  }
  let queueOne = []

  let iteratorOne = new RecursiveIterator(rootOne)
  for (let itemOne = iteratorOne.next(); !itemOne.done; itemOne = iteratorOne.next()) {
    let stateOne = itemOne.value
    queueOne.push(stateOne)
  }

  it('queue.length must be 1', function () {
    assert.strictEqual(queueOne.length, 1)
  })

  // This is not array-like object
  let rootTwo = {
    'width': 0,
    'height': 0,
    'length': 0
  }
  let queueTwo = []

  let iteratorTwo = new RecursiveIterator(rootTwo)
  for (let itemTwo = iteratorTwo.next(); !itemTwo.done; itemTwo = iteratorTwo.next()) {
    let stateTwo = itemTwo.value
    queueTwo.push(stateTwo)
  }

  it('queue.length must be 3', function () {
    assert.strictEqual(queueTwo.length, 3)
  })
})
