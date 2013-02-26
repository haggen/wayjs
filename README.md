# WayJS

Lightweight and flexible URL pattern matching in JavaScript.

## Tests:

You'll need [mocha](https://github.com/visionmedia/mocha) to run the tests.

Run `$ npm install -g mocha`. The `-g` flag tells the NPM to install the module globally so mocha's binaries goes in your `/usr/bin` directory.

Then run `$ mocha`.

## Minify:

You'll need [uglify-js](https://github.com/mishoo/UglifyJS) to minify the script.

Install it with `$ npm install -g uglify-js`, then run `$ make`.

## Usage:

Register a new route:

```javascript
way.map('/hello/world', function() {
  console.log('Hello, world');
});
```

Then match some path against route table:

```javascript
var match = way.match('/hello/world');
```

This will return the first route to match or `undefined` if none.

The route object has the collection of actions and eventually parsed parameters.

```javascript
match.actions; //-> [function() { console.log('Hello, world'); }]
match.params;  //-> {}
```

You can provide multiple actions.

```javascript
way.map('/hello/world', function() {/* 1 */}, function() {/* 2 */});
```

That way you have control over the flow and do things like if the first action do not return true, it won't call the next one, or pass the returning value from the current action to the next one, or anything else that suits you. I told you it was flexible. :)

WayJS works in both browser and Node.

## Pattern syntax:

### Named parameters

Capture anything except forward slashes and save in `way.params` with given name.

    way.map('/log/:message', function() {
      console.log(way.params.message);
    });

### Optional groups

Matches with or without the snippet inside the parenthesis.

    way.map('(/good)/bye', function() {
      console.log('Farewell!!');
    })

### Splats

Capture everything, including slashes and save in `way.params.splat`. You can include multiple splats, returning an array.

    way.map('/goto/*', function() {
      console.log('Goto: ', way.params.splat[0]);
    });

All the special syntaxes above can be combined to create powerful routing patterns.

## Changelog:

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
