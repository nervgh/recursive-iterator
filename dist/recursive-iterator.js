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

        this.__bypassMode = bypassMode;
        this.__ignoreCircular = ignoreCircular;
        this.__maxDeep = maxDeep;
        this.__queue = [].concat(_toConsumableArray(Iterator.getChildNodes(root, [], 0)));
        this.__node = Iterator.getNode();
        this.__cache = [root];
        this.__makeIterable();
    }

    _prototypeProperties(Iterator, {
        getKeys: {
            /**
             * @param {Object|Array} object
             * @returns {Array<String>}
             */

            value: function getKeys(object) {
                return Object.keys(object).sort();
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
        getChildNodes: {
            /**
             * @param {Object|Array} object
             * @param {Array} path
             * @param {Number} deep
             * @returns {Array}
             * @private
             */

            value: function getChildNodes(object, path, deep) {
                return Iterator.getKeys(object).map(function (key) {
                    return Iterator.getNode(object, object[key], key, path.concat(key), deep + 1);
                });
            },
            writable: true,
            configurable: true
        },
        getNode: {
            /**
             * @param {Object} [parent]
             * @param {*} [node]
             * @param {String} [key]
             * @param {Array} [path]
             * @param {Number} [deep]
             * @returns {Object}
             * @private
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
                var any = this.__node && this.__node.node;
                var path = this.__node && this.__node.path;
                var deep = this.__node && this.__node.deep;

                if (this.__maxDeep > deep && Iterator.isObject(any)) {
                    if (this.isCircular(any)) {
                        if (this.__ignoreCircular) {} else {
                            throw new Error("Circular reference");
                        }
                    } else {
                        if (this.onStepInto(any)) {
                            if (this.__bypassMode) {
                                var _queue;

                                (_queue = this.__queue).push.apply(_queue, _toConsumableArray(Iterator.getChildNodes(any, path, deep)));
                            } else {
                                var _queue2;

                                (_queue2 = this.__queue).unshift.apply(_queue2, _toConsumableArray(Iterator.getChildNodes(any, path, deep)));
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
            },
            writable: true,
            configurable: true
        },
        destroy: {
            /**
             *
             */

            value: function destroy() {
                this.__queue.length = 0;
                this.__cache.length = 0;
                this.__node = undefined;
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
                return this.__cache.indexOf(any) !== -1;
            },
            writable: true,
            configurable: true
        },
        onStepInto: {
            /**
             * Callback
             * @param {Object} object
             * @returns {Boolean}
             */

            value: function onStepInto(object) {
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
return RecursiveIterator;

}));
