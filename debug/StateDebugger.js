
var Writable = require('../stream/Writable.js');
var inherits = require('inherits');

function StateDebugger(checkState) {
	this.checkState = checkState;
}

inherits(StateDebugger, Writable);

StateDebugger.prototype.write = function(states) {
	states.forEach(function(state) {
		if (!this.checkState || this.checkState(state)) {
			debugger;
		}
	}.bind(this));
};

module.exports = StateDebugger;
