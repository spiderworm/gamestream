
var TimedUpdate = require('./TimedUpdate.js');
var cloneUtil = require('./cloneUtil.js');

function mergeTimedUpdates(timedUpdates) {
	var updatesOnly = [{}].concat(timedUpdates.map(function(timedUpdate) { return timedUpdate.update; }));
	var mergedUpdate = cloneUtil.clone.apply(null, updatesOnly);
	return new TimedUpdate(
		timedUpdates[timedUpdates.length - 1].time,
		mergedUpdate
	);
}

module.exports = mergeTimedUpdates;
