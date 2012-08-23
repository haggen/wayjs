var tests, assert, way;

assert = require('assert');
way = require('../way.js');

// Add new tests cases inside the array below.
// Test cases consist of:
// - a route pattern
// - a successfully built regex
// - optional groups (underscores) and named parameters
// - successful matches
// - captures of each match
// - mismatches

tests = [
  {
    pattern: '/hello',
    re: /^\/hello$/,
    params: [],
    action: function() {},
    matches: ['/hello'],
    captures: [],
    mismatch: ['/bye']
  }, {
    pattern: '/hello/:name',
    re: /^\/hello\/([^\/]+?)$/,
    params: ['name'],
    action: function() {},
    matches: ['/hello/world'],
    captures: [{ name: 'world' }],
    mismatch: ['/hello', '/hello/you/me']
  }, {
    pattern: '/about(/me)',
    re: /^\/about(\/me)?$/,
    params: ['_'],
    action: function() {},
    matches: ['/about', '/about/me'],
    captures: [],
    mismatch: ['/not/about', '/about/you', '/about/me/more']
  }, {
    pattern: '/say/*/quickly',
    re: /^\/say\/(.+?)\/quickly$/,
    params: ['splat'],
    action: function() {},
    matches: ['/say/something/quickly', '/say/a/b/c/quickly'],
    captures: [{ splat: 'something' }, { splat: 'a/b/c' }],
    mismatch: ['/say', '/say/quickly']
  }, {
    pattern: '/sort(/:order)',
    re: /^\/sort(\/([^\/]+?))?$/,
    params: ['_', 'order'],
    action: function() {},
    matches: ['/sort', '/sort/desc', '/sort/asc'],
    captures: [{}, { order: 'desc' }, { order: 'asc' }],
    mismatch: ['/sort/desc/more', '/sorting']
  }, {
    pattern: '/have(/not)(/you)',
    re: /^\/have(\/not)?(\/you)?$/,
    params: ['_', '_'],
    action: function() {},
    matches: ['/have', '/have/you', '/have/not/you'],
    captures: [],
    mismatch: ['/havent', '/have/you/not']
  }, {
    pattern: '/do/:action/:mod(/:target)',
    re: /^\/do\/([^\/]+?)\/([^\/]+?)(\/([^\/]+?))?$/,
    params: ['action', 'mod', '_', 'target'],
    action: function() {},
    matches: ['/do/run/fast', '/do/jump/high/thefence'],
    captures: [{ action: 'run', mod: 'fast' }, { action: 'jump', mod: 'high', target: 'thefence' }],
    mismatch: ['/do', '/do/action', '/do/a/b/c/d']
  }, {
    pattern: '/api(/:version)/:collection(/:target(/:action))',
    re: /^\/api(\/([^\/]+?))?\/([^\/]+?)(\/([^\/]+?)(\/([^\/]+?))?)?$/,
    params: ['version', '_', 'target', '_', 'action'],
    action: function() {},
    matches: ['/api/users', '/api/1/users', '/api/1/users/1', '/api/1/users/1', '/api/1/users/1/destroy'],
    captures: [{ collection: 'users' }, { version: '1', collection: 'users' }, { version: '1', collection: 'users', target: '1' }, { version: '1', collection: 'users', target: '1', action: 'destroy' }],
    mismatch: ['/api', '/api/a/b/c/d/e']
  }
];

// Every test case will be tested to see if:
// - they're properly mapped
// - their patterns were translate to regex
// - their matches succeed
// - their mismatches fail
// - their named parameters are correctly captured

describe('Way', function() {
  describe('#map', function() {
    it('should account new routes', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert.equal(way.map(tests[i].pattern, tests[i].action), null);
        assert.equal(way.routes.length, i + 1);
      }
    });
  });

  describe('#translate', function() {
    it('should have built a regex for each route', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert(way.routes[i].hasOwnProperty('pattern'));
        assert.equal(String(way.routes[i].pattern), String(tests[i].re));
      }
    });

    it('should have saved named parameters and optional groups', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert(way.routes[i].hasOwnProperty('params'));
        assert.equal(String(way.routes[i].params), String(tests[i].params));
      }
    });
  });

  describe('#match', function() {
    it('should succeed against matches of each test case', function() {
      var i, j;

      for(i = 0; i < tests.length; i++) {
        for(j = 0; j < tests[i].matches.length; j++) {
          assert.equal(way.match(tests[i].matches[j]), tests[i].action);
        }
      }
    });

    it('should fail against mismatches of each test case', function() {
      var i, j;

      for(i = 0; i < tests.length; i++) {
        for(j = 0; j < tests[i].mismatch.length; j++) {
          assert.notEqual(way.match(tests[i].mismatch[j]), tests[i].action);
        }
      }
    });

    it('should capture named parameters as defined by each test case', function() {
      var i, j, k;

      for(i = 0; i < tests.length; i++) {
        for(j = 0; j < tests[i].matches.length; j++) {
          way.match(tests[i].matches[j]);

          if(j in tests[i].captures) {
            for(k in tests[i].captures[j]) {
              if(tests[i].captures[j].hasOwnProperty(k)) {
                assert(way.params.hasOwnProperty(k));
                assert.equal(way.params[k], tests[i].captures[j][k]);
              }
            }
          }
        }
      }
    });
  });
});
