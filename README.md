# Recursive Iterator

## About
Iterates javascript object recursively.
Works in ES5 and ES6 environments.
Supports ES6 [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
Compatible with [for...of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) cycle.

## Required
ES5

## Getting started

### Quick overview (es6)
```js
var iterator = new RecursiveIterator(
    root /*{Object|Array}*/,
    [bypassMode=0] /*{Number}*/,
    [ignoreCircular=false] /*{Boolean}*/,
    [maxDeep=100] /*{Number}*/
);

var {value, done} = iterator.next();
var {parent, node, key, path, deep} = value;

// parent is parent node
// node is current node
// key is key of node
// path is path to node
// deep is current deep
```

### Example (es6)
```js
var root = {
    object: {
        number: 1
    },
    string: 'foo'
};

for(let {node, path} of new RecursiveIterator(root)) {
    console.log(path.join('.'), node);
}

// object    Object {number: 1}
// object.number    1
// string    foo
```

## Roadmap
* [Syntax](/wiki/ES6-&-ES5-syntax)
    * [ES6](/wiki/Syntax#es6)
    * [ES5](/wiki/Syntax#es5)
* API
    * [Options](/wiki/Options)
    * [Methods & Callbacks](/wiki/Methods-&-Callbacks)
* [Cookbook (es6)](/wiki/Cookbook-(es6))
    * [Iterator (not recursive)](/wiki/Cookbook-(es6)#iterator-not-recursive)
    * [DomIterator](/wiki/Cookbook-(es6)#domiterator)
    * [Deep copy / Deep clone](/wiki/Cookbook-(es6)#deep-copy--deep-clone)
