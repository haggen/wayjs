var routes, tests, assert, Way, way;

assert = require('assert');
Way = require('../way');

way = new Way();

routes = [
  {
    pattern: '/a',
    re: /^\/a$/,
    params: [],
    actions: [function() {}]
  }, {
    pattern: '/b/:c',
    re: /^\/b\/([^\/]+?)$/,
    params: ['c'],
    actions: [function() {}]
  }, {
    pattern: '/b/d',
    re: /^\/b\/d$/,
    params: [],
    actions: [function() {}]
  }, {
    pattern: '/c(/d)',
    re: /^\/c(\/d)?$/,
    params: ['_'],
    actions: [function() {}]
  }, {
    pattern: '/d/*/e/*',
    re: /^\/d\/(.+?)\/e\/(.+?)$/,
    params: ['splat', 'splat'],
    actions: [function() {}, function() {}]
  }, {
    pattern: '/e(/f)(/g)',
    re: /^\/e(\/f)?(\/g)?$/,
    params: ['_', '_'],
    actions: [function() {}]
  }, {
    pattern: '/f/:g(/:h)',
    re: /^\/f\/([^\/]+?)(\/([^\/]+?))?$/,
    params: ['g', '_', 'h'],
    actions: [function() {}]
  }, {
    pattern: '/g(/:h)/:i/*',
    re: /^\/g(\/([^\/]+?))?\/([^\/]+?)\/(.+?)$/,
    params: ['_', 'h', 'i', 'splat'],
    actions: [function() {}]
  }
];

tests = [
  {
    path: '/a',
    match: {
      actions: routes[0].actions,
      params: {}
    }
  }, {
    path: '/b/d',
    match: {
      actions: routes[1].actions,
      params: { c: 'd' }
    }
  }, {
    path: '/c',
    match: {
      actions: routes[3].actions,
      params: {}
    }
  }, {
    path: '/c/d',
    match: {
      actions: routes[3].actions,
      params: {}
    }
  }, {
    path: '/d/yadda/yadda/e/nothing',
    match: {
      actions: routes[4].actions,
      params: { splat: ['yadda/yadda', 'nothing'] }
    }
  }
];

describe('Way', function() {
  describe('#map', function() {
    it('should account new routes', function() {
      var i;

      for(i = 0; i < routes.length; i++) {
        way.map.apply(way, [routes[i].pattern].concat(routes[i].actions));
        assert.equal(way.routes.length, i + 1);
      }
    });
  });

  describe('#translate', function() {
    it('should have built a regex for each route', function() {
      var i;

      for(i = 0; i < way.routes.length; i++) {
        assert(way.routes[i].hasOwnProperty('pattern'), 'pattern translated');
        assert.equal(String(way.routes[i].pattern), String(routes[i].re), 'matching patterns');
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
      var m, i, j;

      for(i = 0; i < tests.length; i++) {
        m = way.match(tests[i].path);

        assert.equal(m.actions[0], tests[i].match.actions[0]);

        for(j in tests[i].match.params) {
          if(tests[i].match.params.hasOwnProperty(j)) {
            if(j === 'splat') {
              assert(m.params[j] instanceof Array);
              assert.equal(m.params[j].length, tests[i].match.params[j].length);
              assert.equal(String(m.params[j]), String(tests[i].match.params[j]));
            } else {
              assert.equal(m.params[j], tests[i].match.params[j]);
            }
          }
        }
      }
    });
  });
});
