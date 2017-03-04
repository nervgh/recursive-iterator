
const RecursiveIterator = require('../src/RecursiveIterator');
const {expect} = require('chai');


describe('Testing of destroy() method', function() {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  };

  it('After call of iterator.destroy() item.value === undefined', function() {
    let iterator = new RecursiveIterator(root);
    iterator.next();
    expect(iterator.next().value).to.not.be.undefined;
    iterator.destroy();
    expect(iterator.next().value).to.be.undefined;
    expect(iterator.next().value).to.be.undefined;
  });
  it('After call of iterator.destroy() item.done === true', function() {
    let iterator = new RecursiveIterator(root);
    iterator.next();
    expect(iterator.next().done).to.be.false;
    iterator.destroy();
    expect(iterator.next().done).to.be.true;
    expect(iterator.next().done).to.be.true;
  });
});


describe('Testing of isNode() method', function() {
  it('Calls for each node', function() {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    };

    let isObject = function(any) {
      return any !== null && typeof any === 'object';
    };

    let iterator = new RecursiveIterator(root);
    let queue = [];
    iterator.isNode = function(any) {
      queue.push(any);
      return isObject(any);
    };
    for(let item = iterator.next(); !item.done; item = iterator.next()) {
      // empty body
    }

    expect(queue.length).to.equal(5);
  });
  it('Use isNode() for root node', function() {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    };

    let iterator = new RecursiveIterator(root);
    let queue = [];
    iterator.isNode = function(any) {
      return false;
    };
    for(let item = iterator.next(); !item.done; item = iterator.next()) {
      queue.push(true);
    }

    expect(queue.length).to.equal(0);
  });
  it('If returns "false" node will be skipped', function() {
    let root = {
      date: new Date(),
      object: {
        number: 1
      },
      string: 'walker'
    };

    let iterator = new RecursiveIterator(root);
    let queue = [];
    iterator.isNode = function(any) {
      return any === root;
    };
    for(let item = iterator.next(); !item.done; item = iterator.next()) {
      queue.push(item);
    }

    expect(queue.length).to.equal(3);
  });
});


describe('Testing of isLeaf() method', function() {
  let root = {
    date: new Date(),
    object: {
      number: 1
    },
    string: 'walker'
  };

  let iterator = new RecursiveIterator(root);

  it('Leaf is all primitive types', function() {
    expect(iterator.isLeaf(iterator.next().value.node)).to.be.false; // date
    expect(iterator.isLeaf(iterator.next().value.node)).to.be.false; // object
    expect(iterator.isLeaf(iterator.next().value.node)).to.be.true; // string
  });
});


describe('Testing of isCircular() method', function() {
  let root = {
    array: [],
    object: undefined,
    string: 'walker'
  };
  root.object = root;

  let iterator = new RecursiveIterator(root, 0, true);

  it('isCircular() returns "true" if object is circular reference', function() {
    expect(iterator.isCircular(iterator.next().value.node)).to.be.false;
    expect(iterator.isCircular(iterator.next().value.node)).to.be.true;
    expect(iterator.isCircular(iterator.next().value.node)).to.be.false;
  });
});
