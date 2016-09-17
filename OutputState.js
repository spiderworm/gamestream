
var cloneUtil = require('./cloneUtil.js');

function OutputState(time) {
	this.time = time;
}

OutputState.fromGameState = function(time, gameState, reverse, rewrite) {
	var outputState = new OutputState(time);
	var data = reverse ? gameState.reverseUpdate : gameState.update;
	if (data) {
		data = cloneUtil.clone(data);
		if (rewrite) {
			outputState.rewrite = data;
		} else {
			outputState.update = data;
		}
	}
	if (gameState.speed !== undefined) {
		outputState.speed = gameState.speed;
	}
	return outputState;
};

module.exports = OutputState;
