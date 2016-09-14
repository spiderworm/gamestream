
var cloneUtil = require('./cloneUtil.js');

var tracking = [];

function TimedUpdate(time, update) {
	this.time = time;
	this.update = cloneUtil.clone({}, update);
}

TimedUpdate.squash = function(timedUpdates) {
	var updatesOnly = [{}].concat(timedUpdates.map(function(timedUpdate) { return timedUpdate.update; }));
	var squashedUpdate = cloneUtil.clone.apply(null, updatesOnly);
	return new TimedUpdate(
		timedUpdates[timedUpdates.length - 1].time,
		squashedUpdate
	);
};

module.exports = TimedUpdate;
