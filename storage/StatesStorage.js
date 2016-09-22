
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('../stream/PipeBag.js');
var GameState = require('../states/GameState.js');
var statesUtil = require('../states/statesUtil.js');
var StatesTimeStore = require('./StatesTimeStore.js');

function StatesStorage() {
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
	this._timeStore = new StatesTimeStore();
	Stream.call(this, { objectMode: true });
}

inherits(StatesStorage, Stream);

Object.defineProperty(StatesStorage.prototype, 'maxStorage', {
	get: function() { return this._timeStore.maxLength; },
	set: function(v) { this.setMaxStorage(v); }
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

StatesStorage.prototype.setMaxStorage = function(max) {
	this._timeStore.maxLength = max;
};

StatesStorage.prototype.getStateAtTime = function(time) {
	return this._timeStore.getAt(time);
};

StatesStorage.prototype.getAllAfter = function(startState, endTime) {
	var i1 = (startState ? this._timeStore.states.indexOf(startState) : -1) + 1;
	var i2 = i1;
	var endIndexes = this._timeStore.indexesAt(endTime);
	if (endIndexes.length) {
		i2 = endIndexes[endIndexes.length - 1] + 1;
	}
	var states = this._timeStore.states.slice(i1, i2);
	return states;
};

StatesStorage.prototype.getAllBefore = function(startState, endTime) {
	var i2 = (startState ? this._timeStore.states.indexOf(startState) : this._timeStore.states.length);
	var i1 = i2;
	var endIndexes = this._timeStore.indexesAt(endTime);
	if (endIndexes.length) {
		i1 = endIndexes[0];
	}
	var states = this._timeStore.states.slice(i1, i2).reverse();
	return states;
};

StatesStorage.prototype._handleWriteData = function(data) {
	var state = GameState.fromOutputState(data);
	this._timeStore.insertLate(state);
	return state;
};

module.exports = StatesStorage;
