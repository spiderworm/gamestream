
var cloneUtil = require('./cloneUtil.js');

function GameState(time, updateValues) {
	updateValues = cloneUtil.clone(updateValues);
	this.time = time;
	this.update = updateValues;
	this.values = updateValues;
	this.reverseUpdate = {};
}

GameState.setPreviousState = function(targetState, previousState) {
	var previousValues = previousState ? previousState.values : {};
	this.computeValues(targetState, previousValues);
	this.computeReverseUpdate(targetState, previousValues);
};

GameState.computeValues = function(targetState, previousStateValues) {
	var values = cloneUtil.clone(previousStateValues, targetState.update);
	targetState.values = values;
};

GameState.computeReverseUpdate = function(targetState, previousStateValues) {
	var reverseUpdate = cloneUtil.clone(targetState.update);
	cloneUtil.cloneNarrow(reverseUpdate, previousStateValues);
	targetState.reverseUpdate = reverseUpdate;
};

module.exports = GameState;
