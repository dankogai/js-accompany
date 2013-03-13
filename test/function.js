/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../accompany.js');
}

describe('Function.isBuiltIn', function () {
    it('Function.isBuiltIn(Object)', is(Function.isBuiltIn(Object), true));
    it('Function.isBuiltIn(function(){})', 
       is(Function.isBuiltIn(function(){}), false));
});

