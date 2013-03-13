/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../accompany.js');
}

describe('Array.prototype.repeat', function () {
    it('[0].repeat(0)', is_deeply([0].repeat(0), []));
    it('[].repeat(100)',is_deeply([].repeat(100), []));
    it('[0].repeat(3)', is_deeply([0].repeat(3), [0,0,0]));
    it('[0,1].repeat(3)', is_deeply([0,1].repeat(3), [0,1,0,1,0,1]));
});
