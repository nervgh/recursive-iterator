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
* [Syntax](https://github.com/nervgh/recursive-iterator/wiki/Syntax)
    * [ES6](https://github.com/nervgh/recursive-iterator/wiki/Syntax#es6)
    * [ES5](https://github.com/nervgh/recursive-iterator/wiki/Syntax#es5)
* API
    * [Options](https://github.com/nervgh/recursive-iterator/wiki/Options)
    * [Methods & Callbacks](https://github.com/nervgh/recursive-iterator/wiki/Methods-&-Callbacks)
* [Cookbook (es6)](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6))
    * [Iterator (not recursive)](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6)#iterator-not-recursive)
    * [DomIterator](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6)#domiterator)
    * [Deep copy / Deep clone](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6)#deep-copy--deep-clone)
    * [To Query String](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6)#to-query-string)
    * [Uninformed search algorithms](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6)#uninformed-search-algorithms)
