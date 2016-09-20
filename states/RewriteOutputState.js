
var objectFactory = require('../misc/objectFactory.js');

function RewriteOutputState(time) {
	this.time = time;
	this.rewrite = true;
}

RewriteOutputState.fromState = function(inputState, time, reverse) {
	var state = new RewriteOutputState(time);
	if (inputState.update) {
		var update;
		if (reverse) {
			update = inputState.reverseUpdate;
		} else {
			update = inputState.update;
		}
		state.update = objectFactory.clone(update);
	}
	if (inputState.speed || inputState.speed === 0) {
		state.speed = inputState.speed;
	}
	return state;
};

module.exports = RewriteOutputState;
