
var Duplex = require('../../stream/Duplex.js');
var inherits = require('inherits');
var State = require('../../states/State.js');

function StateFactory() {
	Duplex.call(this);
}

inherits(StateFactory, Duplex);

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
