
var GameStream = require('../');
var now = require('../now');

var PUSH_INTERVAL_MS = 0;
var LAG_MS = 10;
var UPDATE_INTERVAL_MS = 200;



var timeLogs = [];

var state = {
	count: 0,
	temp: undefined
};

function updateState() {
	state.count++;
	if (state.temp) {
		state.temp = undefined;
	} else {
		state.temp = { testValue: 45 };
	}
	timeLogs[state.count] = now();
	stream1.updateNow(state);
}

function outputState(update) {
	var delay = now() - timeLogs[update.count];
	console.info(
		now() + ':',
		'received update with a delay of ' + delay + ' ms',
		'and the temp property',
		(update.hasOwnProperty('temp') ? 'was' : 'WAS NOT (uh oh)'),
		'preserved'
	);
}

var stream1 = new GameStream({
	pushInterval: PUSH_INTERVAL_MS,
	lag: LAG_MS
});

stream1.on('update', outputState);

setInterval(updateState, UPDATE_INTERVAL_MS);
