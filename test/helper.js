/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert;
if (this['window'] !== this) {
    assert = require("assert");
    require('../accompany.js');
}
ok = function (pred) {
    return function () {
        assert(pred)
    }
};
is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};
is_deeply = function (a, e, m) {
    return function () {
        assert.equal(JSON.stringify(a), JSON.stringify(e), m)
    }
};
