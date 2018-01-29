
var objectHero = require('object-hero');

function State(time, update) {
	this.time = time || Date.now();
	this.update = update || {};
}

State.fromObject = function(obj) {

	return new State(
		obj.time,
		objectHero.clone(obj.update)
	);

};

module.exports = State;
