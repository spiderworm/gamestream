
var GameStream = require('../');
var now = require('../now');

var UPDATE_INTERVAL_MS = 1000;
var HISTORY_DELAY = 1500;

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

function outputStates(data) {
	if (data.update) {
		console.info(
			now() + ':',
			'received update from ' + data.time + ':',
			JSON.stringify(data.update)
		);
	}
}

var stream1 = new GameStream();

stream1.on('data', outputStates);

setInterval(updateState, UPDATE_INTERVAL_MS);
setInterval(changeHistory, UPDATE_INTERVAL_MS);
