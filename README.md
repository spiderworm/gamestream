
# GameStream
#### Get your state from here to there

- Github: https://github.com/spiderworm/gamestream
- NPM: https://www.npmjs.com/package/gamestream

The goal of this project is to create a library to make it easy to stream state data from your JavaScript server to JavaScript clients, while still giving you full control over the stream.

### Should I Use This?

This library is in it's very infancy! History rewrites are a little sketchy and may not be implemented 100% correctly yet, nothing is unit-tested, and without a doubt you will run into memory issues with this library if your client and/or server is up and running too long! This library is a toy for now, but has potential to be useful down the road!

Please favorite and watch this project so that you can be notified as I add features and fix serious issues... but for now know that you use this library at your own risk!

### Installation

The simplest installtion will come by using npm.

```bash
npm install gamestream
```

### Examples

#### Simplest Scenario
First, create a stream:
```javascript
var stream1 = new GameStream();
```
Next, set up something to listen to your stream:
```javascript
stream1.on('data', function(data) { console.info(data); });
```
Put state into your stream:
```javascript
stream1.updateNow({ myProp: 'myValue' });
```
Finally, run your script and see your data outputted to the console.

##### Piping It
Of course, you probably want something a little more useful than getting your state output to the console. GameStream makes use of the Node pipe pattern. Try this:
```javascript
var stream1 = new GameStream();

var stream2 = new GameStream();
stream2.on('data', function(data) { console.info('from stream2!',data); });

stream1.pipe(stream2);
stream1.updateNow({ myProp: 'myValue' });
```
... and observe how data from stream1 flows into stream2. In some scenarios, it might also be useful to stream three or more GameStreams together, and you can totally do that.

##### Streaming it to the Client
One of the most common scenarios is syncing state between a game server and clients. You can use the built-in socket pipes for that.

On the server:
```javascript
// it is recommended to store socketConfig in a module shared by client and server.
var socketConfig = {
    host: 'localhost',
    port: 5000
};

var serverStream = new GameStream();
var socketServer = new GameStream.SocketServer(socketConfig);
serverStream.pipe(socketServer);
```

On the client:
```javascript
// again, it is recommended to store socketConfig in a module shared by client and server.
var socketConfig = {
    host: 'localhost',
    port: 5000
};

var clientStream = new GameStream();
clientStream.on('data', function(data) { console.info('client got data!', data); });
var clientSocket = new GameStream.Socket(socketConfig);
clientSocket.pipe(clientStream);
```

Now as you push data into the serverStream...

```javascript
var count = 0;
setInterval(function() {
    count++;
    serverStream.updateNow({ count: count });
}, 100);
```

... the client will automatically receive them! Amazing!

##### Synchronization
One of the trickier things to deal with in multi-user experiences is to deal with late input. Your server may send out state information to clients but later (after receiving information from a laggy player) need to revise some part of the state. GameStream has a number of features to help with that problem!

Firstly, there's .updateAt(). This method allows you to write updated state information at any time in your timeline: past, present, or future.
```
var timestamp = 1474149814385; // what time in the past/present/future would you like to change the state at?
myStream.updateAt(timestamp, { newProp: 'newValue' });
```
Any downstream data receivers will receive the update automatically!

Secondly, you can force a GameStream to output data on a delay. This is useful in cases where you have clients downstream that are experiencing stuttering gameplay when history is rewritten upstream. Just update the lag property on an existing GameStream:
```javascript
clientStream.lag = 100; // milliseconds. Usually done to the client stream
```
... or set the lag value when you create your stream:
var clientStream = new GameStream({ lag: 100 });

##### Playback Controls
All instances of GameStream are automatically given the ability to pause, rewind, and fast-forward their data streams.

```javascript
stream1.pause();
stream1.rewind(2); // rewind at double speed
stream1.fastForward(10); // fast-forward really fast
stream1.play();
```

When combined with piping, playback controls can be useful when you want to set up easy replays on your client.
```javascript
var clientStream = new GameStream();
var replayStream = new GameStream();
clientStream.pipe(replayStream);

// set up a handler to pipe the updates into your game
function updateState(data) {
    if (data.update) {
        myGame.updateState(data);
    }
}

// a simple method to toggle between the normal stream and the replay stream
function replaceStream(oldStream, newStream) {
    if (oldStream) {
        oldStream.removeListener('data',updateState);
    }
    myGame.updateState(newStream.state); // set the initial state
    newStream.on('data',updateState);
}

// when you want to switch control over to the replay:
replaceStream(clientStream, replayStream);
replayStream.time = 1474149814385; // timestamp you want the replay to start at
replayStream.play(); // or .rewind(), .fastForward(), etc

// when you are ready to switch back over to the main
replaceStream(replayStream, clientStream);
```

Pausing, rewinding, and fast-forwarding states is a non-trivial operation in cases where your game interpolates or extrapolates state (i.e. when using a physics engine). Review the documentation and examples for more detailed help.

### Documentation

#### Class GameStream
##### Properties
- push (default true) - When false, do not push updates to downstream listeners. Otherwise, do push updates.
- pushInterval (default 0) - When zero, send data to downstream listeners immediately. When non-zero, queue updates and push those on the interval
- lag (default 0) - Push updates to listeners after the specified delay. Pausing, rewinding, and fast-forwarding the stream will nullify the effect of this property.
- state - The current total state that the GameStream knows of at the current playback time (please note, the current playback time may differ from the actual time).

##### Methods
- write(streamData) - Useful for building custom pipes. A required method for NodeJS writeable pipes.
- updateAt(timestamp, data) - Add updated state data at the specified time.
- updateNow(data) - Add updated state data at the current machine time.
- getState() - get the current state.
