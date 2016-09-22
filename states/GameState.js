
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
	targetState.previous = previousState;
	if (previousState) {
		previousState.next = targetState;
	}
	this._computeValues(targetState);
	this._computeReverseUpdate(targetState);
};

GameState._computeValues = function(targetState) {
	var values = (targetState.previous ? targetState.previous.values : null) || {};
	values = objectFactory.clone(values, [targetState.update]);
	targetState.values = values;
};

GameState._computeReverseUpdate = function(targetState) {
	var previousValues = (targetState.previous ? targetState.previous.values : null) || {};
	reverseUpdate = objectFactory.cloneNarrow(targetState.update, [previousValues]);
	targetState.reverseUpdate = reverseUpdate;
};

module.exports = GameState;
