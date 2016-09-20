
var GameStream = require('../');
var now = require('../misc/now.js');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

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

var stream1 = new GameStream({
	pushInterval: PUSH_INTERVAL_MS,
	lag: LAG_MS
});

var logger = new ConsoleLogger({
	getDelay: function(data, time) {
		if (data.update) {
			return now() - timeLogs[data.update.count];
		}
	}
});
stream1.pipe(logger);

setInterval(updateState, UPDATE_INTERVAL_MS);
