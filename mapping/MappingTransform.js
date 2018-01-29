
var inherits = require("inherits");
var TransformPipe = require("../stream/TransformPipe.js");
var Config = require('../misc/Config.js');
var objectHero = require('object-hero');

var defaultConfig = new Config({});

function MappingTransform(map) {
	map = new Config(defaultConfig, [map]);

	var transformer = (states) => {
		return states.map(state => remap(state, map));
	};

	TransformPipe.call(this, transformer);
}

inherits(MappingTransform, TransformPipe);

function remap(state, map) {
	var values = state.values || {};
	var newValues = objectHero.cloneDeep(map);
	state.values = mapDeep(newValues, values);
	return state;
}

function mapDeep(target, value) {
	for (var i in target) {
		if (objectHero.isObject(target[i])) {
			mapDeep(target[i], value);
		} else {
			target[i] = objectHero.cloneDeep(value);
		}
	}
	return target;
}

module.exports = MappingTransform;
