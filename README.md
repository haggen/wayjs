# WayJS

Light and flexible URL routing in JavaScript.

## Tests:

You'll need [mocha](https://github.com/visionmedia/mocha) to run the tests.

Inside WayJS's directory, run `$ npm install -g`. The `-g` flag tells the NPM to install the dependencies globally so mocha's binaries goes in your `/usr/bin` directory.

Then run `$ mocha`.

## Usage:

Register a new route:

    way.map('/hello/world', function() {
      console.log('Hello, world');
    });

Then match some path against route table:

    var match = way.match('/hello/world');

This will return a collection of matches or `undefined` if no match is found.

    match[0].action(); //-> console.log('Hello, world')
    match[0].params;   //-> {}

Each `match` object has an `action` function and a `params` object.

So let's say, after the snippet above you write:

    way.map('/hello/:name', function(params) {
      console.log('Hello, mister ' + params.name);
    });

Then, match the same path again:

    var matches = way.match('/hello/world');

Now we got:

    matches[0].action(); //-> console.log('Hello, world')
    matches[0].params;   //-> {}

And:

    matches[1].action(); //-> console.log('Hello, mister world')
    matches[1].params;   //-> { name: 'world' }

This way you have control over the flow. Let's you need to "filter" some route, you just register it twice, but in the first you can return a special value that you'll check for before execution the second match. I told you it was flexible! ;)

WayJS works with both browser and Node.

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
