
var TimedUpdate = require('./TimedUpdate.js');
var cloneUtil = require('./cloneUtil.js');

function mergeTimedUpdates(timedUpdates) {
	var merged = cloneUtil.clone.apply(null, timedUpdates);
	return merged;
}

module.exports = mergeTimedUpdates;
