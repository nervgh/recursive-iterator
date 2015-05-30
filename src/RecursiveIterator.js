

// PRIVATE PROPERTIES
const BYPASS_MODE = '__bypassMode';
const IGNORE_CIRCULAR = '__ignoreCircular';
const MAX_DEEP = '__maxDeep';
const QUEUE = '__queue';
const NODE = '__node';
const CACHE = '__cache';


class Iterator {
    /**
     * @param {Object|Array} root
     * @param {Number} [bypassMode=0]
     * @param {Boolean} [ignoreCircular=false]
     * @param {Number} [maxDeep=100]
     */
    constructor(root, bypassMode = 0, ignoreCircular = false, maxDeep = 100) {
        this[BYPASS_MODE] = bypassMode;
        this[IGNORE_CIRCULAR] = ignoreCircular;
        this[MAX_DEEP] = maxDeep;
        this[QUEUE] = [...Iterator.getChildNodes(root, [], 0)];
        this[NODE] = Iterator.getNode();
        this[CACHE] = [root];
        this.__makeIterable();
    }
    /**
     * @returns {Object}
     */
    next() {
        var {parent, node, key, path, deep} = this[NODE] || {};

        if (this[MAX_DEEP] > deep && Iterator.isObject(node)) {
            if (this.isCircular(node)) {
                if (this[IGNORE_CIRCULAR]) {
                    // skip
                } else {
                    throw new Error('Circular reference');
                }
            } else {
                if (this.onStepInto(parent, node, key, path, deep)) {
                    var childNodes = Iterator.getChildNodes(node, path, deep);
                    if (this[BYPASS_MODE]) {
                        this[QUEUE].push(...childNodes);
                    } else {
                        this[QUEUE].unshift(...childNodes);
                    }
                    this[CACHE].push(node);
                }
            }
        }

        var value = this[QUEUE].shift();
        var done = !value;

        this[NODE] = value;

        if (done) this.destroy();

        return {value, done};
    }
    /**
     *
     */
    destroy() {
        this[QUEUE].length = 0;
        this[CACHE].length = 0;
        this[NODE] = null;
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
        return this[CACHE].indexOf(any) !== -1
    }
    /**
     * Callback
     * @param {Object} parent
     * @param {Object} node
     * @param {String} key
     * @param {Array} path
     * @param {Number} deep
     * @returns {Boolean}
     */
    onStepInto(parent, node, key, path, deep) {
        return true;
    }
    /**
     * @param {Object|Array} object
     * @returns {Array<String>}
     */
    static getKeys(object) {
        var keys = Object.keys(object);
        if (Array.isArray(object)) {
            // skip sort
        } else if(Iterator.isArrayLike(object)) {
            keys = keys.filter((key) => Math.floor(Number(key)) == key);
            // skip sort
        } else {
            // sort
            keys = keys.sort();
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
     * Returns descriptors of child nodes
     * @param {Object} node
     * @param {Array} path
     * @param {Number} deep
     * @returns {Array<Object>}
     */
    static getChildNodes(node, path, deep) {
        return Iterator.getKeys(node).map((key) =>
            Iterator.getNode(node, node[key], key, path.concat(key), deep + 1)
        );
    }
    /**
     * Returns descriptor of node
     * @param {Object} [parent]
     * @param {*} [node]
     * @param {String} [key]
     * @param {Array} [path]
     * @param {Number} [deep]
     * @returns {Object}
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