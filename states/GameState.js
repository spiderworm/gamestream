
var objectFactory = require('../misc/objectFactory.js');

function GameState(time, updateValues) {
	updateValues = objectFactory.clone(updateValues);
	this.time = time;
	this.update = updateValues;
	this.values = updateValues;
	this.reverseUpdate = {};
}

GameState.fromOutputState = function(outputState) {
	var state = new GameState(outputState.time, outputState.update);
	if (outputState.speed || outputState.speed === 0) {
		state.speed = outputState.speed;
	}
	return state;
};

GameState.setPreviousState = function(targetState, previousState) {
	var previousValues = previousState ? previousState.values : {};
	this._computeValues(targetState, previousValues);
	this._computeReverseUpdate(targetState, previousValues);
};

GameState._computeValues = function(targetState, previousStateValues) {
	var values = objectFactory.clone(previousStateValues, [targetState.update]);
	targetState.values = values;
};

GameState._computeReverseUpdate = function(targetState, previousStateValues) {
	var reverseUpdate = objectFactory.clone(targetState.update);
	reverseUpdate = objectFactory.cloneNarrow(reverseUpdate, [previousStateValues]);
	targetState.reverseUpdate = reverseUpdate;
};

module.exports = GameState;
