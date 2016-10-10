
var inherits = require('inherits');
var Duplex = require('./stream/Duplex.js');
var objectFactory = require('./misc/objectFactory.js');

function Mapper(map) {
	Duplex.call(this);

	this.map = objectFactory.clone(map);
}

inherits(Mapper, Duplex);

Mapper.prototype.write = function(states) {
	var states = this.mapStates(states);
	this._pipes.out(states);
	return true;
};

Mapper.prototype.mapStates = function(states) {
	states.forEach(this.mapState.bind(this));
	return states;
};

Mapper.prototype.mapState = function(state) {

	function apply(target, values) {
		if (!target) {
			return;
		}
		for (var i in target) {
			if (target[i]) {
				if (objectFactory.isObject(target[i])) {
					apply(target[i], values);
				} else {
					target[i] = values;
				}
			}
		}
		return target;
	}

	if (this.map) {
		if (state.update) {
			state.update = apply(objectFactory.clone(this.map), state.update);
		}
		if (state.values) {
			state.values = apply(objectFactory.clone(this.map), state.values);
		}
	}

	return state;
};

module.exports = Mapper;
