
const RecursiveIterator = require('../src/RecursiveIterator');
const {expect} = require('chai');

describe('Vertical bypass method (bypassMode = 0)', function() {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  };
  let queue = [];

  let iterator = new RecursiveIterator(root);
  for(let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value;
    queue.push(state.parent);
    queue.push(state.node);
    queue.push(state.key);
    queue.push(state.path);
    queue.push(state.deep);
  }

  it('foo [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root);
    expect(queue.shift()).to.equal(root.object);
    expect(queue.shift()).to.equal('object');
    expect(queue.shift().join('.')).to.equal('object');
    expect(queue.shift()).to.equal(1);
  });
  it('foo.bar [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root.object);
    expect(queue.shift()).to.equal(root.object.number);
    expect(queue.shift()).to.equal('number');
    expect(queue.shift().join('.')).to.equal('object.number');
    expect(queue.shift()).to.equal(2);
  });
  it('foo.bar.number [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root);
    expect(queue.shift()).to.equal(root.string);
    expect(queue.shift()).to.equal('string');
    expect(queue.shift().join('.')).to.equal('string');
    expect(queue.shift()).to.equal(1);
  });
});


describe('Horizontal bypass method (bypassMode = 1)', function() {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  };
  let queue = [];

  let iterator = new RecursiveIterator(root, 1);
  for(let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value;
    queue.push(state.parent);
    queue.push(state.node);
    queue.push(state.key);
    queue.push(state.path);
    queue.push(state.deep);
  }

  it('foo [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root);
    expect(queue.shift()).to.equal(root.object);
    expect(queue.shift()).to.equal('object');
    expect(queue.shift().join('.')).to.equal('object');
    expect(queue.shift()).to.equal(1);
  });
  it('foo.bar [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root);
    expect(queue.shift()).to.equal(root.string);
    expect(queue.shift()).to.equal('string');
    expect(queue.shift().join('.')).to.equal('string');
    expect(queue.shift()).to.equal(1);
  });
  it('foo.string [parent, node, key, path, deep]', function() {
    expect(queue.shift()).to.equal(root.object);
    expect(queue.shift()).to.equal(root.object.number);
    expect(queue.shift()).to.equal('number');
    expect(queue.shift().join('.')).to.equal('object.number');
    expect(queue.shift()).to.equal(2);
  });
});


describe('Circular references (exception)', function() {
  let root = {
    object: undefined,
    string: 'walker'
  };
  root.object = root;
  let queue = [];
  let error;

  try {
    let iterator = new RecursiveIterator(root);
    for(let item = iterator.next(); !item.done; item = iterator.next()) {
      let state = item.value;
      queue.push(state.parent);
      queue.push(state.node);
      queue.push(state.key);
      queue.push(state.path);
      queue.push(state.deep);
    }
  } catch (e) {
    error = e;
  }

  it('if detected circular reference then will throw an exception', function() {
    expect(error instanceof Error).to.equal(true);
  });
  it('if a circular reference refers to root', function() {
    expect(queue.length).to.equal(5);
  });
});


describe('Circular references (ignore)', function() {
  let root = {
    object: undefined,
    string: 'walker'
  };
  root.object = root;
  let queue = [];
  let error;

  try {
    let iterator = new RecursiveIterator(root, 0, true);
    for(let item = iterator.next(); !item.done; item = iterator.next()) {
      let state = item.value;
      queue.push(state.parent);
      queue.push(state.node);
      queue.push(state.key);
      queue.push(state.path);
      queue.push(state.deep);
    }
  } catch (e) {
    error = e;
  }

  it('ignoreCircular=true', function() {
    expect(error instanceof Error).to.equal(false);
  });
  it('if a circular reference refers to root', function() {
    expect(queue.length).to.equal(10);
  });
});


describe('Max deep', function() {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  };
  let queue = [];

  let iterator = new RecursiveIterator(root, 0, false, 1);
  for(let item = iterator.next(); !item.done; item = iterator.next()) {
    let state = item.value;
    queue.push(state.parent);
    queue.push(state.node);
    queue.push(state.key);
    queue.push(state.path);
    queue.push(state.deep);
  }

  it('maxDeep=1', function() {
    expect(queue.length).to.equal(10);
  });
});

