
var GameStream = require('../');
var now = require('../misc/now.js');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow({count: state.count});
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

var stream2 = new GameStream({
	lag: 10
});
stream1.pipe(stream2);

var stream3 = new GameStream({
	lag: 1000
});
stream2.pipe(stream3);
stream3.on('data', logger.log.bind(logger));

setInterval(updateState, 1000);
