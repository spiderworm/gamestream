
var objectFactory = require('../misc/objectFactory.js');

function StateZero() {
	this.values = {};
};

StateZero.fromState = function(otherState) {
	var state = new StateZero();
	state.values = objectFactory.clone(otherState.values);
	return state;
};

module.exports = StateZero;
