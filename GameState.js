
var deepAssign = require('deep-assign');

function GameState(time, updateValues) {
	this.time = time;
	this.update = updateValues;
	this.values = updateValues;
}

GameState.setPreviousState = function(targetState, previousState) {
	this.computeValues(targetState, previousState.values);
};

GameState.computeValues = function(targetState, previousStateValues) {
	var values = deepAssign({}, previousStateValues, targetState.update);
	targetState.values = values;
};

module.exports = GameState;
