(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('RecursiveIterator', [], function () {
      return (root['RecursiveIterator'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['RecursiveIterator'] = factory();
  }
}(this, function () {

"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// PRIVATE PROPERTIES
var BYPASS_MODE = "__bypassMode";
var IGNORE_CIRCULAR = "__ignoreCircular";
var MAX_DEEP = "__maxDeep";
var QUEUE = "__queue";
var NODE = "__node";
var CACHE = "__cache";

var Iterator = (function () {
    /**
     * @param {Object|Array} root
     * @param {Number} [bypassMode=0]
     * @param {Boolean} [ignoreCircular=false]
     * @param {Number} [maxDeep=100]
     */

    function Iterator(root) {
        var bypassMode = arguments[1] === undefined ? 0 : arguments[1];
        var ignoreCircular = arguments[2] === undefined ? false : arguments[2];
        var maxDeep = arguments[3] === undefined ? 100 : arguments[3];

        _classCallCheck(this, Iterator);

        this[BYPASS_MODE] = bypassMode;
        this[IGNORE_CIRCULAR] = ignoreCircular;
        this[MAX_DEEP] = maxDeep;
        this[QUEUE] = [].concat(_toConsumableArray(Iterator.getChildNodes(root, [], 0)));
        this[NODE] = Iterator.getNode();
        this[CACHE] = [root];
        this.__makeIterable();
    }

    _prototypeProperties(Iterator, {
        getKeys: {
            /**
             * @param {Object|Array} object
             * @returns {Array<String>}
             */

            value: function getKeys(object) {
                var keys = Object.keys(object);
                if (Array.isArray(object)) {} else if (Iterator.isArrayLike(object)) {
                    keys = keys.filter(function (key) {
                        return Math.floor(Number(key)) == key;
                    });
                    // skip sort
                } else {
                    // sort
                    keys = keys.sort();
                }
                return keys;
            },
            writable: true,
            configurable: true
        },
        isObject: {
            /**
             * @param {*} any
             * @returns {Boolean}
             */

            value: function isObject(any) {
                return any instanceof Object;
            },
            writable: true,
            configurable: true
        },
        isWindow: {
            /**
             * @param {Object} object
             * @returns {Boolean}
             */

            value: function isWindow(object) {
                return object === object.window;
            },
            writable: true,
            configurable: true
        },
        isArrayLike: {
            /**
             * @param {Object} object
             * @returns {Boolean}
             */

            value: function isArrayLike(object) {
                return !Iterator.isWindow(object) && object.hasOwnProperty("length");
            },
            writable: true,
            configurable: true
        },
        getChildNodes: {
            /**
             * Returns descriptors of child nodes
             * @param {Object} node
             * @param {Array} path
             * @param {Number} deep
             * @returns {Array<Object>}
             */

            value: function getChildNodes(node, path, deep) {
                return Iterator.getKeys(node).map(function (key) {
                    return Iterator.getNode(node, node[key], key, path.concat(key), deep + 1);
                });
            },
            writable: true,
            configurable: true
        },
        getNode: {
            /**
             * Returns descriptor of node
             * @param {Object} [parent]
             * @param {*} [node]
             * @param {String} [key]
             * @param {Array} [path]
             * @param {Number} [deep]
             * @returns {Object}
             */

            value: function getNode(parent, node, key) {
                var path = arguments[3] === undefined ? [] : arguments[3];
                var deep = arguments[4] === undefined ? 0 : arguments[4];

                return { parent: parent, node: node, key: key, path: path, deep: deep };
            },
            writable: true,
            configurable: true
        }
    }, {
        next: {
            /**
             * @returns {Object}
             */

            value: function next() {
                var _ref = this[NODE] || {};

                var parent = _ref.parent;
                var node = _ref.node;
                var key = _ref.key;
                var path = _ref.path;
                var deep = _ref.deep;

                if (this[MAX_DEEP] > deep && Iterator.isObject(node)) {
                    if (this.isCircular(node)) {
                        if (this[IGNORE_CIRCULAR]) {} else {
                            throw new Error("Circular reference");
                        }
                    } else {
                        if (this.onStepInto(parent, node, key, path, deep)) {
                            var childNodes = Iterator.getChildNodes(node, path, deep);
                            if (this[BYPASS_MODE]) {
                                var _QUEUE;

                                (_QUEUE = this[QUEUE]).push.apply(_QUEUE, _toConsumableArray(childNodes));
                            } else {
                                var _QUEUE2;

                                (_QUEUE2 = this[QUEUE]).unshift.apply(_QUEUE2, _toConsumableArray(childNodes));
                            }
                            this[CACHE].push(node);
                        }
                    }
                }

                var value = this[QUEUE].shift();
                var done = !value;

                this[NODE] = value;

                if (done) this.destroy();

                return { value: value, done: done };
            },
            writable: true,
            configurable: true
        },
        destroy: {
            /**
             *
             */

            value: function destroy() {
                this[QUEUE].length = 0;
                this[CACHE].length = 0;
                this[NODE] = null;
            },
            writable: true,
            configurable: true
        },
        isLeaf: {
            /**
             * @param {*} any
             * @returns {Boolean}
             */

            value: function isLeaf(any) {
                if (!Iterator.isObject(any)) {
                    return true;
                }var keys = Iterator.getKeys(any);
                return !keys.length;
            },
            writable: true,
            configurable: true
        },
        isCircular: {
            /**
             * @param {*} any
             * @returns {Boolean}
             */

            value: function isCircular(any) {
                return this[CACHE].indexOf(any) !== -1;
            },
            writable: true,
            configurable: true
        },
        onStepInto: {
            /**
             * Callback
             * @param {Object} parent
             * @param {Object} node
             * @param {String} key
             * @param {Array} path
             * @param {Number} deep
             * @returns {Boolean}
             */

            value: function onStepInto(parent, node, key, path, deep) {
                return true;
            },
            writable: true,
            configurable: true
        },
        __makeIterable: {
            /**
             * Only for es6
             * @private
             */

            value: function __makeIterable() {
                var _this = this;

                try {
                    this[Symbol.iterator] = function () {
                        return _this;
                    };
                } catch (e) {}
            },
            writable: true,
            configurable: true
        }
    });

    return Iterator;
})();

//export default Iterator;

// necessary for correct assembly
var RecursiveIterator = Iterator;

// skip

// skip sort
return RecursiveIterator;

}));
