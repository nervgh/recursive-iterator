
const RecursiveIterator = require('../src/RecursiveIterator');
const {expect} = require('chai');


describe('Actual iteration should return the object of the specified type', function() {
  let root = {
    object: {
      number: 1
    },
    string: 'walker'
  };

  let iterator = new RecursiveIterator(root);
  let state = iterator.next().value;

  it('it object must have "parent" property', function() {
    expect(state.hasOwnProperty('parent')).to.be.true;
  });
  it('it object must have "node" property', function() {
    expect(state.hasOwnProperty('node')).to.be.true;
  });
  it('it object must have "key" property', function() {
    expect(state.hasOwnProperty('key')).to.be.true;
  });
  it('it object must have "path" property', function() {
    expect(state.hasOwnProperty('path')).to.be.true;
  });
  it('it object must have "deep" property', function() {
    expect(state.hasOwnProperty('deep')).to.be.true;
  });
});