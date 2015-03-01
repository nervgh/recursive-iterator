(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('recursive-iterator', [], function () {
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

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var RecursiveIterator = (function () {
    /**
     * @param {Object|Array} root
     * @param {Number} [bypassMode=0]
     * @param {Boolean} [ignoreCircularReferences=false]
     * @param {Function} [preventStepInto]
     */

    function RecursiveIterator(root) {
        var bypassMode = arguments[1] === undefined ? 0 : arguments[1];
        var ignoreCircularReferences = arguments[2] === undefined ? false : arguments[2];
        var preventStepInto = arguments[3] === undefined ? function () {
            return false;
        } : arguments[3];

        _classCallCheck(this, RecursiveIterator);

        this.__bypassMode = bypassMode;
        this.__ignoreCircularReferences = ignoreCircularReferences;
        this.__preventStepInto = preventStepInto;
        this.__cache = [];
        this.__stack = [];
        this.__saveState(root, RecursiveIterator.getKeys(root), []);
    }

    _prototypeProperties(RecursiveIterator, {
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
        }
    }, {
        next: {
            /**
             * @param {Function} [preventStepInto]
             * @returns {Object}
             */

            value: function next() {
                var preventStepInto = arguments[0] === undefined ? this.__preventStepInto : arguments[0];

                var _getState = this.__getState();

                var _getState2 = _slicedToArray(_getState, 3);

                var node = _getState2[0];
                var keys = _getState2[1];
                var path = _getState2[2];

                var item = {
                    value: { node: node, value: value, key: key, path: path },
                    done: !this.__stack.length
                };

                if (!node) {
                    return item;
                }var key = keys.shift();
                var value = node[key];
                var way = path.concat(key);

                this.__cache.push(node);
                this.__saveState(node, keys, path);

                item.value = { node: node, value: value, key: key, path: way };
                item.done = !this.__stack.length;

                if (RecursiveIterator.isObject(value)) {
                    if (preventStepInto(item)) {
                        return this.next();
                    }if (this.__cache.indexOf(value) !== -1) {
                        if (this.__ignoreCircularReferences) {
                            return this.next();
                        } else {
                            throw new Error("Circular reference");
                        }
                    }

                    if (this.__bypassMode) {
                        this.__saveState(value, RecursiveIterator.getKeys(value), way, "unshift");
                    } else {
                        this.__saveState(value, RecursiveIterator.getKeys(value), way);
                    }

                    item.done = !this.__stack.length;
                }

                return item;
            },
            writable: true,
            configurable: true
        },
        destroy: {
            /**
             *
             */

            value: function destroy() {
                this.__stack.length = 0;
                this.__cache.length = 0;
            },
            writable: true,
            configurable: true
        },
        __getState: {
            /**
             * @param {String} [method]
             * @returns {Array}
             * @private
             */

            value: function __getState() {
                var method = arguments[0] === undefined ? "pop" : arguments[0];

                return this.__stack[method]() || [undefined, undefined, []];
            },
            writable: true,
            configurable: true
        },
        __saveState: {
            /**
             * @param {Object|Array} node
             * @param {Array} keys
             * @param {Array} path
             * @param {String} [method]
             * @private
             */

            value: function __saveState(node, keys, path) {
                var method = arguments[3] === undefined ? "push" : arguments[3];

                if (keys.length) this.__stack[method]([node, keys, path]);
            },
            writable: true,
            configurable: true
        }
    });

    return RecursiveIterator;
})();

//export default RecursiveIterator;
return RecursiveIterator;

}));
