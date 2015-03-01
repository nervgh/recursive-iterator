

describe('RecursiveIterator must be defined', function() {
    it('Object.traverse to be defined', function() {
        expect(RecursiveIterator).toBeDefined();
    });
});


describe('RecursiveIterator returns instance of RecursiveIterator', function() {
    it('RecursiveIterator must be instance of RecursiveIterator', function() {
        var iterator = new RecursiveIterator({});
        expect(iterator instanceof RecursiveIterator).toBe(true);
    });
});


describe('Vertical bypass method (bypassMode = 0)', function() {
    var root = {
        object: {
            number: 1
        },
        string: 'walker'
    };
    var stack = [];

    var iterator = new RecursiveIterator(root);
    for(var item = iterator.next(); !item.done; item = iterator.next()) {
        var state = item.value;
        stack.push(state.node);
        stack.push(state.value);
        stack.push(state.key);
        stack.push(state.path);
    }

    it('foo [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root);
        expect(stack.shift()).toBe(root.object);
        expect(stack.shift()).toBe('object');
        expect(stack.shift().join('.')).toBe('object');
    });
    it('foo.bar [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root.object);
        expect(stack.shift()).toBe(root.object.number);
        expect(stack.shift()).toBe('number');
        expect(stack.shift().join('.')).toBe('object.number');
    });
    it('foo.bar.number [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root);
        expect(stack.shift()).toBe(root.string);
        expect(stack.shift()).toBe('string');
        expect(stack.shift().join('.')).toBe('string');
    });
});


describe('Horizontal bypass method (bypassMode = 1)', function() {
    var root = {
        object: {
            number: 1
        },
        string: 'walker'
    };
    var stack = [];

    var iterator = new RecursiveIterator(root, 1);
    for(var item = iterator.next(); !item.done; item = iterator.next()) {
        var state = item.value;
        stack.push(state.node);
        stack.push(state.value);
        stack.push(state.key);
        stack.push(state.path);
    }

    it('foo [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root);
        expect(stack.shift()).toBe(root.object);
        expect(stack.shift()).toBe('object');
        expect(stack.shift().join('.')).toBe('object');
    });
    it('foo.bar [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root);
        expect(stack.shift()).toBe(root.string);
        expect(stack.shift()).toBe('string');
        expect(stack.shift().join('.')).toBe('string');
    });
    it('foo.string [node, value, key, path]', function() {
        expect(stack.shift()).toBe(root.object);
        expect(stack.shift()).toBe(root.object.number);
        expect(stack.shift()).toBe('number');
        expect(stack.shift().join('.')).toBe('object.number');
    });
});


describe('Circular references (exception)', function() {
    var root = {
        object: undefined,
        string: 'walker'
    };
    root.object = root;
    var stack = [];

    try {
        var iterator = new RecursiveIterator(root);
        for(var item = iterator.next(); !item.done; item = iterator.next()) {
            var state = item.value;
            stack.push(state.node);
            stack.push(state.value);
            stack.push(state.key);
            stack.push(state.path);
        }
    } catch (e) {
        var error = e;
    }

    it('if detected circular reference then will throw an exception', function() {
        expect(stack.length).toEqual(0);
        expect(error instanceof Error).toBe(true);
    });
});


describe('Circular references (ignore)', function() {
    var root = {
        object: undefined,
        string: 'walker'
    };
    root.object = root;
    var stack = [];

    try {
        var iterator = new RecursiveIterator(root, 0, true);
        for(var item = iterator.next(); !item.done; item = iterator.next()) {
            var state = item.value;
            stack.push(state.node);
            stack.push(state.value);
            stack.push(state.key);
            stack.push(state.path);
        }
    } catch (e) {
        var error = e;
    }

    it('ignoreCircularReferences=true', function() {
        expect(stack.length).toEqual(4);
        expect(error instanceof Error).toBe(false);
    });
});


describe('Prevent step into node (RecursiveIterator(..., ..., preventStepInto)', function() {
    var root = {
        object: {},
        string: 'walker'
    };
    var stack = [];

    var preventStepInto = function(item) {
        var state = item.value;
        return state.key === 'object';
    };

    var iterator = new RecursiveIterator(root, 0, true, preventStepInto);
    for(var item = iterator.next(); !item.done; item = iterator.next()) {
        var state = item.value;
        stack.push(state.node);
        stack.push(state.value);
        stack.push(state.key);
        stack.push(state.path);
    }

    it('stack length is 1', function() {
        expect(stack.length).toEqual(4);
    });
});
