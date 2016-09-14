
var GameState = require('./GameState.js');

function GameStatesBag() {
	this._states = [];
}

Object.defineProperty(GameStatesBag.prototype, 'length', {
	get: function() { return this._states.length; }
});

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

GameStatesBag.prototype._insertAt = function(gameState, index) {
	this._states.splice(index, 0, gameState);
	this._computeStateValuesAt(index);
	return gameState;
};

GameStatesBag.prototype._updateAt = function(gameState, index) {
	throw new Error('TODO: implement me');
};

GameStatesBag.prototype._computeStateValuesAt = function(index) {
	for (var i=index; i<this._states.length; i++) {
		GameState.setPreviousState(
			this._states[i],
			i > 0 ? this._states[i - 1] : null
		);
	}
};

module.exports = GameStatesBag;
