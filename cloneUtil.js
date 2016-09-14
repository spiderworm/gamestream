
var baseClone = require('clone');

function isObject(v) {
	return (
		typeof v === 'object' &&
		v !== null
	);
}

function cloneAssign(target) {
	var modifiers = Array.prototype.slice.call(arguments, 1);
	modifiers.forEach(function(source) {
		for (var i in source) {
			if (isObject(source[i])) {
				if (isObject(target[i])) {
					cloneAssign(target[i],source[i]);
				} else {
					target[i] = baseClone(source[i]);
				}
			} else {
				target[i] = source[i];
			}
		}
	});
	return target;
}

function cloneNarrow(target) {
	var modifiers = Array.prototype.slice.call(arguments, 1);
	modifiers.forEach(function(source) {
		for (var i in target) {
			if (isObject(source[i])) {
				if (!isObject(target[i])) {
					target[i] = clone(source[i]);
				} else {
					cloneNarrow(target[i], source[i])
				}
			} else {
				target[i] = source[i];
			}
		}
	});
	return target;
}

function clone(target) {
	target = baseClone(target);
	var assignArgs = [target].concat(Array.prototype.slice.call(arguments, 1));
	return cloneAssign.apply(null, assignArgs);
}

var cloneUtil = {
	cloneAssign: cloneAssign,
	clone: clone,
	cloneNarrow: cloneNarrow
};

module.exports = cloneUtil;
