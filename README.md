# WayJS

Light and flexible URL routing in JavaScript.

## Tests:

You'll need [mocha](https://github.com/visionmedia/mocha) to run the tests.

Run `npm install -g`. The `-g` flag tells the NPM to install it globally so mocha's binaries goes in `/usr/bin` directory.

Then run `mocha`.

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

Route patterns accepts 3 special syntaxes:

### Named parameters

    way.map('/log/:message', function() {
      console.log(way.params.message);
    });

### Optional groups

    way.map('(/good)/bye', function() {
      console.log('Farewell!!');
    })

### Splats

    way.map('/goto/*', function() {
      console.log('Goto: ', way.params.splat);
    });

They can be combined to create powerful routes.

Also please note that routes are matched in the order they're registered.

## Roadmap:

1. Hooks
2. Better tests
3. Skipping routes
