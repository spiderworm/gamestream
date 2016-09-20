
var GameStream = require('../');
var now = require('../misc/now.js');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

var UPDATE_INTERVAL_MS = 50;
var PUSH_INTERVAL_MS = 200;

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
	}
});

var stream1 = new GameStream({
	fullDataMode: true,
	pushInterval: PUSH_INTERVAL_MS
});

stream1.on('full-data', logger.log.bind(logger));
stream1.on('data', function() { throw new Error('should not be getting merged update when in full data mode'); });

setInterval(updateState, UPDATE_INTERVAL_MS);
