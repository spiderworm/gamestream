
var objectFactory = require('../misc/objectFactory.js');

function OutputState(time) {
	this.time = time;
}

OutputState.fromState = function(inputState, time, reverse) {
	var state = new OutputState(time);
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

module.exports = OutputState;
