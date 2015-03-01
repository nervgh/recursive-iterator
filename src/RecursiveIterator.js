

class RecursiveIterator {
    /**
     * @param {Object|Array} root
     * @param {Number} [bypassMode=0]
     * @param {Boolean} [ignoreCircularReferences=false]
     * @param {Function} [preventStepInto]
     */
    constructor(root, bypassMode = 0, ignoreCircularReferences = false, preventStepInto = () => false) {
        this.__bypassMode = bypassMode;
        this.__ignoreCircularReferences = ignoreCircularReferences;
        this.__preventStepInto = preventStepInto;
        this.__cache = [];
        this.__stack = [];
        this.__saveState(root, RecursiveIterator.getKeys(root), []);
    }
    /**
     * @param {Function} [preventStepInto]
     * @returns {Object}
     */
    next(preventStepInto = this.__preventStepInto) {
        var [node, keys, path] = this.__getState();

        var item = {
            value: {node, value, key, path},
            done: !this.__stack.length
        };

        if (!node) return item;

        var key = keys.shift();
        var value = node[key];
        var way = path.concat(key);

        this.__cache.push(node);
        this.__saveState(node, keys, path);

        item.value = {node, value, key, path: way};
        item.done = !this.__stack.length;

        if (RecursiveIterator.isObject(value)) {
            if (preventStepInto(item)) return this.next();

            if (this.__cache.indexOf(value) !== -1) {
                if (this.__ignoreCircularReferences) {
                    return this.next();
                } else {
                    throw new Error('Circular reference');
                }
            }

            if (this.__bypassMode) {
                this.__saveState(value, RecursiveIterator.getKeys(value), way, 'unshift');
            } else {
                this.__saveState(value, RecursiveIterator.getKeys(value), way);
            }

            item.done = !this.__stack.length;
        }

        return item;
    }
    /**
     *
     */
    destroy() {
        this.__stack.length = 0;
        this.__cache.length = 0;
    }
    /**
     * @param {String} [method]
     * @returns {Array}
     * @private
     */
    __getState(method = 'pop') {
        return this.__stack[method]() || [undefined, undefined, []];
    }
    /**
     * @param {Object|Array} node
     * @param {Array} keys
     * @param {Array} path
     * @param {String} [method]
     * @private
     */
    __saveState(node, keys, path, method = 'push') {
        if (keys.length) this.__stack[method]([node, keys, path]);
    }
    /**
     * @param {Object|Array} object
     * @returns {Array<String>}
     */
    static getKeys(object) {
        return Object.keys(object).sort();
    }
    /**
     * @param {*} any
     * @returns {Boolean}
     */
    static isObject(any) {
        return any instanceof Object;
    }
}


//export default RecursiveIterator;