
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
	updates.forEach(function(info) {
		var delay = now() - timeLogs[info.update.count];
		console.info(
			now() + ':',
			'received update with a delay of ' + delay + ' ms:',
			JSON.stringify(info)
		);
	});
}

var stream1 = new GameStream({
	fullUpdatesMode: true,
	pushInterval: PUSH_INTERVAL_MS
});

stream1.on('full-updates', outputUpdates);
stream1.on('update', function() { throw new Error('should not be getting merged update when in full updates mode'); });

setInterval(updateState, UPDATE_INTERVAL_MS);
