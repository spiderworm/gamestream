
var GameState = require('../states/GameState.js');

function StatesTimeStore() {
	this.states = [];
	this._maxLength = 1000;
}

Object.defineProperty(StatesTimeStore.prototype, 'length', {
	get: function() { return this.states.length; }
});

StatesTimeStore.prototype.insertLate = function(state) {
	for (var i=this.states.length; i > 0; i--) {
		if (this.states[i - 1].time <= state.time) {
			return this._insertAt(state, i);
		}
	}
	return this._insertAt(state, 0);
};

StatesTimeStore.prototype.getAt = function(time) {
	for (var i=this.states.length - 1; i>0; i--) {
		if (this.states[i].time <= time) {
			return this.states[i];
		}
	}
	return this.states[0];
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
			i > 0 ? this.states[i - 1] : null
		);
	}
};

StatesTimeStore.prototype._trim = function() {
	if (this.states.length > this._maxLength) {
		this.states.splice(0, this.states.length - this._maxLength);
	}
};

module.exports = StatesTimeStore;
