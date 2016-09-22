
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('../stream/PipeBag.js');
var GameState = require('../states/GameState.js');
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

StatesStorage.prototype._handleWriteData = function(data) {
	var state = GameState.fromOutputState(data);
	this._timeStore.insertLate(state);
	return state;
};

module.exports = StatesStorage;
