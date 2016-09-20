
var GameStream = require('../');
var now = require('../misc/now');
var ConsoleLogger = require('../debug/ConsoleLogger.js');

var UPDATE_INTERVAL_MS = 1000;
var HISTORY_DELAY = 3500;

var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow(state);
}

function changeHistory() {
	var time = now();
	var count = state.count;
	setTimeout(
		function() {
			var msg = 'I was added when count was ' + count + '!';
			var update = {
				count: 'you should never see me!',
				retroactiveProp: msg
			};
			stream1.updateAt(time, update);
		},
		HISTORY_DELAY
	);
}

var stream1 = new GameStream();

var logger = new ConsoleLogger({
	logRewrite: true,
	logFull: false
});
stream1.on('data',logger.log.bind(logger));

setInterval(updateState, UPDATE_INTERVAL_MS);
setInterval(changeHistory, UPDATE_INTERVAL_MS);
