
var deepAssign = require('deep-assign');

function TimedUpdate(time, update) {
	this.time = time;
	this.update = deepAssign({}, update);
}

TimedUpdate.squash = function(timedUpdates) {
	var updatesOnly = [{}].concat(timedUpdates.map(function(timedUpdate) { return timedUpdate.update; }));
	var squashedUpdate = deepAssign.apply(null, updatesOnly);
	return new TimedUpdate(
		timedUpdates[timedUpdates.length - 1].time,
		squashedUpdate
	);
};

module.exports = TimedUpdate;
