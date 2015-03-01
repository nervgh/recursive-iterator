# Recursive Iterator

## About
Iterates javascript object recursively.
Supports ES6 [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
Compatible with [for...of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/for...of) cycle.

## Required
ES5 Object.keys(), Array.prototype.indexOf()

## Syntax
```js
var iterator = new RecursiveIterator(
    root /*{Object|Array}*/,
    [bypassMode=0] /*{Number}*/,
    [ignoreCircularReferences=false] /*{Boolean}*/,
    [preventStepInto] /*{Function}*/
);

var item = iterator.next();
var state = item.value; // descriptor state
var done = item.done; // true if item is last in tree

var node = state.node; // node is current node
var value = state.value; // value is node[key] value
var key = state.key; // key is key of node
var path = state.path; // path is path to node
```

## Tree traverse methods
By default method bypass of tree is vertical `bypassMode=0`:
```js
var root = {
    object: {
        number: 1
    },
    string: 'foo'
};

var iterator = new RecursiveIterator(root);
for(var item = iterator.next(); !item.done; item = iterator.next()) {
    var state = item.value;
    console.log(state.path.join('.'), state.value);
}

// object    Object {number: 1}
// object.number    1
// string    foo
```
You can change it on horizontal by passing the `bypassMode=1`:
```js
var root = {
    object: {
        number: 1
    },
    string: 'foo'
};

for(var item = iterator.next(); !item.done; item = iterator.next()) {
    var state = item.value;
    console.log(state.path.join('.'), state.value);
}

// object    Object {number: 1}
// string    foo
// object.number    1
```

## Circular references
By default, if detected circular reference then will throw an exception:
```js
var root = {
    number: 1,
    object: undefined,
    string: 'foo'
};
root.object = root;

var iterator = new RecursiveIterator(root);
for(var item = iterator.next(); !item.done; item = iterator.next()) {
    var state = item.value;
    console.log(state.path.join('.'), state.value);
}

// number    1
// Uncaught Error: Circular reference
```
You can change this behaviour by passing `ignoreCircularReferences=true`:
```js
var root = {
    number: 1,
    object: undefined,
    string: 'foo'
};
root.object = root;

var iterator = new RecursiveIterator(root, 0, true);
for(var item = iterator.next(); !item.done; item = iterator.next()) {
    var state = item.value;
    console.log(state.path.join('.'), state.value);
}

// number    1
// string    foo
```

## Prevent step into node
For preventing bypass object you can use `preventStepInto` argument:
```js
var root = {
    object: {
        number: 1
    },
    string: 'foo'
};

var preventStepInto = function(item) {
    return item.value.key === 'object'; // if true then item.value.value will be skipped
};

var iterator = new RecursiveIterator(root, 0, false, preventStepInto);
for(var item = iterator.next(); !item.done; item = iterator.next()) {
    var state = item.value;
    console.log(state.path.join('.'), state.value);
}

// string    foo
```
When you usage this feature you must be careful because `node` and `key` may be `undefined`.

## ES6 example: **for...of** loop
```js
var root = {
    object: {
        number: 1
    },
    string: 'foo'
};

for(let {node, value, key, path} of new RecursiveIterator(root)) {
    console.log(node, value, key, path);
}

// or

for(let item of new RecursiveIterator(root)) {
    console.log(item);
}
```
