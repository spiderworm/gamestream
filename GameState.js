
var cloneUtil = require('./cloneUtil.js');

function GameState(time, updateValues) {
	updateValues = cloneUtil.clone(updateValues);
	this.time = time;
	this.update = updateValues;
	this.values = updateValues;
	this.reverseUpdate = {};
}

GameState.fromOutputState = function(ouputState) {
	var state = new GameState(ouputState.time, ouputState.update);
	state.speed = ouputState.speed;
	return state;
};

GameState.setPreviousState = function(targetState, previousState) {
	var previousValues = previousState ? previousState.values : {};
	this._computeValues(targetState, previousValues);
	this._computeReverseUpdate(targetState, previousValues);
};

GameState._computeValues = function(targetState, previousStateValues) {
	var values = cloneUtil.clone(previousStateValues, targetState.update);
	targetState.values = values;
};

GameState._computeReverseUpdate = function(targetState, previousStateValues) {
	var reverseUpdate = cloneUtil.clone(targetState.update);
	cloneUtil.cloneNarrow(reverseUpdate, previousStateValues);
	targetState.reverseUpdate = reverseUpdate;
};

module.exports = GameState;
