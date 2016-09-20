
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('../stream/PipeBag.js');
var GameState = require('../states/GameState.js');
var statesUtil = require('../states/statesUtil.js');

function StatesStorage() {
	this._maxStorage = Infinity;
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
	this._states = [];
	Stream.call(this, { objectMode: true });
}

inherits(StatesStorage, Stream);

Object.defineProperty(StatesStorage.prototype, 'maxStorage', {
	get: function() { return this._maxStorage; },
	set: function(v) { this.setmaxStorage(v); }
});

StatesStorage.prototype.write = function(rawStates) {
	var states = rawStates.map(function(raw) {
		var state = this._handleWriteData(raw);
		return state;
	}.bind(this));
	this._pipes.forEach(function(writable) {
		writable.write(states);
	});
	return true;
};

StatesStorage.prototype.setmaxStorage = function(max) {
	if (this._maxStorage !== max) {
		this._maxStorage = max;
	}
};

StatesStorage.prototype.get = function(index) {
	return this._states[index];
};

StatesStorage.prototype.getStateAt = function(time) {
	if (this._states.length) {
		for (var i=this._states.length - 1; i>0; i--) {
			if (this._states[i].time <= time) {
				return this._states[i];
			}
		}
		return this._states[0];
	}
};

StatesStorage.prototype.getAllAfter = function(startState, endTime) {
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

StatesStorage.prototype.getAllBefore = function(startState, endTime) {
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

StatesStorage.prototype._handleWriteData = function(data) {
	var state;
	for (var i=this._states.length - 1; i >= 0; i--) {
		var testState = this._states[i];
		if (testState.time < data.time) {
			state = GameState.fromOutputState(data);
			this._insertAt(state, i + 1);
			break;
		} else if (testState.time === data.time) {
			state = this._updateAt(data, i);
			break;
		}
	}
	if (!state) {
		state = GameState.fromOutputState(data);
		this._insertAt(state, 0);
	}
	return state;
};

StatesStorage.prototype._insertAt = function(state, index) {
	this._states.splice(index, 0, state);
	this._computeStateValuesAt(index);
	this._trim();
};

StatesStorage.prototype._updateAt = function(gameState, index) {
	var resultState = this._states[index];
	resultState = statesUtil.merge([resultState, gameState]);
	this._states[index] = resultState;
	this._computeStateValuesAt(index);
	return resultState;
};

StatesStorage.prototype._computeStateValuesAt = function(index) {
	for (var i=index; i<this._states.length; i++) {
		GameState.setPreviousState(
			this._states[i],
			i > 0 ? this._states[i - 1] : null
		);
	}
};

StatesStorage.prototype._trim = function() {
	if (this._states.length > this._maxStorage) {
		this._states.splice(0, this._states.length - this._maxStorage);
	}
};


module.exports = StatesStorage;
