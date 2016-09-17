
var GameState = require('./GameState.js');
var statesUtil = require('./statesUtil.js');

function GameStatesBag() {
	this._states = [];
}

Object.defineProperty(GameStatesBag.prototype, 'length', {
	get: function() { return this._states.length; }
});

GameStatesBag.INSERT = 'insert';
GameStatesBag.MERGE = 'merge';

GameStatesBag.prototype.get = function(index) {
	return this._states[index];
};

GameStatesBag.prototype.getStateAt = function(time) {
	if (this._states.length) {
		for (var i=this._states.length - 1; i>0; i--) {
			if (this._states[i].time <= time) {
				return this._states[i];
			}
		}
		return this._states[0];
	}
};

GameStatesBag.prototype.indexOf = function(gameState) {
	return this._states.indexOf(gameState);
};

GameStatesBag.prototype.insertLate = function(gameState) {
	for (var i=this._states.length - 1; i >= 0; i--) {
		var testState = this._states[i];
		if (testState.time < gameState.time) {
			return this._insertAt(gameState, i + 1);
		} else if (testState.time === gameState.time) {
			return this._updateAt(gameState, i);
		}
	}
	return this._insertAt(gameState, 0);
};

GameStatesBag.prototype.getAllAfter = function(startState, endTime) {
	endTime = !isNaN(endTime) ? endTime : Infinity;
	var states = [];
	var i = this._states.indexOf(startState) + 1;
	for (; i < this._states.length; i++) {
		var testState = this._states[i];
		if (testState.time > endTime) {
			break;
		}
		states.push(testState);
	}
	return states;
};

GameStatesBag.prototype.getAllBefore = function(startState, endTime) {
	endTime = !isNaN(endTime) ? endTime : -Infinity;
	var states = [];
	var i = this._states.indexOf(startState);
	i = (i === -1 ? this._states.length - 1 : i) - 1;
	for (; i > 0; i--) {
		var testState = this._states[i];
		if (testState.time < endTime) {
			break;
		}
		states.push(testState);
	}
	return states;
};

GameStatesBag.prototype._insertAt = function(gameState, index) {
	this._states.splice(index, 0, gameState);
	this._computeStateValuesAt(index);
	return new InsertResult(gameState);
};

GameStatesBag.prototype._updateAt = function(gameState, index) {
	var resultState = this._states[index];
	resultState = statesUtil.merge([resultState, gameState]);
	this._states[index] = resultState;
	this._computeStateValuesAt(index);
	return new MergeResult(resultState);
};

GameStatesBag.prototype._computeStateValuesAt = function(index) {
	for (var i=index; i<this._states.length; i++) {
		GameState.setPreviousState(
			this._states[i],
			i > 0 ? this._states[i - 1] : null
		);
	}
};



function InsertResult(gameState) {
	this.state = gameState;
}
InsertResult.prototype.strategy = GameStatesBag.INSERT;

function MergeResult(gameState) {
	this.state = gameState;
}
MergeResult.prototype.strategy = GameStatesBag.MERGE;




module.exports = GameStatesBag;
