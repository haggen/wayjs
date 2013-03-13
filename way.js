/*
 * WayJS v0.4.0 2013-03-13 10:59:45 -0300
 * by Arthur Corenzan <arthur@corenzan.com>
 * licensed under http://creativecommons.org/licenses/by/3.0
 * more on http://haggen.github.com/wayjs
 */
(function(undefined) {

  'use strict';

  var Way;

  Way = function() {
  };

  Way.prototype = {

    routes: [],

    map: function() {
      var args, route;

      args = [].slice.apply(arguments);
      route = {};

      route.params = [];
      route.pattern = this.translate(args.shift(), route);
      route.actions = args;

      this.routes.push(route);
    },

    translate: function(pattern, route) {
      var re;

      // Escape forward slashes
      re = pattern.replace(/\//g, '\\/');

      // Fix optional groups
      re = re.replace(/\)/g, function() {
        return ')?';
      });

      // Translate named parameters
      re = re.replace(/:(\w[\w\d]*)|\(/g, function(m, n) {
        route.params.push(m === '(' ? '_' : n);
        return m === '(' ? '(' : '([^\\/]+?)';
      });

      // Translate splats
      re = re.replace(/\*/g, function() {
        route.params.push('splat');
        return '(.+?)';
      });

      return new RegExp('^' + re + '$');
    },

    match: function(path) {
      var route, match, param, m, i, j;

      for(i = 0; i < this.routes.length; i++) {
        route = this.routes[i];
        match = { actions: route.actions, params: {} };
        m = path.match(route.pattern);

        if(m) {
          for(j = 1; j < m.length; j++) {
            param = route.params[j - 1];

            if(param === 'splat') {
              if('splat' in match.params) {
                match.params.splat.push(m[j]);
              } else {
                match.params.splat = [m[j]];
              }
            } else {
              match.params[param] = m[j];
            }
          }

          return match;
        }
      }
    }
  };

  if(typeof window === 'object') {
    if(typeof window.define === 'function' && 'amd' in window.define) {
      window.define('way', function() { return Way; });
    } else {
      window.way = Way;
    }
  } else if(typeof module === 'object' && 'exports' in module) {
    module.exports = Way;
  }

})();
