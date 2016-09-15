
var GameStream = require('../');
var now = require('../now');

var UPDATE_INTERVAL_MS = 50;

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
	fullUpdates: true
});

stream1.on('update', outputUpdates);

setInterval(updateState, UPDATE_INTERVAL_MS);
