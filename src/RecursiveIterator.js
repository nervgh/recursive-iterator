

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
        var any = this.__node && this.__node.node;
        var path = this.__node && this.__node.path;
        var deep = this.__node && this.__node.deep;

        if (this.__maxDeep > deep && Iterator.isObject(any)) {
            if (this.isCircular(any)) {
                if (this.__ignoreCircular) {
                    // skip
                } else {
                    throw new Error('Circular reference');
                }
            } else {
                if (this.onStepInto(any)) {
                    if (this.__bypassMode) {
                        this.__queue.push(...Iterator.getChildNodes(any, path, deep));
                    } else {
                        this.__queue.unshift(...Iterator.getChildNodes(any, path, deep));
                    }
                    this.__cache.push(any);
                }
            }
        }

        this.__node = this.__queue.shift();
        if (!this.__node) this.destroy();

        return {
            value: this.__node,
            done: !this.__node
        };
    }
    /**
     *
     */
    destroy() {
        this.__queue.length = 0;
        this.__cache.length = 0;
        this.__node = undefined;
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
        return Object.keys(object).sort();
    }
    /**
     * @param {*} any
     * @returns {Boolean}
     */
    static isObject(any) {
        return any instanceof Object;
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