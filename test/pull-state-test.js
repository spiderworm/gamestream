
var GameStream = require('../');
var now = require('../misc/now.js');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

var UPDATE_INTERVAL_MS = 1000;
var PULL_INTERVAL_MS = 500;

var state = {
	count: 0
};

var stream1 = new GameStream({
	push: false
});

var logger = new ConsoleLogger();
stream1.on('data', outputState);

function updateState() {
	state.count++;
	stream1.updateNow(state);
}

function outputState() {
	var state = stream1.state;
	if (state) {
		logger.log(state);
	}
}

stream1.on('data', function() { throw new Error('data should not be getting pushed out'); });

setInterval(updateState, UPDATE_INTERVAL_MS);
setInterval(outputState, PULL_INTERVAL_MS);
