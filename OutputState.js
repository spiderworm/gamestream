
var cloneUtil = require('./cloneUtil.js');

function OutputState(time) {
	this.time = time;
}

OutputState.fromGameState = function(time, gameState, reverse) {
	var outputState = new OutputState(time);
	var update = reverse ? gameState.reverseUpdate : gameState.update;
	if (update) {
		outputState.update = cloneUtil.clone(update);
	}
	if (gameState.speed !== undefined) {
		outputState.speed = gameState.speed;
	}
	return outputState;
};

module.exports = OutputState;
