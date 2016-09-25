
var Component = require('./Component.js');
var LifeComponent = require('../life/LifeComponent.js');

function Entity(config) {
	this.life = new LifeComponent();
	Entity.apply(this, config);
}

Entity.apply = function(entity, vals) {
	Object.keys(vals).forEach(function(id) {
		if (!entity[id]) {
			entity[id] = new Component(vals[id]);
		} else {
			Component.apply(entity[id], vals[id]);
		}
	});
};

module.exports = Entity;
