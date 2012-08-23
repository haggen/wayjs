# WayJS

Light and flexible URL routing in JavaScript.

## Tests:

You'll need [mocha](https://github.com/visionmedia/mocha) to run the tests.

Inside WayJS's directory, run `$ npm install -g`. The `-g` flag tells the NPM to install the dependencies globally so mocha's binaries goes in your `/usr/bin` directory.

Then run `$ mocha`.

## Usage:

Register a new route:

    way.map('/hello', function() {
      console.log('Hello, world');
    });

Then match some path against route table:

    var action = way.match('/hello');

This will return either the callback or null if no matching route is found.

    action(); //-> console.log('Hello, world');

Way can be used within the browser or with Node.

Also route patterns accepts some special syntax.

## Pattern syntax:

### Named parameters

Capture anything except forward slashes and save in `way.params`.

    way.map('/log/:message', function() {
      console.log(way.params.message);
    });

### Optional groups

Allow flexible routes.

    way.map('(/good)/bye', function() {
      console.log('Farewell!!');
    })

### Splats

Capture everything, including slashes and save in `way.params.splat`. No more than 1 splat per route.

    way.map('/goto/*', function() {
      console.log('Goto: ', way.params.splat);
    });


All the special syntax can be combined to create powerful routes.

Please note that routes are matched in the same order they're mapped.

## Roadmap:

1. Hooks
2. <del>Better tests</del>
3. More special syntax
4. Bypassing routes
