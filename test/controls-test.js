
var GameStream = require('../');
var now = require('../misc/now.js');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

var UPDATE_INTERVAL_MS = 500;
var CONTROLS_SWITCH_INTERVAL_MS = 5000;

var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow(state);
}

var logger = new ConsoleLogger({
	getDelay: function(data, time) {
		if (data.update) {
			return now() - timeLogs[data.update.count];
		}
	},
	logFull: true
});

var stream1 = new GameStream();

var stream2 = new GameStream();
stream1.pipe(stream2);

stream2.on('data', logger.log.bind(logger));

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
	stream1.fastForward(4);
	setTimeout(play, CONTROLS_SWITCH_INTERVAL_MS);
}

play();
