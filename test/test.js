var tests, assert, way;

assert = require('assert');
way = require('../way.js');

tests = [
  {
    pattern: '/hello',
    re: /^\/hello$/,
    params: [],
    action: function() {}
  }, {
    pattern: '/hello/:name',
    re: /^\/hello\/([^\/]+?)$/,
    params: ['name'],
    action: function() { /*.*/ }
  }, {
    pattern: '/about(/me)',
    re: /^\/about(\/me)?$/,
    params: ['_'],
    action: function() {}
  }, {
    pattern: '/say/*/quickly',
    re: /^\/say\/(.+?)\/quickly$/,
    params: ['splat'],
    action: function() {}
  }, {
    pattern: '/sort(/:order)',
    re: /^\/sort(\/([^\/]+?))?$/,
    params: ['_', 'order'],
    action: function() {}
  }, {
    pattern: '/how(/are)(/you)',
    re: /^\/how(\/are)?(\/you)?$/,
    params: ['_', '_'],
    action: function() {}
  }, {
    pattern: '/do/:action/:mod(/:target)',
    re: /^\/do\/([^\/]+?)\/([^\/]+?)(\/([^\/]+?))?$/,
    params: ['action', 'mod', '_', 'target'],
    action: function() {}
  }
];

describe('Way', function() {
  describe('#map', function() {
    it('should account 4 new routes', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert.equal(way.map(tests[i].pattern, tests[i].action), null);
        assert.equal(way.routes.length, i + 1);
      }
    });
  });

  describe('new routes', function() {
    it('pattern should have been translated', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert(way.routes[i].hasOwnProperty('pattern'));
        assert.equal(String(way.routes[i].pattern), String(tests[i].re));
      }
    });

    it('named parameters and optional groups should have been parsed', function() {
      var i;

      for(i = 0; i < tests.length; i++) {
        assert(way.routes[i].hasOwnProperty('params'));
        assert.equal(String(way.routes[i].params), String(tests[i].params));
      }
    });
  });

  describe('#match', function() {
    it('should succeed against /hello', function() {
      var match = way.match('/hello');
      assert.equal(match, tests[0].action);
    });

    it('should fail against /404', function() {
      var match = way.match('/404');
      assert.equal(match, null)
    });

    it('should succeed against /hello/bob and grab "name" parameter', function() {
      assert.equal(way.match('/hello/bob'), tests[1].action);
      assert(way.params.hasOwnProperty('name'));
      assert.equal(way.params.name, 'bob');
    });

    it('should succeed against /about and /about/me and return same action', function() {
      assert.equal(way.match('/about'), tests[2].action);
      assert.equal(way.match('/about/me'), tests[2].action);
    });

    it('should succeed against /say/some/thing/quickly and grab "splat" parameter', function() {
      assert.equal(way.match('/say/some/thing/quickly'), tests[3].action);
      assert(way.params.hasOwnProperty('splat'));
      assert.equal(way.params.splat, 'some/thing');
    });

    it('should succeed against /sort and grab "order" parameter as undefined', function() {
      assert.equal(way.match('/sort'), tests[4].action);
      assert(way.params.hasOwnProperty('order'));
      assert.equal(way.params.order, undefined);
    });

    it('should succeed against /sort/desc and grab "order" parameter as "desc"', function() {
      assert.equal(way.match('/sort/desc'), tests[4].action);
      assert(way.params.hasOwnProperty('order'));
      assert.equal(way.params.order, 'desc');
    });

    it('should succeed against /how, /how/are and /how/are/you', function() {
      assert.equal(way.match('/how'), tests[5].action);
      assert.equal(way.match('/how/are'), tests[5].action);
      assert.equal(way.match('/how/are/you'), tests[5].action);
    });

    it('should succeed against /do/jump/high and grap "action" as "jump" and "mod" as "high"', function() {
      assert.equal(way.match('/do/jump/high'), tests[6].action);
      assert(way.params.hasOwnProperty('action'));
      assert.equal(way.params.action, 'jump');
      assert(way.params.hasOwnProperty('mod'));
      assert.equal(way.params.mod, 'high');
      assert(way.params.hasOwnProperty('target'));
      assert.equal(way.params.target, undefined);
    });

    it('should succeed against /do/run/fast/home and grap "action" as "run", "mod" as "fast" and "target" as "home"', function() {
      assert.equal(way.match('/do/run/fast/home'), tests[6].action);
      assert(way.params.hasOwnProperty('action'));
      assert.equal(way.params.action, 'run');
      assert(way.params.hasOwnProperty('mod'));
      assert.equal(way.params.mod, 'fast');
      assert(way.params.hasOwnProperty('target'));
      assert.equal(way.params.target, "home");
    });
  });
});
