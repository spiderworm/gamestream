
var inherits = require('inherits');
var Duplex = require('../stream/Duplex.js');
var RewriteOutputState = require('../states/RewriteOutputState.js');
var CatchUpOutputState = require('../states/CatchUpOutputState.js');

function Rewriter(pointer) {
	Duplex.call(this);

	this._pointer = pointer;
}

inherits(Rewriter, Duplex);

Rewriter.prototype.write = function(states) {
	this._outputRewrites(states);
	return true;
};

Rewriter.prototype._outputRewrites = function(states) {
	var rewrites = createRewriteStates(states, this._pointer);
	if (rewrites.length > 0) {
		var currentState = this._pointer.getCurrentState();
		var time = this._pointer.getPlaybackTime(currentState.time);
		var unrewriteState = CatchUpOutputState.fromRewriteStates(rewrites, currentState, time);
		this._pipes.out(rewrites.concat(unrewriteState));
	}
};

function createRewriteStates(states, playbackPointer) {
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

module.exports = Rewriter;
