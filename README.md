# WayJS

Lightweight and flexible URL pattern matching in JavaScript.

## Test:

You'll need [mocha](https://github.com/visionmedia/mocha) to run the tests.

If you already have `mocha` installed globally you can simply run `$ mocha`.

If not, you can install the dependencies with `$ npm install` and then run `$ npm test`. No need to install `mocha` with `-g` or anything.

## Minify:

You'll need [uglify-js](https://github.com/mishoo/UglifyJS) to minify the script.

Install the dependencies with `$ npm install` and then run `$ npm run minify`.

## Usage:

First thing is to create a new instance.

In browser:

```javascript
var way = new Way();
```

With AMD/require.js:

```javascript
require('way', function(Way) {
  var way = new Way();
});
```

Or with Node:

```javascript
var Way, way;

Way = require('way');
way = new Way();
```

Now, to register a new route:

```javascript
way.map('/hello/world', function() {
  console.log('Hello, world');
});
```

Then match some path against route table:

```javascript
var match = way.match('/hello/world');
```

This will return an `object` or `undefined` if no route matches. This object has the collection of actions and parameters.

```javascript
match.actions; //-> [function() { console.log('Hello, world'); }]
match.params;  //-> {}
```

You can provide `n` actions when mapping a route.

```javascript
way.map('/hello/world', function() {/* 1 */}, function() {/* 2 */}, ...);
```

Once you have a match, WayJS get out of the way. What to do with the action and parameters is totally up to you.

A common approach is to iterate over the actions, passing the parameters, and if one of them return false, you break the chain:

```javascript
for(i = 0, t = match.actions.length; t--; i++) {
  if(match.actions[i](match.params) === false) {
    break;
  }
}

```

But that's just a simple suggestion. You can do whatever you need.

## Pattern syntax:

### Named parameters

Capture anything except forward slashes and save in `params` with given name.

    way.map('/log/:message', function(params) {
      console.log(params.message);
    });

### Optional groups

Matches with or without the snippet inside the parenthesis.

    way.map('(/good)/bye', function() {
      console.log('Farewell!!');
    })

### Splats

Capture everything, including slashes and save in `params.splat`. You can include multiple splats, returning an array.

    way.map('/goto/*', function(params) {
      console.log('Goto: ', params.splat[0]);
    });

All the special syntaxes above can be combined to create powerful matching patterns.

## Changelog:

### v0.4.0 2013-03-13

- Now Way constructor is properly exposed instead of an instance
- Moved `routes` out of the constructor to the prototype
- Fixed docs typos and outdated information
- Updated tests accordingly
- Dropped Makefile and in favor of npm scripts

### v0.3.4 2012-09-06

- Fixed bug when casting #map arguments as array

### v0.3.3 2012-09-05

- Added support for [requirejs](http://requirejs.org/)

### v0.3.2 2012-09-05

- Changed to multiple actions instead of allowing multiple matches
- Accepts multiple splats
- Tests updated accordingly

### v0.2.1 2012-08-24

- Changed patterns regex to do exact matches

### v0.2.0 2012-08-23

- Accepts multiple matches, returning a collection of them
- Fixed bug with parameter values being sliced

### v0.1.0 2012-08-21

- First version
