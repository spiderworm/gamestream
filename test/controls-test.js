
var GameStream = require('../');
var now = require('../now');

var PUSH_INTERVAL_MS = 500;
var LAG_MS = 10;
var UPDATE_INTERVAL_MS = 500;
var CONTROLS_SWITCH_INTERVAL_MS = 3000;



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



function play() {
	console.info('-- playing normal speed');
	stream1.play();
	setTimeout(pause, CONTROLS_SWITCH_INTERVAL_MS);
}

function pause() {
	console.info('-- pausing');
	stream1.pause();
	setTimeout(rewind, CONTROLS_SWITCH_INTERVAL_MS);
}

function rewind() {
	console.info('-- rewinding');
	stream1.rewind();
	setTimeout(fastForward, CONTROLS_SWITCH_INTERVAL_MS);
}

function fastForward() {
	console.info('-- fast forwarding');
	stream1.fastForward();
	setTimeout(play, CONTROLS_SWITCH_INTERVAL_MS);
}

play();
