var routes, tests, assert, way;

assert = require('assert');
way = require('../way.js');

routes = [
  {
    pattern: '/a',
    re: /^\/a/,
    params: [],
    action: function() {}
  }, {
    pattern: '/b/:c',
    re: /^\/b\/([^\/]+?)/,
    params: ['c'],
    action: function() {}
  }, {
    pattern: '/b/d',
    re: /^\/b\/d/,
    params: [],
    action: function() {}
  }, {
    pattern: '/c(/d)',
    re: /^\/c(\/d)?/,
    params: ['_'],
    action: function() {}
  }, {
    pattern: '/d/*/e',
    re: /^\/d\/(.+?)\/e/,
    params: ['splat'],
    action: function() {}
  }, {
    pattern: '/e(/f)(/g)',
    re: /^\/e(\/f)?(\/g)?/,
    params: ['_', '_'],
    action: function() {}
  }, {
    pattern: '/f/:g(/:h)',
    re: /^\/f\/([^\/]+?)(\/([^\/]+?))?/,
    params: ['g', '_', 'h'],
    action: function() {}
  }, {
    pattern: '/g(/:h)/:i/*',
    re: /^\/g(\/([^\/]+?))?\/([^\/]+?)\/(.+?)/,
    params: ['_', 'h', 'i', 'splat'],
    action: function() {}
  }
];

tests = [
  {
    path: '/a',
    matches: [
      {
        action: routes[0].action,
        params: {}
      }
    ]
  }, {
    path: '/b/d',
    matches: [
      {
        action: routes[1].action,
        params: { c: 'd' }
      }, {
        action: routes[2].action,
        params: {}
      }
    ]
  }
];

describe('Way', function() {
  describe('#map', function() {
    it('should account new routes', function() {
      var i;

      for(i = 0; i < routes.length; i++) {
        way.map(routes[i].pattern, routes[i].action);
        assert.equal(way.routes.length, i + 1);
      }
    });
  });

  describe('#translate', function() {
    it('should have built a regex for each route', function() {
      var i;

      for(i = 0; i < way.routes.length; i++) {
        assert(way.routes[i].hasOwnProperty('pattern'));
        assert.equal(String(way.routes[i].pattern), String(routes[i].re));
      }
    });

    it('should have parsed named parameters, optional groups and splats', function() {
      var i;

      for(i = 0; i < routes.length; i++) {
        assert(way.routes[i].hasOwnProperty('params'));
        assert.equal(String(way.routes[i].params), String(routes[i].params));
      }
    });
  });

  describe('#match', function() {
    it('should return the matches described in each test', function() {
      var m, i, j, k;

      for(i = 0; i < tests.length; i++) {
        m = way.match(tests[i].path);

        for(j = 0; j < tests[i].matches.length; j++) {
          assert.equal(m[j].action, tests[i].matches[j].action);

          for(k in tests[i].matches[j].params) {
            if(tests[i].matches[j].params.hasOwnProperty(k)) {
              assert(k in m[j].params);
              assert.equal(m[j].params[k], tests[i].matches[j].params[k]);
            }
          }
        }
      }
    });
  });
});
