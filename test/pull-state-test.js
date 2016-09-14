
var GameStream = require('../');
var now = require('../now');

var UPDATE_INTERVAL_MS = 1000;
var PULL_INTERVAL_MS = 500;

var state = {
	count: 0
};

var stream1 = new GameStream({
	push: false
});

function updateState() {
	state.count++;
	stream1.updateNow({count: state.count});
}

function outputState() {
	var state = stream1.state;
	console.info('pulled state:', JSON.stringify(state));
}

stream1.on('update', function() { throw new Error('state should not be getting pushed out'); });

setInterval(updateState, UPDATE_INTERVAL_MS);
setInterval(outputState, PULL_INTERVAL_MS);
