
var GameStream = require('../');
var now = require('../now');

var timeLogs = [];

var state = {
	count: 0
};

function updateState() {
	state.count++;
	timeLogs[state.count] = now();
	stream1.updateNow({count: state.count});
}

function outputUpdate(data) {
	if (data.update) {
		var delay = now() - timeLogs[data.update.count];
		console.info(
			now() + ':',
			'received update with a delay of ' + delay + ' ms:',
			JSON.stringify(data.update)
		);
	}
}

var stream1 = new GameStream({
	pushInterval: 100
});

setInterval(updateState, 1000);

var stream2 = new GameStream({
	lag: 10
});
stream1.pipe(stream2);

var stream3 = new GameStream({
	lag: 1000
});
stream2.pipe(stream3);
stream3.on('data', outputUpdate);
