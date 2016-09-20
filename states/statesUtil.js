
var OutputState = require('./OutputState.js');
var cloneUtil = require('../misc/cloneUtil.js');

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
	var merged = cloneUtil.clone.apply(null, states);
	return merged;
}

function createUnrewritePatch(rewrites, state) {
	var output = new OutputState();
	var buildTreeArgs = [{}].concat(rewrites.map(function(o) { return o.update; }));
	output.update = cloneUtil.buildTree.apply(null, buildTreeArgs);
	output.update = cloneUtil.cloneNarrow(output.update, state.values);
	output.rewrite = true;
	return output;
}

var statesUtil = {
	timeSort: timeSort,
	merge: mergeStates,
	createUnrewritePatch: createUnrewritePatch
};

module.exports = statesUtil;
