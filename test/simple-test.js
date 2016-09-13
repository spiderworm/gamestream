
var GameStream = require('../');
var now = require('../now');

var PUSH_INTERVAL_MS = 1000;
var LAG_MS = 10;
var UPDATE_INTERVAL_MS = 100;



var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow({count: state.count});
}

function outputState(update) {
	var delay = now() - timeLogs[update.count];
	console.info(
		now() + ':',
		'received update with a delay of ' + delay + ' ms:',
		JSON.stringify(update)
	);
}

var stream1 = new GameStream({
	pushInterval: PUSH_INTERVAL_MS,
	lag: LAG_MS
});

stream1.on('data', outputState);

setInterval(updateState, UPDATE_INTERVAL_MS);
