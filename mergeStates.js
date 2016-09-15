
var cloneUtil = require('./cloneUtil.js');

function mergeStates(states) {
	var merged = cloneUtil.clone.apply(null, states);
	return merged;
}

module.exports = mergeStates;
