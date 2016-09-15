
var GameStream = require('../');
var now = require('../now');

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

function outputUpdates(updates) {
	console.info('-------- received set of updates ----------');
	console.info('merged: ', GameStream.mergeUpdates(updates));
	var time = now();
	updates.forEach(function(data) {
		if (data.speed !== undefined) {
			console.info(
				time + ':',
				'speed update:', JSON.stringify(data)
			);
		}
		if (data.update) {
			var delay = time - timeLogs[data.update.count];
			console.info(
				time + ':',
				'received update with a delay of ' + delay + ' ms:',
				JSON.stringify(data)
			);
		}
	});
}

var stream1 = new GameStream({
	fullDataMode: true,
	pushInterval: PUSH_INTERVAL_MS
});

stream1.on('full-data', outputUpdates);
stream1.on('data', function() { throw new Error('should not be getting merged update when in full data mode'); });

setInterval(updateState, UPDATE_INTERVAL_MS);
