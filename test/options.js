/* eslint-env mocha */

const RecursiveIterator = require('../src/RecursiveIterator')
const assert = require('assert')

describe('Vertical bypass method (bypassMode = 0)', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }
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

  it('foo [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root)
    assert.equal(queue.shift(), root.object)
    assert.equal(queue.shift(), 'object')
    assert.equal(queue.shift().join('.'), 'object')
    assert.equal(queue.shift(), 1)
  })
  it('foo.bar [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root.object)
    assert.equal(queue.shift(), root.object.number)
    assert.equal(queue.shift(), 'number')
    assert.equal(queue.shift().join('.'), 'object.number')
    assert.equal(queue.shift(), 2)
  })
  it('foo.bar.number [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root)
    assert.equal(queue.shift(), root.string)
    assert.equal(queue.shift(), 'string')
    assert.equal(queue.shift().join('.'), 'string')
    assert.equal(queue.shift(), 1)
  })
})

describe('Horizontal bypass method (bypassMode = 1)', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }
  let queue = []

  let iterator = new RecursiveIterator(root, 1)
  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value
    queue.push(state.parent)
    queue.push(state.node)
    queue.push(state.key)
    queue.push(state.path)
    queue.push(state.deep)
  }

  it('foo [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root)
    assert.equal(queue.shift(), root.object)
    assert.equal(queue.shift(), 'object')
    assert.equal(queue.shift().join('.'), 'object')
    assert.equal(queue.shift(), 1)
  })
  it('foo.bar [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root)
    assert.equal(queue.shift(), root.string)
    assert.equal(queue.shift(), 'string')
    assert.equal(queue.shift().join('.'), 'string')
    assert.equal(queue.shift(), 1)
  })
  it('foo.string [parent, node, key, path, deep]', function () {
    assert.equal(queue.shift(), root.object)
    assert.equal(queue.shift(), root.object.number)
    assert.equal(queue.shift(), 'number')
    assert.equal(queue.shift().join('.'), 'object.number')
    assert.equal(queue.shift(), 2)
  })
})

describe('Circular references (exception)', function () {
  let root = {
    object: undefined,
    string: 'walker'
  }
  root.object = root
  let queue = []
  let error

  try {
    let iterator = new RecursiveIterator(root)
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      let state = item.value
      queue.push(state.parent)
      queue.push(state.node)
      queue.push(state.key)
      queue.push(state.path)
      queue.push(state.deep)
    }
  } catch (e) {
    error = e
  }

  it('if detected circular reference then will throw an exception', function () {
    assert.strictEqual(error instanceof Error, true)
  })
  it('if a circular reference refers to root', function () {
    assert.strictEqual(queue.length, 5)
  })
})

describe('Circular references (ignore)', function () {
  let root = {
    object: undefined,
    string: 'walker'
  }
  root.object = root
  let queue = []
  let error

  try {
    let iterator = new RecursiveIterator(root, 0, true)
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
      let state = item.value
      queue.push(state.parent)
      queue.push(state.node)
      queue.push(state.key)
      queue.push(state.path)
      queue.push(state.deep)
    }
  } catch (e) {
    error = e
  }

  it('ignoreCircular=true', function () {
    assert.strictEqual(error instanceof Error, false)
  })
  it('if a circular reference refers to root', function () {
    assert.strictEqual(queue.length, 10)
  })
})

describe('Max deep', function () {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  }
  let queue = []

  let iterator = new RecursiveIterator(root, 0, false, 1)
  for (let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value
    queue.push(state.parent)
    queue.push(state.node)
    queue.push(state.key)
    queue.push(state.path)
    queue.push(state.deep)
  }

  it('maxDeep=1', function () {
    assert.strictEqual(queue.length, 10)
  })
})
