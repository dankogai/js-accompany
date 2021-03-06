/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../accompany.js');
}

describe('Array', function() {
   it ('Array.of(42)', is_deeply(Array.of(42), [42]));
   it ('Array.of(null)', is_deeply(Array.of(null), [null]));
   it ('Array.of(undefined)', is_deeply(Array.of(undefined), [null]));
   it ('Array.of(0,1,2,3)', is_deeply(Array.of(0,1,2,3), [0,1,2,3]));
   it ('Array.from({length.0})', is_deeply(Array.from({length:0}), []));
   it ('Array.from({0:0,length.1})', is_deeply(Array.from({0:0,length:1}), [0]));
});


describe('Array.prototype.repeat', function () {
    it('[0].repeat(0)', is_deeply([0].repeat(0), []));
    it('[].repeat(100)',is_deeply([].repeat(100), []));
    it('[0].repeat(3)', is_deeply([0].repeat(3), [0,0,0]));
    it('[0,1].repeat(3)', is_deeply([0,1].repeat(3), [0,1,0,1,0,1]));
});

describe('Array.prototype.sorted', function () {
   var a = [7,63,127,31,1,3,15,255],
       cmp = function(a,b){ return a - b };
   it('a.sorted()',    is_deeply(a.sorted(), [1,127,15,255,3,31,63,7]));
   it('a.sorted(cmp)', is_deeply(a.sorted(cmp), [1,3,7,15,31,63,127,255]));
   it('a remains unchanged', is_deeply(a, [7,63,127,31,1,3,15,255]));
});
