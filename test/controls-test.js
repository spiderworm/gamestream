
var GameStream = require('../');
var now = require('../now.js');

var UPDATE_INTERVAL_MS = 50;
var CONTROLS_SWITCH_INTERVAL_MS = 1000;



var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow(state);
}

function outputUpdate(data) {
	if (data.speed !== undefined) {
		console.info('speed update:',data.speed);
	}
	if (data.update) {
		var delay = now() - timeLogs[data.update.count];
		console.info(
			now() + ':',
			'received update with a delay of ' + delay + ' ms:',
			JSON.stringify(data.update)
		);
	}
}

var stream1 = new GameStream();

var stream2 = new GameStream();
stream2.on('data', outputUpdate);
stream1.pipe(stream2);

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
	stream1.rewind(1);
	setTimeout(fastForward, CONTROLS_SWITCH_INTERVAL_MS);
}

function fastForward() {
	console.info('-- fast forwarding');
	stream1.fastForward(1.5);
	setTimeout(play, CONTROLS_SWITCH_INTERVAL_MS);
}

play();
