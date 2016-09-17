
var OutputState = require('./OutputState.js');
var cloneUtil = require('./cloneUtil.js');

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
	var buildTreeArgs = [{}].concat(rewrites.map(function(o) { return o.rewrite; }));
	output.update = cloneUtil.buildTree.apply(null, buildTreeArgs);
	output.update = cloneUtil.cloneNarrow(output.update, state.values);
	return output;
}

var statesUtil = {
	timeSort: timeSort,
	merge: mergeStates,
	createUnrewritePatch: createUnrewritePatch
};

module.exports = statesUtil;
