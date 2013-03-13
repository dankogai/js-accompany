/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    var ns = require('../accompany.js');
    Map = ns.Map;
}

var falsy = [null, undefined, false, 0, ''].sort();
describe('Map primitives', function () {
  'use strict';
  var m = Map(), i,j, l, v, v2;
  for (i = 0, l = falsy.length; i < l ; ++i) {
      v = falsy[i];
      m.set(v, v);
      it('m.get('+v+')', is(m.get(v), v));
      it('m.has('+v+')', is(m.has(v), true));
  }
  it('m.size',   is(m.size, falsy.length));
  it('m.keys()',   is_deeply(m.keys().sort(), falsy));
  it('m.values()', is_deeply(m.values().sort(), falsy));
  it('m.items()',  is_deeply(m.items().sort(), 
                             falsy.map(function(v){return [v,v]}).sort()));
  for (i = 0, l = falsy.length; i < l ; ++i) {
      v = falsy[i];
      for (j = 0; j < l; ++j) {
          if (i === j) continue;
          v2 = falsy[j];
          it(v+' !== '+v2, ok(m.get(v2) !== v));
      }
  };
  for (i = 0, l = falsy.length; i < l ; ++i) {
     v = falsy[i];
     it('m.delete('+v+')', is(m.delete(v), true));
     it('m.delete('+v+') again', is(m.delete(v), false));
     it('m.has('+v+')', is(m.has(v), false));
  }
  it('m.size',   is(m.size, 0));
  it('m.keys()',   is_deeply(m.keys(), []));
  it('m.values()', is_deeply(m.values(), []));
  it('m.items()',  is_deeply(m.items(), []));
});

var a = [], o = {}, f = function(){}, r = /./g, d = new Date(0);
var objs = [a, o, f, r, d].sort();

describe('Map objects', function () {
    var m = Map(), i,j, l, v;
    for (i = 0, l = objs.length; i < l ; ++i) {
        v = objs[i];
        m.set(v, v);
        it('m.get('+v+')', is(m.get(v), v));
        it('m.has('+v+')', is(m.has(v), true));
    }
    it('m.size',   is(m.size, objs.length));
    it('m.keys()',   is_deeply(m.keys().sort(), objs));
    it('m.values()', is_deeply(m.values().sort(), objs));
    it('m.items()',  is_deeply(m.items().sort(), 
                               objs.map(function(v){return [v,v]}).sort()));
    it('m.get('+a+')', ok(m.get(a) !== []));
    it('m.get('+a+')', is_deeply(m.get(a), []));
    it('m.get('+o+')', ok(m.get(o) !== {}));
    it('m.get('+o+')', is_deeply(m.get(o), {}));
    it('m.get('+f+')', ok(m.get(f) !== function(){}));
    it('m.get('+f+')', is_deeply(m.get(f), function(){}));
    it('m.get('+r+')', ok(m.get(r) !== /./g));
    it('m.get('+r+')', is_deeply(m.get(r), /./g));
    it('m.get('+d+')', ok(m.get(d) !== new Date(0)));
    it('m.get('+d+')', is_deeply(m.get(d), new Date(0)));
    for (i = 0, l = objs.length; i < l ; ++i) {
        v = objs[i];
        it('m.delete('+v+')', is(m.delete(v), true));
        it('m.delete('+v+') again', is(m.delete(v), false));
        it('m.has('+v+')', is(m.has(v), false));
    }
    it('m.size',   is(m.size, 0));
    it('m.keys()',   is_deeply(m.keys(), []));
    it('m.values()', is_deeply(m.values(), []));
    it('m.items()',  is_deeply(m.items(), []));
});