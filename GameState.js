
var deepAssign = require('deep-assign');

function GameState(time, update) {
	this.time = time;
	this.update = update;
	this.values = update;
}

GameState.prototype.computeValues = function(gameState) {
	var values = {};

	if (gameState) {
		deepAssign(values, gameState.values);
	}

	deepAssign(values, this.update);

	this.values = values;
}

module.exports = GameState;
