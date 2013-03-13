/*
 * $Id: list-lazy.js,v 0.13 2013/03/12 00:56:33 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    http://es5.github.com/
 *    http://wiki.ecmascript.org/doku.php?id=harmony:harmony
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
    }
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
        return extend(extend(create(null), defspec), o) 
    };
    var toSpec = function(v){ return newspec({value:v}) };
    var newSpecs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
           defineProperty(specs, k, 
                          typeof(src[k]) === 'function' ? toSpec(src[k]) : src[k])
        });
        return specs;
    };
    var is = function(x, y) {
        return x === y
            ?  x !== 0 ? true             // normal
                       : 1 / x === 1 / y  // +-0
            :  x !== x && y !== y;        // NaN
    };
    // Object
    defaults(Object, newSpecs({
        extend: extend,
        defaults: defaults,
        is: is,
        isnt: function (x, y) {
            return !is(x, y)
        }
    }));
})(this);