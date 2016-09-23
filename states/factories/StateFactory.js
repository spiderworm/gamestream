
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('../../stream/PipeBag.js');
var State = require('../../states/State.js');

function StateFactory() {
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
	Stream.call(this, { objectMode: true });
}

inherits(StateFactory, Stream);

StateFactory.prototype.write = function(rawStates) {
	var states = this._createStates(rawStates);
	this._pipes.out(states);
	return true;
};

StateFactory.prototype._createStates = function(rawStatesArray) {
	return rawStatesArray.map(function(rawState) {
		var state = State.fromOutputState(rawState);
		return state;
	}.bind(this));
};

module.exports = StateFactory;
