

class Iterator {
    /**
     * @param {Object|Array} root
     * @param {Number} [bypassMode=0]
     * @param {Boolean} [ignoreCircular=false]
     * @param {Number} [maxDeep=100]
     */
    constructor(root, bypassMode = 0, ignoreCircular = false, maxDeep = 100) {
        this.__bypassMode = bypassMode;
        this.__ignoreCircular = ignoreCircular;
        this.__maxDeep = maxDeep;
        this.__queue = [...Iterator.getChildNodes(root, [], 0)];
        this.__node = Iterator.getNode();
        this.__cache = [root];
        this.__makeIterable();
    }
    /**
     * @returns {Object}
     */
    next() {
        var {node, path, deep} = this.__node || {};

        if (this.__maxDeep > deep && Iterator.isObject(node)) {
            if (this.isCircular(node)) {
                if (this.__ignoreCircular) {
                    // skip
                } else {
                    throw new Error('Circular reference');
                }
            } else {
                if (this.onStepInto(node)) {
                    var childNodes = Iterator.getChildNodes(node, path, deep);
                    if (this.__bypassMode) {
                        this.__queue.push(...childNodes);
                    } else {
                        this.__queue.unshift(...childNodes);
                    }
                    this.__cache.push(node);
                }
            }
        }

        var value = this.__queue.shift();
        var done = !value;

        this.__node = value;

        if (done) this.destroy();

        return {
            value,
            done
        };
    }
    /**
     *
     */
    destroy() {
        this.__queue.length = 0;
        this.__cache.length = 0;
        this.__node = null;
    }
    /**
     * @param {*} any
     * @returns {Boolean}
     */
    isLeaf(any) {
        if (!Iterator.isObject(any)) return true;
        var keys = Iterator.getKeys(any);
        return !keys.length;
    }
    /**
     * @param {*} any
     * @returns {Boolean}
     */
    isCircular(any) {
        return this.__cache.indexOf(any) !== -1
    }
    /**
     * Callback
     * @param {Object} object
     * @returns {Boolean}
     */
    onStepInto(object) {
        return true;
    }
    /**
     * @param {Object|Array} object
     * @returns {Array<String>}
     */
    static getKeys(object) {
        var keys = Object.keys(object).sort();
        if (!Array.isArray(object) && Iterator.isArrayLike(object)) {
            keys = keys.filter((key) => Math.floor(Number(key)) == key);
        }
        return keys;
    }
    /**
     * @param {*} any
     * @returns {Boolean}
     */
    static isObject(any) {
        return any instanceof Object;
    }
    /**
     * @param {Object} object
     * @returns {Boolean}
     */
    static isWindow(object) {
        return object === object.window;
    }
    /**
     * @param {Object} object
     * @returns {Boolean}
     */
    static isArrayLike(object) {
        return !Iterator.isWindow(object) && object.hasOwnProperty('length');
    }
    /**
     * @param {Object|Array} object
     * @param {Array} path
     * @param {Number} deep
     * @returns {Array}
     * @private
     */
    static getChildNodes(object, path, deep) {
        return Iterator.getKeys(object).map((key) =>
            Iterator.getNode(object, object[key], key, path.concat(key), deep + 1)
        );
    }
    /**
     * @param {Object} [parent]
     * @param {*} [node]
     * @param {String} [key]
     * @param {Array} [path]
     * @param {Number} [deep]
     * @returns {Object}
     * @private
     */
    static getNode(parent, node, key, path = [], deep = 0) {
        return {parent, node, key, path, deep};
    }
    /**
     * Only for es6
     * @private
     */
    __makeIterable() {
        try {
            this[Symbol.iterator] = () => this;
        } catch(e) {}
    }
}


//export default Iterator;

// necessary for correct assembly
let RecursiveIterator = Iterator;