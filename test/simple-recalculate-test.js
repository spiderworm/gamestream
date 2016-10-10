
var GameStream = require('../');
var now = require('../misc/now.js');

var engine = {
	state: {
		count: 0
	},
	applyState: function(state) {
		if (state.update) {
			if (state.update.count) {
				this.state.count = state.update.count;
			}
		}
	},
	getState: function() {
		return this.state;
	},
	tick: function() {
		this.state.count++;
	}
};

var stream1 = new GameStream({
	fullData: true
});

var logger = new GameStream.ConsoleLogger({
	logRewrite: true,
	logFull: false
});
//stream1.on('data',logger.log.bind(logger));

stream1.on('full-data', function(states) {
	states.forEach(function(state) {
		logger.log(state);
		engine.applyState(state);
		stream1.updateAt(state.time, engine.getState());
	});
});

setInterval(function() {
	engine.tick();
}, 100);

setInterval(function() {
	stream1.updateNow(engine.getState());
}, 50);

function rewriteState() {
	var newState = {
		time: now() - 1000,
		update: {
			count: engine.state.count - 5000
		}
	};
	stream1.write([newState]);
}

setInterval(rewriteState, 2000);
