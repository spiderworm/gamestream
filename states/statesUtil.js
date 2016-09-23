
var RewriteOutputState = require('./RewriteOutputState.js');
var objectFactory = require('../misc/objectFactory.js');

function timeSort(states) {
	return states.sort(function(a, b) {
		if (a.time === b.time) {
			return 0;
		}
		if (a.time < b.time) {
			return -1;
		}
		return 1;
	});
};

function mergeStates(states) {
	timeSort(states);
	var merged = objectFactory.clone(states[0], states.slice(1));
	return merged;
}

var statesUtil = {
	timeSort: timeSort,
	merge: mergeStates,
};

module.exports = statesUtil;
