
var objectFactory = require('../misc/objectFactory.js');

var cloneClean = objectFactory.createFactory({
	clone: true,
	deep: true,
	narrow: false,
	copyUndefined: false
});

function StateZero() {
	this.values = {};
};

StateZero.fromState = function(otherState) {
	var state = new StateZero();
	state.values = cloneClean(otherState.values);
	return state;
};

module.exports = StateZero;
