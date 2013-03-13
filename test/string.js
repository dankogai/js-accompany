/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../accompany.js');
}

describe('String.prototype.repeat', function () {
    it('"string".repeat(0)', is("string".repeat(0), ''));
    it('"".repeat(100)',     is("".repeat(100), ''));
    it('"string".repeat(3)', is("string".repeat(3), 'stringstringstring'));
});
