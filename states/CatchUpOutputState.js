
var objectFactory = require('../misc/objectFactory.js');

function CatchUpOutputState(time) {
	this.time = time;
	this.rewrite = true;
}

CatchUpOutputState.fromRewriteStates = function(rewrites, currentState, time) {
	var state = new CatchUpOutputState(time);
	var buildTreeArgs = rewrites.map(function(o) { return o.update; });
	var update = objectFactory.clone({}, buildTreeArgs);
	update = objectFactory.cloneNarrow(update, [currentState.values]);
	state.update = update;
	return state;
};

module.exports = CatchUpOutputState;
