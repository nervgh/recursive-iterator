/* eslint-env mocha */

const RecursiveIterator = require('../src/RecursiveIterator')
const assert = require('assert')

describe('Testing of destroy() method', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }

  it('After call of iterator.destroy() item.value === undefined', function () {
    let iterator = new RecursiveIterator(root)
    iterator.next()
    assert.notStrictEqual(iterator.next().value, undefined)
    iterator.destroy()
    assert.strictEqual(iterator.next().value, undefined)
    assert.strictEqual(iterator.next().value, undefined)
  })
  it('After call of iterator.destroy() item.done === true', function () {
    let iterator = new RecursiveIterator(root)
    iterator.next()
    assert.strictEqual(iterator.next().done, false)
    iterator.destroy()
    assert.strictEqual(iterator.next().done, true)
    assert.strictEqual(iterator.next().done, true)
  })
})

describe('Testing of isNode() method', function () {
  it('Calls for each node', function () {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    }

    let isObject = function (any) {
      return any !== null && typeof any === 'object'
    }

    let iterator = new RecursiveIterator(root)
    let queue = []
    iterator.isNode = function (any) {
      queue.push(any)
      return isObject(any)
    }
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      // empty body
    }

    assert.strictEqual(queue.length, 5)
  })
  it('Use isNode() for root node', function () {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    }

    let iterator = new RecursiveIterator(root)
    let queue = []
    iterator.isNode = function (any) {
      return false
    }
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      queue.push(true)
    }

    assert.strictEqual(queue.length, 0)
  })
  it('If returns "false" node will be skipped', function () {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    }

    let iterator = new RecursiveIterator(root)
    let queue = []
    iterator.isNode = function (any) {
      return any === root
    }
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      queue.push(item)
    }

    assert.strictEqual(queue.length, 3)
  })
})

describe('Testing of isLeaf() method', function () {
  let root = {
    date: new Date(),
    object: {
      number: 1
    },
    string: 'walker'
  }

  let iterator = new RecursiveIterator(root)

  it('Leaf is all primitive types', function () {
    assert.strictEqual(iterator.isLeaf(iterator.next().value.node), false) // date
    assert.strictEqual(iterator.isLeaf(iterator.next().value.node), false) // object
    assert.strictEqual(iterator.isLeaf(iterator.next().value.node), true) // string
  })
})

describe('Testing of isCircular() method', function () {
  let root = {
    array: [],
    object: undefined,
    string: 'walker'
  }
  root.object = root

  let iterator = new RecursiveIterator(root, 0, true)

  it('isCircular() returns "true" if object is circular reference', function () {
    assert.strictEqual(iterator.isCircular(iterator.next().value.node), false)
    assert.strictEqual(iterator.isCircular(iterator.next().value.node), true)
    assert.strictEqual(iterator.isCircular(iterator.next().value.node), false)
  })
})
