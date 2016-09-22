
var GameState = require('../states/GameState.js');
var StateZero = require('../states/StateZero.js');

function StatesTimeStore() {
	this.states = [];
	this._maxLength = Infinity;
	this._rebase();
}

Object.defineProperty(StatesTimeStore.prototype, 'maxLength', {
	get: function() { return this._maxLength; },
	set: function(v) { this.setMaxLength(v); }
});

StatesTimeStore.prototype.setMaxLength = function(length) {
	this._maxLength = length;
	this._trim();
};

StatesTimeStore.prototype.insertLate = function(state) {
	for (var i=this.states.length; i > 0; i--) {
		if (this.states[i - 1].time <= state.time) {
			return this._insertAt(state, i);
		}
	}
	return this._insertAt(state, 0);
};

StatesTimeStore.prototype.getAt = function(time) {
	for (var i=this.states.length - 1; i>=0; i--) {
		if (this.states[i].time <= time) {
			return this.states[i];
		}
	}
	return this._stateZero;
};

StatesTimeStore.prototype.indexesAt = function(time) {
	var indexes = [];
	var i = this.states.length - 1;
	for (; i>=0; i--) {
		if (this.states[i].time > time) {
			continue;
		} else {
			time = this.states[i].time;
			do {
				indexes.unshift(i);
				i--;
			} while(i > 0 && this.states[i].time === time);
			break;
		}
	}
	return indexes;
};

StatesTimeStore.prototype._insertAt = function(state, index) {
	this.states.splice(index, 0, state);
	this._trim();
	this._updateLinkingAtIndex(index);
};

StatesTimeStore.prototype._updateLinkingAtIndex = function(index) {
	for (var i=index; i<this.states.length; i++) {
		GameState.setPreviousState(
			this.states[i],
			i > 0 ? this.states[i - 1] : this._stateZero
		);
	}
};

StatesTimeStore.prototype._trim = function() {
	if (this.states.length > this._maxLength) {
		var oldStates = this.states.splice(0, this.states.length - this._maxLength);
		var state = oldStates[oldStates.length - 1];
		if (state) {
			this._rebase(state);
		}
	}
};

StatesTimeStore.prototype._rebase = function(baseState) {
	var stateZero;
	if (baseState) {
		stateZero = StateZero.fromState(baseState);
	} else {
		stateZero = new StateZero();
	}
	if (this.states[0]) {
		GameState.setPreviousState(
			this.states[0],
			stateZero
		);
	}
	this._stateZero = stateZero;
}

module.exports = StatesTimeStore;
