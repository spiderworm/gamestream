
var deepAssign = require('deep-assign');

function GameUpdate(gameState) {
	this.time = gameState.time;
	this.update = deepAssign({}, gameState.update);
}

module.exports = GameUpdate;
