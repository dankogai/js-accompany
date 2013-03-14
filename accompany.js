/*
 * $Id: accompany.js,v 0.1 2013/03/14 09:12:15 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    http://es5.github.com/
 *    http://wiki.ecmascript.org/doku.php?id=harmony:proposals
 *    https://github.com/paulmillr/es6-shim/
 */

(function(global) {
    'use strict';
    if (!Object.freeze || typeof Object.freeze !== 'function') {
        throw Error('ES5 unsupported');
    }
    var create = Object.create,
        defineProperty = Object.defineProperty,
        defineProperties = Object.defineProperties,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        getPrototypeOf = Object.getPrototypeOf,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString       = Object.prototype.toString,
        slice = Array.prototype.slice;
    
    var extend = function(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(
            dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    var defaults = function(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
            dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    var defspec = extend(create(null), 
                         getOwnPropertyDescriptor(Object, 'freeze'));
    delete defspec.value;
    var newspec = function(o) {
        return extend(extend(create(null), defspec), o);
    };
    var toSpec = function(v) {
        return newspec({
            value: v
        });
    };
    var newSpecs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(specs, k,
            typeof (src[k]) === 'function' ? toSpec(src[k]) : src[k]);
        });
        return specs;
    };
    var typeOf = function(o) {
        return o !== null ? typeof (o) : 'null';
    };
    var is = function(x, y) {
        return x === y ? x !== 0 ? true // normal
            :   1 / x === 1 / y         // +-0
            :   x !== x && y !== y;     // NaN
    };
    var isObject = function(o) {
        return o === Object(o);
    };
    var isPrimitive = function(o) {
        return o !== Object(o);
    };
    var isFunction = function(f) {
        return typeOf(f) === 'function';
    };
    var isNil = function(o) {
        return o === void 0 || o === null;
    };
    // clone with deep clone support -- tough
    var hasProtoFunction = function(name) {
        return function(e) {
            return isPrimitive(o)              ? false
                : ! o[name]                    ? false
                : hasOwnProperty.call(o, name) ? false
                : !isFunction(o[name])         ? false
                :                                true;
        };
    };
    var canCloneNode = hasProtoFunction('cloneNode');
    var canClone     = hasProtoFunction('clone');
    var getObjectSignature = function(o) {
        return toString.call(o);
    };
    var getConstructorOf = function(o) {
        if (isNil(o))        return null;
        if (isPrimitive(o))  return o.constructor;
        var proto = getPrototypeOf(o);
        if (proto) {
            return isFunction(proto)         ? proto
                : proto === Object.prototype ? Object 
                : getConstructorOf(proto);
        };
        return null;
    };
    var clone = function(o, deep) {
        // primitives and functions
        if (isPrimitive(o))  return o;
        if (isFunction(o))   return o;
        // DOM node
        if (canCloneNode(o)) return o.cloneNode(deep);
        // its prototype has own clone methods
        if (canClone(o))     return o.clone(deep);
        // Arrays
        if (Array.isArray(o)) {
            return !deep  ? slice.call(o)
                : o.map(function(v) {
                        return clone(v, deep);
                    });
        }
        switch(getObjectSignature(o)) {
        case '[object Object]':
            var baby = create(getPrototypeOf(o));
            getOwnPropertyNames(o).forEach(function(k) {
                var desc = getOwnPropertyDescriptor(o, k);
                if (deep && 'value' in desc) desc.value = clone(o[k], deep);
                defineProperty(baby, k, desc);
            });
            return baby;
        case '[object RegExp]':
        case '[object Date]':
            return deep ? new ctor(o) : o;
        default:
            return o;
        };
    };
    // Object
    defaults(Object, newSpecs({
        clone: clone,
        extend: extend,
        defaults: defaults,
        getConstructorOf: getConstructorOf,
        has: function(o, k) {
             return hasOwnProperty.call(o, k);
        },
        is: is,
        isnt: function(x, y) {
            return !is(x, y);
        },
        'typeOf': typeOf,
        isObject: isObject,
        isNull: function(o) { return o === null },
        isUndefined: function(o) { return o === void 0 },
        isNil: isNil,
        isPrimitive: isPrimitive,
        isElement: function(e) {
            return canCloneNode(e) && e.nodeType === 1
        },
        items: function(o) {
            return Object.keys(o).map(function(k) {
                return [k, o[k]]
            });
        },
        values: function(o) {
            return Object.keys(o).map(function(k) {
                return o[k]
            });
        }
    }));
    // Boolean
    defaults(Boolean, newSpecs({
        isBoolean: function(s) {
            return typeOf(s) === 'boolean';
        }
    }));
    defaults(Boolean.prototype, newSpecs({
        toNumber: function() {
            return !!this ? 1 : 0;
        }
    }));
    // String
    defaults(String, newSpecs({
        isString: function(s) {
            return typeOf(s) === 'string';
        }
    }));
    // String.prototype
    defaults(String.prototype, newSpecs({
        // http://blog.livedoor.jp/dankogai/archives/51172176.html
        repeat: function(n) {
            var s = this,
                result = '';
            for (n *= 1; n > 0; n >>>= 1, s += s) if (n & 1) result += s;
            return result;
        },
        // http://wiki.ecmascript.org/doku.php?id=harmony:string_extras
        startsWith: function(s) {
            return this.indexOf(s) === 0;
        },
        endsWith: function(s) {
            var t = String(s),
                index = this.lastIndexOf(t);
            return index >= 0 && index === this.length - t.length;
        },
        contains: function(s) {
            return this.indexOf(s) !== -1;
        },
        toArray: function() {
            return this.split('');
        },
        toBoolean: function() {
            return !!this;
        }
    }));
    // Array
    defaults(Array, newSpecs({
        from: function(o) {
           return slice.call(o);
        },
        of: function() {
            return slice.call(arguments);
        }
    }));
    // Array.prototype
    var sort = Array.prototype.sort;
    defaults(Array.prototype, newSpecs({
        repeat: function(n) {
            var a = this,
                result = [];
            for (n *= 1; n > 0; n >>>= 1, a = a.concat(a)) {
                if (n & 1) result = result.concat(a);
            }
            return result;
       },
       sorted: function() {
            return sort.apply(slice.call(this), slice.call(arguments));
       }
    }));
    defaults(Function, newSpecs({
        isFunction: isFunction,
        isBuiltIn: function(f) {
            return /\{\s+\[native\s+code]\s\}$/.test(''+f);
        }
    }));
    //defaults(Function.prototype, newSpecs({
    //}));
    // Number
    var gParseInt = parseInt,
        gParseFloat = parseFloat,
        gIsFinite = isFinite;
    defaults(Number, newSpecs({
        MAX_INTEGER: {
            value: Math.pow(2, 53)
        },
        EPSILON: {
            value: Math.pow(2, -52)
        },
        parseInt: gParseInt,
        parseFloat: gParseFloat,
        isFinite: function(n) {
            return n === 1*n && gIsFinite(n);
        },
        isNumber: function(n) {
            return typeOf(n) === 'number';
        },
        isInteger: function(n) {
            return Number.isFinite(n) && n % 1 === 0;
        },
        isNaN: function(n) {
            return Object.is(n, NaN);
        },
        toInteger: function(n) {
            n *= 1;
            return Object.is(n, NaN)  ? 0 
                :  Number.isFinite(n) ? n - n % 1 
                                      : n;
        }
    }));
    defaults(Number.prototype, newSpecs({
        toBoolean: function() {
            return !!this;
        }
    }));
    // Math
    defaults(Math, newSpecs({
        acosh: function(n) {
            return Math.log(n + Math.sqrt(n * n - 1));
        },
        asinh: function(n) {
            return Math.log(n + Math.sqrt(n * n + 1));
        },
        atanh: function(n) {
            return 0.5 * Math.log((1 + n) / (1 - n));
        },
        cbrt: function(n) {
            return Math.pow(n, 1 / 3);
        },
        cosh: function(n) {
            return (Math.exp(n) + Math.exp(-n)) / 2;
        },
        expm1: function(n) {
            return Math.exp(n) - 1;
        },
        hypot: function(x, y) {
            return Math.sqrt(x * x + y * y) || +0;
        },
        log2: function(n) {
            return Math.log(n) / Math.LN2;
        },
        log10: function(n) {
            return Math.log(n) / Math.LN10;
        },
        log1p: function(n) {
            return Math.log(1 + n);
        },
        sign: function(n) {
            n *= 1;
            return n === 0 ? n : Object.is(n, NaN) ? n : n < 0 ? -1 : 1;
        },
        sinh: function(n) {
            return (Math.exp(n) - Math.exp(-n)) / 2;
        },
        tanh: function(n) {
            var u = Math.exp(n),
                d = Math.exp(-n);
            return (u - d) / (u + d);
        },
        trunc: function(n) {
            return~~ n;
        }
    }));
    // Map
    var val2str = function(t, v) {
        switch(t){
        case 'string':
            return '.' + v;
        case 'number':
        return (
            0 > v              ? ''
            : Object.is(v, -0) ? '-'
            : v >= 0           ? '+'
            :                    ''
            ) + v.toString(10)
        default: 
            return '' + v;
        }
    }
    var str2val = function(s) {
        switch (s[0]) {
        case '.':
            return s.substr(1)
        case '+':
        case '-':
        case 'N': // NaN
             return Number.parseFloat(s, 10);
        case 't':
             return true;
        case 'f':
             return false;
        case 'u':
            return undefined;
        case 'n':
            return null;
        default:
            throw new TypeError('unknown format:' + s);
        }
    };
    var indexOfIdentical = function(keys, k) {
        for (var i = 0, l = keys.length; i < l; i++) {
            if (Object.is(keys[i], k)) return i;
        }
        return -1;
    };
    var Map = function() {
        if (!(this instanceof Map)) return new Map();
        defineProperties(this, {
            '__keys': {value: []},
            '__vals': {value: []},
            '__hash': {value: {}},
            '__size': { value: 0,  writable: true },
            'size': {
                get: function() {
                    return this.__size;
                }
            }
        });
    };
    defaults(Map.prototype, newSpecs({
        has: function(k) {
            var t = typeOf(k), s;
            if (isPrimitive(k)) {
                s = val2str(t, k);
                return s in this.__hash;
            }
            return indexOfIdentical(this.__keys, k) >= 0;
        },
        get: function(k) {
            var t = typeOf(k),
                i;
            if (isPrimitive(k)) {
                return this.__hash[ val2str(t, k) ];
            } else {
                i = indexOfIdentical(this.__keys, k);
                return i < 0 ? undefined : this.__vals[i];
            }
        },
        set: function(k, v) {
            var t = typeOf(k),
                i, s;
            if (isPrimitive(k)) {
                s = val2str(t, k);
                if (!(s in this.__hash)) this.__size++;
                this.__hash[s] = v;
            } else {
                i = indexOfIdentical(this.__keys, k);
                if (i < 0) {
                    this.__keys.push(k);
                    this.__vals.push(k);
                    this.__size++;
                } else {
                    this.__keys[i] = k;
                    this.__vals[i] = v;
                }
            }
        },
        'delete': function(k) {
            var t = typeOf(k),
                i, s;
            if (isPrimitive(k)) {
                s = val2str(t, k);
                if (s in this.__hash) {
                    delete this.__hash[s];
                    this.__size--;
                    return true;
                }
            } else {
                i = indexOfIdentical(this.__keys, k);
                if (i >= 0) {
                    this.__keys.splice(i, 1);
                    this.__vals.splice(i, 1);
                    this.__size--;
                    return true;
                }
            }
            return false;
        },
        keys: function() {
            var keys = [],
                k;
            for (k in this.__hash) {
                keys.push(str2val(k));
            }
            return keys.concat(this.__keys);
        },
        values: function() {
            var vals = [],
                k;
            for (k in this.__hash) {
                vals.push(this.__hash[k]);
            }
            return vals.concat(this.__vals);
        },
        items: function() {
            var kv = [],
                k, i, l;
            for (k in this.__hash) {
                kv.push([str2val(k), this.__hash[k]]);
            }
            for (i = 0, l = this.__keys.length; i < l; i++) {
                kv.push([this.__keys[i], this.__vals[i]]);
            }
            return kv;
        }
    }));
    // Set
    var Set = function() {
        if (!(this instanceof Set)) return new Set();
    };
    Set.prototype = Map();
    defaults(Set.prototype, newSpecs({
        add: function(k) {
            Map.prototype.set.apply(this, [k, true]);
        },
        values: function() {
            return Map.prototype.keys.apply(this);
        }
    }));
    defaults(global, newSpecs({
        Map: Map,
        Set: Set
    }));
})(this);
