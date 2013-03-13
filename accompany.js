/*
 * $Id$
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
    if (! Object.freeze || typeof Object.freeze !== 'function') {
        throw Error('ES5 unsupported');
    }
    var create = Object.create,
        defineProperty = Object.defineProperty,
        defineProperties = Object.defineProperties,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice;
    var extend = function(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
        });
        return dst;
    };
    var defaults = function(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
        });
        return dst;
    };
    var defspec = extend(create(null),
                         getOwnPropertyDescriptor(Object, 'freeze'));
    delete defspec.value;
    var newspec = function(o) {
        return extend(extend(create(null), defspec), o);
    };
    var toSpec = function(v) { return newspec({value: v}) };
    var newSpecs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
           defineProperty(specs, k,
                          typeof(src[k]) === 'function' ? toSpec(src[k]) : src[k]);
        });
        return specs;
    };
    var is = function(x, y) {
        return x === y
            ? x !== 0 ? true             // normal
                       : 1 / x === 1 / y  // +-0
            : x !== x && y !== y;        // NaN
    };
    // Object
    defaults(Object, newSpecs({
        extend: extend,
        defaults: defaults,
        is: is,
        isnt: function(x, y) {
            return !is(x, y);
        }
    }));
    // String.prototype
    defaults(String.prototype, newSpecs({
        // http://blog.livedoor.jp/dankogai/archives/51172176.html
        repeat: function(n) {
            var s = this, result = '';
            for (n *= 1; n > 0; n >>>= 1, s += s) if (n & 1) result += s;
            return result;
        },
        // http://wiki.ecmascript.org/doku.php?id=harmony:string_extras
        startsWith: function(s) {
            return this.indexOf(s) === 0;
        },
        endsWith: function(s) {
            var t = String(s);
            var index = this.lastIndexOf(t);
            return index >= 0 && index === this.length - t.length;
        },
        contains: function(s) {
            return this.indexOf(s) !== -1;
        },
        toArray: function() {
            return this.split('');
        }
    }));
    // Array
    defaults(Array, newSpecs({
        from: function(obj) {
            var result = [], k, l;
            for (obj = new Object(obj), k = 0, l = obj.length >>> 0; k < l; k++) {
                if (k in obj) result[k] = obj[k];
            }
            return array;
        },
        of: function() {
            slice.call(arguments);
        }
    }));
    // Array.prototype
    defaults(Array.prototype, newSpecs({
        repeat: function(n) {
            var a = this, result = [];
            for (n *= 1; n > 0; n >>>= 1, a = a.concat(a)) {
                if (n & 1) result = result.concat(a);
            }
            return result;
        }
    }));
    // Number
    var gParseInt = parseInt,
        gParseFloat = parseFloat,
        gIsFinite = isFinite;
    defaults(Number, newSpecs({
        MAX_INTEGER: {value: Math.pow(2, 53)},
        EPSILON: {value: Math.pow(2, -52)},
        parseInt: gParseInt,
        parseFloat: gParseFloat,
        isFinite: function(n) {
            return n === 0 + n && gIsFinite(n);
        },
        isInteger: function(n) {
            return Number.isFinite(n) && n % 1 === 0;
        },
        isNaN: function(n) {
          return Object.is(n, NaN);
        },
        toInteger: function(n) {
            n *= 1;
            return Object.is(n, NaN) ? +0
                : !Number.isFinite(n) ? n
                                        : n - n % 1;
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
            return n === 0 ? n
                : Object.is(n, NaN) ? n
                : n < 0 ? -1 : 1;
        },
        sinh: function(n) {
            return (Math.exp(n) - Math.exp(-n)) / 2;
        },
        tanh: function(n) {
        	var u = Math.exp(n), d = Math.exp(-n); 
            return (u - d) / (u + d);
        },
        trunc: function(n) {
            return ~~n;
        }
    }));
})(this);