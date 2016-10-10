
var inherits = require('inherits');
var Duplex = require('../stream/Duplex.js');

function Rewriter(pointer) {
	Duplex.call(this);

	this._pointer = pointer;
}

inherits(Rewriter, Duplex);

Rewriter.prototype.write = function(states) {
	this._pipes.out(states);
/*
	states.forEach(function(state) {
		var removedStates = this._pointer.purgeGeneratedStatesAfter(state.time);

		removedStates.forEach(function(removed) {
			var history = this._pointer.getHistory(removed.time);
			if (history.length > 0) {
				history.forEach(function(point) {
					
				})
			}
		}.bind(this))



		var history = this._pointer.getHistory(state.time);
		if (history.length > 0) {

		}
	}.bind(this));


	var rewrites = createRewriteStates(states, this._pointer);
	if (rewrites.length > 0) {
		var currentState = this._pointer.getCurrentState();
		var time = this._pointer.getPlaybackTime(currentState.time);
		var unrewriteState = CatchUpOutputState.fromRewriteStates(rewrites, currentState, time);
		this._pipes.out(rewrites.concat(unrewriteState));
	}
*/
};

/*
function createRewriteStates(states, playbackPointer) {
	var currentState = playbackPointer.getCurrentState();
	var allRewrites = [];
	states.forEach(function(state) {
		var history = playbackPointer.getHistory(state.time);
		if (history.length > 0) {
			var rewrites = history.map(function(point) {
				return RewriteOutputState.fromState(state, point.time, point.speed < 0);
			});
			allRewrites = allRewrites.concat(rewrites);
		}
	});
	return allRewrites;
}
*/

module.exports = Rewriter;
