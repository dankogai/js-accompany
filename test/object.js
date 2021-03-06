/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../accompany.js');
}

describe('Object.is(nt)?', function () {
    [null, void 0, [0], 5, 'str', {a: null}].forEach(function(item) {
        it('Object.is('+item+','+item+')===true', 
           is(Object.is(item,item), true));
    });
    it('Object.is(NaN,NaN)===true',    is(Object.is(NaN,NaN), true));
    it('Object.isnt(NaN,NaN)===false', is(Object.isnt(NaN,NaN), false));
    it('Object.is(+0,-0)===false',     is(Object.is(+0,-0),   false));
    it('Object.isnt(+0,-0)===true',    is(Object.isnt(+0,-0), true));
});

describe('Object', function () {
        var specA = Object.getOwnPropertyDescriptor(Object, 'freeze'),
            specB = Object.getOwnPropertyDescriptor(Object, 'extend');
        ['configurable', 'enumerable', 'writable'].forEach(function(p){
                it(p+'==='+specA[p], is(specA[p], specB[p]))
        });
        it('Object.extend', is_deeply(
               Object.extend({name : 'moe'}, {age : 50}), 
               {name:"moe",age:50}
               ));
        it('Object.defaults', is_deeply(
               Object.defaults(
                   {flavor : "chocolate"}, 
                   {flavor : "vanilla", sprinkles : "lots"}
               ),
               {flavor : "chocolate", sprinkles : "lots"}
        ));
        it('Object.items', is_deeply(
               Object.items(
                   {one : 1, two : 2, three : 3}
               ),
               [["one", 1], ["two", 2], ["three", 3]]
        ));
        it('Object.values', is_deeply(
               Object.values(
                   {one : 1, two : 2, three : 3}
               ),
               [1,2,3]
        ));
});

describe('Object.has', function () {
    it('Object.has({})', is(Object.has({}, ''), false));
    it('Object.has({1:1})', is(Object.has({1:1}, '1'), true));
    it('Object.has({hasOwnProperty:false})', 
       is(Object.has({hasOwnProperty:true}, 'hasOwnProperty'), true));
    it('Object.has(Object.create({hasOwnProperty:false}))', 
       is(Object.has(Object.create({hasOwnProperty:true}), 
                     'hasOwnProperty'), 
          false));
});
