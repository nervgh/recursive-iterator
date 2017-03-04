
const RecursiveIterator = require('../src/RecursiveIterator');
const {expect} = require('chai');


describe('The end of the iteration', function() {
    let root = {
        object: {
            number: 1
        },
        string: 'walker'
    };

    let iterator = new RecursiveIterator(root);
    iterator.next();
    iterator.next();
    iterator.next();
    iterator.next();

    it('item.value must undefined', function() {
        expect(iterator.next().value).to.be.undefined;
    });
    it('item.done must true', function() {
        expect(iterator.next().done).to.be.true;
    });
});


